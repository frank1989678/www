<?php
$roleName = isset($_REQUEST['roleName']) ? $_REQUEST['roleName'] : "";
if ($roleName == 'abc') {
	$arr = '角色名已存在';
} else {
	$arr = '';
}
echo json_encode($arr);
?>	
