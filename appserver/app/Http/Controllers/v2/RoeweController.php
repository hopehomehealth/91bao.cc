<?php
//
namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Models\v2\RoeweCar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RoeweController extends Controller
{


	public function purchaseCar()
	{
		$rules = [
			'code'                      =>'required|string|digits:6',
			'deduction_voucher'			=>'required',                     //尊享抵扣券
			'car_brand'	                =>'required|string|min:2|max:16', //车辆品牌
			'engine_number'             =>'required|string|min:8',        //发动机号
			'frame_number'             =>'required|string|min:10',        //车架号
			'is_transfer'               =>'boolean',                      //上一年是否移权转移
			'car_num'					=>[
				'required_if:is_new,0',
				'regex:/^([\x{4e00}-\x{9fa5}])[A-Z]\s*[A-Z_0-9]{5}$/u',
			],                                                            //车牌号
			'record_date'				=>'required|date_format:Y-m-d',
			'drive_city'				=>[
				'required','regex:/([\x{4e00}-\x{9fa5}]){2,12}/u'
			],                                                            //行驶城市
			'is_new'			    	=>'boolean',
			'name'			=>[
				'required','string','min:2','max:12'
			],                                                            //姓名
			'card_num'		=>[
				'required',
				'regex:/^([1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2})$/'
			],                                                           //身份证号
			'card_type'		=>'integer|min:1',
			'mobile'			=>[
				'required',
				'numeric',
				'regex:/^1[345678]\d{9}$/'
			],                                                          //手机号

		];

		if ($error = $this->validateInput($rules)) {
			return $error;
		}

		$response = RoeweCar::purchase($this->validated);

		return $this->json($response);
    }

}
