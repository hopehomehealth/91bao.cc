<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/5/24
 * Time: 17:02
 */
$id = $_POST['id'];
if(file_exists("./functions/{$id}.php")){
    include "./functions/{$id}.php";
	calculatePrice($_POST);
}else{
	echo  'error request';
}