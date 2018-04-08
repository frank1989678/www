<?php
include("conn.php");//引入链接数据库
$id 	= isset($_REQUEST['id']) ? $_REQUEST['id'] : "1";
$faved 	= isset($_REQUEST['faved']) ? $_REQUEST['faved'] : "1";
$price 	= isset($_REQUEST['price']) ? $_REQUEST['price'] : "1";
$faved 	= isset($_REQUEST['faved']) ? $_REQUEST['faved'] : "0";
$create_time = date('Y-m-d H:i:s', time()+8*60*60);
$q1 = "select * from follow_commodity where commodity_id = " . $id . " and user_id = 133";
$q2 = "UPDATE follow_commodity SET status = " . $faved . " where commodity_id = " . $id . " and user_id = 133";
$q3 = "insert into follow_commodity(commodity_id,price,user_id,create_time,status) value ('$id','$price','133','$create_time','$faved')";
mysql_query($q1, $conn);
$status = mysql_affected_rows();
if ($status == 0) {
	mysql_query($q3, $conn);
} else {
	mysql_query($q2, $conn);
}
mysql_close();
// echo json_encode(mysql_affected_rows());
?>	