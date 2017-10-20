(function () {

    'use strict';

    angular
        .module('app')
        .factory('BalanceRechargeModel', BalanceRechargeModel);

    BalanceRechargeModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

    function BalanceRechargeModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

        var PER_PAGE = 10;

        var service = {};
        service.isEmpty = false;
        service.isLoaded = false;
        service.isLoading = false;
        service.isLastPage = false;
        service.status = null;
        service.coupons = null;
        service.fetch = _fetch;
        service.reload = _reload;
        service.loadMore = _loadMore;
        return service;

        function _reload() {

            if (!AppAuthenticationService.getToken())
                return;

            if (this.isLoading)
                return;

            this.coupons = null;
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

            if (this.coupons && this.coupons.length) {
                this.fetch((this.coupons.length / PER_PAGE) + 1, PER_PAGE);
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


            params.status = this.status;

            var _this = this;
            API.coupon.list(params).then(function (coupons) {
                _this.coupons = _this.coupons ? _this.coupons.concat(coupons) : coupons;
                _this.isEmpty = (_this.coupons && _this.coupons.length) ? false : true;
                _this.isLoaded = true;
                _this.isLoading = false;
                _this.isLastPage = (coupons && coupons.length < perPage) ? !_this.isEmpty : false;
            });
        }

    }

})();