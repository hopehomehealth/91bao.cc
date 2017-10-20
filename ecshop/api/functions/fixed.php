<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/5/26
 * Time: 16:50
 */

/**
 * @param $goods_id
 * @param $arr
 * @return mixed
 */
function calculatePrice($arr,$goods_id){
	$combo_id = $arr['combo_id'];
	$goods_id = mysql_real_escape_string($goods_id);
	$sql = "select * from 91bao_combo WHERE gid='$goods_id' AND id = '$combo_id'";
	$res = $GLOBALS['db']->getRow($sql);
	return $res['price'];
}

