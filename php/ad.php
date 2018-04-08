<?php
include("conn.php");//引入链接数据库
$type_id 	= isset($_REQUEST['type_id']) ? $_REQUEST['type_id'] : "";
$q 		= "SELECT * FROM ad where type_id=" . $type_id. " order by sort desc";
$rs 	= mysql_query($q, $conn);
$data   = array();

while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$data[] = $row;
}
// $status = mysql_affected_rows(); 
// $arr 	= array("status" => $status, 'data' => $data);
mysql_close(); 
echo json_encode($data);
?>	
