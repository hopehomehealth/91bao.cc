(function () {

	'use strict';

	angular
		.module('app')
		.controller('PaymentSuccessController', PaymentSuccessController);

	PaymentSuccessController.$inject = ['$scope', '$http', '$location', '$state', '$stateParams', 'PaymentModel'];

	function PaymentSuccessController($scope, $http, $location, $state, $stateParams,PaymentModel) {

		var orderId = $stateParams.order;
        $scope.paymentModel = PaymentModel;

		$scope.touchDetail = function () {
			var isCar = $scope.paymentModel.isCar;
            if(!isCar){//普通险
                $state.go('order-detail', {order: orderId,afterPay: '1'});
            }else {//车险
                $state.go('car-order-detail',{carOrder: orderId,afterSubmit: '1'});
            }
            $scope.paymentModel.isCar=0;
		}
	}

})();