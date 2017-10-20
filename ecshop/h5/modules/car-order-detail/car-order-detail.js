(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('car-order-detail', {
                needAuth: true,
                url: '/car-order-detail/?carOrder&afterSubmit',
                title: "订单详情",
                templateUrl: 'modules/car-order-detail/car-order-detail.html',
            });

    }

})();