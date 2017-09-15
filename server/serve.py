# -*- coding:utf-8 -*-  
import web 
from info import info
urls = (  
    '/()', 'index',    
    '/(info)', 'info',  
)    
app = web.application(urls, globals())  
class index:  
    def GET(self, file):  
        web.seeother('/static/index.html'); #重定向  
  
if __name__ == "__main__":  
    app.run()  