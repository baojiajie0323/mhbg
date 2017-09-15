#!/usr/bin/python
# -*- coding: UTF-8 -*-

#dbstr = "select * from table1" "where a = " "12";
dbstr = "select * from table1 where a = %s"  % ("12");
print dbstr;