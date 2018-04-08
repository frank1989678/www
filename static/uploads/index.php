<?php
$data = '';
$new  = '';
$last = 7 * 24 * 60 * 60; // 7天以内
$hostdir = dirname(__FILE__);
$filesnames = scandir($hostdir.'/');
foreach ($filesnames as $name) {
	if($name !== '.' && $name !== '..' && $name !== 'index.php' && $name !== '2014-12-02'){
		if (filemtime($name)) {
			$date = filemtime($name);
			if ($date - time() + $last > 0) {
				$new = ' class="new"';
			} else {
				$new = '';
			}
		}
		$data .= "\n\t\t<li". $new ."><img src=\"" . $name . "\"><i></i><em>" . $name . "</em></li>";
	}
}
$pageTpl = <<< EOPAGE
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>图片</title>
<meta name="viewport" content="width=device-width initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />
<meta name="format-detection" content="email=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="EaseMobile" />
<link rel="stylesheet" href="/static/css/layout.css" />
<link rel="stylesheet" href="/static/css/pub-static.css" />
</head>

<body>
<div class="content">
	<h2 class="caption">图片</h2>
	<ul class="nav clearfix">$data
	</ul>
</div>
</body>
</html>
EOPAGE;
echo $pageTpl;
?>