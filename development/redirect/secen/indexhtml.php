<?php
/**
* 
*/
include_once("../config.php");

//$url = "http://static.duduche.me/".VER_ADM."/secenhtml/index.html";
$url = "http://duduche.me/html/secenhtml/index.html?_r=".time();

if(is_array($_GET)&&count($_GET)>0){
	foreach($_GET as $k=>$v){
		$url .= "&".$k."=".$v;
	}
}

header("Location: ".$url);

?>
