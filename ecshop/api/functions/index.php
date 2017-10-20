<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/5/26
 * Time: 20:41
 */
if(file_exists(__DIR__."/{$goods_id}.php")){
	include __DIR__."/{$goods_id}.php";
}else{
	include __DIR__."/fixed.php";
}