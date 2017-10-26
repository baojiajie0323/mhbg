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

  gettodaytask: "SELECT tc_afr09,ima02,tc_afr02,tc_afr03,ima55,tc_afr04,tc_afr05 FROM tc_afr_file \
  LEFT JOIN ima_file ON tc_afr09=ima01 \
  WHERE tc_afr01 = to_date(:todaydate,'yyyy-mm-dd')",
  gettaskstate: "Select tc_afq02,tc_afq03,tc_afq04,tc_afq05 FROM tc_afq_file \
  Where tc_afq01 = to_date(:todaydate,'yyyy-mm-dd')",
  begintask: "Update tc_afq_file set tc_afq06=:begintime,tc_afq05='2' \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq03=:ordertype \
  And tc_afq04=:orderstep ",
  endtask: "Update tc_afq_file set tc_afq07=:begintime,tc_afq05='3' \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq03=:ordertype \
  And tc_afq04=:orderstep ",
  gettaskinfo: "SELECT tc_afr02,CASE WHEN sfb02=1 THEN '一般工单' WHEN sfb02= 5 THEN '返工工单' \
  WHEN sfb02= 7 THEN '委外工单' WHEN sfb02= 8 THEN '返工委外工单' END sfb02, \
  to_char(sfb81,'YYYY-MM-DD') sfb81, tc_afr09, ima02, sfb08, \
  tc_afr04, tc_afr05, gen02, ima55 FROM tc_afr_file\
  LEFT JOIN ima_file ON tc_afr09=ima01    \
  LEFT JOIN gen_file ON tc_afr08=gen01    \
  INNER JOIN sfb_file ON tc_afr02=sfb01  \
  WHERE tc_afr02=:orderno \
  AND tc_afr01= to_date(:todaydate, 'yyyy-mm-dd') AND tc_afr04=:ordertype ",
  getwlqd: "Select tc_afi04,tc_afi05,tc_afi06,tc_afi07,tc_afi08,tc_afi09,tc_afi10,tc_afi11,tc_afi12 \
  from tc_afi_file \
  where tc_afi01=to_date(:todaydate,'yyyy-mm-dd') and tc_afi02=:orderno and tc_afi03=:ordertype ",
  updatewlqd: "update tc_afi_file set tc_afi09=:cpjg,tc_afi10=:cpsm,tc_afi11=:fpjg,tc_afi12=:fpsm \
  where tc_afi01=to_date(:todaydate,'yyyy-mm-dd') and tc_afi02=:orderno and tc_afi03=:ordertype \
  and tc_afi04=:ljbh ",
  getsbtj: "Select tc_afj04,tc_afj05, tc_afj06, tc_afj07, tc_afj08  from tc_afj_file \
  Where tc_afj01=to_date(:todaydate,'yyyy-mm-dd') and tc_afj02=:orderno and tc_afj03=:ordertype ",
  updatesbtj: "MERGE INTO tc_afj_file \
  USING (SELECT :todaydate as a1,:orderno as a2,:ordertype as a3,:device as a4,:xb as a5,:tjry as a6,:cs as a7,:gy as a8 FROM dual ) aa \
  ON (to_char(tc_afj01,'YYYY-MM-DD')=aa.a1 AND tc_afj02=aa.a2 AND tc_afj03=aa.a3 AND tc_afj04=aa.a4 ) \
  WHEN MATCHED THEN \
  UPDATE SET tc_afj05=aa.a5,tc_afj06=aa.a6,tc_afj07=aa.a7 \
  WHEN NOT MATCHED THEN \
  INSERT (tc_afj01,tc_afj02,tc_afj03,tc_afj04,tc_afj05,tc_afj06,tc_afj07,tc_afj08) VALUES (to_date(aa.a1,'yyyy-mm-dd'),aa.a2,aa.a3,aa.a4,aa.a5,aa.a6,aa.a7,aa.a8) ",
  getsjqr: "Select tc_afk04,tc_afk05, tc_afk06, tc_afk07, tc_afk08, tc_afk09, tc_afk10, tc_afk11 \
  from tc_afk_file\
  Where tc_afk01=to_date(:todaydate,'yyyy-mm-dd') and tc_afk02=:orderno and tc_afk03=:ordertype ",
  updatesjqr: "Update tc_afk_file \
  set tc_afk04=:state1, tc_afk05=:bz1, tc_afk06=:state2, tc_afk07=:bz2, \
  tc_afk08=:state3, tc_afk09=:bz3, tc_afk10=:state4, tc_afk11=:bz4 \
  Where tc_afk01=to_date(:todaydate,'yyyy-mm-dd') and tc_afk02=:orderno and tc_afk03=:ordertype ",
  getzssc: "Select to_char(tc_afq01,'YYYY-MM-DD') tc_afq01,tc_afq06,tc_afl04,tc_afl06,tc_afl05 \
  From tc_afq_file \
  Left join tc_afl_file on tc_afq01=tc_afl01 and tc_afq02=tc_afl02 and tc_afq03=tc_afl03 \
  Where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq03=:ordertype and tc_afq04='D' ",
  updatezssc: "Update tc_afl_file set tc_afl04=:xb,tc_afl05=:rs,tc_afl06=:gx \
  Where tc_afl01=to_date(:todaydate,'yyyy-mm-dd') and tc_afl02=:orderno and tc_afl03=:ordertype ",
  getbgsj: "select tc_afq01,tc_afq06,tc_afq07,tc_afq08,tc_afl05,tc_afq09,tc_afq10,tc_afq11 \
  from tc_afq_file \
  inner join tc_afl_file on tc_afq01=tc_afl01 and tc_afq02=tc_afl02 and tc_afq03=tc_afl03 \
  where tc_afq01=to_date(:todaydate,'yyyy-mm-dd') and tc_afq02=:orderno and tc_afq03=:ordertype and tc_afq04='D'",
  getbgsj_lp: "Select tc_afm04,tc_afm05 from tc_afm_file \
  Where tc_afm01=to_date(:todaydate,'yyyy-mm-dd') and tc_afm02=:orderno and tc_afm03=:ordertype ",
  updatebgsj_lp: "Update tc_afm_file set tc_afm04=:lpcount \
  Where tc_afm01=to_date(:todaydate,'yyyy-mm-dd') and tc_afm02=:orderno and tc_afm03=:ordertype ",
  getbgsj_bl: "Select tc_afn05,tc_afn04,tc_afn06,tc_afn07,tc_afn08,tc_afn09,tc_afn10,tc_afn11 \
  From tc_afn_file \
  Where tc_afn01==to_date(:todaydate,'yyyy-mm-dd') and tc_tan02=:orderno and tc_afn03=:ordertype ",
  updatebgsj_bl: "Insert into tc_afn_file (tc_afn01, afn02, afn03, afn04, afn05, afn06, afn07, afn08, afn09, afn10, afn11) \
  values (to_date(:todaydate,'yyyy-mm-dd'),:orderno,:ordertype,:ljbh,:pm,:count,:dw,:blyy,:pdjg,:ph,:gys) "
};

module.exports = sqlmap;
