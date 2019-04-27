
THREE.MyFPC = function ( object, domElement ) {
    this.isChange=false;
    this.isAllowForward = true;
    this.isAllowBack = true;
    this.isAllowLeft = true;
    this.isAllowRight = true;
    this.isAllowUp = true;
    this.isAllowDown = true;

    this.isAllowHorizontalForward = true;
    this.isAllowHorizontalBack = true;
    this.isAllowHorizontalLeft = true;
    this.isAllowHorizontalRight = true;


    this.object = object;
    this.targetObject = new THREE.Object3D;
    this.targetObject.position = new THREE.Vector3(object.position.x,object.position.y,object.position.z);
    this.targetObject.rotation = new THREE.Euler(object.rotation.x,object.rotation.y,object.rotation.z,object.rotation.order);
    this.target = new THREE.Vector3( 0, 0, 0 );

    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;
    // this.invertVertical = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.lowspeed = 1;

    if ( this.domElement !== document ) {

        this.domElement.setAttribute( 'tabindex', -1 );

    }

    //

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;

        }

    };

    this.onMouseDown = function ( event ) {

        if ( this.domElement !== document ) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        this.mouseDragOn = true;
        this.lastMouseX = event.pageX;
        this.lastMouseY = event.pageY;
    };

    this.onMouseUp = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        this.mouseDragOn = false;

    };

    this.onMouseOut = function (event) {
        event.preventDefault();
        event.stopPropagation();

        this.mouseDragOn = false;

    }

    this.onMouseMove = function ( event ) {

        if(this.mouseDragOn) {
            this.mouseX = (event.pageX - this.lastMouseX)*5;
            this.mouseY = (event.pageY - this.lastMouseY)*5;

            this.lastMouseX = event.pageX;
            this.lastMouseY = event.pageY;

        }

    };

    this.onKeyDown = function ( event ) {
        
        //event.preventDefault();

        switch ( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.moveForward = true; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = true; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = true; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = true; break;

            case 82: /*R*/ this.moveUp = true; break;
            case 70: /*F*/ this.moveDown = true; break;

            case 16:
                this.lowspeed = 0.02;
                break;
            case 17:
                this.lowspeed = 2;
                break;

            case 81: /*Q*/ this.freeze = !this.freeze; break;

        }

    };

    this.onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.moveForward = false; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = false; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = false; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = false; break;

            case 82: /*R*/ this.moveUp = false; break;
            case 70: /*F*/ this.moveDown = false; break;

            case 16:
            case 17:
                this.lowspeed = 1;
                break;
        }

    };

    this.update = function( delta ) {

        if ( this.freeze ) {

            return;

        }

        if ( this.heightSpeed ) {

            var y = THREE.Math.clamp( this.targetObject.position.y, this.heightMin, this.heightMax );
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed;


        if(!(this.moveBackward||this.moveDown||this.moveForward||this.moveLeft||this.moveRight||this.moveUp)){
            this.isChange=false;
        }


        if ( (this.moveForward || ( this.autoForward && !this.moveBackward )) && this.isAllowForward)
        {
            //this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor )*this.lowspeed );
            this.targetObject.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor )*this.lowspeed );
            this.isChange=true;
        }
        if ( (this.moveForward || ( this.autoForward && !this.moveBackward )) && !this.isAllowForward && this.isAllowHorizontalForward)
        {
            if(Math.abs(this.targetObject.rotation.z * 180 /Math.PI) > 90) {
                var v1 = new THREE.Vector3(0,0,1);
                var horizontalRotation = new THREE.Euler(Math.PI,this.targetObject.rotation.y,this.targetObject.rotation.z,'XYZ');
            }
            else{
                var v1 = new THREE.Vector3(0,0,-1);
                var horizontalRotation = new THREE.Euler(Math.PI,-this.targetObject.rotation.y,this.targetObject.rotation.z,'XYZ');
            }
            var horizontalQuaternion = new THREE.Quaternion();
            v1.applyQuaternion( horizontalQuaternion.setFromEuler(horizontalRotation) );
            //this.object.position.add(v1.multiplyScalar( - ( actualMoveSpeed + this.autoSpeedFactor )*this.lowspeed ));
            this.targetObject.position.add(v1.multiplyScalar( - ( actualMoveSpeed + this.autoSpeedFactor )*this.lowspeed ));
        }
        if ( this.moveBackward && this.isAllowBack)
        {
            //this.object.translateZ( actualMoveSpeed*this.lowspeed );
            this.targetObject.translateZ( actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }
        if ( this.moveBackward && !this.isAllowBack && this.isAllowHorizontalBack)
        {
            if(Math.abs(this.targetObject.rotation.z * 180 /Math.PI) > 90) {
                var v1 = new THREE.Vector3(0,0,1);
                var horizontalRotation = new THREE.Euler(Math.PI,this.targetObject.rotation.y,this.targetObject.rotation.z,'XYZ');
            }
            else{
                var v1 = new THREE.Vector3(0,0,-1);
                var horizontalRotation = new THREE.Euler(Math.PI,-this.targetObject.rotation.y,this.targetObject.rotation.z,'XYZ');
            }
            var horizontalQuaternion = new THREE.Quaternion();
            v1.applyQuaternion( horizontalQuaternion.setFromEuler(horizontalRotation) );
            //this.object.position.add(v1.multiplyScalar( actualMoveSpeed*this.lowspeed));
            this.targetObject.position.add(v1.multiplyScalar( actualMoveSpeed*this.lowspeed));
        }


        if ( this.moveLeft && this.isAllowLeft)
        {
            //this.object.translateX( - actualMoveSpeed*this.lowspeed );
            this.targetObject.translateX( - actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }
        if ( this.moveLeft && !this.isAllowLeft && this.isAllowHorizontalLeft)
        {
            //this.object.translateX( - actualMoveSpeed*this.lowspeed );
            this.targetObject.translateX( - actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }
        if ( this.moveRight && this.isAllowRight)
        {
            //this.object.translateX( actualMoveSpeed*this.lowspeed );
            this.targetObject.translateX( actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }
        if ( this.moveRight && !this.isAllowRight && this.isAllowHorizontalRight)
        {
            //this.object.translateX( actualMoveSpeed*this.lowspeed );
            this.targetObject.translateX( actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }

        if ( this.moveUp && this.isAllowUp)
        {
            //this.object.translateY( actualMoveSpeed*this.lowspeed );
            this.targetObject.translateY( actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }
        if ( this.moveDown && this.isAllowDown)
        {
            //this.object.translateY( - actualMoveSpeed*this.lowspeed );
            this.targetObject.translateY( - actualMoveSpeed*this.lowspeed );
            this.isChange=true;
        }



        var actualLookSpeed = delta * this.lookSpeed;

        if ( !this.activeLook ) {

            actualLookSpeed = 0;

        }

        var verticalLookRatio = 1;

        if ( this.constrainVertical ) {

            verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

        }

        this.lon += this.mouseX * actualLookSpeed;
        if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = THREE.Math.degToRad( 90 - this.lat );

        this.theta = THREE.Math.degToRad( this.lon );

        if ( this.constrainVertical ) {

            this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

        }

        var targetPosition = this.target,
            position = this.targetObject.position;

        targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
        targetPosition.y = position.y + 100 * Math.cos( this.phi );
        targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        this.object.lookAt( targetPosition );
        this.targetObject.lookAt( targetPosition );

        this.mouseX = 0;
        this.mouseY = 0;
    };


    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

    this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
    this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
    this.domElement.addEventListener( 'mouseout', bind( this, this.onMouseOut ), false );
    this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
    this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
    this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    };

    this.handleResize();

};
