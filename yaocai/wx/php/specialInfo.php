<?php
include("conn.php");//引入链接数据库
if (isset($_REQUEST['pid']) && $_REQUEST['pid'] != '') {
	$pid 	= $_REQUEST['pid'];
} else {
	$pid 	= '1';
}

$info 	= array();
$rs 	= mysql_query("SELECT * FROM special where id=" . $pid, $conn);
$info 	= mysql_fetch_row($rs, MYSQL_ASSOC);
// $info['pictuer_url'] = str_replace('/opt/resources/yaobest', 'http://static.yaobest.com', $info['pictuer_url']);
mysql_close(); 
echo json_encode($info);
?>	
