<?php
/**
 * 页面作用：常用表单验证类
 */
class class_post
{
	function is_empty($param){
		return !empty(trim($param))?false:true;
	}
//验证是否为指定长度的字母/数字组合
	function fun_text1($num1,$num2,$str)
	{
		Return (preg_match("/^[a-zA-Z0-9]{".$num1.",".$num2."}$/",$str))?true:false;
	}

//验证是否为指定长度数字
	function fun_text2($num1,$num2,$str)
	{
		return (preg_match("/^[0-9]{".$num1.",".$num2."}$/i",$str))?true:false;
	}

	//验证是否为指定长度数字
	function fun_card_num($str)
	{
		return (preg_match('/^[0,1,x][2,3,5,0]\d{4}$/i',$str))?true:false;
	}
//验证是否为指定长度汉字
	function fun_font($str)
	{
// preg_match("/^[\xa0-\xff]{1,4}$/", $string);result
		///^[\x{4e00}-\x{9fa5}]+$/

		return (preg_match('/^([\x{4e00}-\x{9fa5}]){2,10}$/u',$str))?true:false;
	}
//验证身份证号码
	function fun_status($str)
	{
		return (preg_match('/(^([\d]{15}|[\d]{18}|[\d]{17}x)$)/i',$str))?true:false;
	}
//验证邮件地址
	function fun_email($str){
		return (preg_match('/^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,4}$/',$str))?true:false;
	}
//验证电话号码
	function fun_phone($str)
	{
		return (preg_match("/^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/",$str))?true:false;
	}
//验证手机号码
	function fun_mobile($str)
	{
		return (preg_match('/^1[3,4,5,6,7,8][0-9]{9}$/',$str))?true:false;
	}
//验证邮编
	function fun_zip($str)
	{
		return (preg_match("/^[1-9]\d{5}$/",$str))?true:false;
	}
//验证url地址
	function fun_url($str)
	{
		return (preg_match("/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/",$str))?true:false;
	}

	function fun_birthday($str){
	    $is_date = strtotime($str)?strtotime($str):false;
	    if($is_date === false){
	        return false;
	    }else{
	    	return true;
		}
	}
// 数据入库 转义 特殊字符 传入值可为字符串 或 一维数组
	function data_join(&$data)
	{
		if(get_magic_quotes_gpc() == false)
		{
			if (is_array($data))
			{
				foreach ($data as $k => $v)
				{
					$data[$k] = addslashes($v);
				}
			}
			else
			{
				$data = addslashes($data);
			}
		}
		Return $data;
	}
// 数据出库 还原 特殊字符 传入值可为字符串 或 一/二维数组
	function data_revert(&$data)
	{
		if (is_array($data))
		{
			foreach ($data as $k1 => $v1)
			{
				if (is_array($v1))
				{
					foreach ($v1 as $k2 => $v2)
					{
						$data[$k1][$k2] = stripslashes($v2);
					}
				}
				else
				{
					$data[$k1] = stripslashes($v1);
				}
			}
		}
		else
		{
			$data = stripslashes($data);
		}
		Return $data;
	}
// 数据显示 还原 数据格式 主要用于内容输出 传入值可为字符串 或 一/二维数组
// 执行此方法前应先data_revert()，表单内容无须此还原
	function data_show(&$data)
	{
		if (is_array($data))
		{
			foreach ($data as $k1 => $v1)
			{
				if (is_array($v1))
				{
					foreach ($v1 as $k2 => $v2)
					{
						$data[$k1][$k2]=nl2br(htmlspecialchars($data[$k1][$k2]));
						$data[$k1][$k2]=str_replace(" "," ",$data[$k1][$k2]);
						$data[$k1][$k2]=str_replace("\n","<br>\n",$data[$k1][$k2]);
					}
				}
				else
				{
					$data[$k1]=nl2br(htmlspecialchars($data[$k1]));
					$data[$k1]=str_replace(" "," ",$data[$k1]);
					$data[$k1]=str_replace("\n","<br>\n",$data[$k1]);
				}
			}
		}
		else
		{
			$data=nl2br(htmlspecialchars($data));
			$data=str_replace(" "," ",$data);
			$data=str_replace("\n","<br>\n",$data);
		}
		Return $data;
	}

