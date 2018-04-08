<?php
include("conn.php");//引入链接数据库

$id 	= isset($_REQUEST['id']) ? $_REQUEST['id'] : "2";
$info 	= array();
$rs 	= mysql_query("SELECT * FROM article where id=" . $id, $conn);
$info 	= mysql_fetch_row($rs, MYSQL_ASSOC);

$str = $info['content'];
$str = strip_tags($str, '<p>');
$str = str_replace(PHP_EOL, '', $str); 
$str = str_replace('</p>', '', $str);
$str = explode('<p>', $str);

mysql_close(); 
// print_r ($str);
echo json_encode($str);

?>	
