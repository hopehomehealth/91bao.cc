<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/7/20
 * Time: 19:31
 */

class Jhpay {

	public $jhpayMerid; //商户ID
	public $jhpayMd5; //尽量不要明文赋值
	//以下字段参考接口文档
	public $jhpayVersion = '1.0';
	public $jhpayMername = '云购商城'; //商户名称
	public $jhpayPolicyid = '000006';
	public $jhpayMerorderid = ''; //订单号
	public $jhpayPaymoney = 0; //金额
	public $jhpayProductname = '商城商品支付'; //商品名称，尽量不要用云购，1元云购等
	public $jhpayProductdesc = '商城商品支付'; //商品描述
	public $jhpayUserid = '';
	public $jhpayUsername = '';
	public $jhpayEmail = '';
	public $jhpayPhone = '';
	public $jhpayExtra = ''; //添加自定义内容
	public $jhpayCustom = '';
	public $jhpayRedirect = '2';
	public $jhpayRedirecturl = ''; //回调地址
	public $jhpayCrtfile = ''; //证书

	/**
	 * 构造函数
	 */

	public function __construct($config) {

		//商户编号
		$this->jhpayMerid = $config['app_id'];
		//md5 key
		$this->jhpayMd5 = $config['app_key'];
		$this->jhpayRedirecturl = $config['return_url']; //回调地址
		global $lowxp;
		$this->jhpayMername = $config['app_mername'];
	}

	/**
	 * 生成支付代码
	 * @param type $order 订单信息
	 * @param type $payment 支付方式信息
	 * @return type
	 */
	public function get_code($order, $payment) {
		//记录支付订单号
		$log_id = insert_order_sn($order['order_id'], $order['order_amount']);
		$order_no = $order['order_sn'] . $log_id;
		$this->jhpayMerorderid = $order_no; //订单号
		$this->jhpayExtra = $order['order_sn'];
		$this->jhpayPaymoney = $order['order_amount'] * 1; //金额
		$this->jhpayUserid = $order['user_id'];
//		$this->jhpayUsername = $order['username'];

		//构造要请求的参数数组，无需改动
		$parameter = array(
			"version" => $this->jhpayVersion,
			"merid" => $this->jhpayMerid,
			"mername" => $this->jhpayMername,
			"policyid" => $this->jhpayPolicyid,
			"merorderid" => $this->jhpayMerorderid,
			"paymoney" => $this->jhpayPaymoney,
			"productname" => $this->jhpayProductname,
			"productdesc" => $this->jhpayProductdesc,
			"userid" => $this->jhpayUserid,
			"username" => base64_encode($this->jhpayUsername),
			"email" => $this->jhpayEmail,
			"phone" => $this->jhpayPhone,
			"extra" => $this->jhpayExtra,
			"custom" => $this->jhpayCustom,
			"redirect" => $this->jhpayRedirect,
			"redirecturl" => $this->jhpayRedirecturl
		);

		$jhpayConfig = array(
			"partner" => $this->jhpayMerid,
			"key" => $this->jhpayMd5,
			"sign_type" => 'MD5', //签名方式 不需修改
			"inputCharset" => 'utf-8', //字符编码格式 目前支持 gbk 或 utf-8
			"transport" => 'http'
		);
		$url="";
		if(IS_APP !==1){
			$jhpaySubmit = new JhpaySubmit($jhpayConfig);
			$url = $jhpaySubmit->buildRequestForm($parameter, 'POST', 'submit');
			return $url;
		}else{
			$parameter['AppUrl']=$url;
			return $parameter;
		}

	}

	/**
	 * 收银台扫码支付代码
	 * @param type $order 订单信息
	 * @param type $payment 支付方式信息
	 * @return type
	 */
	public function get_codesm($order, $payment) {
		//记录支付订单号
		$log_id = insert_order_sn($order['order_id'], $order['order_amount']);
		$order_no = $order['order_sn'].$log_id ;

		$this->jhpayMerorderid = $order_no; //订单号
		$this->jhpayExtra = $order['order_sn'];
		$this->jhpayPaymoney = $order['order_amount'] * 1; //金额
		$this->jhpayUserid = $order['user_id'];
		$this->jhpayUsername = '';

		//构造要请求的参数数组，无需改动
		$parameter = array(
			"version" => $this->jhpayVersion,
			"merid" => $this->jhpayMerid,
			"mername" => $this->jhpayMername,
			"policyid" => $this->jhpayPolicyid,
			"merorderid" => $this->jhpayMerorderid,
			"paymoney" => $this->jhpayPaymoney,
			"productname" => $this->jhpayProductname,
			"productdesc" => $this->jhpayProductdesc,
			"userid" => $this->jhpayUserid,
			"username" => base64_encode($this->jhpayUsername),
			"email" => $this->jhpayEmail,
			"phone" => $this->jhpayPhone,
			"extra" => $this->jhpayExtra,
			"custom" => $this->jhpayCustom,
			"redirect" => $this->jhpayRedirect,
			"redirecturl" => $this->jhpayRedirecturl
		);

		$jhpayConfig = array(
			"partner" => $this->jhpayMerid,
			"key" => $this->jhpayMd5,
			"sign_type" => 'MD5', //签名方式 不需修改
			"inputCharset" => 'utf-8', //字符编码格式 目前支持 gbk 或 utf-8
			"transport" => 'http'
		);
		$url="";

		$jhpaySubmit = new JhpaySubmit($jhpayConfig);
		$url = $jhpaySubmit->buildRequestFormsm($parameter, 'POST', 'submit');
		return $url;
	}

