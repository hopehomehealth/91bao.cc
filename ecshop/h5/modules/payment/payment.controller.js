(function () {

	'use strict';

	angular
		.module('app')
		.controller('PaymentController', PaymentController);

	PaymentController.$inject = ['$scope', '$http', '$location', '$state', '$rootScope', '$timeout', '$stateParams', 'API', 'ENUM', 'PaymentModel','ConfirmProductService'];

	function PaymentController($scope, $http, $location, $state, $rootScope, $timeout, $stateParams, API, ENUM, PaymentModel,ConfirmProductService) {

		if (!PaymentModel.order) {
			$timeout(function () {
				$rootScope.goHome();
			}, 1);
			return;
		}

		$scope.selectedType = null;
		$scope.paymentModel = PaymentModel;

		$scope.isSelected = _isSelected;
		$scope.touchSelect = _touchSelect;
		$scope.touchSubmit = _touchSubmit;
		$scope.touchDetail = _touchDetail;

		//返回订单列表
		$scope.backOrder	= _backOrder;


		function _isSelected(type) {
			if (!$scope.selectedType) {
				return false;
			}
			if (type.code == $scope.selectedType.code) {
				return true;
			}
			return false;
		}

		function _touchSelect(type) {
			$scope.selectedType = type;
		}

		function _touchSubmit() {
			if (!$scope.selectedType) {
				$scope.toast('请选择支持方式');
				return;
			}

			switch ($scope.selectedType.code) {
			case 'alipay.app':
            {
                $state.go('alipay-wap', {
                    order: PaymentModel.order.id
                });
                // $scope.toast('暂不支持支付宝支付');
                break;
            }
			case 'alipay.wap':
				{
					$state.go('alipay-wap', {
						order: PaymentModel.order.id
					});
					// $scope.toast('暂不支持支付宝支付');
					break;
				}
			case 'wxpay.app':
			case 'wxpay.web':
				{
					if ($rootScope.isWeixin()) {
						$state.go('wechat-pay', {
							order: PaymentModel.order.id
						});
					} else {
						$scope.toast('暂不支持此方式');
					}

					break;
				}
			case 'unionpay.app':
				{
					$scope.toast('暂不支持此方式');
					break;
				}

			case 'teegon.wap':
			{
				$state.go('teegon', {
					order: PaymentModel.order.id
				});
				break;
			}

			// 余额支付 20170607
			case 'balance':
			{
                $state.go('balance', {
                	order: PaymentModel.order.id,
					code: $scope.selectedType.code
                });
				break;
			}
			// 聚合富支付
            // case 'alipay':
			// {
             //    $state.go('alipay-wap', {
             //        order: PaymentModel.order.id,
             //        code: $scope.selectedType.code,
			// 		pay_type: 'alipay'
             //    });
                // break;
                // var href = $state.href('alipay-wap', {order: PaymentModel.order.id});
                // window.open(href, '_blank');
             //    break;
			// }
             //    case 'wx':
             //    {
             //        $state.go('alipay-wap', {
             //            order: PaymentModel.order.id,
             //            code: $scope.selectedType.code,
             //            pay_type: 'wx'
             //        });
             //        // break;
             //        // var href = $state.href('alipay-wap', {order: PaymentModel.order.id});
             //        // window.open(href, '_blank');
             //        break;
             //    }



			default:
				{
					$scope.toast('暂不支持此方式');
					break;
				}
			}
		}

		function _touchDetail() {
			$state.go('order-detail', {
				order: $scope.paymentModel.order.id
			});
		}

		function _reload() {
			$scope.paymentModel
				.reload()
				.then(function (succeed) {
					if (succeed) {
						
					}
				});
		}

		//返回订单列表
		function _backOrder() {
			var isCar = $scope.paymentModel.isCar;
			if(!isCar){//普通险
                $state.go('my-order', {tab: 'created',isNoPay:1});
			}else {//车险
                $state.go('car-order',{tab: 'created',isNoPay:1});
			}
            $scope.paymentModel.isCar=0;
        }
		
		_reload();
	}

})();