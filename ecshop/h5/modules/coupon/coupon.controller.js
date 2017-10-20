(function () {

    'use strict';

    angular
        .module('app')
        .controller('CouponController', CouponController);

    CouponController.$inject = ['$scope', '$http', '$location', '$stateParams', '$state', 'CouponModel', 'ENUM','API'];

    function CouponController($scope, $http, $location, $stateParams, $state, CouponModel, ENUM, API) {

        $scope.TAB_AVAILABLE    = 0;
        $scope.TAB_EXPIRED      = 1;
        $scope.TAB_USED         = 2;

        $scope.currentTab       = $scope.TAB_AVAILABLE;
        $scope.CouponModel      = CouponModel;

        $scope.error_desc       = $stateParams.error_desc;
        //添加一个充值方法
        $scope.recharge         = _recharge;
        //跳转页面
        $scope.jumpPage         = _jumpPage;

        if ($stateParams.tab == 'available') {
            $scope.currentTab = $scope.TAB_AVAILABLE;
            $scope.CouponModel.status = ENUM.COUPON_STATUS.AVAILABLE;
        } else if ($stateParams.tab == 'expired') {
            $scope.currentTab = $scope.TAB_EXPIRED;
            $scope.CouponModel.status = ENUM.COUPON_STATUS.EXPIRED;
        } else if ($stateParams.tab == 'used') {
            $scope.currentTab = $scope.TAB_USED;
            $scope.CouponModel.status = ENUM.COUPON_STATUS.USED;
        } else {
            $scope.currentTab = $scope.TAB_AVAILABLE;
            $scope.CouponModel.status = ENUM.COUPON_STATUS.AVAILABLE;
        }

        $scope.touchTabAvailable = _touchTabAvailable;
        $scope.touchTabExpired = _touchTabExpired;
        $scope.touchTabUsed = _touchTabUsed;

        function _touchTabAvailable() {
            if ($scope.currentTab != $scope.TAB_AVAILABLE) {
                $scope.currentTab = $scope.TAB_AVAILABLE;
                $scope.CouponModel.status = ENUM.COUPON_STATUS.AVAILABLE;
                $scope.CouponModel.reload();
            }
        }

        function _touchTabExpired() {
            if ($scope.currentTab != $scope.TAB_EXPIRED) {
                $scope.currentTab = $scope.TAB_EXPIRED;
                $scope.CouponModel.status = ENUM.COUPON_STATUS.EXPIRED;
                $scope.CouponModel.reload();
            }
        }

        function _touchTabUsed() {
            if ($scope.currentTab != $scope.TAB_USED) {
                $scope.currentTab = $scope.TAB_USED;
                $scope.CouponModel.status = ENUM.COUPON_STATUS.USED;
                $scope.CouponModel.reload();
            }
        }

        // $scope.CouponModel.reload();

        //充值方法 @wuwp 20170609
        function _recharge() {
            var params = {};
            if(!$scope.card_num){
                $scope.toast('请填写代金券卡号');
                return;
            }

            var card_numReg = /^(10|05|03|x5|01)\d{4}$/;
            if(!card_numReg.test($scope.card_num)){
                $scope.toast('请填写有效代金券卡号');
                return false;
            }

            params.card_num = $scope.card_num;

            API.coupon.available(params)
                .then(function (res) {
                    if(res.data.error_code == '0'){
                        _jumpPage('success');
                        // $scope.toast('代金券充值成功');
                        // $scope.goHome();
                    }else {
                        _jumpPage('fail',res.data.error_desc);
                        // $scope.toast('代金券充值过期或无效');
                    }
                });

        }
        // 返回订单详情
        function _jumpPage(isSuccess,error_desc) {
            $state.go('coupon-'+isSuccess, {error_desc:error_desc});
        }

    }

})();