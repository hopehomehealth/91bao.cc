(function () {

	'use strict';

	angular
		.module('app')
		.controller('AddressEditController', AddressEditController);

	AddressEditController.$inject = ['$scope', '$http','API', '$location', '$q', '$window', '$state', '$stateParams', 'AddressEditModel'];

	function AddressEditController($scope, $http,API, $location, $q, $window, $state, $stateParams, AddressEditModel) {

		$scope.touchSave = _touchSave;
		$scope.touchSetDefault = _touchSetDefault;
		$scope.touchPickerShow = _touchPickerShow;
		$scope.touchPickerRegion = _touchPickerRegion;
		$scope.touchPickerCancel = _touchPickerCancel;
		$scope.formatRegions = _formatRegions;
		$scope.touchDelete = _touchDelete;
		$scope.touchCancel = _touchCancel;
        $scope.touchDialogCancel = _touchDialogCancel;
        $scope.touchDialogConfirm = _touchDialogConfirm;
        //添加性别的方法	@wuwp 20170605
        $scope.touchSexPickerShow = _touchSexPickerShow;
        $scope.touchSexPickerCancel = _touchSexPickerCancel;
		$scope.touchPickerSex = _touchPickerSex;
		$scope.formatSex = _formatSex;
		//radio sex
		$scope.touchSexRadio	= _touchSexRadio;

		//身份证方法  @wuwp 20170605
        $scope.touchCardTypePickerShow = _touchCardTypePickerShow;
        $scope.touchCardTypePickerCancel = _touchCardTypePickerCancel;
        $scope.touchPickerCardType = _touchPickerCardType;
        $scope.formatCardType = _formatCardType;

		$scope.showPicker = false;
		$scope.pickerData = [];
		$scope.pickerRegions = [];
		$scope.pickerRegionName = null;

        //注册性别Picker
        $scope.showSexPicker = false;
        $scope.pickerSexName = null;
        //注册身份证Picker
		$scope.showCardTypePicker = false;
		$scope.pickerCardTypeName = null;
		$scope.addressEditModel = AddressEditModel;
		// 提示信息
        $scope.showDialog = false;


		var consignee = $scope.addressEditModel.consignee;
		if (consignee && consignee.id) {
			$scope.name = consignee.name;
			$scope.mobile = consignee.mobile;
			$scope.regions = consignee.regions;
			$scope.address = consignee.address;
			$scope.isDefault = consignee.is_default;
			//添加参数	@wuwp 20170605
			$scope.card_type = consignee.card_type;
			$scope.card_num = consignee.card_num;
			$scope.sex = consignee.sex;
			$scope.email = consignee.email;
			$scope.zip_code = consignee.zip_code;
		}

		function _touchCancel(){
			$scope.goBack();
		}

		function _touchSave() {
			var name = $scope.name;
			var mobile = $scope.mobile;
			var address = $scope.address;
			var regions = $scope.regions;
			//新增的变量
			var card_type = $scope.card_type;
			var card_num = $scope.card_num;
			var sex = $scope.sex;
			var email = $scope.email;
			var zip_code = $scope.zip_code;

			if (!name) {
				$scope.toast('请填写姓名');
				return;
			}
            if(name<2||name>18){
				$scope.toast('请填写有效姓名');
				return;
			}
			if (!mobile) {
				$scope.toast('请填写手机号码');
				return;
			}

            // var mobileReg = /^1[3-8][0-9]\d{4,8}$/;
            var mobileReg = /^1[34578]\d{9}$/;
            if(!mobileReg.test(mobile)){
                $scope.toast('请填写有效的手机号码！');
                return false;
            }

			/*  添加验证 card_type, card_num, sex, email, zip_code ----START-----*/
            if (!card_type || card_type==null) {
                $scope.card_type = '1';
                return;
            }
            if (!card_num) {
                $scope.toast('请填写证件号码');
                return;
            }
            var cardNumReg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            if(!cardNumReg.test(card_num)){
                $scope.toast('请填写有效的证件号码！');
                return false;
            }
            //出生日期判定
	    var carAgeReg  = /^(\d{15}$|^\d{6}(19|2[0-9])\d{9}(\d|X|x))$/;
            if(!carAgeReg.test(card_num)){
                $scope.toast('证件号码出生日期有误！');
                return false;
            }

            if (sex == null) {
                $scope.toast('请选择性别');
                return;
            }
            if (!email) {
                $scope.toast('请填写电子邮箱');
                return;
            }
            var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
            if(!emailReg.test(email)){
                $scope.toast('请填写有效的电子邮箱！');
                return;
            }
			if(zip_code && zip_code.length != 6){
				$scope.toast('邮政编码为6位');
				return;
			}
			var zip_codeReg = /^[1-9]\d{5}(?!\d)$/;
			if(zip_code && !zip_codeReg.test(zip_code)){
                $scope.toast('邮政编码有误');
                return;
			}

			/* 添加部分 -----END-----*/

            if (!regions || !regions.length) {
                $scope.toast('请选择地区');
                return;
            }

            var lastRegion = regions[regions.length - 1];
            if (!lastRegion) {
                $scope.toast('请选择地区');
                return;
            }

            if (!address || address.length < 1) {
                $scope.toast('请填写地址');
                return;
            }

            $scope.addressEditModel
				// .save(name, mobile, lastRegion.id, address)
				.save(name, mobile, lastRegion.id, address, card_type, card_num, sex, email, zip_code)
				.then(function (consignee) {
					if(consignee && consignee.id){
						$scope.toast('保存成功');
						$scope.goBack();
					}
				})
		}

		function _touchSetDefault() {
			$scope.isDefault = !$scope.isDefault;
		}

        //显示删除提示框
        function _touchDelete(order) {
            $scope.showDialog = true;
        }

        function _touchDialogCancel() {
            $scope.showDialog = false;
        }

        function _touchDialogConfirm(){
			var params = {};
			params.consignee = $scope.addressEditModel.consignee.id;
			API.consignee
				.delete(params)
				.then(function (res) {
					if(res){
						$scope.toast('删除成功');
						$scope.goBack();
					}
					else{
						$scope.toast('删除失败');
					}

				});
		}



        function _touchPickerShow() {
			$scope.pickerData = [];
			$scope.pickerRegions = [];
			$scope.pickerRegionName = null;

			$scope.showPicker = true;

			$scope.addressEditModel
				.reloadIfNeeded()
				.then(function (success) {
					if (success) {
						$scope.pickerData = $scope.addressEditModel.regions;
					} else {
						$scope.toast('请稍后再试');
						$scope.touchPickerCancel();
					}
				});
		}

		function _touchPickerRegion(region) {
			$scope.pickerRegions.push(region);
			$scope.pickerRegionName = _formatRegions($scope.pickerRegions);

			if (region.regions && region.regions.length) {
				$scope.pickerData = region.regions;
			} else {
				$scope.regions = $scope.pickerRegions;
				$scope.showPicker = false;
			}
		}

		function _touchPickerCancel() {
			$scope.showPicker = false;

			$scope.pickerData = [];
			$scope.pickerRegions = [];
			$scope.pickerRegionName = null;
		}

		function _formatRegions(regions) {
			var address = '';

			for (var i = 0; i < regions.length; ++i) {
				address += regions[i].name;
				address += ' ';
			}

			return address;
		}

        //打开sex选择窗口	@wuwp 20170605
        function _touchSexPickerShow() {
            $scope.showSexPicker = true;
            $scope.pickerSexName = null;
        }

        function _touchPickerSex(sex) {
            $scope.pickerSexName = _formatSex(sex);
            $scope.sex = sex;
            $scope.showSexPicker = false;
        }

        function _touchSexPickerCancel(){
            $scope.showSexPicker = false;
            $scope.pickerSexName = null;
        }

        function _formatSex(sex) {
            var sexNam = (sex == '0') ? '女' : '男';
            return sexNam;
        }

        //sex 选择
		function _touchSexRadio(sex) {
			$scope.sex = sex;
        }

        //打开身份证号选择窗口	@wuwp 20170605
        function _touchCardTypePickerShow() {
            $scope.showCardTypePicker = true;
            $scope.pickerCardTypeName = null;
        }

        function _touchPickerCardType(cardType) {
            $scope.pickerCardTypeName = _formatCardType(cardType);
            $scope.card_type = cardType;
            $scope.showCardTypePicker = false;
        }

        function _touchCardTypePickerCancel(){
            $scope.showCardTypePicker = false;
            $scope.pickerCardTypeName = null;
        }

        function _formatCardType(cardType) {
            var cardTypeNam = (cardType=='1') ? '身份证': '身份证';
            return cardTypeNam;
        }

	}

})();