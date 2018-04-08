<?php 
header("Content-Type: text/html; charset=UTF-8");
//第一步：链接数据库 
$conn = @mysql_connect("localhost","root","ycg20160401") or die ("mysql链接失败"); 
//第二步: 选择指定的数据库，设置字符集 
@mysql_select_db("yaocai", $conn) or die ("db链接失败".mysql_error()); 
mysql_query('SET NAMES UTF8')or die ("字符集设置错误"); 
?> 