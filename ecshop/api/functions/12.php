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
		'1-3天' => '88',
		'4-7天' => '118',
		'8-14天' => '188',
		'15-30天' => '268',
		'31-60天' => '588',
		'61-90天' => '828',
	];
	$comboArr = [

	];

	return $attrArr[$attrId];
}