	/**
	 * 生成微信二维码
	 * @param type $order 订单信息
	 * @param type $payment 支付方式信息
	 * @return type
	 */
	public function get_codewxsm($order, $payment) {
		//记录支付订单号
		$log_id = insert_order_sn($order['order_id'], $order['order_amount']);
		$order_no = $order['order_sn'] . $log_id;

		$this->jhpayMerorderid = $order_no; //订单号
		$this->jhpayExtra = $order['order_sn'];
		$this->jhpayPaymoney = $order['order_amount'] * 1; //金额
		$this->jhpayUserid = $order['mid'];
		$this->jhpayUsername = $order['username'];

		//构造要请求的参数数组，无需改动
		$parameter = array(
			"version" => $this->jhpayVersion,
			"merid" => $this->jhpayMerid,
			"mername" => $this->jhpayMername,
			"merorderid" => $this->jhpayMerorderid,
			"paymoney" => $this->jhpayPaymoney,
			"productname" => $this->jhpayProductname,
			"productdesc" => $this->jhpayProductdesc,
			"userid" => $this->jhpayUserid,
			"username" => base64_encode($this->jhpayUsername),
			"email" => $this->jhpayEmail,
			"phone" => $this->jhpayPhone,
			"extra" => $this->jhpayExtra,
			"custom" => $this->jhpayCustom,
		);

		$jhpayConfig = array(
			"partner" => $this->jhpayMerid,
			"key" => $this->jhpayMd5,
			"sign_type" => 'MD5', //签名方式 不需修改
			"inputCharset" => 'utf-8', //字符编码格式 目前支持 gbk 或 utf-8
			"transport" => 'http'
		);
		$url="";

		$jhpaySubmit = new JhpaySubmit($jhpayConfig);
		$parameter = $jhpaySubmit->buildRequestPara($parameter);

		return $parameter;

	}

	/**
	 * 响应操作
	 */
	public function respond() {
		/*
		  商户编号	 merid	12
		  商户订单号	merorderid	32	商户订单号
		  交易流水号	tradeid	20
		  交易完成时间	tradedate	19
		  支付交易结果	success	1	0：失败1：成功
		  支付交易成功金额	successmoney
		  支付渠道编号	paychannel	6
		  渠道服务提供方交易流水号	channeltradeid	32	支付渠道为网银/快捷支付时为银行流水号，其支付渠道与交易流水号相同
		  支付卡号/手机号	cardid	20	卡号（使用卡类支付时所使用的卡号）
		  用户ID	userid	32
		  用户名称	username	128	支付用户的名称
		  商户附加信息	extra	128
		  附加信息	attach	128	保留
		  通知方式	internal		0：前台页面返回 1：后台服务器返回
		  MD5校验值	md5	32	参数值的MD5校验值
		  签名信息	sign	1024	数字签名信息
		 */
		$parameter = array(
			'version' => $this->jhpayVersion, //版本号
			'merid' => $this->jhpayMerid, //商户编号
			'merorderid' => $_REQUEST['merorderid'], //商户订单号
			'tradeid' => $_REQUEST['tradeid'], //交易流水号
			'tradedate' => $_REQUEST['tradedate'], //交易完成时间
			'success' => $_REQUEST['success'], //支付交易结果	0：失败1：成功
			'successmoney' => $_REQUEST['successmoney'], //支付交易成功金额
			'paychannel' => $_REQUEST['paychannel'], //支付渠道编号
			'channeltradeid' => $_REQUEST['channeltradeid'], //渠道服务提供方交易流水号	支付渠道为网银/快捷支付时为银行流水号，其支付渠道与交易流水号相同
			'cardid' => $_REQUEST['cardid'], //支付卡号/手机号	卡号（使用卡类支付时所使用的卡号）
			'userid' => $_REQUEST['userid'], //用户ID
			'username' => $_REQUEST['username'], //用户名称	支付用户的名称
			'extra' => $_REQUEST['extra'], //商户附加信息
			'attach' => $_REQUEST['attach'], //附加信息	保留
			'internal' => $_REQUEST['internal'], //通知方式	0：前台页面返回 1：后台服务器返回
			'sign' => $_REQUEST['sign'], //签名信息
		);

		$jhpayConfig = array(
			"partner" => $this->jhpayMerid,
			"key" => $this->jhpayMd5,
			"sign_type" => 'MD5', //签名方式 不需修改
			"inputCharset" => 'utf-8', //字符编码格式 目前支持 gbk 或 utf-8
			"transport" => 'https'
		);

		$order_sn = str_replace($_REQUEST['extra'], '', $_REQUEST['merorderid']);
		$order_sn = trim(addslashes($order_sn));
		/* 检查支付的金额是否相符 */
		if (!check_money($order_sn, $_REQUEST['successmoney'])) {
			return false;
		}


		$jhpaySubmit = new JhpaySubmit($jhpayConfig);

		//生成签名结果
		$mysign = strtoupper($jhpaySubmit->buildRequestMysign($jhpaySubmit->paraFilterJhf($parameter)));

		//证书验证
		//$verifySign = $jhpaySubmit->verifySign($this->jhpayCrtfile, $this->createLinkstring($jhpaySubmit->paraFilterJhf($parameter)), $_REQUEST['sign']);
		if (strtoupper($_REQUEST['md5']) == $mysign /* && $verifySign */ &&  $_REQUEST['success']) {
			/* 改变订单状态 */
			header('Response: 1');
			$data = change_order_paid( $order_sn , 2);
			if($data['error'] > 0){ return false; }
			else{
				//记录第三方订单号
//				insert_order_sn($order_sn, array('transaction_id'=>$parameter["tradeid"]));
			}
			return true;
		}
		header('Response: 0');
		return false;
	}

}