<?php
header("Access-Control-Allow-Origin:*");  // 允许跨域
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$username = isset($_POST['username']) ? $_POST['username'] : "admin";
$password = isset($_POST['password']) ? $_POST['password'] : "123456";


$arr1 = array(
    "status" => 200,
    "msg"    => "登录成功!",
    "data"   => array(
        "id"         => 1,  //用户ID
        "name"       => "管理员",
        "username"   => "admin",
        "password"   => null,
        "salt"       => null,
        "status"     => 1,
        "createTime" => 1524044149000,
        "updateTime" => 1524044151000
    )
);

$arr2 = array(
    "status" => 500,
    "msg"    => "用户名或密码错误",
    "data"   => array(
        "username"   => $username,
        "password"   => $password
    )
);

if ($username === 'admin' && $password === '123456') {
	echo json_encode($arr1);
} else {
	echo json_encode($arr2);
}

exit;
?>	