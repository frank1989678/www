<?php
$time = 	isset($_REQUEST['time']) ? $_REQUEST['time'] : "";
sleep($time/1000);
echo json_encode($time);
?>	
