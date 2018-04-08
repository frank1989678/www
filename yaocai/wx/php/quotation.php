<?php
include("conn.php");//引入链接数据库
$q 				= 	"SELECT * from quotation where status = 1 order by id desc limit 0,10";
$rs 			= 	mysql_query($q, $conn);
$his = array();
while($row = mysql_fetch_row($rs, MYSQL_ASSOC)){
	$his[] = array(
		'id' => $row['id'],
		'title' => $row['title'],
		'date' => $row['create_time']
	);
}


if (isset($_REQUEST['iid']) && $_REQUEST['iid'] != '') {
	$q2 	= "SELECT * FROM quotation where status = 1 and id = ".$_REQUEST['iid'];
} else {
	$q2 	= "SELECT * FROM quotation where status = 1 order by id desc LIMIT 1";
}

$rs2 	= mysql_query($q2 , $conn);
$info 	= mysql_fetch_row($rs2, MYSQL_ASSOC);

if (empty($info)) {
	$data = array('empty' => true);
} else {
	$desc = $info['description'];
	$desc = strip_tags($desc, '<p>');
	$desc = str_replace(PHP_EOL, '', $desc); 
	$desc = str_replace('</p>', '', $desc);
	$desc = explode('<p>', $desc);

	$quote = $info['content'];

	$data = array(
		'iid' 	=> $info['id'],
		'title' => $info['title'],
		'desc' 	=> $desc,
		'quote' => $info['content'],
		'his' 	=> $his
	);
}
mysql_close(); 
echo json_encode($data);

?>	
