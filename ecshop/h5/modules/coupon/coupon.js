(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('coupon', {
                needAuth: true,
                url: '/coupon',
                title: "我的代金券",
                templateUrl: 'modules/coupon/coupon.html',
            });
        $stateProvider
            .state('coupon-success', {
                needAuth: true,
                url: '/coupon-success',
                title: "充值信息",
                templateUrl: 'modules/coupon/coupon-success.html',
            });
        $stateProvider
            .state('coupon-fail', {
                needAuth: true,
                url: '/coupon-fail?error_desc',
                title: "充值信息",
                templateUrl: 'modules/coupon/coupon-fail.html',
            });

    }

})();