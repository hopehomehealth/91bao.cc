(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('customer-service', {
                needAuth: true,
                url: '/customer-service',
                title: "联系客服",
                templateUrl: 'modules/customer-service/customer-service.html'
            });
    }

})();