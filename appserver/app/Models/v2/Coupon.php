<?php

namespace App\Models\v2;

use App\Models\BaseModel;
use App\Helper\Token;
use Illuminate\Support\Facades\DB;

class Coupon extends BaseModel {

	protected $connection = 'shop';
	protected $table = 'coupon';
	protected $primaryKey = 'coupon_id';
	public $timestamps = false;

	public function index()
	{

	}

	public static function validate($card_num)
	{
		$uid = Token::authorization();
		$telephone = Member::user_info($uid)->username;
		$model = self::where(['card_num' => $card_num, 'telephone' => $telephone, 'status' => 0 ]);
		$result = $model->first();
		if(!$result){
			return self::formatError(400,'优惠券不存在或已失效!');
		}
		$result->status = 1;
		if($result->save()){
			Member::logAccountChange($uid,$result->money,0,0,0,'用户代金券充值',Member::ACT_SAVING);
		 	return self::formatBody(['message'=>'优惠券充值成功!']);
		}else{
		 	return self::formatError(self::UNKNOWN_ERROR);
		}

	}

}
