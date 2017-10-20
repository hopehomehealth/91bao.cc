(function () {

    'use strict';

    angular
        .module('app')
        .controller('PayPasswordController', PayPasswordController);

    PayPasswordController.$inject = ['$scope', '$http', '$window', '$location', '$state', 'API', 'ENUM'];

    function PayPasswordController($scope, $http, $window, $location, $state, API, ENUM) {

        $scope.payStatus    = {
            setPassword : {
                flag : 0
            },
            updatePassword : {
                flag : 1
            },
            findPassword : {
                flag : 2
            }
        };

        $scope.payPassword      = '';
        $scope.newPassword      = '';
        $scope.newPassword2     = '';
        $scope.payTitle         = '';
        $scope.username         = '';
        $scope.verification_code= '';
        $scope.hasPayPassword   = $scope.payStatus.updatePassword.flag;

        switch ($scope.hasPayPassword){
            case 0:$scope.payTitle  = '设置支付密码';break;
            case 1:$scope.payTitle  = '修改支付密码';break;
            case 2:$scope.payTitle  = '找回支付密码';break;
            default:$scope.payTitle = '设置支付密码';break;
        }

        $scope.touchPayPassword = _touchPayPassword;
        $scope.setPayPassword   = _setPayPassword;
        $scope.payPasswordUpdate= _payPasswordUpdate;
        $scope.payPasswordFind  = _payPasswordFind;
        $scope.touchForget      = _touchForget;

        function _touchPayPassword() {
            switch ($scope.hasPayPassword){
                case $scope.payStatus.setPassword.flag:
                    _setPayPassword();
                    break;
                case $scope.payStatus.updatePassword.flag:
                    _payPasswordUpdate();
                    break;
                case $scope.payStatus.findPassword.flag:
                    _payPasswordFind();
                    break;
                default:
                    _setPayPassword();
                    break;
            }
        }

        //设置支付密码
        function _setPayPassword() {
            var newPassword = $scope.newPassword;
            var newPassword2 = $scope.newPassword2;
            if(!newPassword){
                $scope.toast("请填写支付密码");
                return;
            }
            if(!newPassword2){
                $scope.toast("请确认支付密码");
                return;
            }
            if(newPassword.length < 6||newPassword2.length < 6){
                $scope.toast("密码长度不能小于6位");
                return;
            }
            if(newPassword.length > 18||newPassword2.length > 18){
                $scope.toast("密码长度不能大于18位");
                return;
            }
            if (newPassword != newPassword2) {
                $scope.toast("两次密码填写不一致");
                return;
            }
            API.user.payPassword({
                password: newPassword
            })
                .then(function (res) {
                    if (res.data.error_code == 0) {
                        $scope.toast('密码设置成功');
                        $scope.goBack();
                    } else {
                        $scope.toast(res.data.error_desc);
                    }

                });
        }

        //修改支付密码
        function _payPasswordUpdate() {
            var payPassword = $scope.payPassword;
            var newPassword = $scope.newPassword;
            var newPassword2 = $scope.newPassword2;
            if(!payPassword){
                $scope.toast("请填写原密码");
                return;
            }
            if(payPassword.length < 6){
                $scope.toast("原密码长度不能小于6位");
                return;
            }
            if(payPassword.length > 6){
                $scope.toast("原密码长度不能大于18位");
                return;
            }
            if(!newPassword){
                $scope.toast("请填写新密码");
                return;
            }
            if(!newPassword2){
                $scope.toast("请确认新密码");
                return;
            }
            if(newPassword.length < 6||newPassword2.length < 6){
                $scope.toast("密码长度不能小于6位");
                return;
            }
            if(newPassword.length > 18||newPassword2.length > 18){
                $scope.toast("密码长度不能大于18位");
                return;
            }
            if (newPassword != newPassword2) {
                $scope.toast("两次密码填写不一致");
                return;
            }
            API.user.payPasswordUpdate({
                oldPassword: payPassword,
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
        
        // 找回支付密码
        function _payPasswordFind() {
            var username            = $scope.username;
            var verification_code   = $scope.verification_code;
            if (!username){
                $scope.toast('请填写手机号');
                return;
            }
            if(!isTel(username)){
                $scope.toast('请填写有效的手机号码');
                return;
            }
            if(!verification_code){
                $scope.toast('请填写验证码');
                return;
            }
            if(verification_code.length<4){
                $scope.toast('请填写有效的验证码');
                return;
            }
            API.user.payPasswordUpdate({
                oldPassword: payPassword,
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

        // 切换至 密码找回
        function _touchForget(){
            $scope.hasPayPassword   = $scope.payStatus.findPassword.flag;
            $scope.payTitle         = '找回支付密码';
        }

    }

})();