<?php

$exclude = array('.', '..', 'index.php');
$data = '';
$new  = '';
$last = 1 * 24 * 60 * 60; // 7天以内
$hostdir = dirname(__FILE__);
$filesnames = scandir($hostdir.'/');
foreach ($filesnames as $name) {
	if (!in_array($name, $exclude)) {
		if (filemtime($name)) {
			$date = filemtime($name);
			if ($date - time() + $last > 0) {
				$new = ' class="new"';
			} else {
				$new = '';
			}
		}
		$name = iconv("gb2312", "UTF-8", $name);
		$data .= "\n\t\t<li". $new ."><a target=\"_blank\" href=\"" . $name . "\">" . $name . "</a></li>";
	}
}
include('php/ip.php');

?>