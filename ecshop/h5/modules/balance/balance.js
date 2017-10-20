/**
 * Created by howiezhang on 16/9/27.
 */
(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('balance', {
                needAuth: true,
                url: '/balance?order&code',                     //传递两个参数 order： 订单号; code：支付方式
                title: "余额支付",
                controller: "BalanceController",
                templateUrl: 'modules/balance/balance.html'
            });
    }

})();