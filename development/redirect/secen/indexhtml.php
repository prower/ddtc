<?php
/**
* 
*/
include_once("../config.php");

//$url = "http://static.duduche.me/".VER_ADM."/secenhtml/index.html";
$url = "http://duduche.me/html/secenhtml/index.html";

if(is_array($_GET)&&count($_GET)>0){
	$appendix = null;
	foreach($_GET as $k=>$v){
		if($appendix == null){
			$appendix = $k."=".$v;
		}else{
			$appendix .= "&".$k."=".$v;
		}
	}
	$url .= "?".$appendix;
}

header("Location: ".$url);

?>
