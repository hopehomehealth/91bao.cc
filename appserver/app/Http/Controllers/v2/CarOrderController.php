<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/9
 * Time: 10:17
 */

namespace App\Http\Controllers\v2;


use App\Http\Controllers\Controller;
use App\Models\v2\Order;
use App\Models\v2\PolicyCar;
use Illuminate\Http\Request;

class CarOrderController extends Controller
{

	public function index(){

	}

	public function getList()
	{

		$rules = [
			'page'            => 'required|integer|min:1',
			'per_page'        => 'required|integer|min:1',
			'status'          => 'integer|min:0',
		];

		if ($error = $this->validateInput($rules)) {
			return $error;
		}

		$response = PolicyCar::getList($this->validated);
		return $this->json($response);
	}

	public function getInfo()
	{
		$rules = [
			"id"    =>  "integer|min:1"
		];
		if ($error = $this->validateInput($rules)) {
			return $error;
		}
		$response = PolicyCar::getInfo($this->validated);
		return $this->json($response);
	}

	public function subtotal()
	{
		return $this->json(PolicyCar::subtotal());
	}
}