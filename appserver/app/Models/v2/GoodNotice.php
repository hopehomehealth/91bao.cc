<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/5
 * Time: 18:39
 */

namespace App\Models\v2;


use App\Models\BaseModel;

class GoodNotice extends BaseModel {

	protected $connection = 'shop';
	protected $table      = 'goods_jkgz';
	public    $timestamps = false;

//	protected $appends = ['jkgz_id','jkgz_key','jkgz_value'];

//	protected $visible = ['jkgz_id','jkgz_key','jkgz_value'];

	protected $primaryKey = 'jkgz_id';

	public function getJkgzIdAttribute(){

		return $this->attributes['jkgz_id'];

	}

}