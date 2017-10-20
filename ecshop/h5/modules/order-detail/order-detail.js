(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('order-detail', {
                needAuth: true,
                // url: '/order-detail/?order',		afterPay判断是否支付成功后跳转过来的
                url: '/order-detail/?order&afterPay',
                title: "订单详情",
                templateUrl: 'modules/order-detail/order-detail.html',
            });

    }

})();