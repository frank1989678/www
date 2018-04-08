<?php 
$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
if (strpos($url, "localhost")) {
  $ip = gethostbyname('zhouxiongjun');
  header("location:http://".$ip."/");
} 
?> 