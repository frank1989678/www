<?php 
	//$_POST["param"] 获取文本框的值;
	//$_POST["name"]  获取文本框的name属性值，通过该值来判断是哪个文本框请求处理，这样当有多个实时验证请求时可以指定同一个文件处理;
	sleep(1);//效果演示，该句可移除;
	//echo "y" //验证通过输出小写字母"y"，出错则输出相应错误信息;
	$username = $_GET["username"];

	echo json_encode(array('status' => 'y', 'info' => $username)); 
?>