<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/7
 * Time: 17:52
 */

namespace App\Models\v2;


use App\Helper\Token;
use App\Http\Controllers\Controller;
use App\Models\BaseModel;
use App\Services\Shopex\Sms;

class RoeweCarCoupon extends BaseModel
{
	protected $connection = 'rw';

	protected $table      = 'deduction_voucher';

	protected $primaryKey = 'id';

	public    $timestamps = false;

	protected $visible = ['id'];

	public static function verifyDeductionCode($mobile,$code)
	{
		$result = self::where(['mobile' => $mobile, 'coupon_code' => $code])->get()->toArray();
		if($result){
			return true;
		}else{
			return false;
		}
	}


}