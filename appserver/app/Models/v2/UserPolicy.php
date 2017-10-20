<?php
/**
 * Created by PhpStorm.
 * User: Meng
 * Date: 2017/6/30
 * Time: 23:11
 */

namespace App\Models\v2;


use App\Models\BaseModel;
use App\Helper\Token;

class UserPolicy extends BaseModel
{
	protected $connection = 'shop';

	protected $table      = 'user_policy';

	protected $primaryKey = 'policy_id';

	public    $timestamps = false;


	/***
	 * @param $orderid
	 * @param $goods_id
	 * @param $policyHolderAddId
	 *
	 * @param $endTime
	 */
	public static function insertPolicy($orderid, $goods_id, $policyHolderAddId,  $endTime, $relation)
	{
		$uid = Token::authorization();
		$recognizee   = UserAddress::get_consignee($policyHolderAddId);
		if($relation === 0){
			$policyHolder =	$recognizee;
		}else{
			$policyHolder = UserAddress::get_consignee('');
		}
		$array = [
			'order_id' 				 => $orderid,
			'goods_id' 				 => $goods_id,
			'user_id'				 => $uid,
			'recognizee_name'  		 => $recognizee['name'],
			'recognizee_cardtype' 	 => $recognizee['card_type'],
			'recognizee_cardnum'	 => $recognizee['card_num'],
			'recognizee_birth'		 => $recognizee['birthdate'],
			'recognizee_sex' 		 => $recognizee['sex'] == 0?'女':'男',
			'recognizee_phone' 		 => $recognizee['mobile'],
			'recognizee_age'		 => PolicyCar::getAgeByCard($recognizee['card_num']),
			'start_time'             => strtotime('+1 days'),
			'end_time' 				 => $endTime,
			'recognizee_relation' 	 => empty($relation)?'本人':'监护人',
			'recognizee_receiptor'   => '法定',
			'policy_name' 			 => $policyHolder['name'],
			'policy_cardtype'		 => $policyHolder['card_type'],
			'policy_cardnum' 		 => $policyHolder['card_num'],
			'policy_birth' 			 => $policyHolder['birthdate'],
			'policy_sex' 			 => $policyHolder['sex'] == 0?'女':'男',
			'policy_phone' 			 => $policyHolder['mobile'],
		];
		UserPolicy::insertGetId($array);

	}
}