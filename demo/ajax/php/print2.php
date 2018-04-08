<?php
Header("Content-type: application/json");
include("conn.php");//引入链接数据库
$cb 	= isset($_REQUEST['callback']) ? $_REQUEST['callback'] : "callback";
$q 		= "SELECT * FROM member limit 10";
$rs 	= mysql_query($q, $conn);
$data   = array();

while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$data[] = $row;
}
$status = mysql_affected_rows(); 
$arr 	= array("status" => $status, 'data' => $data);
mysql_close(); 
echo $cb . "(" .json_encode($arr) . ")"; 
?>	
