(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('car-order', {
                needAuth: true,
                url: '/car-order?tab&isNoPay',
                title: "车险保单",
                templateUrl: 'modules/car-order/car-order.html',
            });

    }

})();