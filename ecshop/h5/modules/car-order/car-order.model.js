(function () {

    'use strict';

    angular
        .module('app')
        .factory('CarOrderModel', CarOrderModel);

    CarOrderModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

    function CarOrderModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

        var PER_PAGE = 10;

        var service = {};
        service.isEmpty = false;
        service.isLoaded = false;
        service.isLoading = false;
        service.isLastPage = false;
        service.status = null;
        service.carorders = null;

        service.fetch = _fetch;
        service.reload = _reload;
        service.loadMore = _loadMore;
        return service;

        function _reload() {

            if (!AppAuthenticationService.getToken())
                return;

            if (this.isLoading)
                return;

            this.carorders = null;
            this.isEmpty = false;
            this.isLoaded = false;
            this.isLastPage = false;

            this.fetch(1, PER_PAGE);
        }

        function _loadMore() {

            if (!AppAuthenticationService.getToken())
                return;

            if (this.isLoading)
                return;
            if (this.isLastPage)
                return;

            if (this.carorders && this.carorders.length) {
                this.fetch((this.carorders.length / PER_PAGE) + 1, PER_PAGE);
            } else {
                this.fetch(1, PER_PAGE);
            }
        }

        function _fetch(page, perPage) {

            if (!AppAuthenticationService.getToken())
                return;

            this.isLoading = true;

            var params = {
                page: page,
                per_page: perPage
            };

            if (null != this.status) {
                params.status = this.status;
            }

            var _this = this;
            API.carorder.list(params).then(function (carorders) {
                _this.carorders = _this.carorders ? _this.carorders.concat(carorders) : carorders;
                _this.isEmpty = (_this.carorders && _this.carorders.length) ? false : true;
                _this.isLoaded = true;
                _this.isLoading = false;
                _this.isLastPage = (carorders && carorders.length < perPage) ? !_this.isEmpty : false;
            });
        }

    }

})();