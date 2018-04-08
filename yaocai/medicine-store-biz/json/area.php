<?php
$area = array(array("id" => 110000, 'areaname' => "北京"), array("id" => 120000, 'areaname' => "天津"));
$data = array("status" => 200, "msg" => "", "data" => $area);
echo json_encode($data);
?>	
