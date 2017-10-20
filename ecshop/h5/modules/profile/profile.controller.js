(function () {

	'use strict';

	angular
		.module('app')
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$scope', '$http', '$rootScope', '$location', '$state', 'API', 'AppAuthenticationService', 'CartModel', 'ConfigModel'];

	function ProfileController($scope, $http, $rootScope, $location, $state, API, AppAuthenticationService, CartModel, ConfigModel) {

		$scope.touchAllOrders 		= _touchAllOrders;
		$scope.touchOrderCreated 	= _touchOrderCreated;
		$scope.touchOrderPayed 		= _touchOrderPayed;
		$scope.touchOrderDelivering = _touchOrderDelivering;
		$scope.touchOrderDelivered 	= _touchOrderDelivered;
		//车险订单	@wuwp 20170612
		$scope.touchCarAllOrders    = _touchCarAllOrders;
		$scope.touchCarOrderCreated	= _touchCarOrderCreated;
		$scope.touchCarOrderPayed	= _touchCarOrderPayed;
		$scope.touchCarOrderDelivering 	= _touchCarOrderDelivering;
		$scope.touchCarOrderDelivered 	= _touchCarOrderDelivered;

		$scope.touchFav 		= _touchFav;
		$scope.touchAddress 	= _touchAddress;
		$scope.touchScore 		= _touchScore;
		$scope.touchCashGift 	= _touchCashGift;
		$scope.touchHelps 		= _touchHelps;
		$scope.touchPassword 	= _touchPassword;
		$scope.touchSignin 		= _touchSignin;
		$scope.touchSignout 	= _touchSignout;
		$scope.touchBonus 		= _touchBonus;
		$scope.touchBalance 	= _touchBalance;
		$scope.isSignIn 		= _isSignIn;
		// 我的代金券
		$scope.touchCashCoupon 	= _touchCashCoupon;
		$scope.touchBalanceRecharge	= _touchBalanceRecharge;
		// 支付密码
		$scope.touchPayPassword	= _touchPayPassword;
		// 个人信息
		$scope.goPersonalInfo	= _goPersonalInfo;
		// 选择性别
		$scope.touchSexRadio	= _touchSexRadio;
		// 修改用户信息
		$scope.resetUser		= _resetUser;

		$scope.isWeixin  = _isWeixin;

		$scope.cartModel = CartModel;
		$scope.user = AppAuthenticationService.getUser();

		ConfigModel.fetch();

		var config = ConfigModel.getConfig();
		$scope.authorize = config.authorize;

		function _touchAllOrders() {
			$state.go('my-order', {
				tab: 'all'
			});
		}

		function _touchOrderCreated() {
			$state.go('my-order', {
				tab: 'created'
			});
		}

		function _touchOrderPayed() {
			$state.go('my-order', {
				tab: 'paid'
			});
		}

		function _touchOrderDelivering() {
			$state.go('my-order', {
				tab: 'delivering'
			});
		}

		function _touchOrderDelivered() {
			$state.go('my-order', {
				tab: 'delivered'
			});
		}

		function _touchFav() {
			$state.go('my-favorite', {});
		}

		function _touchAddress() {
			$state.go('my-address', {});
		}

		function _touchScore() {
			$state.go('my-score', {
				tab: 'all'
			});
		}

		function _touchCashGift() {
			$state.go('my-cashgift', {});
		}

		function _touchHelps() {
			$state.go('article', {});
		}

		function _touchPassword() {
			$state.go('change-password', {});
		}

		function _touchSignin() {
			if (!AppAuthenticationService.getToken()) {
				$scope.goSignin();
			}
		}

		function _touchSignout() {
			if (AppAuthenticationService.getToken()) {
				API.auth.base
					.signout()
					.then(function (success) {
						if (success) {
							$scope.goHome();
							$scope.toast('退出成功');
						} else {
							$scope.toast('退出失败');
						}
					});
			}
		}

		function _reloadUser() {
			if ( _isSignIn() ) {
				API.user.profileGet().then(function (user) {
					AppAuthenticationService.setUser(user);
					$scope.user = user;
				})
			};
		}

		function _reload() {
			_reloadUser();
			$scope.cartModel.reloadIfNeeded();
		}

		function _isWeixin() {
			return $rootScope.isWeixin();
		}

		function _touchBonus(){
			$state.go('bonus', {});
		}

		function _touchBalance(){
			$state.go('my-balance', {});
		}

		function _isSignIn(){
			return AppAuthenticationService.getToken()
		}

		_reload();

		// 我的代金券 20170608
		function _touchCashCoupon() {
			$state.go('coupon', {});
		}

		// 余额充值 20170722
        function _touchBalanceRecharge(){
			$state.go('balance-recharge', {});
		}

		// 支付密码
		function _touchPayPassword() {
			$state.go('pay-password',{});
        }
		
		//车险订单  @wuwp 20170612
        function _touchCarAllOrders() {
            $state.go('car-order', {
                tab: 'all'
            });
        }

        function _touchCarOrderCreated() {
            $state.go('car-order', {
                tab: 'created'
            });
        }

        function _touchCarOrderPayed() {
            $state.go('car-order', {
                tab: 'paid'
            });
        }

        function _touchCarOrderDelivering() {
            $state.go('car-order', {
                tab: 'delivering'
            });
        }

        function _touchCarOrderDelivered() {
            $state.go('car-order', {
                tab: 'delivered'
            });
        }
        
        // 查看个人信息
		function _goPersonalInfo() {
			$state.go('personal-info', {
			});
        }
        
        // 选择性别
		function _touchSexRadio(sex) {
			$scope.user.sex = sex;
        }
        
        // 修改用户信息
		function _resetUser() {
			var email 	= $scope.user.email;
            var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
            if(email && !emailReg.test(email)){
                $scope.toast('请填写有效的电子邮箱！');
                return;
            }
        	var params = {
				"email": email,
				"sex": $scope.user.sex
			};

			API.user.profileUpdate(JSON.stringify(params)).then(function (result) {
				console.log(result);
				if(result && result.id){
                    $scope.toast('个人信息修改成功');
                    $scope.goProfile();
				}else {
                    $scope.toast('个人信息修改失败');
				}
            })
        }
	}

})();