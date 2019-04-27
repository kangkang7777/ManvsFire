# -*- coding: utf-8 -*- 

import os,sys 
rootinfo = os.getcwd() 

# stringPos = info.rindex('/')
# tempInfo = info[0:stringPos]
# tempInfo = info[stringPos+1:]
# tempStringPos = tempInfo.rindex('/')
# direction = tempInfo[tempStringPos+1:]
fileCount = 0
groupCount = 0
# fout = open('MergedFile/'+tempInfo+'_'+groupCount+'.dat', 'w') # 合并内容到该文件 

def writeintofile(info): 
    fin = open(info) 
    strinfo = fin.read() 
    # 利用##作为标签的点缀，你也可以使用其他的 
    # fout.write('\n##\n') 
    sstring1 = '\\'
    sstring2 = '.'
    string1Pos = info.rindex(sstring1)
    string2Pos = info.rindex(sstring2)
    fout.write('COMPONENT '+info[string1Pos+1:string2Pos]) 
    fout.write('\n') 
    fout.write(strinfo)
    fout.write('\n')
    fout.write('COMPONENTFINISH') 
    fout.write('\n')
    fout.write('\n')
    fin.close() 

    
for root, dirs, files in os.walk(rootinfo):
    # print("file is: %s"%(dirs)) 
    # if len(dirs)==0: 
    print("len:%d" % len(dirs))
    for dir in dirs:
        info = rootinfo + '\\' + dir
        for sroot, sdirs, sfiles in os.walk(info):      
            fout = open('..\\MergedFiles\\' + dir + '_' + str(groupCount) + '.dat', 'w')
            for fil in sfiles:
                info = "%s\\%s\\%s" % (root,dir,fil) 
                if info[-3:] == 'dat': # 只将后缀名为py的文件内容合并 
                    #print("info is %s"%(info))
                    writeintofile(info) 
                    fileCount +=1
                    if fileCount == 200:
                        fout.close()
                        fileCount = 0
                        groupCount +=1 
                        fout = open('..\\MergedFiles\\'+dir+'_'+ str(groupCount) +'.dat', 'w') # 合并内容到该文件
            print("groupCount is %s"%(groupCount))
            groupCount = 0
            fileCount = 0
            fout.close()

#fout.close() 