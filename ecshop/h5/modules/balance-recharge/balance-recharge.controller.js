(function () {

    'use strict';

    angular
        .module('app')
        .controller('BalanceRechargeController', BalanceRechargeController);

    BalanceRechargeController.$inject = ['$scope', '$sce','$http', '$location', '$stateParams', '$state', 'CouponModel', 'ENUM','API'];

    function BalanceRechargeController($scope, $sce, $http, $location, $stateParams, $state, CouponModel, ENUM, API) {

        $scope.TAB_AVAILABLE    = 0;
        $scope.TAB_EXPIRED      = 1;
        $scope.TAB_USED         = 2;
        $scope.pay_type         = 'alipay';

        $scope.currentTab       = $scope.TAB_AVAILABLE;
        $scope.CouponModel      = CouponModel;

        $scope.error_desc       = $stateParams.error_desc;
        //添加一个充值方法
        $scope.recharge         = _recharge;
        $scope.touchPayType     = _touchPayType;

        $scope.balance_recharge_html = '';

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

        //充值方法 @wuwp 20170609
        function _recharge() {
            if(!$scope.card_num){
                $scope.toast('请填写充值金额');
                return;
            }

          if($scope.card_num <= 2){
                $scope.toast('金额必须大于2元');
                return false;
            }
            $state.go('alipay-wap', {
                money: $scope.card_num,
                order: $scope.card_num,
                pay_type: $scope.pay_type
            });
        }

        function _touchPayType(payType) {
            $scope.pay_type = payType;
        }

    }

})();