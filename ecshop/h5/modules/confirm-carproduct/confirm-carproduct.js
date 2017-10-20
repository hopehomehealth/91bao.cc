(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('confirm-carproduct', {
                needAuth: true,
                url: '/confirm-carproduct',
                title: "填写车险保单",
                templateUrl: 'modules/confirm-carproduct/confirm-carproduct.html',
            });

    }

})();