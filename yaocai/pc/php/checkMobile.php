<?php
sleep (1);
$mobile		= 	isset($_REQUEST['mobile']) ? $_REQUEST['mobile'] : "";
if ($mobile === '15926332570') {
	$arr = array('status' => 'isused', 'msg' => '此手机号已被占用');
} else {
	$arr = array('status' => 'y', 'msg' => '');
}
echo json_encode($arr);
?>	
