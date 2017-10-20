<?php

namespace App\Models\v2;
use App\Models\BaseModel;

use App\Helper\Token;
use \DB;
use App\Services\Shopex\Erp;

class Price extends BaseModel
{
    protected $connection = 'shop';

    protected $table      = 'price';

    public    $timestamps = false;

//    protected $primaryKey = 'goods_id';

    protected $guarded = [];

    protected $appends = [

                         ];

//    protected $visible = [
//
//                         ];

	public function index()
	{

    }

	public static function goodsPrice($card_num, $goods_id)
	{
		if(!empty($card_num)){
			$lrtc_id = self::getLrtcId($goods_id);
			$age = PolicyCar::getAgeByCard($card_num);
		}
		$price = self::where(['lrtc_id' => $lrtc_id, 'age' =>$age, 'goods_id' => $goods_id ])->select('price')->first();
		if(empty($price)){
		    return false;
		}
		return $price['price'];
    }

	public static function getLrtcId($goods_id)
	{
		$arr = [
			4  =>'2491',
			35 =>'2492',
			36 =>'2493',
		];
		return $arr[$goods_id];
    }

}
