# -*- coding:utf-8 -*-  
import web 
from info import info
urls = (  
    '/()', 'index',    
    '/(info)', 'info',  
)    
class index:  
    def GET(self, file):  
        web.seeother('/static/index.html'); #重定向  

        
app = web.application(urls, globals()).wsgifunc() 

if __name__ == "__main__":  
    app.run()  