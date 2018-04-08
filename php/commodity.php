<?php
sleep(1);
include("conn.php");//引入链接数据库
$perNumber		=	10; //每页显示的记录数
$page 			= 	isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : "1";
$count			=	mysql_query("select count(*) from commodity"); //获得记录总数
$rs				=	mysql_fetch_array($count);
$totalNumber	=	$rs[0];
$totalPage		=	ceil($totalNumber/$perNumber); //计算出总页数
$startCount		=	($page-1)*$perNumber; //分页开始,根据此方法计算出开始的记录
$nomore 		= 	$page >= $totalPage;
$q 				= 	"SELECT * FROM commodity limit $startCount,$perNumber";
$rs 			= 	mysql_query($q, $conn);
$data   		= 	array();
while($row = mysql_fetch_array($rs, MYSQL_ASSOC)){
	$data[] = $row;
}
$arr 	= array('data' => $data, "nomore" => $nomore);
mysql_close(); 
echo json_encode($arr);
?>	
