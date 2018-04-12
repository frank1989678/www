<?php 
$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
if (strpos($url, "localhost")) {
  $ip = gethostbyname('USER-20180131DV');
  header("location:http://".$ip."/");
} 
?> 