<?php 
namespace App\Services\Shopex;
use Log;
use Cache;
use App\Models\v2\ShopConfig;
include __DIR__.'/../../../vendor/aliyun-php-sdk-core/Config.php';
include_once __DIR__.'/../../../vendor/Dysmsapi/Request/V20170525/SendSmsRequest.php';
include_once __DIR__.'/../../../vendor/Dysmsapi/Request/V20170525/QuerySendDetailsRequest.php';


class Sms
{

	public static function requestSmsCode($mobile, $template = null) {

//		if(empty($_SERVER['HTTP_REFERER']) || $_SERVER['HTTP_REFERER'] != env('SHOP_H5')){
//		    return false;
//		}

		//此处需要替换成自己的AK信息
		$accessKeyId = env('ALISMS_KEY');
		$accessKeySecret = env('ALISMS_SECRETKEY');
		//短信API产品名
		$product = "Dysmsapi";
		//短信API产品域名
		$domain = "dysmsapi.aliyuncs.com";
		//暂时不支持多Region
		$region = env('REGION','cn-shanghai');
		//短信签名
		$signName = env('SMS_SIGN_NAME','91保');
		if(null == $template){
		    $template = 'SMS_76550005';
		}

		//初始化访问的acsCleint
		$profile = \DefaultProfile::getProfile($region, $accessKeyId, $accessKeySecret);
		\DefaultProfile::addEndpoint($region, $region, $product, $domain);
		$acsClient= new \DefaultAcsClient($profile);

		$request = new \Dysmsapi\Request\V20170525\SendSmsRequest;
		//必填-短信接收号码
		$request->setPhoneNumbers($mobile);
		//必填-短信签名
		$request->setSignName($signName);
		//必填-短信模板Code
		$request->setTemplateCode($template);
		//选填-假如模板中存在变量需要替换则为必填(JSON格式)
		$code = self::generate_verify_code(6);
		$request->setTemplateParam("{\"vcode\":\"$code\",\"timeout\":\"30\"}");
		//选填-发送短信流水号
		$request->setOutId($code);

		//发起访问请求
		$acsResponse = $acsClient->getAcsResponse($request);
		if ($acsResponse->Code == 'OK') {
			Cache::put('smscode:'.$mobile, $code, 30);
			return true;
		}else{
			$response = get_object_vars($acsResponse);
			Log::error('验证码发送失败', array_merge($response, ['mobile' => $mobile, 'code' => $code]));
//			return false;
		}
	}

	public static function querySendDetails() {

		//此处需要替换成自己的AK信息
		$accessKeyId = "yourAccessKeyId";
		$accessKeySecret = "yourAccessKeySecret";
		//短信API产品名
		$product = "Dysmsapi";
		//短信API产品域名
		$domain = "dysmsapi.aliyuncs.com";
		//暂时不支持多Region
		$region = "cn-hangzhou";

		//初始化访问的acsCleint
		$profile = DefaultProfile::getProfile($region, $accessKeyId, $accessKeySecret);
		DefaultProfile::addEndpoint("cn-hangzhou", "cn-hangzhou", $product, $domain);
		$acsClient= new DefaultAcsClient($profile);

		$request = new Dysmsapi\Request\V20170525\QuerySendDetailsRequest();
		//必填-短信接收号码
		$request->setPhoneNumber("15000000000");
		//选填-短信发送流水号
		$request->setBizId("abcdefgh");
		//必填-短信发送日期，支持近30天记录查询，格式yyyyMMdd
		$request->setSendDate("20170525");
		//必填-分页大小
		$request->setPageSize(10);
		//必填-当前页码
		$request->setContent(1);

		//发起访问请求
		$acsResponse = $acsClient->getAcsResponse($request);
		var_dump($acsResponse);

	}



    public static function verifySmsCode($mobile, $code)
    {
        if (Cache::get('smscode:'.$mobile) == $code) {
            Cache::forget('smscode:'.$mobile);
            return true;
        }

        return false;
    }

    //验证方法
    public static function get_ac($params,$token){
        ksort($params);
        $tmp_verfy='';
        foreach($params as $key=>$value){
            $params[$key]=stripslashes($value);
            $tmp_verfy.=$params[$key];
        }
        return strtolower(md5(trim($tmp_verfy.$token)));
    }

    public static function generate_verify_code($num = 4) {
        if(!$num) {
            return false;
        }
        
        $num = intval($num);

        $pool = '0123456789';
        $shuffled = str_shuffle($pool);

        $code = substr($shuffled, 0, $num);

        return $code;
    }

}