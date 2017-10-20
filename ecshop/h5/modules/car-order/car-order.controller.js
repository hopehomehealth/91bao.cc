(function () {

    'use strict';

    angular
        .module('app')
        .controller('CarOrderController', CarOrderController);

    CarOrderController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'PaymentModel', 'CarOrderModel', 'OrderExpressModel'];

    function CarOrderController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, PaymentModel, CarOrderModel, OrderExpressModel) {

        $scope.TAB_ALL = 0;
        $scope.TAB_CREATED = 1;
        $scope.TAB_PAID = 2;
        $scope.TAB_DELIVERING = 3;
        $scope.TAB_DELIVERIED = 4;

        $scope.currentTab = $scope.TAB_ALL;

        $scope.cancellingOrder = null;
        $scope.showDialog = false;

        $scope.carOrderModel = CarOrderModel;
        $scope.paymentModel = PaymentModel;
        $scope.orderExpressModel = OrderExpressModel;
        //
        $scope.isNoPay      = $stateParams.isNoPay;

        if ($stateParams.tab == 'all') {
            $scope.currentTab = $scope.TAB_ALL;
            $scope.carOrderModel.status = null;
        } else if ($stateParams.tab == 'created') {
            $scope.currentTab = $scope.TAB_CREATED;
            $scope.carOrderModel.status = ENUM.ORDER_STATUS.CREATED;
        } else if ($stateParams.tab == 'paid') {
            $scope.currentTab = $scope.TAB_PAID;
            $scope.carOrderModel.status = ENUM.ORDER_STATUS.PAID;
        } else if ($stateParams.tab == 'delivering') {
            $scope.currentTab = $scope.TAB_DELIVERING;
            $scope.carOrderModel.status = ENUM.ORDER_STATUS.DELIVERING;
        } else if ($stateParams.tab == 'delivered') {
            $scope.currentTab = $scope.TAB_DELIVERIED;
            $scope.carOrderModel.status = ENUM.ORDER_STATUS.DELIVERIED;
        } else {
            $scope.currentTab = $scope.TAB_ALL;
            $scope.carOrderModel.status = null;
        }

        $scope.touchTabAll = _touchTabAll;
        $scope.touchTabCreated = _touchTabCreated;
        $scope.touchTabPaid = _touchTabPaid;
        $scope.touchTabDelivering = _touchTabDelivering;
        $scope.touchTabDeliveried = _touchTabDeliveried;

        $scope.touchDialogCancel = _touchDialogCancel;
        $scope.touchDialogConfirm = _touchDialogConfirm;

        $scope.touchOrder = _touchOrder;
        $scope.touchPay = _touchPay;
        $scope.touchCancel = _touchCancel;
        $scope.touchConfirm = _touchConfirm;
        $scope.touchExpress = _touchExpress;
        $scope.touchComment = _touchComment;

        function _touchTabAll() {
            if ($scope.currentTab != $scope.TAB_ALL) {
                $scope.currentTab = $scope.TAB_ALL;
                $scope.carOrderModel.status = null;
                $scope.carOrderModel.reload();
            }
        }

        function _touchTabCreated() {
            if ($scope.currentTab != $scope.TAB_CREATED) {
                $scope.currentTab = $scope.TAB_CREATED;
                $scope.carOrderModel.status = ENUM.ORDER_STATUS.PAID;
                $scope.carOrderModel.reload();
            }
        }

        function _touchTabPaid() {
            if ($scope.currentTab != $scope.TAB_PAID) {
                $scope.currentTab = $scope.TAB_PAID;
                $scope.carOrderModel.status = ENUM.ORDER_STATUS.DELIVERING;
                $scope.carOrderModel.reload();
            }
        }

        function _touchTabDelivering() {
            if ($scope.currentTab != $scope.TAB_DELIVERING) {
                $scope.currentTab = $scope.TAB_DELIVERING;
                $scope.carOrderModel.status = ENUM.ORDER_STATUS.DELIVERIED;
                $scope.carOrderModel.reload();
            }
        }

        function _touchTabDeliveried() {
            if ($scope.currentTab != $scope.TAB_DELIVERIED) {
                $scope.currentTab = $scope.TAB_DELIVERIED;
                $scope.carOrderModel.status = ENUM.ORDER_STATUS.OVER_PROTECTION;
                $scope.carOrderModel.reload();
            }
        }

        function _touchOrder(order) {
            $state.go('car-order-detail', {
                carOrder: order.id
            });
        }

        function _touchConfirm(order) {
            API.order.confirm({
                order: order.id,
            }).then(function (order) {
                $state.go('confirm-delivery', {
                    order: order.id
                });
            });
        }

        function _touchExpress(order) {
            $scope.orderExpressModel.clear();
            $scope.orderExpressModel.order = order;

            $state.go('order-express', {
                order: order.id
            });
        }

        function _touchComment(order) {
            $state.go('order-review', {
                order: order.id
            });
        }

        function _touchPay(order) {
            if (order) {
                $scope.paymentModel.clear();
                $scope.paymentModel.order = order;
                $scope.paymentModel.isCar  = 1;
                $state.go('payment', {});
            }
        }

        function _touchCancel(order) {
            $scope.cancellingOrder = order;
            $scope.showDialog = true;
        }

        function _touchDialogCancel() {
            $scope.cancellingOrder = null;
            $scope.showDialog = false;
        }

        function _touchDialogConfirm() {
            API.order.cancel({
                order: $scope.cancellingOrder.id,
                reason: 1
            }).then(function (order) {
                $scope.carOrderModel.reload();
                $scope.cancellingOrder = null;
                $scope.showDialog = false;
            });
        }

        $scope.carOrderModel.reload();
    }

})();