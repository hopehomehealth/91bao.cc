(function () {

    'use strict';

    angular
        .module('app')
        .controller('ConfirmCarproductController', ConfirmCarproductController);

    ConfirmCarproductController.$inject = ['$scope', '$state', '$rootScope', '$stateParams', 'API', 'ConfirmCarproductService', 'ExpressSelectService', 'InvoiceSelectService', 'PaymentModel'];

    function ConfirmCarproductController($scope, $state, $rootScope, $stateParams, API, ConfirmCarproductService, ExpressSelectService, InvoiceSelectService, PaymentModel) {

        var orderId = '';
        $scope.touchAddress = _touchAddress;
        $scope.touchExpress = _touchExpress;
        $scope.touchInvoice = _touchInvoice;
        $scope.touchCashgift = _touchCashgift;
        $scope.touchSubmit = _touchSubmit;
        $scope.refreshScore = _refreshScore;
        $scope.refreshComment = _refreshComment;
        //返回车险订单
        $scope.backToOrderDetail = _backToOrderDetail;
        //format 是否上险
        $scope.formatIsNew = _formatIsNew;
        $scope.touchIsNewPickerCancel = _touchIsNewPickerCancel;
        $scope.touchPickerIsNew = _touchPickerIsNew;
        $scope.touchIsNewPickerShow = _touchIsNewPickerShow;
        // 是否上一年所有权转移
        $scope.formatIsTransfer = _formatIsTransfer;
        $scope.touchIsTransferPickerCancel = _touchIsTransferPickerCancel;
        $scope.touchPickerIsTransfer = _touchPickerIsTransfer;
        $scope.touchIsTransferPickerShow = _touchIsTransferPickerShow;
        //保险期限
        $scope.getDateStr = _getDateStr;
        $scope.getDateYear = _getDateYear;
        $scope.firstTime = _getDateStr(1);
        $scope.lastTime = _getDateYear(1);


        $scope.consigneeList = [];
        $scope.consignee = ConfirmCarproductService.consignee;
        $scope.invoiceType = ConfirmCarproductService.invoiceType;
        $scope.invoiceTitle = ConfirmCarproductService.invoiceTitle;
        $scope.invoiceContent = ConfirmCarproductService.invoiceContent;
        $scope.cashgift = ConfirmCarproductService.cashgift;
        $scope.express = ConfirmCarproductService.express;
        $scope.coupon = ConfirmCarproductService.coupon;
        $scope.all_discount = 0;
        //创建 product 变量,获取product对象 @wuwp 20170608
        $scope.product = ConfirmCarproductService.product;
        $scope.car_brand=null;
        $scope.car_num=null;
        $scope.card_num=null;
        $scope.card_type='1';
        $scope.drive_city=null;
        $scope.engine_number =null;
        $scope.frame_number=null;
        $scope.is_new = 0;
        $scope.is_transfer = 0;
        $scope.mobile = null;
        $scope.name = null;
        $scope.record_date =null;
        //展示Picker 弹窗
        $scope.showIsNewPicker = false;
        $scope.showIsTransferPicker = false;




        $scope.input = {
            score: 0,
            comment: ""
        };

        $scope.input.score = ConfirmCarproductService.input.score;
        $scope.input.comment = ConfirmCarproductService.input.comment;

        if($scope.input.score == 0){
            $scope.input.score = "";
        }

        $scope.rule = "";
        $scope.scoreInfo = null;
        $scope.priceInfo = {};
        $scope.canPurchase = _checkCanPurchase;
        $scope.formatPromo = _formatPromo;
        $scope.maxUseScore = 0;
        $scope.selectedGoods = [];

        if(ConfirmCarproductService.product){
            var card_good = {};
            card_good.product = ConfirmCarproductService.product;
            var attrs = ConfirmCarproductService.attrs;
            card_good.property = "";
            card_good.attrs = [];
            var product_price = parseFloat(card_good.product.current_price);

            var attrsLength = attrs.length;
            for (var i = 0; i < attrsLength; i++) {

                var propertiesLength = card_good.product.properties.length;
                for (var j = 0; j < propertiesLength; j++) {

                    var property = card_good.product.properties[j];
                    var attrsLength = property.attrs.length;
                    for (var k = 0; k < attrsLength; k++) {
                        var attrItem = property.attrs[k];
                        if (parseInt(attrItem.id) == attrs[i]) {
                            if (card_good.property.length > 0) {
                                card_good.property += "," + attrItem.attr_name;
                            } else {
                                card_good.property = attrItem.attr_name;
                            }
                            card_good.attrs.push(attrItem.id);
                            product_price += parseFloat(attrItem.attr_price);
                        }
                    }
                }
            }

            card_good.amount = ConfirmCarproductService.amount;
            card_good.price = product_price;

            $scope.selectedGoods.push(card_good);
        }
        else{
            return;
        }

        _reloadConsignee();
        _reloadScore();
        _refreshOrderPrice();

        function _touchAddress() {
            $state.go('address-select', {
                address: $scope.consignee ? $scope.consignee.id : null
            });
        }

        function _touchExpress() {

            if (!$scope.consignee) {
                $scope.toast('请选择地址');
                return;
            }

            var goodsIds = [];
            var numbers = [];
            for (var key in $scope.selectedGoods) {
                var good = $scope.selectedGoods[key];
                goodsIds.push(good.product.id);
                numbers.push(good.amount);
            }

            ExpressSelectService.clear();
            ExpressSelectService.expressId = $scope.express ? $scope.express.id : null;
            ExpressSelectService.goodsIds = goodsIds;
            ExpressSelectService.goodsNumbers = numbers;
            ExpressSelectService.region = $scope.consignee.id;

            $state.go('express-select', {});
        }

        function _touchInvoice() {
            InvoiceSelectService.clear();
            InvoiceSelectService.type = $scope.invoiceType ? $scope.invoiceType : null;
            InvoiceSelectService.title = $scope.invoiceTitle;
            InvoiceSelectService.content = $scope.invoiceContent ? $scope.invoiceContent : null;

            $state.go('invoice-select', {});
        }

        function _touchCashgift() {
            $state.go('cashgift-select', {
                cashgift: $scope.cashgift ? $scope.cashgift.id : null,
                total: $scope.priceInfo ? $scope.priceInfo.product_price : 0
            });
        }

        function _checkCanPurchase() {
            if (!$scope.selectedGoods || !$scope.selectedGoods.length)
                return false;
            if (!$scope.consignee)
                return false;
            if (!$scope.express)
                return false;

            return true;
        }

        function _formatPromo(key) {
            if (key == 'score') {
                return "积分";
            } else if (key == 'cashgift') {
                return "红包";
            } else if (key == 'preferential') {
                return "优惠金额";
            } else if (key == 'goods_reduction') {
                return "商品减免";
            } else if (key == 'order_reduction') {
                return "订单减免";
            } else if (key == 'coupon_reduction') {
                return "优惠券减免";
            } else {
                return "其他优惠";
            }
        }

        function _reloadConsignee() {
            var param = {};
            API.consignee.list(param).then(function (consignees) {

                if (consignees) {
                    $scope.consigneeList = consignees;

                    if (!$scope.consignee) {
                        for (var key in $scope.consigneeList) {
                            if ($scope.consigneeList[key].is_default) {
                                $scope.consignee = $scope.consigneeList[key];
                                $rootScope.$emit('consigneeChanged', $scope.consignee);
                            }
                        }

                        _refreshOrderPrice();
                    }

                }

            })
        }

        function _reloadScore() {

            $scope.maxUseScore = 0;

            for (var i = 0; i < $scope.selectedGoods.length; ++i) {
                $scope.maxUseScore += $scope.selectedGoods[i].product.score*$scope.selectedGoods[i].amount;
            }

            API.score.get({})
                .then(function (info) {
                    $scope.scoreInfo = info;
                })
        }

        function _refreshScore() {

            var maxScore = $scope.scoreInfo.score > $scope.maxUseScore ? $scope.maxUseScore : $scope.scoreInfo.score;

            if ($scope.input.score > maxScore) {
                $scope.input.score = maxScore;
            }

            if ($scope.input.score < 0) {
                $scope.input.score = 0;
            }

            ConfirmCarproductService.input.score = $scope.input.score;

            _refreshOrderPrice();
        }

        function _refreshComment(){
            ConfirmCarproductService.input.comment = $scope.input.comment;
        }

        function _refreshOrderPrice() {

            if (!$scope.consignee) {
                return;
            }

            var products = [];

            for (var key in $scope.selectedGoods) {
                var good = $scope.selectedGoods[key];
                var shoppingProduct = {
                    goods_id: good.product.id,
                    property: good.attrs,
                    num: good.amount,
                    total_amount: good.amount
                };
                products.push(shoppingProduct);
            }

            var params = {};
            params.order_product = JSON.stringify(products);
            if ($scope.consignee) {
                params.consignee = $scope.consignee.id;
            }

            if ($scope.express) {
                params.shipping = $scope.express.id;
            }

            if ($scope.cashgift) {
                params.cashgift = $scope.cashgift.id;
            }

            if ($scope.coupon) {
                params.coupon = $scope.coupon.id;
            }

            if ($scope.input.score) {
                params.score = $scope.input.score;
            }

            API.order
                .price(params)
                .then(function (priceInfo) {
                    if(priceInfo){
                        $scope.priceInfo = priceInfo;
                        $scope.all_discount = priceInfo.discount_price;
                        for(var promo in priceInfo.promos){
                            $scope.all_discount += parseFloat(priceInfo.promos[promo].price);
                        }
                    }

                })
        }

        function _touchSubmit() {
            var mobile          = $scope.mobile;
            var frame_number    = $scope.frame_number;
            var engine_number   = $scope.engine_number;
            var car_num         = $scope.car_num;
            var car_brand       = $scope.car_brand;

            if(!$scope.drive_city && $scope.drive_city<2){
                $scope.toast('请填写正确的城市名称');
                return;
            }
            if(!$scope.car_num && !$scope.is_new){
                $scope.toast('请填写车牌号');
                return;
            }
            var carNumReg       = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]{1}\s|[A-Z]{1})[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            if(!carNumReg.test(car_num) && !$scope.is_new){
                $scope.toast('请填写有效的车牌号');
                return false;
            }
            if(!$scope.card_num){
                $scope.toast('请填写身份证号');
                return;
            }
            var cardNumReg      = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            if(!cardNumReg.test($scope.card_num)){
                $scope.toast('请填写有效的身份证号码！');
                return false;
            }
            //出生日期判定
            var carAgeReg  = /^(\d{15}$|^\d{6}(19|2[0-9])\d{9}(\d|X|x))$/;
            if(!carAgeReg.test($scope.card_num)){
                $scope.toast('证件号码出生日期有误！');
                return false;
            }
            if(!$scope.mobile){
                $scope.toast('请填写手机号');
                return;
            }
            var mobileReg       = /^1[34578]\d{9}$/;
            if(!mobileReg.test(mobile)){
                $scope.toast('请填写有效的手机号码');
                return false;
            }
            if(!$scope.frame_number){
                $scope.toast('请填写车架号');
                return;
            }
            if(frame_number.length < 17){
                $scope.toast('车架号一般长度为17位');
                return;
            }
            if(!$scope.engine_number){
                $scope.toast('请填写发动机号');
                return;
            }
            if(engine_number.length < 4){
                $scope.toast('发动机号长度不小于4位');
                return;
            }
            if(!$scope.car_brand){
                $scope.toast('请填写品牌型号');
                return;
            }
            if(!$scope.record_date){
                $scope.toast('请填写注册登记日期-格式:2017-01-01');
                return;
            }
            var recordReg = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
            if(!recordReg.test($scope.record_date)){
                $scope.toast('注册登记日期格式:2017-01-01');
                return;
            }

            var params = {};
            params.goods_id     = $scope.product.id;
            // params.name         = $scope.consignee.name;
            params.drive_city   = $scope.drive_city;
            params.car_num      = $scope.car_num;
            params.card_type    = '1';
            params.card_num     = $scope.card_num;
            params.mobile       = $scope.mobile;
            params.frame_number = $scope.frame_number;
            params.engine_number= $scope.engine_number;
            params.car_brand    = $scope.car_brand;
            params.record_date  = $scope.record_date;
            params.is_new       = ($scope.is_new == null) ? '0' : $scope.is_new;
            params.is_transfer  = ($scope.is_transfer);

            API.product.purchaseCar(params)
                .then(function (order) {
                    if (order) {
                        ConfirmCarproductService.clear();
                        ExpressSelectService.clear();
                        PaymentModel.clear();
                        PaymentModel.order = order;
                        PaymentModel.isCar  = 1;
                        $state.go('car-order-detail', {
                            carOrder: order.id
                        });
                    }
                });
        }

        //添加一个查看订单详情的方法  @wuwp 20170607
        //参数 afterPay 表示 订单详情页 是否跳转到主页
        function _backToOrderDetail(orderId) {
            $state.go('order-detail', {
                order: orderId,
                afterPay: '1'
            });
        }

        //格式化是否上险
        function _formatIsNew(isNew) {
            var isNewName           = (isNew=='1') ? '是' : '否';
            return isNewName;
        }
        //打开 是否上险 窗口
        function _touchIsNewPickerShow() {
            $scope.showIsNewPicker  = true;
        }
        //关闭 是否上险 窗口
        function _touchIsNewPickerCancel() {
            $scope.showIsNewPicker  = false;
        }
        //选择 是否上险
        function _touchPickerIsNew(isNew) {
            $scope.is_new = isNew;
            $scope.showIsNewPicker  = false;
        }

        //格式化是否所有权转移
        function _formatIsTransfer(isTransfer) {
            var isTransferName      = (isTransfer=='1') ? '是' : '否';
            return isTransferName;
        }
        //打开 是否所有权转移 窗口
        function _touchIsTransferPickerShow() {
            $scope.showIsTransferPicker = true;
        }
        //关闭 是否所有权转移 窗口
        function _touchIsTransferPickerCancel() {
            $scope.showIsTransferPicker = false;
        }
        //选择 是否
        function _touchPickerIsTransfer(isTransfer) {
            $scope.is_transfer = isTransfer;
            $scope.showIsTransferPicker = false;
        }

        //保险期限
        function _getDateStr(AddDayCount) {
            var dd  = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y   = dd.getFullYear();
            var m   = dd.getMonth()+1;//获取当前月份的日期
            var d   = dd.getDate();
            return y+"年"+m+"月"+d+"日0时";
        }
        function _getDateYear(addYear) {
            var dd  = new Date();
            // dd.setDate(dd.getDate());
            var y   = dd.getFullYear()+addYear;
            var m   = dd.getMonth()+1;//获取当前月份的日期
            var d   = dd.getDate();
            return y+"年"+m+"月"+d+"日24时";
        }

    }

})();