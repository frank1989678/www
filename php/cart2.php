<?php
include("conn.php");//引入链接数据库
$perNumber		=	10; //每页显示的记录数
$id 			= 	isset($_REQUEST['id']) ? $_REQUEST['id'] : "1";
$q 				= 	"select * from commodity where id in(".$id.")";
$rs 			= 	mysql_query($q, $conn);
$data   		= 	array();
while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$data[] = array(
		'id' => $row['id'],
		'name' => $row['name'],
		'norms' => $row['title']
	);
}
// print_r ($data);
mysql_close(); 
echo json_encode($data);
// echo json_encode(array());
?>	
