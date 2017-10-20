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
		'1-3天' => '18',
		'4-7天' => '30',
		'8-14天' => '45',
		'15-30天' => '60',
	];
	$comboArr = [

	];

	return $attrArr[$attrId];
}