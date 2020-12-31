var sqlmap = {
  /*=============================WEB相关====================================*/
  getorder: "SELECT tc_afr02,  \
  CASE WHEN sfb02=1 THEN '一般工单' WHEN sfb02=5 THEN '返工工单' WHEN sfb02=7 THEN '委外工单' WHEN sfb02=8 THEN '返工委外工单' END GDTYPE, \
  to_char(sfb81,'YYYY-MM-DD') sfb81,to_char(sfb13,'YYYY-MM-DD') sfb13,to_char(sfb15,'YYYY-MM-DD') sfb15,tc_afr09,ima02,sfb08,sfb081, \
  CASE WHEN sfb04=1 THEN '开立' WHEN sfb04=2 THEN '发放' WHEN sfb04=4 THEN '发料' WHEN sfb04=7 THEN '入库' WHEN sfb04='8' THEN '结案' END GDSTATUS, \
  tc_afr05,tc_afr07,gen02,ima55 \
  FROM tc_afr_file \
  LEFT JOIN ima_file ON tc_afr09=ima01 \
  LEFT JOIN gen_file ON tc_afr08=gen01 \
  INNER JOIN sfb_file ON tc_afr02=sfb01 ",
  getorderdetail: "SELECT sfa03,ima02,ima08,sfa12,sfa05,sfa06+sfa062 sfa051,sfa05-sfa06-sfa062 sfa052 FROM sfa_file \
  LEFT JOIN ima_file ON sfa03=ima01 \
  WHERE sfa01=:orderno",

  /*=============================APP相关====================================*/
  login: "SELECT tc_afv03,tc_afv05,tc_afv06 \
  FROM tc_afv_file \
  WHERE tc_afv01=:username and tc_afv02=:password and tc_afv04='Y' ",
  gettodaytask: "SELECT tc_afr09,ima02,ima021,tc_afr02,tc_afr03,tc_afr08,tc_afr19 ima55,tc_afr04,tc_afr05,tc_aft08,tc_afv05,tc_afr12,tc_afr13,tc_afr14 \
  FROM tc_afr_file \
  LEFT JOIN ima_file ON tc_afr09=ima01 \
  LEFT JOIN tc_aft_file ON tc_afr01 = tc_aft01 AND tc_afr02 = tc_aft02 AND tc_afr12 = tc_aft05 AND tc_afr14 = tc_aft06 \
  LEFT JOIN tc_afv_file ON tc_aft08 = tc_afv01 \
  WHERE tc_afr01 = to_date(:todaydate,'yyyy-mm-dd')",
  getabmlist: "SELECT tc_abm01 FROM tc_abm_file",
  gettaskstate: "Select tc_afq02,tc_afq03,tc_afq04,tc_afq05,tc_afq12,tc_afq13,tc_afq14,tc_afq15 FROM tc_afq_file \
  Where tc_afq01 = to_date(:todaydate,'yyyy-mm-dd')",
  begintask: "Update tc_afq_file set tc_afq06=:begintime,tc_afq05='2' \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13=:xh and tc_afq15=:useraccount \
  And tc_afq04=:orderstep ",
  endtask: "Update tc_afq_file set tc_afq07=:begintime,tc_afq05='3' \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13=:xh and tc_afq15=:useraccount \
  And tc_afq04=:orderstep ",
  gettaskinfo: "SELECT tc_afr02,CASE WHEN sfb02=1 THEN '一般工单' WHEN sfb02= 5 THEN '返工工单' \
  WHEN sfb02= 7 THEN '委外工单' WHEN sfb02= 8 THEN '返工委外工单' END sfb02, \
  to_char(sfb81,'YYYY-MM-DD') sfb81, tc_afr09, ima02, sfb08, \
  tc_afr04, tc_afr05, gen02, ima55, tc_afr12,tc_afr14 FROM tc_afr_file\
  LEFT JOIN ima_file ON tc_afr09=ima01    \
  LEFT JOIN gen_file ON tc_afr08=gen01    \
  INNER JOIN sfb_file ON tc_afr02=sfb01  \
  WHERE tc_afr02=:orderno \
  AND tc_afr01= to_date(:todaydate, 'yyyy-mm-dd') AND tc_afr12=:orderdh AND tc_afr14=:orderxh ",
  getwlqd: "Select tc_afi04,tc_afi05,tc_afi06,tc_afi07,tc_afi08,tc_afi09,tc_afi10,tc_afi11,tc_afi12 \
  from tc_afi_file \
  where tc_afi01=to_date(:todaydate,'yyyy-mm-dd') and tc_afi02=:orderno and tc_afi03=:gy ",
  updatewlqd: "update tc_afi_file set tc_afi09=:cpjg,tc_afi10=:cpsm,tc_afi11=:fpjg,tc_afi12=:fpsm \
  where tc_afi01=to_date(:todaydate,'yyyy-mm-dd') and tc_afi02=:orderno and tc_afi03=:gy \
  and tc_afi04=:ljbh ",
  getsbtj: "Select tc_afj04,tc_afj05, tc_afj06, tc_afj07, tc_afj08  from tc_afj_file \
  Where tc_afj01=to_date(:todaydate,'yyyy-mm-dd') and tc_afj02=:orderno and tc_afj09=:dh and tc_afj10 =:xh and tc_afj12 =:useraccount ",
  updatesbtj: "MERGE INTO tc_afj_file \
  USING (SELECT :todaydate as a1,:orderno as a2,:ordertype as a3,:device as a4,:xb as a5,:tjry as a6,:cs as a7,:gy as a8,:dh as a9,:xh as a10,:tasktype as a11,:useraccount as a12 FROM dual ) aa \
  ON (to_char(tc_afj01,'YYYY-MM-DD')=aa.a1 AND tc_afj02=aa.a2 AND tc_afj09=aa.a9 AND tc_afj10=aa.a10 AND tc_afj12=aa.a12 AND tc_afj04=aa.a4 ) \
  WHEN MATCHED THEN \
  UPDATE SET tc_afj05=aa.a5,tc_afj06=aa.a6,tc_afj07=aa.a7 \
  WHEN NOT MATCHED THEN \
  INSERT (tc_afj01,tc_afj02,tc_afj03,tc_afj04,tc_afj05,tc_afj06,tc_afj07,tc_afj08,tc_afj09,tc_afj10,tc_afj11,tc_afj12) VALUES (to_date(aa.a1,'yyyy-mm-dd'),aa.a2,aa.a3,aa.a4,aa.a5,aa.a6,aa.a7,aa.a8,aa.a9,aa.a10,aa.a11,aa.a12) ",
  getsjqr: "Select tc_afk04,tc_afk05, tc_afk06, tc_afk07, tc_afk08, tc_afk09, tc_afk10, tc_afk11 \
  from tc_afk_file\
  Where tc_afk01=to_date(:todaydate,'yyyy-mm-dd') and tc_afk02=:orderno and tc_afk13=:dh and tc_afk14 =:xh and tc_afk16 =:useraccount ",
  updatesjqr: "Update tc_afk_file \
  set tc_afk04=:state1, tc_afk05=:bz1, tc_afk06=:state2, tc_afk07=:bz2, \
  tc_afk08=:state3, tc_afk09=:bz3, tc_afk10=:state4, tc_afk11=:bz4 \
  Where tc_afk01=to_date(:todaydate,'yyyy-mm-dd') and tc_afk02=:orderno and tc_afk13=:dh and tc_afk14 =:xh and tc_afk16 =:useraccount ",
  getzssc: "Select to_char(tc_afq01,'YYYY-MM-DD') tc_afq01,tc_afq06,tc_afl04,tc_afl06,tc_afl05,tc_afl07 \
  From tc_afq_file \
  Left join tc_afl_file on tc_afq01=tc_afl01 and tc_afq02=tc_afl02 and tc_afq12=tc_afl08 and tc_afq13=tc_afl09 and tc_afq15=tc_afl11 \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13 =:xh and tc_afq15 =:useraccount and tc_afq04='D' ",
  updatezssc: "Update tc_afl_file set tc_afl04=:xb,tc_afl05=:rs,tc_afl06=:gx \
  Where tc_afl01=to_date(:todaydate,'yyyy-mm-dd') and tc_afl02=:orderno and tc_afl08=:dh and tc_afl09=:xh and tc_afl11=:useraccount ",
  getusers: "SELECT hrat01,hrat02,hrao02  FROM hrat_file,hrao_file \
  WHERE hrat04=hrao01 \
  AND hrat44='Y' order by hrao02",
  updateusers: "insert into tc_bat_file(tc_bat01,tc_bat02,tc_bat03,tc_bat04,tc_bat05,tc_bat06) \
  values(to_date(:todaydate,'yyyy-mm-dd'),:orderno,:dh,:xh,'1',:userno)",
  getbgsj: "select to_char(tc_afq01,'YYYY-MM-DD') tc_afq01,tc_afq06,tc_afq07,tc_afq08,tc_afl05,to_number(tc_afq09) tc_afq09,to_number(tc_afq10) tc_afq10,tc_afq11 \
  from tc_afq_file \
  inner join tc_afl_file on tc_afq01=tc_afl01 and tc_afq02=tc_afl02 and tc_afq12=tc_afl08 and tc_afq13=tc_afl09 and tc_afq15=tc_afl11 \
  where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13 =:xh and tc_afq15 =:useraccount and tc_afq04='D'",
  getbgsj_begintime: "select tc_afq06 \
  from tc_afq_file \
  where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13 =:xh and tc_afq15 =:useraccount and tc_afq04='E'",
  getbghis: "select sum(tc_afm04) ALLHIS from tc_afm_file \
  where tc_afm01=to_date(:todaydate,'yyyy-mm-dd') and tc_afm02=:orderno and tc_afm07=:dh and tc_afm08=:xh and tc_afm10=:useraccount " ,
  getbgsj_lp: "Select tc_afm04,tc_afm05 from tc_afm_file \
  Where tc_afm01=to_date(:todaydate,'yyyy-mm-dd') and tc_afm02=:orderno and tc_afm07=:dh and tc_afm08=:xh and tc_afm10=:useraccount ",
  updatebgsj_lp: "insert into tc_afm_file(tc_afm01,tc_afm02,tc_afm03,tc_afm04,tc_afm05,tc_afm07,tc_afm08,tc_afm09,tc_afm10,tc_afm11,tc_afm12,tc_afm13,tc_afm14,tc_afm15,tc_afm16) \
  values (to_date(:todaydate,'yyyy-mm-dd'),:orderno,:ordertype,:count,:dw,:dh,:xh,:lx,:useraccount,:zsscbegin,:zsscend,:begin,:end,:zssccount,:ph)",
  getbgsj_bl: "Select tc_afn04,tc_afn05,tc_afn06,tc_afn07,tc_afn08,tc_afn09,tc_afn10,tc_afn11 \
  From tc_afn_file \
  Where tc_afn01=to_date(:todaydate,'yyyy-mm-dd') and tc_afn02=:orderno and tc_afn12=:dh and tc_afn13=:xh and tc_afn15=:useraccount ",
  updatebgsj_bl: "Insert into tc_afn_file (tc_afn01, tc_afn02, tc_afn03, tc_afn04, tc_afn05, tc_afn06, tc_afn07, tc_afn08, tc_afn09, tc_afn10, tc_afn11 ,tc_afn12,tc_afn13,tc_afn14,tc_afn15,tc_afn16,tc_afn17,tc_afn18,tc_afn19) \
  values (to_date(:todaydate,'yyyy-mm-dd'),:orderno,:ordertype,:ljbh,:pm,:count,:dw,:blyy,:pdjg,:ph,:gys,:dh,:xh,:tasktype,:useraccount,:zsscbegin,:zsscend,:begin,:end) ",
  getbgsj_blyy: "SELECT qce01,qce03 FROM qce_file WHERE qce04='1' AND qceacti='Y'",
  getbgsj_blyy2: "SELECT tc_qce01 qce01,tc_qce03 qce03 FROM tc_qce_file,eca_file,tc_afr_file \
  WHERE tc_qce02=eca01 AND eca05=tc_afr06 \
  AND tc_afr01=to_date(:todaydate,'yyyy-mm-dd') AND tc_afr02=:orderno \
  AND tc_afr12=:dh AND tc_afr14=:xh",
  getbgsj_bllj: "SELECT sfa03,ima02 FROM sfa_file \
  LEFT JOIN ima_file ON sfa03=ima01 \
  WHERE sfa01=:orderno \
  UNION \
  SELECT sfb05,ima02 FROM sfb_file \
  LEFT JOIN ima_file ON sfb05=ima01 \
  WHERE sfb01=:orderno",
  getbgsj_blph: "SELECT DISTINCT sfe10 FROM sfe_file \
  WHERE sfe02 IN (SELECT DISTINCT tc_afs03 FROM tc_afs_file WHERE tc_afs01=to_date(:todaydate,'yyyy-mm-dd')) \
  AND sfe01=:orderno ",
  resettaskstate: "update tc_afq_file set tc_afq05='1',tc_afq06='',tc_afq07='' \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh \
  and tc_afq13=:xh And tc_afq15=:useraccount \
  And tc_afq04 IN ('D','E')",
  restartzssc: "update tc_afl_file set tc_afl07=0 \
  where tc_afl01=to_date(:todaydate,'yyyy-mm-dd') AND tc_afl02=:orderno AND tc_afl08=:dh AND tc_afl09=:xh \
  AND tc_afl11=:useraccount",

  getxjcount: "SELECT COUNT(*) xjcount FROM tc_abk_file \
  WHERE tc_abk01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abk02=:orderno AND tc_abk04=:dh AND tc_abk05=:xh \
  AND tc_abk06=:type AND tc_abk07=:useraccount AND tc_abk08='1' ",
  getxj: "SELECT tc_abl08,tc_abl09,tc_abl10,tc_abl11,tc_abl12,tc_abl13,tc_abl14,tc_abl15,tc_abl16,tc_abl17,tc_abl18,tc_abl19 FROM tc_abl_file \
  WHERE tc_abl01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abl02=:orderno AND tc_abl04=:dh AND tc_abl05=:xh \
  AND tc_abl06=:lx AND tc_abl07=:useraccount AND tc_abl22=:xjcount",
  //getxj:"select * from tc_abl_file where tc_abl02='411-MH011810150162'",
  insertcyxj: "INSERT INTO tc_abk_file values(to_date(:todaydate,'yyyy-mm-dd'),:orderno,:gy,:dh,:xh,:type,\
  :useraccount,'1',:begintime,:endtime,:count_cc,:times,:count_wg,:count_xn,'','') ",
  updatexj: "UPDATE tc_abl_file  SET tc_abl15=:state ,tc_abl16=:bz \
  WHERE tc_abl01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abl02=:orderno AND tc_abl04=:dh AND tc_abl05=:xh \
  AND tc_abl06=:lx AND tc_abl07=:useraccount AND tc_abl08=:lb AND tc_abl10=:xm ",
  insertxj_cc: "INSERT INTO tc_abn_file values(to_date(:todaydate,'yyyy-mm-dd'),:orderno,:gy,:dh,:xh,:type,\
  :useraccount,'1',:begintime,:endtime,:indexc,:sizec,:sizek,:sizeg,:times,'','')",

  //首件确认整合版本
  getsjqr_n: "SELECT tc_abg08,tc_abg09,tc_abg10,tc_abg11,tc_abg12,tc_abg13,tc_abg14,tc_abg15,tc_abg16,tc_abg17,tc_abg18,tc_abg19 FROM tc_abg_file \
  WHERE tc_abg01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abg02=:orderno AND tc_abg04=:dh AND tc_abg05=:xh \
  AND tc_abg06=:lx AND tc_abg07=:useraccount ",
  updatesjqr_n: "UPDATE tc_abg_file  SET tc_abg15=:state ,tc_abg16=:bz \
  WHERE tc_abg01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abg02=:orderno AND tc_abg04=:dh AND tc_abg05=:xh \
  AND tc_abg06=:lx AND tc_abg07=:useraccount AND tc_abg08=:lb AND tc_abg10=:xm ",

  //设备调机整合版本
  getsbtj_n: "SELECT tc_abi08,tc_abi09,tc_abi10,tc_abi11,tc_abi12,tc_abi13 \
  FROM tc_abi_file \
  WHERE tc_abi01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abi02=:orderno AND tc_abi04=:dh AND tc_abi05=:xh \
  AND tc_abi06=:lx AND tc_abi07=:useraccount",
  updatesbtj_n: "UPDATE tc_abi_file set tc_abi12=:bz \
  WHERE tc_abi01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abi02=:orderno AND tc_abi04=:dh AND tc_abi05=:xh \
  AND tc_abi06=:lx AND tc_abi07=:useraccount AND tc_abi08=:jqbh AND tc_abi10=:xmbh",


  /*=============================品管检验====================================*/
  getRwbh: "select tc_afq20 from tc_afq_file \
  where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq12=:dh and tc_afq13=:xh \
  and tc_afq04='C' and tc_afq15=:useraccount ",
  updatewlqd_pg: "update tc_bae_file set tc_bae02='Y' \
  where tc_bae01=:rwbh and tc_bae05=to_date(:todaydate,'yyyy-mm-dd')",
  updatesbtj_pg: "update tc_bae_file set tc_bae03='Y' \
  where tc_bae01=:rwbh and tc_bae05=to_date(:todaydate,'yyyy-mm-dd')",
  getsjcount: "SELECT COUNT(*) FROM tc_bae_file,tc_ttr_file \
  WHERE tc_bae01=tc_ttr01 AND tc_bae02='Y' AND tc_bae03='Y' AND tc_ttr03=0 AND tc_ttr02=to_date(:todaydate,'yyyy-mm-dd') AND tc_ttr20='N'",
  getsjlist: "SELECT tc_ttr04,tc_ttr05,tc_ttr06,tc_ttr16,tc_ttr22,tc_ttr23,tc_ttr24,tc_ttr19,tc_ttr20,tc_ttr26 \
  FROM tc_ttr_file,tc_bae_file \
  WHERE tc_ttr01=tc_bae01 AND tc_ttr20='N' AND tc_bae02='Y' AND tc_bae03='Y' AND tc_ttr02=to_date(:todaydate,'yyyy-mm-dd') AND tc_ttr03='0'",
  getjylist: "SELECT tc_tts03,tc_tts04, tc_tts05,tc_tts19,tc_tts20,tc_tts21 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh",
  getjylist_wlqr: "SELECT tc_tts03,tc_tts05,tc_tts19,tc_tts20,tc_tts21 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts04='1'",
  getjylist_sbcs: "SELECT tc_tts03,tc_tts20,tc_tts21 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts04='2'",
  getjylist_cpqr: "SELECT DISTINCT tc_tts25,CASE tc_tts24 WHEN 'N' THEN tc_tts05 ELSE tc_tts23 END tc_tts05,tc_tts24,tc_tts21 \
  FROM tc_tts_file  WHERE tc_tts22=:rwbh  AND tc_tts04='3'  ORDER BY tc_tts05",
  getjymx: "SELECT tc_tts20,tc_tts19,tc_tts09,tc_tts03,tc_tts05, tc_tts22,tc_tts15,tc_tts17 \
  FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts03=:xh",
  getjymx_wlqr: "SELECT tc_tts05, tc_tts19,tc_tts20,tc_tts09, tc_tts03 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts05=:ljbh",
  getjymx_cpqrn: "SELECT tc_tts19,tc_tts09,tc_tts03,tc_tts22,tc_tts15,tc_tts17 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts05=:ljbh",
  getjymx_cpqry: "SELECT DISTINCT tc_tts22,tc_tts09,tc_tts15 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts23=:ljbh",
  getjymx_cpqry_xc: "SELECT tc_tts03,tc_tts19 FROM tc_tts_file \
  WHERE tc_tts22=:rwbh AND tc_tts23=:ljbh",
  getcsbz: "select ta_qcd04,qcd061,qcd062 \
  from qcd_file \
  WHERE qcd01=:ljbh AND qcd02=:xmbh",
  getcslist: "select tc_bmq03,tc_bmq04 FROM tc_bmq_file where tc_bmq01=:rwbh AND tc_bmq02=:xc",
  getcslist_cpqry: "select tc_bmq02,tc_bmq03,tc_bmq04 FROM tc_bmq_file where tc_bmq01=:rwbh",
  updatecs: "merge into tc_bmq_file \
  using (select :rwbh aa,:xc bb,:jgxc cc,:zhi dd FROM dual) \
  ON (tc_bmq01=aa AND tc_bmq02=bb AND tc_bmq03=cc) \
  WHEN MATCHED THEN \
  UPDATE SET tc_bmq04=dd \
  WHEN NOT MATCHED THEN \
  INSERT VALUES(aa,bb,cc,dd,:sfcl,'','','')",
  updatecsresult: "update tc_tts_file set tc_tts21='Y',tc_tts28=:useraccount,tc_tts27=:todaytime where tc_tts22=:rwbh and tc_tts03=:xc",
  updatecsresult_cpqr: "update tc_tts_file set tc_tts21='Y',tc_tts28=:useraccount,tc_tts27=:todaytime where tc_tts22=:rwbh",
  updatejymx: "update tc_baf_file set tc_baf08=:result \
  where tc_baf01=:rwxh AND tc_baf04=:xh AND tc_baf02=0",
  insertjyjl_x: "insert into tc_bad_file(tc_bad01,tc_bad02,tc_bad03,tc_bad04,tc_bad05,tc_bad06,tc_bad07,tc_bad11) \
  values(:rwbh,to_date(:todaydate,'yyyy-mm-dd'),:begintime,:endtime,'NG',:bz,:cysl,:curdw)",
  insertjyjl_y: "insert into tc_bad_file(tc_bad01,tc_bad02,tc_bad03,tc_bad04,tc_bad05) \
  values(:rwbh,to_date(:todaydate,'yyyy-mm-dd'),:begintime,:endtime,'OK')",
  updatesjstatus: "update tc_ttr_file set tc_ttr27='Y' \
  where tc_ttr01 IN (SELECT tc_ttr01 FROM tc_ttr_file WHERE tc_ttr26=:rwbh)",
  updatesjqr_nn: "update tc_afq_file set tc_afq06=:begintime,tc_afq07=:endtime ,tc_afq05='3'\
  where tc_afq20 IN (SELECT tc_ttr01 FROM tc_ttr_file WHERE tc_ttr26=:rwbh) and tc_afq04='C'",
  updatesjbegintime: "update tc_ttr_file set tc_ttr16=:begintime \
  where tc_ttr26=:rwbh",
  getsjmxbegintime: "select distinct tc_tts26 from tc_tts_file WHERE tc_tts22=:rwbh ",
  updatesjmxbegintime: "update tc_tts_file set tc_tts26=:begintime WHERE tc_tts22=:rwbh",
  getxjcount_n: "select count(*) from tc_bai_file where tc_bai01=:rwbh",
  getxjduration: "select tc_bai02, tc_bai25 from tc_bai_file where tc_bai01=:rwbh",
  updatexjjl: "update tc_bai_file set tc_bai21=:begintime',tc_bai22=:endtime \
  where tc_bai01=:rwbh and tc_bai02=:times",

  /*巡检*/
  getxjcount_nnn: "SELECT COUNT(*) FROM tc_ttr_file \
  WHERE tc_ttr03 > 0 and tc_ttr27 = 'Y' AND tc_ttr02=to_date(:todaydate,'yyyy-mm-dd') AND tc_ttr20='N' and  tc_ttr14 <=:nowtime",
  getxjlist: "SELECT tc_ttr04,tc_ttr05,tc_ttr06,tc_ttr22,tc_ttr23,tc_ttr24,tc_ttr19,tc_ttr20,tc_ttr26,tc_ttr14,tc_ttr15,tc_ttr16 \
  FROM tc_ttr_file \
  WHERE tc_ttr03 > 0  AND tc_ttr27='Y' AND tc_ttr20='N' AND tc_ttr02=to_date(:todaydate,'yyyy-mm-dd') and  tc_ttr14 <=:nowtime",

  /*成品检*/
  getcpjcount: "SELECT COUNT(*) FROM tc_ttu_file WHERE tc_ttu19='N'",
  getcpjlist: "SELECT tc_ttu13,tc_ttu01,tc_ttu03,tc_ttu15,tc_ttu17,tc_ttu18 \
  FROM tc_ttu_file \
  WHERE tc_ttu19='N'",
  getcpjjylist: "SELECT DISTINCT tc_ttw20,CASE tc_ttw22 WHEN 'N' THEN tc_ttw03 ELSE tc_ttw13 END tc_ttw03, tc_ttw22,tc_ttw21 \
  FROM tc_ttw_file \
  WHERE tc_ttw01=:rwbh \
  ORDER BY tc_ttw03",
  updatecpjjy: "update tc_ttu_file set tc_ttu19='Y' \
  where tc_ttu01=:rwbh ",
  getcpjjymx_y: "SELECT tc_ttw01,tc_ttw02,tc_ttw07,tc_ttw15,tc_ttw19 FROM tc_ttw_file \
  WHERE tc_ttw01=:rwbh AND tc_ttw13=:bh",
  updatecpjresult: "update tc_ttw_file SET tc_ttw21='Y',tc_ttw23=:useraccount,tc_ttw26=to_date(:todaydate,'yyyy-mm-dd'),tc_ttw27=:todaytime \
   WHERE tc_ttw01=:rwbh ",
  getcpjmxbegintime: "select distinct tc_ttw25 from tc_ttw_file WHERE tc_ttw01=:rwbh ",
  updatecpjmxbegintime: "update tc_ttw_file set tc_ttw24=to_date(:begindate,'yyyy-mm-dd'),tc_ttw25=:begintime WHERE tc_ttw01=:rwbh",
  getcpjjymx_n: "SELECT tc_ttw20,tc_ttw07,tc_ttw02,tc_ttw01,tc_ttw15,tc_ttw17 FROM tc_ttw_file \
  WHERE tc_ttw01=:rwbh AND tc_ttw03=:bh",
  /*=============================利器管理====================================*/
  getlqlist: "select tc_afy01,tc_afx01,tc_afx02 from tc_afy_file \
  inner join tc_afx_file on tc_afy01 = tc_afx01 \
  where tc_afy03=:cjbh",
  getcjlist: "select eca02 from eca_file where ecaacti='Y'",
  getbrlist: "SELECT tc_afw01, tc_afw02, tc_afw03,tc_afw09, gen02,tc_afw04,to_char(tc_afw05,'YYYY-MM-DD') tc_afw05,tc_afw06,tc_afw12 \
  from tc_afw_file \
  left join gen_file on tc_afw09=gen01 \
  where tc_afw11='N'",
  addbrinfo: "insert into tc_afw_file (tc_afw01,tc_afw02,tc_afw03,tc_afw04,tc_afw05,tc_afw06,tc_afw07,tc_afw08,tc_afw09,tc_afw10,tc_afw11,tc_afw12,tc_afw13,tc_afw14,tc_afw15) \
  values (:lqbh,:lqmc,:lqxh,:lqsl,to_date(:jcrq,'yyyy-mm-dd'),:jcsj,'','',:jcgh,'','N',:cjbh,'','','')",
  updatertinfo: "update tc_afw_file set tc_afw07=:ghrq,tc_afw08=:ghsj,tc_afw10=:ghgh,tc_afw11='Y' \
  where tc_afw01=:lqbh and tc_afw03=:lqxh and tc_afw05=to_date(:jcrq,'yyyy-mm-dd') and tc_afw06=:jcsj",

  /*=============================设备维修====================================*/
  getsblist: "select eci06,eci01 from eci_file \
  where eci01 NOT like 'EQP%' AND eciacti='Y'",
  getgdlist: "select tc_afr02,tc_afr05,tc_afr12,tc_afr14,tc_afr13 from tc_afr_file \
  where tc_afr01=to_date(:todaydate,'yyyy-mm-dd')",
  getbxlist: "SELECT tc_bab02,tc_bab01,tc_baa03,tc_baa04,gen02, to_char(tc_bab03,'YYYY-MM-DD') tc_bab03,tc_bab04,tc_baa13,tc_bab05,tc_bab06 \
  FROM tc_bab_file \
  inner JOIN tc_baa_file on tc_bab01=tc_baa01 AND tc_bab03=tc_baa05 and tc_bab04=tc_baa06 \
  left join gen_file on tc_baa07=gen01 \
  WHERE (tc_bab05 = 'A' and tc_bab06 = '1') or (tc_bab05 = 'A' and tc_bab06 = '2') or (tc_bab05 = 'B' and tc_bab06 = '1') or (tc_bab05 = 'B' and tc_bab06 = '2')",
  addbxinfo: "INSERT INTO tc_baa_file(tc_baa01,tc_baa02,tc_baa03,tc_baa04,tc_baa05,tc_baa06,tc_baa07, \
  tc_baa08,tc_baa09,tc_baa10,tc_baa11,tc_baa12) \
  VALUES(:sbbh,:sbmc,:sbwz,:sbgz,to_date(:bxdate,'yyyy-mm-dd'),:bxtime,:useraccount, \
  :gdgd,:gdgy,:gddh,:gdxh,:gdlx)",
  addbxstatus: "insert into tc_bab_file (tc_bab01,tc_bab02,tc_bab03,tc_bab04,tc_bab05,tc_bab06,tc_bab07,tc_bab08,tc_bab09,tc_bab10 ) \
  values (:sbbh,:sbmc,to_date(:bxdate,'yyyy-mm-dd'),:bxtime,:type,:status,to_date(:startdate,'yyyy-mm-dd'),:starttime,to_date(:enddate,'yyyy-mm-dd'),:endtime)",
  getfplist: "select tc_afv05 FROM tc_afv_file WHERE tc_afv03='8'",
  updatezpinfo: "UPDATE  tc_baa_file SET tc_baa13=:zpry \
  WHERE tc_baa01=:sbbh AND tc_baa05=to_date(:bxdate,'yyyy-mm-dd') AND tc_baa06=:bxtime ",
  updatebxstatus_begin: "UPDATE tc_bab_file SET tc_bab07=to_date(:begin,'yyyy-mm-dd'),tc_bab08=:end,tc_bab06=:bxtype \
  WHERE tc_bab01=:sbbh AND tc_bab03=to_date(:bxdate,'yyyy-mm-dd') AND tc_bab04=:bxtime and tc_bab05=:bxstatus ",
  updatebxstatus_end: "UPDATE tc_bab_file SET tc_bab09=to_date(:begin,'yyyy-mm-dd'),tc_bab10=:end,tc_bab06=:bxtype \
  WHERE tc_bab01=:sbbh AND tc_bab03=to_date(:bxdate,'yyyy-mm-dd') AND tc_bab04=:bxtime and tc_bab05=:bxstatus ",
  updatewxinfo: "UPDATE  tc_baa_file SET tc_baa14=:wxnr \
  WHERE tc_baa01=:sbbh AND tc_baa05=to_date(:bxdate,'yyyy-mm-dd') AND tc_baa06=:bxtime ",

  checkbxstatus: "SELECT COUNT(*) FROM tc_bab_file \
  WHERE tc_bab01=:sbbh AND tc_bab03=to_date(:bxdate,'yyyy-mm-dd') AND tc_bab04=:bxtime AND tc_bab06=:bxstatus AND tc_bab05=:bxtype"

};

module.exports = sqlmap;
