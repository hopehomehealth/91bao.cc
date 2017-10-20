<?php
include __DIR__.'/aliyun-php-sdk-core/Config.php';
include_once __DIR__.'/Dysmsapi/Request/V20170525/SendSmsRequest.php';
include_once __DIR__.'/Dysmsapi/Request/V20170525/QuerySendDetailsRequest.php';

function sendSms($mobile, $smsType = null) {


	if(!preg_match('/^1[34578]\d{9}$/',$mobile)){
		return ['Code' => 'false', 'Message' => '手机号格式不正确!'];
	}
    //此处需要替换成自己的AK信息
    $accessKeyId = ALISMS_KEY;
    $accessKeySecret = ALISMS_SECRETKEY;
    //短信API产品名
    $product = "Dysmsapi";
    //短信API产品域名
    $domain = "dysmsapi.aliyuncs.com";
    //暂时不支持多Region
    $region = REGION;
    
    //初始化访问的acsCleint
    $profile = DefaultProfile::getProfile($region, $accessKeyId, $accessKeySecret);
    DefaultProfile::addEndpoint(REGION, REGION, $product, $domain);
    $acsClient= new DefaultAcsClient($profile);
    
    $request = new Dysmsapi\Request\V20170525\SendSmsRequest;
    //必填-短信接收号码
    $request->setPhoneNumbers($mobile);
    //必填-短信签名
    $request->setSignName(SMS_SIGN_NAME);
    //必填-短信模板Code
    $request->setTemplateCode(SMS_TEMPLATE);
    //选填-假如模板中存在变量需要替换则为必填(JSON格式)
	$code = generate_verify_code(6);
    $request->setTemplateParam("{\"vcode\":\"$code\",\"timeout\":\"30\"}");
    //选填-发送短信流水号
    $request->setOutId(time());
    
    //发起访问请求
    $acsResponse = $acsClient->getAcsResponse($request);
    if($acsResponse->Code == 'OK'){
        $_SESSION['sms_code'][$mobile] = $code;
        $_SESSION['sms_code']['time'] = time() + ACTIVE_TIME;
    }elseif ($acsResponse->Message == '触发业务级流控限制'){
		$acsResponse->Message = '短信发送频繁请稍后再试!';
	}
    unset($acsResponse->BizId);
    unset($acsResponse->RequestId);
	return $acsResponse;
}

function querySendDetails() {
    
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

function verifySmsCode($mobile, $code)
{
	if ($_SESSION['sms_code'][$mobile] == $code && $_SESSION['sms_code']['time'] > time()) {
		$_SESSION['sms_code'] = '';
		return true;
	}

	return false;
}

function generate_verify_code($num = 4) {
	if(!$num) {
		return false;
	}

	$num = intval($num);

	$pool = '0123456789';
	$shuffled = str_shuffle($pool);

	$code = substr($shuffled, 0, $num);

	return $code;
}
