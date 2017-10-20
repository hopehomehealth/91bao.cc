(function () {

    'use strict';

    angular
    .module('app')
    .factory('APIAuthBaseService', APIAuthBaseService);

    APIAuthBaseService.$inject = ['$http', '$q', '$timeout', 'CacheFactory', 'AppAuthenticationService', 'ENUM'];

    function APIAuthBaseService($http, $q, $timeout, CacheFactory, AppAuthenticationService, ENUM) {

        var service = new APIEndpoint( $http, $q, $timeout, CacheFactory, 'APIAuthBaseService' );
        service.signin = _signin;
        service.signout = _signout;
        //验证码
        service.verificationcode = _verificationcode;
        service.verifysignin = _verifysignin;
        service.setpassword = _setpassword;
        return service;

        function _signin( params ) {
            return this.fetch( '/v2/ecapi.auth.signin', params, false, function(res){
                if ( res.data && ENUM.ERROR_CODE.OK == res.data.error_code ) {
                    if ( res.data.token && res.data.user ) {
                        AppAuthenticationService.setCredentials( res.data.token, res.data.user );
                        return true;
                    }
                }
                return false;
            });
        }

        function _signout() {
            var deferred = this.$q.defer();
            $timeout(function() {
                AppAuthenticationService.clearCredentials();
                deferred.resolve(true);
            }, 1);
            return deferred.promise;
        }
        
        //验证码
        function _verificationcode(params) {
            var result = null;
            return this.fetch('/v2/ecapi.auth.mobile.send',params, false, function(res){
                result = (res.data && ENUM.ERROR_CODE.OK == res.data.error_code) ? res.data : null;
                return result;
            });
        }

        //账号 验证码登入
        function _verifysignin(params) {
            var result = null;
            return this.fetch( '/v2/ecapi.auth.signin.mobile', params, false, function(res){
                if ( res.data && ENUM.ERROR_CODE.OK == res.data.error_code ) {
                    if ( res.data.token && res.data.user ) {
                        AppAuthenticationService.setCredentials( res.data.token, res.data.user );
                    }
                }
                result = res.data;
                return result;
            });
        }

        //设置新密码
        function _setpassword(params) {
            var result = null;
            return this.fetch('/v2/ecapi.auth.setpassword',params, false, function(res){
                result = (res.data && ENUM.ERROR_CODE.OK == res.data.error_code) ? true : false;
                return result;
            });
        }
    }

})();
