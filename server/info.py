# -*- coding:utf-8 -*-   
import web   
import json
class info:  
    def GET(self, name):          
        web.header('Content-Type','text/json; charset=utf-8', unique=True)
        sData = web.data()
        if sData == '' :
            return '{result:"参数错误"}'
        #data = json.loads(web.data())
        return 'Hello, ' + name + '!'  
