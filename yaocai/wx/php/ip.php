<?php 
$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
if (strpos($url, "localhost")) {
  $ip = gethostbyname('zhouxiongjun');
  // header("location:http://".$ip."/");
} 

$pageTpl = <<< EOPAGE
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>导航</title>
<meta name="viewport" content="width=device-width initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />
<meta name="format-detection" content="email=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="EaseMobile" />
<link rel="stylesheet" href="/static/css/layout.css" />
<link rel="stylesheet" href="/static/css/pub-nav.css" />
</head>

<body>
<div class="content">
    <h2 class="caption">导航</h2>
    <ul class="nav clearfix">$data
    </ul>
</div>
</body>
</html>
EOPAGE;
echo $pageTpl;
?> 