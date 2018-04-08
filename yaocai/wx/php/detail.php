<?php
include("conn.php");//引入链接数据库
$id 	= isset($_REQUEST['id']) ? $_REQUEST['id'] : "1";
$q1 = "SELECT * FROM commodity where id = " . $id; // 查询商品详情
$q2 = "SELECT * FROM commodity where category_id = "; // 查询商品的其他规格商品
$q3 = "SELECT * FROM article where id = 2"; // 查询质量保证
$q4 = "SELECT * FROM follow_commodity where commodity_id = " . $id . " and user_id = 133"; // 查询关注商品

$info 	= mysql_fetch_row(mysql_query($q1, $conn), MYSQL_ASSOC);
$quality 	= mysql_fetch_row(mysql_query($q3, $conn), MYSQL_ASSOC);
$follow 	= mysql_fetch_row(mysql_query($q4, $conn), MYSQL_ASSOC);

$s = mysql_query($q2 . $info['category_id'], $conn);

while($row = mysql_fetch_array($s, MYSQL_ASSOC)) {
	$norms[$row['id']] = $row['spec'];
}

$str = $info['detail'];
$str = str_replace(PHP_EOL, '', $str);
$str = str_replace(array('_src', '"'), '', $str);
preg_match_all("|src=(.*) |U", $str, $result);

// 质量保证
$quality = $quality['content'];
$quality = strip_tags($quality, '<p>');
$quality = str_replace(PHP_EOL, '', $quality); 
$quality = str_replace('</p>', '', $quality);
$quality = explode('<p>', $quality);

// 关注商品
if ($follow) {
	$faved = $follow['status'];
} else {
	$faved = '0';
}

$data = array(
	'info' => array(
		'title'       => $info['title'],
		'name'        => $info['name'],
		'spec'        => $info['spec'],
		'origin'      => $info['origin'],
		'har_year'    => $info['har_year'],
		'unit'        => $info['unit'],
		'norms'       => $norms,
		'price'       => $info['price'],
		'update_time' => explode(' ', $info['update_time']),
		'detail'      => $result[1],
		'quality'     => $quality
	),
	'banner'      => $info['picture_url'],
	'attr'        => $info['attribute'],
	'min'         => $info['minimum_quantity'],
	'faved'		  => $faved
);

mysql_close(); 
echo json_encode($data);
?>	
