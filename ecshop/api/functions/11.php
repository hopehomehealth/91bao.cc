<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/14
 * Time: 13:08
 */
/**
 * @param $arr
 * @param $goodsid
 * @return mixed
 */
function calculatePrice($arr, $goodsid){
	$attrId = $arr['spec_227'];
	$comboId = $arr['combo_id'];
	$attrArr = [
		'1-3天' => '58',
		'4-7天' => '80',
		'8-14天' => '138',
		'15-30天' => '208',
		'31-60天' => '378',
		'61-90天' => '508',
	];
	$comboArr = [

	];

	return $attrArr[$attrId];
}