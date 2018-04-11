<?php
// header("Access-Control-Allow-Origin:*");  // 允许跨域
Header("Content-type: application/json");
echo json_encode(array('status' => 'SUCCESS')); 
exit;
?>	