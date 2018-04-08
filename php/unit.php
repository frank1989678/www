<?php
include("conn.php");//引入链接数据库
$q 		= "SELECT * FROM code";
$rs 	= mysql_query($q, $conn);
$data   = array();
while($row = mysql_fetch_row($rs, MYSQL_ASSOC)){
	$data[$row['id']] = $row['name'];
}
mysql_close(); 
echo json_encode($data);
?>	
