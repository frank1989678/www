<?php 
Header("Content-type: application/json");
include("conn.php");//引入链接数据库
$pid	= isset($_REQUEST["parentId"]) ? $_REQUEST["parentId"] : '100000';
if ($pid  === "") {
	$pid = '100000';
}
$q 		= "SELECT * FROM area where parentid = " . $pid;
$rs 	= mysql_query($q, $conn);
$arr 	= array();
while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$arr[] = $row;
};
mysql_close(); 
echo json_encode($arr);
exit;

?> 


