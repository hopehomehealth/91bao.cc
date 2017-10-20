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

class PolicyCar extends BaseModel
{
	protected $connection = 'shop';

	protected $table      = 'user_car_policy';

	protected $primaryKey = 'policy_id';

	public    $timestamps = false;

	protected $appends = ['id', 'sn' ];

	protected $visible = ['id', 'sn', 'order', 'goods','car_brand','engine_number', 'frame_number', 'is_transfer',
		'car_num', 'record_date', 'drive_city', 'is_new', "recognizee_name", 'status', 'total',
	    "recognizee_cardtype",
	    "recognizee_cardnum" ,
	    "recognizee_brithday" ,
	    "recognizee_sex" ,
	    "recognizee_phone" ,
	    "recognizee_age",
	    "recognizee_receiptor",
		];
	// ECM 订单状态
	const STATUS_CREATED    	 = 0; // all
	const STATUS_PAID        	 = 1; // 未付款
	const STATUS_DELIVERING 	 = 2; // 处理中
	const STATUS_DELIVERIED  	 = 3; // 保障中
	const STATUS_FINISHED    	 = 4; // 已完成
	const STATUS_CANCELLED  	 = 5; // 已取消(只有全部里会有取消)
	const STATUS_OVER_PROTECTION = 6; // 已过保

	/* 订单状态 */
	const OS_UNCONFIRMED     = 0; // 未确认
	const OS_CONFIRMED       = 1; // 已确认
	const OS_CANCELED        = 2; // 已取消
	const OS_INVALID         = 3; // 已过保
	const OS_RETURNED        = 4; // 退货
	const OS_SPLITED         = 5; // 已分单
	const OS_SPLITING_PART   = 6; // 部分分单

	/* 支付状态 */
	const PS_UNPAYED         = 0; // 未付款
	const PS_PAYING          = 1; // 付款中
	const PS_PAYED           = 2; // 已付款

	/* 配送状态 */
	const SS_UNSHIPPED       = 0; // 未发货
	const SS_SHIPPED         = 1; // 已发货
	const SS_RECEIVED        = 2; // 已收货
	const SS_PREPARING       = 3; // 备货中
	const SS_SHIPPED_PART    = 4; // 已发货(部分商品)
	const SS_SHIPPED_ING     = 5; // 发货中(处理分单)
	const OS_SHIPPED_PART    = 6; // 已发货(部分商品)


	/**
	 * 生成车保订单
	 * @param array $attributes
	 * @return array
	 */
	 public static function purchase(array $attributes)
	{
		extract($attributes);
		$user_id = Token::authorization();
		$addr_arr = UserAddress::get_consignee('');
		if(empty($addr_arr)){
			$addr_arr['id'] = 28;
		}
		$data = Goods::purchase(['consignee'=> $addr_arr['id'], 'product' => $goods_id, 'amount' => 1 ,'shipping' => 1 ,'is_car' => 1]);
		$order_id = $data['order']->getIdAttribute();
		$model = new PolicyCar();

		$model->order_id = $order_id;
		$model->goods_id = $goods_id;
		$model->user_id = $user_id;
		$model->car_brand = $car_brand;
		$model->engine_number = $engine_number;
		$model->frame_number = $frame_number;
		$model->is_transfer = $is_transfer;
		$model->car_num= $car_num;
		$model->record_date= $record_date;
		$model->is_new = $is_new;
		$model->drive_city = $drive_city;
		$model->recognizee_name = '91保用户';
		$model->recognizee_cardnum = $card_num;
		$model->recognizee_brithday = substr($card_num,6,4).'-'.substr($card_num,10,2).'-'.substr($card_num,12,2);
		$model->recognizee_sex = isset($sex)?$sex:0;
		$model->recognizee_phone = $mobile;
		$model->start_time = strtotime('+1 day');
		$model->end_time = strtotime('+1 year');
		$model->recognizee_age = self::getAgeByCard($card_num);
		$model->insert($model->attributes);
		return self::formatBody([
			'order' => [
				'id' => $order_id
			]
		]);

	}

	/**
	 * @param $cardNum
	 * @return false|string
	 */
	public static function getAgeByCard($cardNum)
	{
		$age = date('Y',time()) - substr($cardNum,6,4);
		return $age;
	}

	public static function getSex($cardNum)
	{
		if(strlen($cardNum) == 15){
		    
		}
	}

