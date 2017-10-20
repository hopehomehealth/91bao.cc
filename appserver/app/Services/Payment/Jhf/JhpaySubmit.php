<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/7/20
 * Time: 19:32
 */
namespace App\Services\Payment\Jhf;
class JhpaySubmit {

	private $jhfpayConfig;

	/**
	 * 聚合富网关地址（新）
	 */
	private $jhfpay_gateway_new = 'https://www.jhpay.com/service/payment.jsp?';
	private $jhfpay_gateway_mobile = 'https://www.jhpay.com/mobile/payment.jsp?';
	private $jhfpay_gateway_wechat = 'https://www.jhpay.com/wechat/wechatpay.jsp?';

	public function __construct($jhfpayConfig) {
		$this->jhfpayConfig = $jhfpayConfig;
		if (IS_MOBILE == 1) {
			$this->jhfpay_gateway_new = $this->jhfpay_gateway_wechat;
		}
	}

	/**
	 * 建立请求，以表单HTML形式构造（默认）
	 * @param $para_temp 请求参数数组
	 * @param $method 提交方式。两个值可选：post、get
	 * @param $button_name 确认按钮显示文字
	 * @return 提交表单HTML文本
	 */
	public function buildRequestForm($para_temp, $method, $button_name) {
		if ((IS_MOBILE == 1) && isset($para_temp['policyid'])) {
			unset($para_temp['policyid']);
			unset($para_temp['redirect']);
		}
		//待请求参数数组
		$para = $this->buildRequestPara($para_temp);
		$sHtml = "";
		$sHtml .= "<form id=jhfpaysubmit' name='jhfpaysubmit' action='" . $this->jhfpay_gateway_new . "_inputCharset=" . trim(strtolower($this->jhfpayConfig['inputCharset'])) . "' method='" . $method . "'>";
		while (list ($key, $val) = each($para)) {
			$sHtml.= "<input type='hidden' name='" . $key . "' value='" . $val . "'/>";
			//echo $key.'->'.$val.'</br>';
		}
		//submit按钮控件请不要含有name属性
		$sHtml = $sHtml . '<input type="submit" style="display: none" value="立即支付"/></form>';
		$sHtml = $sHtml."<script>document.forms['jhfpaysubmit'].submit();</script>";
		return $sHtml;
	}

	/**
	 * 建立请求，以表单HTML形式构造（默认）
	 * @param $para_temp 请求参数数组
	 * @param $method 提交方式。两个值可选：post、get
	 * @param $button_name 确认按钮显示文字
	 * @return 提交表单HTML文本
	 */
	public function buildRequestFormsm($para_temp, $method, $button_name) {
		//待请求参数数组
		$para = $this->buildRequestPara($para_temp);
		$sHtml = "";
		$sHtml .= "<form id=jhfpaysubmit' name='jhfpaysubmit' action='" . $this->jhfpay_gateway_mobile . "_inputCharset=" . trim(strtolower($this->jhfpayConfig['inputCharset'])) . "' method='" . $method . "'>";
		while (list ($key, $val) = each($para)) {
			$sHtml.= "<input type='hidden' name='" . $key . "' value='" . $val . "'/>";
			//echo $key.'->'.$val.'</br>';
		}
		//submit按钮控件请不要含有name属性
		$sHtml = $sHtml . '<input type="submit" style="display: none" value="立即支付"/></form>';
		$sHtml = $sHtml."<script>document.forms['jhfpaysubmit'].submit();</script>";
		return $sHtml;
	}

	/**
	 * 生成要请求给聚合富的参数数组
	 * @param $para_temp 请求前的参数数组
	 * @return 要请求的参数数组
	 */
	public function buildRequestPara($para_temp) {
		//除去待签名参数数组中的空值和签名参数
		$para_filter = $this->paraFilterJhf($para_temp);
		//对待签名参数数组排序，聚合富暂不用排序
		//$para_sort = argSort($para_filter);
		$para_sort = $para_filter;
		//生成签名结果
		$mysign = $this->buildRequestMysign($para_sort);

		//签名结果与签名方式加入请求提交参数组中
		//$para_sort['sign'] = $mysign;
		//$para_sort['sign_type'] = strtoupper(trim($this->jhfpayConfig['sign_type']));
		$para_sort['md5'] = strtoupper($mysign);

		return $para_sort;
	}

	/**
	 * 除去数组中的空值和签名参数
	 * @param $para 签名参数组
	 * return 去掉空签名
	 */
	public function paraFilterJhf($para) {
		$para_filter = array();
		while (list ($key, $val) = each($para)) {
			if ($key == "sign" || $key == "sign_type")
				continue;
			else
				$para_filter[$key] = $para[$key];
		}
		return $para_filter;
	}

	/**
	 *
	 * @param string $prestr
	 * @param type $key
	 * @return type
	 */
	public function md5Sign($prestr, $key) {
		$prestr = $prestr . $key;
		return md5($prestr);
	}

	/**
	 * 生成签名结果
	 * @param $para_sort 已排序要签名的数组
	 * return 签名结果字符串
	 */
	public function buildRequestMysign($para_sort) {
		//把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
		$prestr = $this->createLinkstring($para_sort);

		$mysign = "";
		switch (strtoupper(trim($this->jhfpayConfig['sign_type']))) {
			case "MD5" :
				$mysign = $this->md5Sign($prestr, $this->jhfpayConfig['key']);
				break;
			default :
				$mysign = "";
		}

		return $mysign;
	}

	//自定义构造GET提交URL
	public function buildRequestGet($para_temp) {
		$para = $this->buildRequestPara($para_temp);
		$hUrl = $this->jhfpay_gateway_new;
		while (list ($key, $val) = each($para)) {
			// $hUrl .= urlencode('&').$key.'='.$val;
			$hUrl .= '&' . $key . '=' . $val;
		}
		return $hUrl;
	}

	/**
	 * 建立请求，以模拟远程HTTP的POST请求方式构造并获取聚合富的处理结果
	 * @param $para_temp 请求参数数组
	 * @return 支付宝处理结果
	 */
	public function buildRequestHttp($para_temp) {
		$sResult = '';

		//待请求参数数组字符串
		$request_data = $this->buildRequestPara($para_temp);

		//远程获取数据
		$sResult = getHttpResponsePOSTJhf($this->jhfpay_gateway_new, $this->jhfpayConfig['cacert'], $request_data, trim(strtolower($this->jhfpayConfig['inputCharset'])));

		return $sResult;
	}

	/**
	 * 把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
	 * @param $para 需要拼接的数组
	 * return 拼接完成以后的字符串
	 */
	public function createLinkstring($para) {
		$arg = "";
		while (list ($key, $val) = each($para)) {
			$arg.=$key . "=" . $val . "&";
		}
		//去掉最后一个&字符
		$arg = substr($arg, 0, count($arg) - 2);

		//如果存在转义字符，那么去掉转义
		if (get_magic_quotes_gpc()) {
			$arg = stripslashes($arg);
		}

		return $arg;
	}

	/**
	 * 证书验证
	 * @param string $crtfile 证书地址   绝对地址，例如"c:\\juhefu.cer";
	 * @param string $updateData 参数连接字符串
	 * @param string $sign 签名
	 * @return boolean
	 */
	public static function verifySign($crtfile, $updateData, $sign) {
		try {
			$x509 = openssl_x509_read(file_get_contents($crtfile));
			$public_key_id = openssl_get_publickey($x509);
			$success = openssl_verify($updateData, base64_decode($sign), $public_key_id, OPENSSL_ALGO_MD5);
			if ($success) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			return false;
		}
	}

}