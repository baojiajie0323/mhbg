# -*- coding:utf-8 -*-   

import web   
import json
import cx_Oracle
import os 
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'

class info:  
    def begindb():
        conn = cx_Oracle.connect('mh01/mh01@192.168.0.15:1521/TOPPROD')
        return conn

    def enddb(conn):
        conn.close ()

    def getTask(data):
        print 'getTask'

    def POST(self, name):          
        web.header('Content-Type','text/json; charset=utf-8', unique=True)
        data = web.input() 
        if(data.cmd == "gettask"):

        # if sData == '' :
        #     return '{result:"参数错误"}'
        # data = json.dumps(sData)
        print data
        return json.dumps({"result":"ok","data":data})
