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
};

module.exports = sqlmap;
