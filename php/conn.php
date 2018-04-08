<?php 
header("Content-Type: text/html; charset=UTF-8");
// sleep(2);
// Header("Content-type: application/json");
//第一步：链接数据库 
//
$conn = @mysql_connect("192.168.1.55:3306","yaoyy","123456") or die ("mysql链接失败"); 

//第二步: 选择指定的数据库，设置字符集 
@mysql_select_db("yaoyy", $conn) or die ("db链接失败".mysql_error()); 
mysql_query('SET NAMES UTF8')or die ("字符集设置错误"); 
?> 