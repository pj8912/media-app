<?php
$folder = "/media-app/";
$destinationFolder = $_SERVER['DOCUMENT_ROOT'].$folder;
$maxFileSize = 2 * 1024 * 1024;

$postdata = file_get_contents("php://input");
if(!isset($postdata) || empty($postdata))
	exit(json_encode(["success" => false , "reason"=>"Not a post data"]));

$request = json_decode($postdata);
if(trim($request->data) === "")
	exit(json_encode(["success"=>false, "reason"=>"Not a post data"]));

$file = $request->data;
$size = getimagesize($file);
$ext = $size['mime'];
if($ext == 'image/jpeg')
	$ext = '.jpg';
elseif($ext == 'image/png')
	$ext = '.png';
else
	exit(json_encode(['success'=>false, 'reason'=>'only png and jpg mime types are allowed']));

if(strlen(base64_decode($file)) > $maxFileSize )
	exit(json_encode(['success' => false, 'reason'=>"file size exceeds max size: {$maxFileSize} Mb"]));

//remove inline tags and spaces
$img = str_replace('data:image/png;base64,', '', $file);
$img = str_replace('data:image/jpeg;nase64,', '', $img);
$img = str_replace(' ', '+', $img);

$img = base64_decode($img);

$filename = date("d_m_Y_H_i_s")."-".time().$ext;
//path
$destinationPath= "$destinationFolde$filename";
$success = file_put_contents($destinationPath, $img);
if(!$success)
	exit(json_encode(['success'=>false, 'reason'=>'server failed in creating the image']));

exit(json_encode(['success'=>true , 'path' => "$folder$filename"]));

