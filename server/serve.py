# -*- coding:utf-8 -*-  
import web 
import sys
sys.path.append('/var/www/webpy-app/')

from bginfo import bginfo
urls = (  
    '/()', 'index',    
    '/(info)', 'bginfo',  
)    
class index:  
    def GET(self, file):  
        web.seeother('/static/index.html'); #重定向  

web.config.debug = True
# application = web.application(urls, globals()).wsgifunc() 
app = web.application(urls, globals()) 

if __name__ == "__main__":  
    app.run()  