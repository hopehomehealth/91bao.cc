<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/7/14
 * Time: 19:27
 */

function calculatePrice($arr, $goodsid){
	$attrId = $arr['spec_224'];
	$comboId = $arr['combo_id'];
	$attrArr = [
		'50-55周岁' => '1290',
		'56-60周岁' => '1690',
		'61-65周岁' => '2290',
		'66-70周岁' => '2899',
		'71-75周岁' => '3590',
		'76-80周岁' => '4009',
	];
	$comboArr = [

	];

	return $attrArr[$attrId];
}