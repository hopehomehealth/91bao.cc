(function () {

    'use strict';

    angular.module('app').controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$stateParams', 'API','ENUM','AppAuthenticationService', '$interval'];

    function SignupController($scope, $http, $window, $location, $state, $stateParams, API,ENUM, AppAuthenticationService, $interval) {

		$scope.TAB_MOBILE 			= 0;
		$scope.TAB_EMAIL 			= 1;

		$scope.currentTab 			= $scope.TAB_MOBILE;
		// 用户协议
		$scope.showLicense			= false;

		if 		($stateParams.tab == 'mobile') 	{$scope.currentTab 	= $scope.TAB_MOBILE;}
		else if ($stateParams.tab == 'email') 	{$scope.currentTab 	= $scope.TAB_EMAIL;}
		else 									{$scope.currentTab 	= $scope.TAB_MOBILE;}

		$scope.touchTabMobile 		= _touchTabMobile;
		$scope.touchTabEmail 		= _touchTabEmail;

		$scope.signupMobile 		= {show:true};

		function _touchTabMobile() {
			if ($scope.currentTab != $scope.TAB_MOBILE) {
				$scope.currentTab 	= $scope.TAB_MOBILE;
				$scope.signupMobile = {show:true};
			}
		}

		function _touchTabEmail() {
			if ($scope.currentTab != $scope.TAB_EMAIL) {
				$scope.currentTab 	= $scope.TAB_EMAIL;
				$scope.signupMobile = {show:false};
			}
		}

    	$scope.state={
            username: 			"",
            password: 			"",
            password2: 			"",
            email: 				"",
            mobile: 			"",
            mobile_code: 		"",
            mobile_password: 	"",
            mobile_password2: 	"",
        };

    	$scope.touchSignup 			= _touchSignup;
    	$scope.touchSignupMobile 	= _touchSignupMobile;
    	$scope.toucheMobileCode 	= _toucheMobileCode;

    	$scope.touchLicense 		= _touchLicense;

        $scope.siteInfo 			= {};

    	function _touchSignup() {
    		var username 	= $scope.state.username;
    		var password 	= $scope.state.password;
    		var password2 	= $scope.state.password2;
    		var email 		= $scope.state.email;

            if (!username) 						{$scope.toast('请填写手机号码');		return;}

            var usernameReg = /^1[34578]\d{9}$/;
            if(!usernameReg.test(username))		{$scope.toast('请填写有效的手机号码');	return;}

            if (!password) 						{$scope.toast('请填写密码');			return;}

            if(password.length<6)				{$scope.toast('密码长度不能小于6位');	return;}

            if(password.length>18)				{$scope.toast('密码长度不大于18位');	return;}

            if(!password2)						{$scope.toast('请确认密码');			return;}

            if ( password != password2 ) 		{$scope.toast('两次填写的密码不一致');$scope.password2 = '';return;}

            if ( !email || email.length < 5 ) 	{$scope.toast('请填写正确的邮箱地址');	return;}

            var params 		= {};
            params.username = username;
            params.password = password;
            params.email 	= email;

            if(AppAuthenticationService.getReferences()){
                params.invite_code 		=  parseInt(AppAuthenticationService.getReferences());
            }

            API.auth.default.
            signup(params)
            .then(function(res){
                if ( res.data && ENUM.ERROR_CODE.OK == res.data.error_code )
                {	$scope.toast('注册成功');$scope.goHome();}
                else
                {	$scope.toast(res.data.error_desc);}
            });
    	}

    	$scope.paracont 			= "获取验证码";
		$scope.paraclass 			= "mobile-code";
		$scope.paraevent 			= true;

		function timeout() {
			var second 			= 120,
				timePromise 	= undefined;

			timePromise = $interval(function(){
	          if(second<=0){
	            $interval.cancel(timePromise);  
	            timePromise 		= undefined;
	            second 				= 120;
	            $scope.paracont 	= "重发验证码";
	            $scope.paraclass 	= "mobile-code";
	            $scope.paraevent 	= true;
	          }
	          else{
	            $scope.paracont 	= second + "s";
	            $scope.paraclass 	= "not-mobile-code";
	            $scope.paraevent 	= false;
	            second--;  
	          }  
			},1000,130);
		}

    	function _toucheMobileCode() {

			if ( !$scope.paraevent ) {return;}

    		var mobile 			= $scope.state.mobile;

	   		if (!mobile) {
                $scope.toast('请填写手机号码');
                return;
            }
            var mobileReg 		= /^1[34578]\d{9}$/;
            if(!mobileReg.test(mobile)){
                $scope.toast('请填写有效的手机号码');
                return false;
            }
            var params 			= {};
            params.mobile 		= mobile;
            params.code 		= "86";

	        API.auth.mobile.
	        verify(params)
            .then(function(res) {
            	if ( res ) {
			        API.auth.mobile.
			        send(params)
		            .then(function(res) {
		                if ( res.data && ENUM.ERROR_CODE.OK == res.data.error_code ){
                            $scope.toast('验证码已经发送到您的手机，请注意查收');
		                	timeout();
		                }
		                else
						{	$scope.toast(res.data.error_desc);}
		            });
            	}
            });
    	}

    	function _touchSignupMobile() {
    		var mobile 		= $scope.state.mobile;
    		var code 		= $scope.state.mobile_code;
    		var password 	= $scope.state.mobile_password;
    		var password2 	= $scope.state.mobile_password2;

    		if (!mobile) 						{$scope.toast('请填写手机号码');			return;}

            var mobileReg 	= /^1[34578]\d{9}$/;
            if(!mobileReg.test(mobile))			{$scope.toast('请填写有效的手机号码');		return;}

			if (!code || code.length < 4 ) 		{$scope.toast('请填写正确的手机验证码');	return;}

            if (!password) 						{$scope.toast('请填写密码');				return;}

            if(password.length<6)				{$scope.toast('密码长度不小于6位');		return;}

            if(password.length>18)				{$scope.toast('密码长度不大于18位');		return;}

			var passwordReg	= /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if(passwordReg.test(password))		{$scope.toast('密码中不能包含汉字');		return;}

			if(!password2)						{$scope.toast('请确认密码');				return;}

			if (password != password2 ) 		{$scope.toast('两次填写的密码不一致');$scope.password2 = '';return;}

            var params 		= {};
            params.mobile 	= mobile;
            params.code 	= code;
            params.password = password;

			if(AppAuthenticationService.getReferences()){
                params.invite_code 		=  parseInt(AppAuthenticationService.getReferences());
            }

			API.auth.mobile.
	        signup(params)
            .then(function(res) {
				if ( res.data && ENUM.ERROR_CODE.OK == res.data.error_code ) {
				    $scope.toast('手机号注册成功');
                    $scope.goHome();
                }
                else{
                    $scope.toast(res.data.error_desc);
                }
            });
    	}

    	function _touchLicense() {
            // $window.location.href = $scope.siteInfo.terms_url;
            $scope.showLicense	= !$scope.showLicense;
    	}

        function _reloadSiteInfo(){
            API.site.get().then(function(siteInfo){
                    $scope.siteInfo = siteInfo;
                }
            )
        }
        _reloadSiteInfo();
    }

})();
