<?php
header("Access-Control-Allow-Origin:*");  // 允许跨域
// Header("Content-type: application/json");
$arr1 = array("id" => 1, "title" => 'this is news 1', "url" => '/news/1');
$arr2 = array("id" => 2, "title" => 'this is news 2', "url" => '/news/2');

$data = array($arr1, $arr2);

echo json_encode($data);
exit;
?>	