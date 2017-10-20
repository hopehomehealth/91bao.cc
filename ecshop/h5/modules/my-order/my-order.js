(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('my-order', {
                needAuth: true,
                url: '/my-order?tab&isNoPay',
                title: "我的订单",
                templateUrl: 'modules/my-order/my-order.html',
            });
    }

})();