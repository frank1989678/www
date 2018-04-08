<?php 
$names = $_POST['name'];
if ($names) {
	include("conn.php");//引入链接数据库
	$arr = explode(",",$names);
	for ($i=0; $i<count($arr); $i++) {
		$sql = "insert into surname(surname) value ('$arr[$i]')" ;  	
		mysql_query($sql);	
	}
	$status 	=  	mysql_affected_rows();
	echo json_encode(array('status' => $status)); 
	mysql_close();
	// header("Location: http://www.power.com/form");  
	exit;
}
?> 


