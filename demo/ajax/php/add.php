<?php 
include("conn.php");//引入链接数据库
$name		=	$_POST['name']; 
$tel		=	$_POST['tel']; 
$address	=	$_POST['address']; 
$birthday	=	$_POST['birthday']; 
$sql		=	"insert into member(name,tel,address,birthday) value ('$name','$tel','$address','$birthday')" ; 
mysql_query($sql); 
$status 	=  	mysql_affected_rows();
echo json_encode(array('status' => $status)); 
mysql_close(); 
?> 


