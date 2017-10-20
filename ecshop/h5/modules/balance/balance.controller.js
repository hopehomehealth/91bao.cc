/**
 * Created by howiezhang on 16/9/27.
 */
(function () {

    'use strict';

    angular
        .module('app')
        .controller('BalanceController', BalanceController);

    BalanceController.$inject = ['$scope', '$http','$rootScope', '$window','$state', '$location', '$stateParams', 'PaymentModel', 'API', '$sce','ConfigModel'];

    function BalanceController($scope, $http,$rootScope, $window, $state, $location, $stateParams, PaymentModel, API, $sce,ConfigModel) {

        $scope.paymentModel = PaymentModel;

        var orderId = $stateParams.order;
        var code = $stateParams.code;
        if ( !orderId ) {
            $state.go('payment-failed', {
                order: orderId,
                reason: "参数错误"
            });
            return;
        }

        $rootScope.$on('onPaySuccess', function( event,reason ) {
            $state.go('payment-success', {
                order:orderId
            });
        });

        $rootScope.$on('onPayFailed', function( event,reason ) {
            $state.go('payment-failed', {
                order:orderId,
                reason:"支付宝支付失败"
            });
        });

        var callbackUrl = encodeURIComponent($window.location.protocol+"//"+$window.location.host+$window.location.pathname);
        // var params = {order:orderId,code:"alipay.wap",referer:callbackUrl};
        // API.payment.pay(params)
        //     .then(function(res) {
        //         if ( res.data.alipay&&res.data.alipay.html  ) {
        //             $scope.alipay_html = $sce.trustAsHtml(res.data.alipay.html);
        //         }
        //         return true ;
        //     });
        var params = {order:orderId,code:code,referer:callbackUrl};
        API.payment.pay(params)
            .then(function(res) {
                if(res!=null && res.data.error_code == '0'){
                    $state.go('payment-success', {
                        order:orderId
                    });
                }else if(res.data.error_desc == '余额不足'){      //余额不足
                    $state.go('payment-failed', {
                        order:orderId,
                        reason:res.data.error_desc
                    });
                }
                return true ;
            });
    }

})();