	public static function getInfo(array $attributes)
	{
		$user_id = Token::authorization();
		$id = $attributes['id'];
		$model = self::where(['order_id' => $id ,'user_id' => $user_id]);
		$data = $model->get();
//		return $data;
		$total_price  = Order::where(['order_id' => $data[0]['order_id']])->first();
		$total_price = $total_price['total'];
		$data[0]['total'] = $total_price ;
		$goodsImg = \DB::table('order_goods')->leftJoin('goods' ,'order_goods.goods_id','=','goods.goods_id')
			->where(['order_id' => $id])
			->select('goods_img', 'goods_thumb','goods.goods_name')
			->first();
		$goodsImg->goods_img = formatPhoto($goodsImg->goods_img, $goodsImg->goods_thumb);
		unset($goodsImg->goods_thumb);
//		$goods['goods_thumb'] = formatPhoto($goodsImg['goods_thumb']);
		$data[0]['goods'] = $goodsImg;
		return self::formatBody(['policyInfo' => $data]);
	}

	public function getIdAttribute()
	{
		return $this->attributes['order_id'];
	}

//	public function getStatusAttribute()
//	{
//		return $this->attributes['status'];
//	}

	public function getSnAttribute()
	{
		$data = Order::where(['order_id' => $this->attributes['order_id']])->first();
		$this->attributes['status'] = $data->status;
		return $data->order_sn;
	}

	public static function getList(array $attributes)
	{
		extract($attributes);

		$uid = Token::authorization();
		$model = Order::where([ 'user_id' => $uid, 'is_car' =>'1' ]);
		if (isset($status)) {
			switch ($status) {

				case self::STATUS_CREATED:
					$model->whereIn('pay_status', [self::PS_UNPAYED, self::PS_PAYING]);
					$model->whereNotIn('order_status', [self::OS_CANCELED, self::OS_INVALID, self::OS_RETURNED]);
					break;
				//待支付
				case 1:
					$model->whereIn('order_status', [self::OS_CONFIRMED]);
					$model->whereIn('pay_status', [self::PS_UNPAYED, self::PS_PAYING]);
//					$model->whereIn('shipping_status', [self::SS_RECEIVED ]);
					break;
				//处理中
				case 2:
					$model->whereIn('pay_status', [self::PS_UNPAYED]);
					$model->whereIn('order_status', [self::OS_UNCONFIRMED]);
					break;

				//保障中
				case 3:
					$model->whereIn('shipping_status', [self::SS_RECEIVED])
					->where('order_status', [self::OS_CONFIRMED])
					->where('pay_status', [self::PS_PAYED]);
					break;
				//已完成
				case 6:
					$model->whereIn('shipping_status', [self::SS_RECEIVED])
						  ->whereIn('order_status', [self::OS_INVALID])
					      ->where('pay_status', [self::PS_PAYED]);
					break;
			}
		}

		$total = $model->count();

		$data = $model
			->with('goods')
			->orderBy('add_time', 'DESC')
			->paginate($per_page)->toArray();

		return self::formatBody(['carorders' => $data['data'],'paged' => self::formatPaged($page, $per_page, $total)]);
	}

	public function order(){
	    return $this->hasOne('App\Models\v2\Order', 'order_id','order_id');
	}

	public function goods(){
		$model = new Order();
	    return $model->hasOne('App\Models\v2\OrderGoods', 'order_id','order_id');
	}

	public static function subtotal()
	{
		$uid = Token::authorization();
		$ids = OrderReview::where('user_id', $uid)->groupBy('order_id')->pluck('order_id')->toArray();
		$model = Order::where([ ['user_id', '=', $uid],	['order_amount', '=', '0'] ]);

		$data = [
			'created' => Order::where([	['user_id', '=', $uid],	['order_amount', '=', '0'] ])->whereIn('pay_status', [self::PS_UNPAYED, self::PS_PAYING])->whereNotIn('order_status', [self::OS_CANCELED, self::OS_INVALID, self::OS_RETURNED])->count(),
			'paid' => Order::where([['user_id', '=', $uid],	['order_amount', '=', '0'] ])->whereIn('pay_status', [self::PS_PAYED])->whereIn('shipping_status', [self::SS_UNSHIPPED, self::SS_PREPARING, self::SS_SHIPPED_ING])->count(),
			'delivering' => Order::where([['user_id', '=', $uid],	['order_amount', '=', '0'] ])->whereIn('shipping_status', [self::SS_SHIPPED, self::SS_SHIPPED_PART, self::OS_SHIPPED_PART])->count(),
			'deliveried' => $model->whereIn('shipping_status', [self::SS_RECEIVED])->whereNotIn('order_id', $ids)->count(),
			'finished' => $model->whereIn('shipping_status', [self::SS_RECEIVED])->whereIn('order_id', $ids)->count(),
			'cancelled' => Order::where([['user_id', '=', $uid],	['order_amount', '=', '0'] ])->whereIn('order_status', [self::OS_CANCELED, self::OS_INVALID, self::OS_RETURNED])->count(),
		];

		return self::formatBody(['subtotal' => $data]);
	}


}