(function () {
    'use strict';

    angular
    .module('app')
    .factory('APIPaymentService', APIPaymentService);

    APIPaymentService.$inject =  ['$http', '$q', '$timeout', 'CacheFactory','ENUM'];

    function APIPaymentService($http, $q, $timeout, CacheFactory, ENUM) {

        var service = new APIEndpoint( $http, $q, $timeout, CacheFactory, 'APIPaymentService' );

        service.pay = _pay;
        service.charge = _charge;
        service.typeList = _typeList;

        return service;

        function _pay( params ) {
            return this.fetch( '/v2/ecapi.payment.pay', params, false, function(res){
                // return ENUM.ERROR_CODE.OK == res.data.error_code ? res : null;
                return res;
            });
        }
        function _charge( params ) {
            return this.fetch( '/v2/ecapi.payment.charge', params, false, function(res){
                // return ENUM.ERROR_CODE.OK == res.data.error_code ? res : null;
                return res;
            });
        }

        function _typeList(params) {
            return this.fetch( '/v2/ecapi.payment.types.list', params, false, function(res){
                return ENUM.ERROR_CODE.OK == res.data.error_code ? res.data.payment_types : null;
            });
        }
    }

})();
