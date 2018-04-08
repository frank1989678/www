<?php
include("conn.php");//引入链接数据库
$perNumber		=	10; //每页显示的记录数
$keyword		= 	isset($_REQUEST['keyword']) ? $_REQUEST['keyword'] : "";
$q 				= 	"SELECT * FROM commodity where name like '%" . $keyword . "%'";
$rs 			= 	mysql_query($q, $conn);
$data   		= 	array();
while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$data[] = $row;
}
$arr 	= array('list' => $data);
mysql_close(); 
echo json_encode($arr);
?>	
