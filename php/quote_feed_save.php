<?php
include("conn.php");//引入链接数据库

$qid		= $_REQUEST['qid'];
$nickname 	= $_REQUEST['nickname'];
$content 	= $_REQUEST['content'];
$avatar 	= $_REQUEST['avatar'];
$create_time = date('Y-m-d H:i:s', time()+8*60*60);
$sql		= "insert into quote_feed(qid,nickname,content,create_time) value ('$qid','$nickname','$content','$create_time')"; 
mysql_query($sql);
$status 	= mysql_affected_rows();
$array = array('nickname' => $nickname, 'content' => $content, 'avatar' => $avatar);
mysql_close(); 
echo json_encode(array('info' => $array, 'status' => $status));
?>	