	function checkParam(){
		//被保人姓名验证
		if($this->is_empty($_POST['recognizee_name_'])){
			$data['recognizee_name_']['message'] ='被保人姓名不能为空!';
			$data['recognizee_name_']['result'] ='false';
		}elseif(!$this->fun_font($_POST['recognizee_name_'])){
			$data['recognizee_name_']['message'] ='被保人姓名格式不正确!';
			$data['recognizee_name_']['result'] ='false';
		}else{
			$data['recognizee_name_']['message'] ='';
			$data['recognizee_name_']['result'] ='true';
		}

		//被保人身份证号验证
		if($this->is_empty($_POST['recognizee_cardnum_'])){
			$data['recognizee_cardnum_']['message'] ='被保人身份证号不能为空!';
			$data['recognizee_cardnum_']['result'] ='false';
		}elseif(!$this->fun_status($_POST['recognizee_cardnum_'])){
			$data['recognizee_cardnum_']['message'] ='被保人身份证号不正确!';
			$data['recognizee_cardnum_']['result'] ='false';
		}else{
			$data['recognizee_cardnum_']['message'] ='';
			$data['recognizee_cardnum_']['result'] ='true';
		}

		//被保人生日验证
		if($this->is_empty($_POST['recognizee_birth_'])){
			$data['recognizee_birth_']['message'] ='被保人生日不能为空!';
			$data['recognizee_birth_']['result'] ='false';
		}elseif(!$this->fun_birthday($_POST['recognizee_birth_'])){
			$data['recognizee_birth_']['message'] ='被保人生日格式不正确!';
			$data['recognizee_birth_']['result'] ='false';
		}else{
			$data['recognizee_birth_']['message'] ='';
			$data['recognizee_birth_']['result'] ='true';
		}

		//被保人手机号验证
		if($this->is_empty($_POST['recognizee_phone_'])){
			$data['recognizee_phone_']['message'] ='被保人手机号不能为空!';
			$data['recognizee_phone_']['result'] ='false';
		}elseif(!$this->fun_mobile($_POST['recognizee_phone_'])){
			$data['recognizee_phone_']['message'] ='被保人手机号不正确!';
			$data['recognizee_phone_']['result'] ='false';
		}else{
			$data['recognizee_phone_']['message'] ='';
			$data['recognizee_phone_']['result'] ='true';
		}

		//投保人身份证号验证
		if($this->is_empty($_POST['policy_cardnum_'])){
			$data['policy_cardnum_']['message'] ='投保人身份证号不能为空!';
			$data['policy_cardnum_']['result'] ='false';
		}elseif(!$this->fun_status($_POST['policy_cardnum_'])){
			$data['policy_cardnum_']['message'] ='投保人身份证号格式不正确!';
			$data['policy_cardnum_']['result'] ='false';
		}else{
			$data['policy_cardnum_']['message'] ='';
			$data['policy_cardnum_']['result'] ='true';
		}

		//投保人姓名验证
		if($this->is_empty($_POST['policy_name_'])){
			$data['policy_name_']['message'] ='投保人姓名不能为空!';
			$data['policy_name_']['result'] ='false';
		}elseif(!$this->fun_font($_POST['policy_name_'])){
			$data['policy_name_']['message'] ='投保人姓名格式不正确!';
			$data['policy_name_']['result'] ='false';
		}else{
			$data['policy_name_']['message'] ='';
			$data['policy_name_']['result'] ='true';
		}

		//投保人生日验证
		if($this->is_empty($_POST['policy_birth_'])){
			$data['policy_birth_']['message'] ='投保人生日不能为空!';
			$data['policy_birth_']['result'] ='false';
		}elseif(!$this->fun_birthday($_POST['policy_birth_'])){
			$data['policy_birth_']['message'] ='投保人生日格式不正确!';
			$data['policy_birth_']['result'] ='false';
		}else{
			$data['policy_birth_']['message'] ='';
			$data['policy_birth_']['result'] ='true';
		}

		//投保人手机号验证
		if($this->is_empty($_POST['policy_phone_'])){
			$data['policy_phone_']['message'] ='投保人手机号不能为空!';
			$data['policy_phone_']['result'] ='false';
		}elseif(!$this->fun_mobile($_POST['policy_phone_'])){
			$data['policy_phone_']['message'] ='投保人手机号格式不正确!';
			$data['policy_phone_']['result'] ='false';
		}else{
			$data['policy_phone_']['message'] ='';
			$data['policy_phone_']['result'] ='true';
		}

		return $data;

	}
}


