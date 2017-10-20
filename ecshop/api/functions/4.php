<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/5/26
 * Time: 15:45
 */

/**
 * @param $array
 * @param $goods_id
 * @return mixed
 */
function calculatePrice($array, $goods_id){
	$combo_id =$array['combo_id'];
//	$goods_id =$array['id'];
	$age = birthday($array['birthday']);
	$arr =[
		'92'=>'2491',
		'93'=>'2492',
		'94'=>'2493',
	];
	$sql = "select price from 91bao_price WHERE  lrtc_id ='$arr[$combo_id]' AND age = '$age'";
	$res = $GLOBALS['db']->getRow($sql);
	return $res['price'];
}


