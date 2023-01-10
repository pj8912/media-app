<?php

if(isset($_GET['name'])){
	$name = 'audio/'.$_GET['name'];
	unlink($name);
	header('Location: http://localhost/media-app/all_files.php');
	exit();
}

