(function () {

    'use strict';

    angular
        .module('app')
        .controller('ProductInformController', ProductInformController);

    ProductInformController.$inject = ['$scope', '$http', '$stateParams', '$rootScope', '$state', 'API', 'ProductInformService','ConfirmProductService','ConfirmCarproductService','ENUM','CartModel','AppAuthenticationService'];

    function ProductInformController($scope, $http, $stateParams, $rootScope, $state, API, ProductInformService, ConfirmProductService,ConfirmCarproductService, ENUM,CartModel,AppAuthenticationService) {

        //$scope.selectedId = $stateParams.address;
        var productId = $stateParams.product;
        var isPushCar = $stateParams.isPushCar;
        $scope.cartModel = CartModel;

        //定义confirmInform 函数变量
        $scope.product = [];
        $scope.currentAttrs = ConfirmProductService.attrs;
        $scope.optionalAttrs = [];
        $scope.input = {
            currentAmount: 1
        };


        // $scope.ProductModel = ProductModel;
        // $scope.consignee = ProductInformService.consignee;
        // $scope.invoiceType = ProductInformService.invoiceType;
        // $scope.invoiceTitle = ProductInformService.invoiceTitle;
        // $scope.invoiceContent = ProductInformService.invoiceContent;
        // $scope.cashgift = ProductInformService.cashgift;
        // $scope.express = ProductInformService.express;
        // $scope.coupon = ProductInformService.coupon;

        //$scope.touchConsignee = _touchConsignee;

        //添加 确认 按钮方法
        $scope.confirmInform = _confirmInform;
        $scope.reload = _reload;

        function _confirmInform() {
            var product = $scope.product;
            var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
            var amount = $scope.input.currentAmount;
            if(product!=null && product.category != ENUM.CATEGORY.QICHEXIAN){
                ConfirmProductService.clear();
                ConfirmProductService.product = product;
                ConfirmProductService.attrs = attrs;
                ConfirmProductService.amount = amount;
                $state.go('confirm-product', {});
            }else{                                               //ENUM.CATEGORY.QICHEXIAN 表示车险类别
                ConfirmCarproductService.clear();
                ConfirmCarproductService.product = product;
                ConfirmCarproductService.attrs = attrs;
                ConfirmCarproductService.amount = amount;
                $state.go('confirm-carproduct',{});
            }

            // if(!isPushCar && isPushCar == '0'){
            //     $state.go('confirm-product', {});
            // }else{
            //     CartModel
            //         .add(productId, attrs, amount)
            //         .then(function(succeed){
            //             if ( succeed ) {
            //                 $scope.goBack();
            //                 $scope.toast('已添加到购物车');
            //             }
            //         });
            // }
        }




        function _reload() {
            // $scope.isLoading = true;
            API.product
                .get({product:productId})
                .then(function(product){

                    product.properties.sort(function(a, b){
                        return a.is_multiselect - b.is_multiselect;
                    })

                    $scope.product = product;
                    //// 改变量notice 赋值 (页面展示数据)
                    $scope.notices = product.notice;

                });
        }

        _reload();
    }

})();