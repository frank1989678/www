<?php
// header("Access-Control-Allow-Origin:*");  // 允许跨域
Header("Content-type: application/json");
include("conn.php");//引入链接数据库
$page	= isset($_REQUEST["page"]) ? ($_REQUEST["page"] - 1) * 10 : 1;
$q 		= "SELECT * FROM member order by iid limit $page,10";
$rs 	= mysql_query($q, $conn);
$arr 	= array();
while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$arr[] = $row;
};
mysql_close(); 
echo json_encode($arr);
exit;
?>	