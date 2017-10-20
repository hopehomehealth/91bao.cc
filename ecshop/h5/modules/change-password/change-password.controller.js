(function () {

	'use strict';

	angular
		.module('app')
		.controller('ChangePasswordController', ChangePasswordController);

	ChangePasswordController.$inject = ['$scope', '$http', '$window', '$location', '$state', 'API', 'ENUM'];

	function ChangePasswordController($scope, $http, $window, $location, $state, API, ENUM) {

		$scope.oldPassword = "";
		$scope.newPassword = "";

		$scope.touchChangePassword = touchChangePassword;

		function touchChangePassword() {

			var oldPassword = $scope.oldPassword;
			var newPassword = $scope.newPassword;
			var newPassword2 = $scope.newPassword2;

			if(!oldPassword){
				$scope.toast("请填写原密码");
				return;
			}
            if(!newPassword){
                $scope.toast("请填写新密码");
                return;
            }

			if(oldPassword.length < 6||newPassword.length < 6){
				$scope.toast("密码长度不能小于6位");
				return;
			}
            if(oldPassword.length > 18||newPassword.length > 18){
				$scope.toast("密码长度不能大于18位");
				return;
            }

            var passwordReg	= /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if(passwordReg.test(oldPassword) || passwordReg.test(newPassword))		{$scope.toast('密码中不能包含汉字');		return;}

			if (newPassword != newPassword2) {
				$scope.toast("两次密码填写不一致");
				return;
			}

			API.user.passwordUpdate({
					old_password: oldPassword,
					password: newPassword
				})
				.then(function (res) {
					if (res.data.error_code == 0) {
						$scope.toast('密码修改成功');
						$scope.goBack();
					} else {
						$scope.toast(res.data.error_desc);
					}

				});

		}

	}

})();