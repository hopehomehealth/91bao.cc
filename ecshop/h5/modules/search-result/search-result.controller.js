(function () {

	'use strict';

	angular
		.module('app')
		.controller('SearchResultController', SearchResultController);

	SearchResultController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM'];

	function SearchResultController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM) {

		var PER_PAGE = 10;

		$scope.currentSortKey = $stateParams.sortKey ? $stateParams.sortKey : ENUM.SORT_KEY.DEFAULT;
		$scope.currentSortValue = $stateParams.sortValue ? $stateParams.sortValue : ENUM.SORT_KEY.DESC;
		$scope.currentKeyword = $stateParams.keyword ?$stateParams.keyword:null;
		$scope.currentCategory = $stateParams.category;

		$scope.navTitle = $stateParams.navTitle;
		$scope.navStyle = $stateParams.navStyle;

		if (!$scope.navStyle) {
			$scope.navStyle = 'default';
		}

		$scope.products = null;

		$scope.touchSearch = _touchSearch;
		$scope.touchSortDefault = _touchSortDefault;
		$scope.touchSortSale = _touchSortSale;
		$scope.touchSortDate = _touchSortDate;
		$scope.touchSortPrice = _touchSortPrice;
		$scope.touchSortCredit = _touchSortCredit;
		$scope.touchProduct = _touchProduct;
		$scope.loadMore = _loadMore;
		//添加 商品类获取的方法
        $scope.subCategories = [];
        // $scope.subCategories1 = [];
		$scope.reloadCategories = _reloadCategories;
        $scope.touchMain = _touchMain;
        $scope.toNextTab = _toNextTab;


        $scope.isEmpty = false;
		$scope.isLoaded = false;
		$scope.isLoading = false;
		$scope.isLastPage = false;
		//shell
		$scope.isHell = false;

		function _touchSearch() {
			_reload();
		}

		function _touchSortDefault() {
			var key = ENUM.SORT_KEY.DEFAULT;
			var val = ENUM.SORT_VALUE.DEFAULT;
			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchSortSale() {
			var key = ENUM.SORT_KEY.SALE;
			var val = ENUM.SORT_VALUE.DESC;
			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchSortDate() {
			var key = ENUM.SORT_KEY.DATE;
			var val = ENUM.SORT_VALUE.DESC;
			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchSortPrice() {
			var key = ENUM.SORT_KEY.PRICE;
			var val = ENUM.SORT_VALUE.DESC;

			if ($scope.currentSortKey == ENUM.SORT_KEY.PRICE) {
				if ($scope.currentSortValue == ENUM.SORT_VALUE.DEFAULT || $scope.currentSortValue == ENUM.SORT_VALUE.ASC) {
					key = ENUM.SORT_KEY.PRICE;
					val = ENUM.SORT_VALUE.DESC;
				} else {
					key = ENUM.SORT_KEY.PRICE;
					val = ENUM.SORT_VALUE.ASC;
				}
			} else {
				key = ENUM.SORT_KEY.PRICE;
				val = ENUM.SORT_VALUE.DESC;
			}

			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchSortCredit() {
			var key = ENUM.SORT_KEY.CREDIT;
			var val = ENUM.SORT_VALUE.DESC;
			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchProduct(product) {
            var ngTimstemp = new Date().getTime();
            var diffTemp = ngTimstemp - indexTimstamp;
            if(diffTemp < 400){
                return false;
            }
			$state.go('product', {
				product: product.id
			});
		}

		function _reload() {
			if ($scope.isLoading)
				return;

			$scope.products = null;
			$scope.isEmpty = false;
			$scope.isLoaded = false;

			_fetch(1, PER_PAGE);
		}

		function _loadMore() {
			if ($scope.isLoading)
				return;
			if ($scope.isLastPage)
				return;

			if ($scope.products && $scope.products.length) {
				_fetch(($scope.products.length / PER_PAGE) + 1, PER_PAGE);
			} else {
				_fetch(1, PER_PAGE);
			}
		}

		function _fetch(page, perPage) {
			$scope.isLoading = true;

			var params = {};

			if($scope.currentCategory){
				params.category = $scope.currentCategory;
			}

			if($scope.currentKeyword){
				params.keyword = $scope.currentKeyword;
			}

			params.sort_key = $scope.currentSortKey;
			params.sort_value = $scope.currentSortValue;
			params.page = page;
			params.per_page = perPage;

			API.product.list(params).then(function (products) {
				$scope.products = $scope.products ? $scope.products.concat(products) : products;
				$scope.isEmpty = ($scope.products && $scope.products.length) ? false : true;
				$scope.isLoaded = true;
				$scope.isLoading = false;
				$scope.isLastPage = (products && products.length < perPage) ? !$scope.isEmpty : false;
			});
		}

		_reload();
        //添加 商品类获取的方法
        _reloadCategories();
        function _reloadCategories(){
            API.category
                .list({
                    page: 1,
                    per_page: PER_PAGE
                })
                .then(function (categories) {
                    if (categories && categories.length) {
                        $scope.subCategories = categories;
						// if(categories.length<=4){
                        	// $scope.subCategories = categories;
						// }else{
                         //    for(var i=0;i<4;i++){
                         //        $scope.subCategories.push(categories[i]);
                         //    }
                         //    for(var j=4;j<categories.length;j++){
                         //        $scope.subCategories1.push(categories[j]);
                         //    }
						// }
                    } else {
                        $scope.subCategories = null;
                    }
                });
		}
		//点击 险种
		function _touchMain(main) {
            $state.go('search-result', {
                sortKey: ENUM.SORT_KEY.DEFAULT,
                sortValue: ENUM.SORT_VALUE.DEFAULT,
                keyword: null,
                category: main.id,
                navTitle: main.name,
                navStyle: 'default'
            });
        }
        //下一个Tab
        function _toNextTab(){
            $scope.isHell = !$scope.isHell;
		}
	}

})();