<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/5/25
 * Time: 16:27
 */
/**
 * @param $arr 投保时长
 * @param $goods_id 商品id
 * @return mixed
 */

function calculatePrice($arr,$goods_id){
	$time = $arr['combo_id'];
	$insurance= $arr['spec_215'];
	$cost = $arr['spec_218'] == '不选择'?0:$arr['spec_218'];
	$arrPrice = [
		'107'=>[

			'3万' => '5',
			'8万' => '11',
			'18万'=> '23',
			'38万'=> '35',
			'58万'=> '50',
			'88万'=> '71',

		],
		'108'=>[

			'3万' => '18',
			'8万' => '38',
			'18万'=> '78',
			'38万'=> '118',
			'58万'=> '168',
			'88万'=> '238',
		]
	];
	$result = $arrPrice[$time][$insurance] + $cost/100*5;
	return $result;


}
//执行函数 返回结果
