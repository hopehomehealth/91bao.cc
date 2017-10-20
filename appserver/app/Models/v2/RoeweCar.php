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

class RoeweCar extends BaseModel
{
	protected $connection = 'rw';

	protected $table      = 'user_car_policy';

	protected $primaryKey = 'policy_id';

	public    $timestamps = false;

	protected $appends = ['id'];

	protected $visible = ['id'];

	/**
	 * 生成车保订单
	 * @param array $attributes
	 * @return array
	 */
	 public static function purchase(array $attributes)
	{
		extract($attributes);
		if(!RoeweCarCoupon::verifyDeductionCode($mobile, $deduction_voucher)){
			return self::formatError('414', '抵扣券不正确');
		}
		if (!Sms::verifySmsCode($mobile, $code)) {
			return self::formatError(self::BAD_REQUEST, trans('message.member.mobile.code.error'));
		}


		$time = time();
		$model = new RoeweCar();
		$model->order_id = $time;
		$model->goods_id = $time;
		$model->user_id = $time;
		$model->car_brand = $car_brand;
		$model->engine_number = $engine_number;
		$model->frame_number = $frame_number;
		$model->is_transfer = $is_transfer;
		$model->car_num= $car_num;
		$model->record_date= $record_date;
		$model->is_new = $is_new;
		$model->drive_city = $drive_city;
		$model->recognizee_name = $name;
		$model->recognizee_cardnum = $card_num;
		$model->recognizee_brithday = substr($card_num,6,4).'-'.substr($card_num,10,2).'-'.substr($card_num,12,2);
		$model->recognizee_sex = isset($sex)?$sex:0;
		$model->recognizee_phone = $mobile;
		$model->recognizee_age = self::getAgeByCard($card_num);
		$result = $model->insertGetId($model->attributes);
		if($result){
		    Member::createMemberByMobileRoewe($mobile);
		}
		return self::formatBody([
			'order' => [
				'id' => $result
			]
		]);

	}

	public function getIdAttribute()
	{
		return $this->attributes['policy_id'];
	}
	/**
	 * @param $cardNum
	 * @return false|string
	 */
	public static function getAgeByCard($cardNum)
	{
		$age = date('Y',time()) - substr($cardNum,6,4) + 1;
		return $age;
	}

	public static function getSex($cardNum)
	{
		if(strlen($cardNum) == 15){
		    
		}
	}

}