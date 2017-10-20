(function () {

    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('profile', {
                needAuth: true,
                url: '/profile',
                title: "个人中心",
                templateUrl: 'modules/profile/profile.html'
            });

        // 查看个人信息
        $stateProvider
            .state('personal-info', {
                needAuth: true,
                url: '/personal-info',
                title: '个人信息',
                templateUrl: 'modules/profile/personal-info.html'
            });

    }

})();