<?php 
namespace App\Services\Shopex;

use Log;
use App\Models\v2\ShopConfig;

class Erp
{
    public static function order($order_sn, $type = 'order_update')
    {
        $certificate_info = ShopConfig::findByCode('certificate');
        
        if (!$certificate_info) {
            return false;
        }

        $certificate = unserialize($certificate_info);                    
        $token = "";
        if(isset($certificate['token']))
        {
            $token = $certificate['token'];
        }
        else{
            return;
        }        
        

        //获取物流信息参数
        $param = array(
            'act' => 'ecmobile_fire_event',//固定方法
            'type' => $type,
            'id' => $order_sn,//订单号
            'return_data' => 'json',//返回类型
        );

        $ac = self::get_ac($param,$token);//验证签名

        $param['ac'] = $ac;//签名值放入参数中

        $api = config('app.shop_url') . '/api.php';

        $response = curl_request($api, 'POST', $param);

        if ($response['result'] == 'success') {
           return true;
        }

        Log::error('订单号：' . $order_sn . ' 同步ERP失败');

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

}