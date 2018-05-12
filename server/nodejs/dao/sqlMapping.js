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
  gettodaytask: "SELECT tc_afr09,ima02,tc_afr02,tc_afr03,ima55,tc_afr04,tc_afr05,tc_aft08,tc_afv05,tc_afr12,tc_afr13,tc_afr14 FROM tc_afr_file \
  LEFT JOIN ima_file ON tc_afr09=ima01 \
  LEFT JOIN tc_aft_file ON tc_afr01 = tc_aft01 AND tc_afr02 = tc_aft02 AND tc_afr12 = tc_aft05 AND tc_afr14 = tc_aft06 \
  LEFT JOIN tc_afv_file ON tc_aft08 = tc_afv01 \
  WHERE tc_afr01 = to_date(:todaydate,'yyyy-mm-dd')",
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
  getbgsj_bllj: "SELECT sfa03,ima02 FROM sfa_file \
  LEFT JOIN ima_file ON sfa03=ima01 \
  WHERE sfa01=:orderno ",
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
  updatesbtj_n: "UPDATE tc_abi12=:bz \
  WHERE tc_abi01=to_date(:todaydate,'yyyy-mm-dd') AND tc_abi02=:orderno AND tc_abi04=:dh AND tc_abi05=:xh \
  AND tc_abi06=:lx AND tc_abi07=:useraccount AND tc_abi08=:jqbh AND tc_abi10=:xmbh",

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
  WHERE (tc_bab05 = 'A' and tc_bab06 = '1') or (tc_bab05 = 'A' and tc_bab06 = '2') or (tc_bab05 = 'B' and tc_bab06 = '1')",
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
};

module.exports = sqlmap;
