<?php
/* *
 * 功能：支付宝页面跳转同步通知页面
 * 版本：2.0
 * 修改日期：2017-05-01
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。

 *************************页面功能说明*************************
 * 该页面可在本机电脑测试
 * 可放入HTML等美化页面的代码、商户业务逻辑程序代码
 */
define('IN_ECS', true);

require_once(__DIR__ . '/includes/init.php');
require_once(__DIR__."/includes/alipay/config.php");
require_once __DIR__."/includes/alipay/pagepay/service/AlipayTradeService.php";
$config = $db->getRow("select config from". $ecs->table('config')." where code = 'alipay.wap'");
$config = json_decode($config['config'], true);


$result =  AlipayTradeService::check($_GET, $config);

/* 实际验证过程建议商户添加以下校验。
1、商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
3、校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
4、验证app_id是否为该商户本身。
*/
if($result) {//验证成功
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//商户订单号
	$out_trade_no = htmlspecialchars($_GET['out_trade_no']);
	$total_amount = htmlspecialchars($_GET['total_amount']);
	$seller_id = htmlspecialchars($_GET['seller_id']);
	$app_id =  htmlspecialchars($_GET['app_id']);

	$order = $db->getRow("select pay_status, order_id from". $ecs->table('order_info')." where 
		order_sn = '$out_trade_no' and 
		user_id  = '$_SESSION[user_id]' and
		order_amount = '$total_amount' limit 1
	");

	if($app_id == $config['app_id'] && $seller_id == $config['partner_id'] && $order['pay_status'] == 2){
		show_message('订单支付成功', '查看订单详情', 'user.php?act=order_detail&order_id='.$order['order_id']);
	}else{
		show_message('订单状态获取失败' ,'查看订单详情','user.php');
	}



	//——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表



	//支付宝交易号
//	$trade_no = htmlspecialchars($_GET['trade_no']);

//	echo "验证成功<br />支付宝交易号：".$trade_no;
	show_message('订单支付成功');

	//——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
else {
    //验证失败
    echo "验证失败";
}
