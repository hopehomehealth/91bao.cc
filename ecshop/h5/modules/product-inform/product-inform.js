(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('product-inform', {
                needAuth: true,
                url: '/product-inform/?product&isPushCar',
                title: '告知',
                templateUrl: 'modules/product-inform/product-inform.html',
            });

    }

})();