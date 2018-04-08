<?php 
include("conn.php");//引入链接数据库
$iid		=	$_POST['delIid']; 
$sql		=	"delete from member where iid = ". $iid ; 
mysql_query($sql); 
$status 	=  	mysql_affected_rows();
echo json_encode(array('status' => $status)); 
mysql_close(); 
?> 


