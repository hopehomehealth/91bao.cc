(function () {

    'use strict';

    angular
        .module('app')
        .controller('CarOrderDetailController', CarOrderDetailController);

    CarOrderDetailController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'PaymentModel', 'OrderExpressModel'];

    function CarOrderDetailController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, PaymentModel, OrderExpressModel) {

        var orderId = $stateParams.carOrder;
        $scope.order = {
            id: orderId
        };

        $scope.isLoading = false;
        $scope.isLoaded = false;
        //是否提交过来的数据
        $scope.afterSubmit = $stateParams.afterSubmit;

        $scope.touchPay = _touchPay;
        $scope.touchCancel = _touchCancel;
        $scope.touchConfirm = _touchConfirm;
        $scope.touchExpress = _touchExpress;
        $scope.touchComment = _touchComment;
        $scope.touchProduct = _touchProduct;

        $scope.showDialog = false;
        $scope.touchDialogCancel = _touchDialogCancel;
        $scope.touchDialogConfirm = _touchDialogConfirm;

        $scope.paymentModel = PaymentModel;
        $scope.orderExpressModel = OrderExpressModel;

        //formate 新车未上险  是否所有权转移
        $scope.formateIsNew = _formateIsNew;
        $scope.formateIsTransfer = _formateIsTransfer;
        // 返回订单
        $scope.gotoCarOrder     = _gotoCarOrder;

        function _touchPay() {
            if (!$scope.order)
                return;
            $scope.paymentModel.clear();
            $scope.paymentModel.order = $scope.order;
            $scope.paymentModel.isCar  = 1;
            $state.go('payment', {});
        }

        function _touchCancel() {
            if (!$scope.order)
                return;
            $scope.showDialog = true;
        }

        function _touchDialogCancel() {
            $scope.showDialog = false;
        }

        function _touchDialogConfirm() {
            API.order.cancel({
                order: orderId,
                reason: 1
            }).then(function (order) {
                $scope.toast('取消成功');
                $scope.showDialog = false;
                _reload();
            });
        }

        function _touchConfirm() {
            API.order.confirm({
                order: orderId,
            }).then(function (order) {
                $scope.toast('确认成功');
                _reload();
            });
        }

        function _touchExpress() {
            $scope.orderExpressModel.clear();
            $scope.orderExpressModel.order = $scope.order;
            $state.go('order-express', {
                order: $scope.order.id
            });
        }

        function _touchComment() {
            $state.go('order-review', {
                order: $scope.order.id
            });
        }

        function _touchProduct(product) {
            $state.go('product', {
                product: product.id
            });
        }

        function _reload() {
            $scope.isLoading = true;
            $scope.isLoaded = false;
            API.carorder.get({
                id: orderId,
            }).then(function (policyInfo) {
                $scope.order = policyInfo[0];
                $scope.isLoading = false;
                $scope.isLoaded = true;
            });
        }

        _reload();

        //新车为上险
        function _formateIsNew(isNew) {
            var isNewVal = (isNew == '0') ? '否' : '是';
            return isNewVal;
        }

        // 所有权是否转移
        function _formateIsTransfer(isTransfer) {
            var isTransferVal = (isTransfer == '0') ? '否' : '是';
            return isTransferVal;
        }
        
        // 车险订单
        function _gotoCarOrder() {
            $state.go('car-order', {
                tab: ENUM.ORDER_STATUS.PAID,
                isNoPay: 1
            });
        }

    }

})();