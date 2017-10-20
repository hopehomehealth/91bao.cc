(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('balance-recharge', {
                needAuth: true,
                url: '/balance-recharge',
                title: "余额充值",
                templateUrl: 'modules/balance-recharge/balance-recharge.html'
            });
        $stateProvider
            .state('balance-recharge-success', {
                needAuth: true,
                url: '/balance-recharge-success',
                title: "充值信息",
                templateUrl: 'modules/balance-recharge/balance-recharge-success.html'
            });
        $stateProvider
            .state('balance-recharge-fail', {
                needAuth: true,
                url: '/balance-recharge-fail?error_desc',
                title: "充值信息",
                templateUrl: 'modules/balance-recharge/balance-recharge-fail.html'
            });

    }

})();