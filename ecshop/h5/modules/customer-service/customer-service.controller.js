(function () {

    'use strict';

    angular
        .module('app')
        .controller('CustomerServiceController', CustomerServiceController);

    CustomerServiceController.$inject = ['$scope', '$http','$rootScope', '$timeout', '$location', '$state', 'API', 'ENUM','CONSTANTS', '$window', 'AppAuthenticationService'];

    function CustomerServiceController($scope, $http,$rootScope, $timeout, $location, $state, API, ENUM,CONSTANTS, $window, AppAuthenticationService) {






    }

})();