<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/1
 * Time: 13:55
 */

namespace App\Models\v2;
use App\Models\BaseModel;
use Illuminate\Contracts\Bus\SelfHandling;

class Combo extends BaseModel {

	protected $connection = 'shop';
	protected $table      = 'combo';
	public $timestamps = 'false';

	public static function getComboByGoods($goods_id)
	{
		$model = self::where(['gid'=>$goods_id, 'is_show' => 1])->orderBy('sort_order', 'ASC');

		$data = $model->get();

		return $data;
	}

	public static function getGoodIdByCombId($combo_id)
	{
		$model = self::where(['combo_id' => $combo_id])->select('gid')->first();

		return $model;
	}

}


