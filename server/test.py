#!/usr/bin/python
# -*- coding: UTF-8 -*-
import cx_Oracle
import os 
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'

conn = cx_Oracle.connect('mh01/mh01@192.168.0.15:1521/TOPPROD')


# where_params = {'deptno':30}
# sql = "SELECT ENAME, EMPNO FROM EMP \
#         WHERE deptno = :deptno"
# cursor.execute(sql, where_params);

def query():
	cursor = conn.cursor ()
	cursor.execute ("select * from gen_file")
	row = cursor.fetchone()
	while row :
		for i in row:
			if isinstance(i,str):  
				print i.decode('utf-8'),  
			else :	
				print i,
		print ""	
		row = cursor.fetchone()
	cursor.close ()


query();
conn.close ()
