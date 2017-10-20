(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('pay-password', {
                needAuth: true,
                url: '/pay-password',
                title: "支付密码管理",
                templateUrl: 'modules/pay-password/pay-password.html',
            });

    }

})();