<?php
/*
*	!!! THIS IS JUST AN EXAMPLE !!!, PLEASE USE ImageMagick or some other quality image processing libraries
*/

// sleep(1);
header("Content-Type: text/html; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, AuthorizationToken, Authorization");
header('Access-Control-Allow-Methods: GET, POST, PUT,DELETE');

$allowedExts = array("gif", "jpeg", "jpg", "png"); //上传文件类型列表
$max_file_size = 1024*1024; //上传文件大小限制, 单位BYTE
$imagePath = "temp/";

$file = $_FILES;

foreach ($file as $key => $value) {  
    $fileName = $value;
    $key = $key;
}

$temp = explode(".", $fileName["name"]);

$extension = strtolower(end($temp));

if (!file_exists($imagePath)) {
    mkdir($imagePath);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$filename = $fileName["tmp_name"];
    $imgage = $imagePath . "temp_" . md5(uniqid()) . "." . $extension;

    if (move_uploaded_file ($filename, $imgage)) {
    	$image_size = getimagesize($imgage);
		$response = array(
	    	"status" => 'success' 
	    	,"title" => '上传成功' 
			,"message" => '图片已上传成功'
	    	,"url" => $imgage
	    	,"width" => $image_size[0] 
	    	,"height" => $image_size[1]
	    	,"key" => $key
    	);
    } else {
    	$response = array(
	        "status" => 'error', 
			"title" => 'PHP限制图片太大', 
			"message" => '请上传小于2M的图片'
		);
    }
} else {
	$response = array(
    	"status" => 'error', 
    	"title" => '上传失败', 
		"message" => '只能POST提交'
    );
}

print json_encode($response);

