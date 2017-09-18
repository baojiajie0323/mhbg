# -*- coding:utf-8 -*-

import web
import json
import cx_Oracle
import os
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'


class info:
    def begindb(self):
        conn = cx_Oracle.connect('mh01/mh01@192.168.0.15:1521/TOPPROD')
        return conn

    def enddb(self, conn):
        conn.close()

    def getTask(self, data):
        conn = self.begindb()
        # where_params = {'deptno': 30}
        sql = "SELECT tc_afr01, tc_afr02, tc_afr03, tc_afr09, ima02, tc_afr05, tc_afr07, gen02 FROM tc_afr_file \
        LEFT JOIN ima_file ON tc_afr09 = ima01 \
        LEFT JOIN gen_file ON tc_afr08 = gen01"
        # WHERE deptno = :deptno"
        cursor = conn.cursor()
        cursor.execute(sql)
        row = cursor.fetchone()
        while row:
            for i in row:
                if isinstance(i, str):
                    print i.decode('utf-8'),
                else:
                    print i,
            print ""
            row = cursor.fetchone()
        cursor.close()
        self.enddb(conn)
        return 'getTask'

    def getOrder(self, data):
        # conn = self.begindb()
        # where_params = {'deptno': 30}
        print data
        sql = " SELECT tc_afr02,  \
        CASE WHEN sfb02=1 THEN '一般工单' WHEN sfb02=5 THEN '返工工单' WHEN sfb02=7 THEN '委外工单' WHEN sfb02=8 THEN '返工委外工单' END GDTYPE, \
        to_char(sfb81,'YYYY-MM-DD') sfb81,tc_afr09,ima02,sfb08,sfb081,sfb09, \
        CASE WHEN sfb04=1 THEN '开立' WHEN sfb04=2 THEN '发放' WHEN sfb04=4 THEN '发料' WHEN sfb04=7 THEN '入库' WHEN sfb04='8' THEN '结案' END GDSTATUS, \
        tc_afr05,tc_afr07,gen02 \
        FROM tc_afr_file \
        LEFT JOIN ima_file ON tc_afr09=ima01 \
        LEFT JOIN gen_file ON tc_afr08=gen01 \
        INNER JOIN sfb_file ON tc_afr02=sfb01 \
        "
        if(data["data[orderno]"]):
            sql += "WHERE TC_AFR02=:order"

        print sql
        # WHERE deptno = :deptno"
        # cursor = conn.cursor()
        # cursor.execute(sql)
        # index = cursor.description
        # result = []
        # row = cursor.fetchone()
        # while row:
        #     columnIndex = 0
        #     rowData = {}
        #     for i in row:
        #         rowKey = index[columnIndex][0]
        #         rowValue = ""
        #         if isinstance(i, str):
        #             rowValue = i.decode('utf-8'),
        #         else:
        #             rowValue = i,
        #         rowData[rowKey] = rowValue[0]
        #         columnIndex += 1
        #     result.append(rowData)
        #     row = cursor.fetchone()
        # cursor.close()
        # self.enddb(conn)
        return result

    def getOrderDetail(self, data):
        conn = self.begindb()
        where_params = {'order': data["data[order]"]}
        sql = "SELECT sfa03,ima02,ima08,sfa12,sfa05,sfa06+sfa062,sfa05-sfa06-sfa062 FROM sfa_file \
        LEFT JOIN ima_file ON sfa03=ima01 \
        WHERE sfa01=:order"
        # WHERE deptno = :deptno"
        cursor = conn.cursor()
        cursor.execute(sql,where_params)
        row = cursor.fetchone()
        while row:
            for i in row:
                if isinstance(i, str):
                    print i.decode('utf-8'),
                else:
                    print i,
            print ""
            row = cursor.fetchone()
        cursor.close()
        self.enddb(conn)
        return 'getorderdetail'

    def POST(self, name):
        web.header('Content-Type', 'text/json; charset=utf-8', unique=True)
        data = web.input()
        result = []
        if(data.cmd == "gettask"):
            result = self.getTask(data)
        elif(data.cmd == "getorder"):
            result = self.getOrder(data)
        elif(data.cmd == "getorderdetail"):
            result = self.getOrderDetail(data)
        # if sData == '' :
        #     return '{result:"参数错误"}'
        # data = json.dumps(sData)
        print result
        return json.dumps({"code": 0, "data": result})
