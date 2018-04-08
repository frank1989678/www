<?php
$img_file = file_get_contents("close.png");
echo base64_encode($img_file);
?>