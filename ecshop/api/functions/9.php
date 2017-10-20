<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/13
 * Time: 9:37
 */
function calculatePrice($arr, $goodsid){
	$attrId = $arr['spec_224'];
	$comboId = $arr['combo_id'];
	$attrArr = [
		'18-25周岁' => '460',
		'26-30周岁' => '745',
		'31-35周岁' => '1030',
		'36-40周岁' => '1770',
		'41-45周岁' => '3055',
		'46-50周岁' => '5345',
	];
	$comboArr = [

	];

	return $attrArr[$attrId];
}