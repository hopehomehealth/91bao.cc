(function () {

    'use strict';

    angular
    .module('app')
    .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$rootScope', 'API', 'ENUM','ConfigModel','$interval'];

    function SigninController($scope, $http, $window, $location, $state, $rootScope, API, ENUM,ConfigModel,$interval) {

    	$scope.username = "";
    	$scope.password = "";
    	//选项卡
    	$scope.activeTab = null;
    	//验证码
        $scope.verification_code = null;
        $scope.verification_btn = '获取验证码';
        //是否设置密码
        $scope.passwordSet = false;
        $scope.passwordF = null;
        $scope.passwordS = null;
        $scope.confirmPassword = _confirmPassword;

    	$scope.touchSignin = _touchSignin;
    	$scope.touchSignup = _touchSignup;
    	$scope.touchForget = _touchForget;
    	$scope.touchWeixin = _touchWeixin;
        $scope.touchQQ     = _touchQQ;
        $scope.isWeixin    = _isWeixin;
        //验证码
        $scope.send_sms_car = _send_sms_car;
        $scope.verifySignin = _verifySignin;
        $scope.paraclass = "inputBg";
        $scope.paraevent    = true;

    	function _touchSignin() {
    		var username = $scope.username;
    		var password = $scope.password;

            if ( !username)                     {$scope.toast('请填写手机号');            return;}

            var usernameReg = /^1[34578]\d{9}$/;
            if(!usernameReg.test(username))     {$scope.toast('请填写有效的手机号码');    return;}

            if (!password)                      {$scope.toast('请填写密码');             return;}

            if (password.length<6)              {$scope.toast('密码长度不小于6位');         return;}

            if (password.length>18)             {$scope.toast('密码长度不能大于18位');      return;}

            var passwordReg	= /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if(passwordReg.test(password))		{$scope.toast('密码中不能包含汉字');		  return;}

			API.auth.base
			.signin({username:username, password:password})
			.then(function(success){
                if (success) {
                    $scope.toast('登录成功');
                    $scope.goBack();
                }
                else{
                    $scope.toast('用户名或密码错误');
                }
			});
    	}

    	function _touchSignup() {
            $state.go('signup', {});
    	}

    	function _touchForget() {
            $state.go('forget', {});
    	}

    	function _touchWeixin() {
			$state.go('wechat-auth', {});
    	}

        function _touchQQ() {
            $state.go('qq-auth', {});
        }

        function _isWeixin() {

            var config = ConfigModel.getConfig();
            var wechat = config['wechat.web'];
            return wechat && $rootScope.isWeixin();
        }
        
        //验证码
        function _send_sms_car() {
            var username = $scope.username;
            if ( !username ) {
                $scope.toast('请填写手机号');
                return;
            }
            var usernameReg = /^1[34578]\d{9}$/;
            if(!usernameReg.test(username)){
                $scope.toast('请填写有效的手机号码');
                return false;
            }

            API.auth.base
                .verificationcode({mobile:username,code:'86'})
                .then(function(data){
                    if ( data && ENUM.ERROR_CODE.OK == data.error_code ) {
                        $scope.toast('验证码已经发送到您的手机，请注意查收');
                        timeout();
                    }
                });
        }
        function timeout() {
            var second = 120,
                timePromise = undefined;
            timePromise = $interval(function(){
                if(second<=0){
                    $interval.cancel(timePromise);
                    timePromise = undefined;

                    second = 120;
                    $scope.verification_btn = "重发验证码";
                    $scope.paraclass = "inputBg";
                    $scope.paraevent = true;
                }
                else
                {
                    $scope.verification_btn = second + "s";
                    $scope.paraclass = "no-inputBg";
                    $scope.paraevent = false;
                    second--;
                }
            },1000,130);
        }

        //验证码登录
        function _verifySignin(){
            var username = $scope.username;
            var verification_code = $scope.verification_code;

            if ( !username) {
                $scope.toast('请填写手机号');
                return;
            }

            var usernameReg = /^1[34578]\d{9}$/;
            if(!usernameReg.test(username)){
                $scope.toast('请填写有效的手机号码');
                return false;
            }

            if ( !verification_code || verification_code.length < 6 ) {
                $scope.toast('请填写正确的验证码');
                return;
            }

            API.auth.base
                .verifysignin({code:verification_code, mobile:username})
                .then(function(res){
                    if (res.error_code == 0) {
                        //判断是否注册用户
                        if(res.hasOwnProperty('is_exists')){
                            $scope.toast('登录成功');
                            $scope.goHome();
                        }else{
                            $scope.toast('登录成功,请重置密码');
                            $scope.passwordSet = true;
                        }
                    }
                    else{
                        $scope.toast(res.error_desc);
                    }
                });
        }
        
        //重设密码
        function _confirmPassword() {
            var passwordF = $scope.passwordF;
            var passwordS = $scope.passwordS;

            if (!passwordF) 					{$scope.toast('请设置登录密码');			return;}

            if(passwordF.length<6)				{$scope.toast('密码长度不小于6位');		return;}

            if(passwordF.length>18)				{$scope.toast('密码长度不大于18位');		return;}

            var passwordReg	= /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if(passwordReg.test(passwordF))		{$scope.toast('密码中不能包含汉字');		return;}

            if(!passwordS)						{$scope.toast('请确认密码');				return;}

            if (passwordF != passwordS ) 		{$scope.toast('两次填写的密码不一致');$scope.passwordS = '';return;}

            API.auth.base
                .setpassword({old_password:'', password:passwordF})
                .then(function(success){
                    if (success) {
                        $scope.toast('密码设置成功，账号已登录');
                        $scope.goHome();
                    } else{
                        $scope.toast('密码设置失败，返回首页');
                        $scope.goHome();
                    }
                });
            
        }
    }

})();
