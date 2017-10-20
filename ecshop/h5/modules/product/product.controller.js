(function () {

  'use strict';

  angular
  .module('app')
  .controller('ProductController', ProductController);

  ProductController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'AppAuthenticationService', 'ConfirmProductService','ConfirmCarproductService','ProductInformService', 'CartModel','ConfigModel'];

  function ProductController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, AppAuthenticationService, ConfirmProductService,ConfirmCarproductService, ProductInformService, CartModel,ConfigModel) {

      var MAX_COMMENTS = 3;

      var productId = $stateParams.product;

      $scope.currentStock = null; //当前库存
      $scope.currentAttrs = [];   //单选属性
      $scope.currentSelectedPrice = 0;   //单选属性
      $scope.input = {
          currentAmount: 1
      };

      $scope.optionalAttrs = []; //多选属性
      $scope.canPurchase = false;//是否可以购买

      $scope.product = null;
      $scope.comments = [];

      $scope.cartModel = CartModel;

      //添加notice 变量  @wuwp 20170606
      $scope.notices = [];
      $scope.msgPicker = false;
      $scope.msgPickerClose = _msgPickerClose;
      $scope.msgPickerShow = _msgPickerShow;
      $scope.isPushCar = false;                 //判断是  立即购买 或 是加入购物车
      $scope.proudtInform = _proudtInform;        //打开 告知 页面

      $scope.touchAmountSub = _touchAmountSub;
      $scope.touchAmountAdd = _touchAmountAdd;
      $scope.touchAttr = _touchAttr;
      $scope.touchLike = _touchLike;
      $scope.touchComments = _touchComments;
      $scope.touchComment = _touchComment;
      $scope.touchCart = _touchCart;
      $scope.touchAddCart = _touchAddCart;
      $scope.touchPurchase = _touchPurchase;
      $scope.refreshAmount = _refreshAmount;

      $scope.formatGrade = _formatGrade;
      $scope.isAttrSelected = _isAttrSelected;
      //商品类型20170705
      $scope.isComboSelected    = _isComboSelected;
      $scope.touchCombo         = _touchCombo;
      $scope.comboIndex         = 0;

      $scope.isLoading = false;
      $scope.isLoaded = false;

      function _touchAmountSub() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;
        }

        var amount = parseInt($scope.input.currentAmount);
        if ( amount <= 1 ){
            $scope.toast('受不了了，宝贝不能再少了');
            return;
        }

          $scope.input.currentAmount = '' + (amount - 1);
      }

      function _refreshAmount(){

          var amount = parseInt($scope.input.currentAmount);
          if (amount < 1) {
              $scope.input.currentAmount = 1+"";
          }

      }

      function _touchAmountAdd() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;

          var amount = parseInt($scope.input.currentAmount);
          var stock = parseInt($scope.currentStock.stock_number);
          if ( amount >= stock )
            return;

            $scope.input.currentAmount = '' + (amount + 1);
        } else {
          var amount = parseInt($scope.input.currentAmount);
          var stock = $scope.product.good_stock;
          if ( amount >= stock )
            return;

            $scope.input.currentAmount = '' + (amount + 1);
        }

      }

      function _touchAttr( property, attr ) {
        if ( !$scope.product )
          return;
        // if (attr.attr_price ==0 && attr.attr_name == '3个月'){
        //     $state.go('product', {
        //         product: 3,
        //     });
        // }else if(attr.attr_price ==0 && attr.attr_name == '1年'){
        //     $state.go('product', {
        //         product: 16,
        //     });
        // }
        var product = $scope.product;
        if ( attr.is_multiselect ) {
          var attrs = [].concat( $scope.optionalAttrs );
          var index = attrs.indexOf( attr.id );
          if ( -1 == index ) {
            attrs.push( attr.id );
          } else {
            attrs.splice( index, 1 );
          }
          $scope.optionalAttrs = attrs;
          _refreshPrice();
        } else {
          var stock = null;
          var attrs = [].concat( $scope.currentAttrs );
          var index = attrs.indexOf( attr.id );

          attrs.push( attr.id );

          for ( var i in property.attrs ) {
            if ( property.attrs[i].id != attr.id ) {
              var index = attrs.indexOf( property.attrs[i].id );
              if ( -1 != index ) {
                attrs.splice( index, 1 );
              }
            }
          }

          attrs = attrs.filter(function( attr, index, self ){
            return self.indexOf(attr) === index;
          });

          attrs.sort(function(a, b){
            return a - b;
          })

          if ( attrs.length ) {
            var key = attrs.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {
              var goods_attr = product.stock[i].goods_attr;
              var goods_attr_array =  goods_attr.split("|");

              goods_attr_array.sort(function(a, b){
                return a - b;
              })

              var goods_attr_str = goods_attr_array.join('|');

              if ( goods_attr_str == key ) {
                stock = product.stock[i];
                break;
              }
            }
          }

          $scope.currentAttrs = attrs;
          $scope.currentStock = stock;
          $scope.canPurchase = _checkCanPurchase();
          _refreshPrice();
        }
      }

      function _touchComments() {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchComment( comment ) {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchCart() {

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        $state.go('cart-select', {});
      }

      function _touchLike(){

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        if ( $scope.product.is_liked ) {
            $scope.product.is_liked = false;
            API.product
            .unlike({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('取消收藏');
            }, function(error){
              $scope.product.is_liked = true;
            });
        } else {
            $scope.product.is_liked = true;
            API.product
            .like({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('收藏成功');
            }, function(error){
              $scope.product.is_liked = false;
            });
        }
      }

      function _touchAddCart() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = $scope.input.currentAmount;

        CartModel
        .add(productId, attrs, amount)
        .then(function(succeed){
            if ( succeed ) {
              $scope.toast('已添加到购物车');
            }
        });
      }

      function _touchPurchase() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var product = $scope.product;
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = $scope.input.currentAmount;

        // ConfirmProductService.clear();
        // ConfirmProductService.product = product;
        // ConfirmProductService.attrs = attrs;
        // ConfirmProductService.amount = amount;
        //$state.go('confirm-product', {});

        //普通险，车险判断 @wuwp 20170607
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

      }

      function _refreshPrice(){
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);

          $scope.currentSelectedPrice = parseInt($scope.product.current_price);

          for ( var i = 0; i < $scope.product.properties.length; ++i ) {
            var property = $scope.product.properties[i];

            for ( var j in property.attrs ) {              
                var index = attrs.indexOf( property.attrs[j].id );
                if ( -1 != index && property.attrs[j].attr_price)  {
                    $scope.currentSelectedPrice += parseInt(property.attrs[j].attr_price);
                }              
            }
          }

      }
      function _checkCanPurchase() {
        var product = $scope.product;
        var required = false;

        if ( !product || !product.good_stock )
          return false;

        for ( var i in  product.properties ) {
          if ( !product.properties[i].is_multiselect ) {
            required = true;
            break;
          }
        }

        if ( required ) {
          if ( !$scope.currentAttrs || !$scope.currentAttrs.length ) {
            return false;
          }
          // if ( !$scope.currentStock ) {
          //   return false;
          // }
        }

        return true;
      }

      function _formatGrade( grade ) {
        if ( ENUM.REVIEW_GRADE.BAD == grade ) {
          return '差评';
        } else if ( ENUM.REVIEW_GRADE.MEDIUM == grade ) {
          return '中评';
        } else if ( ENUM.REVIEW_GRADE.GOOD == grade ) {
          return '好评';
        }
        return '中评';
      }

      function _isAttrSelected( attr ) {
        if ( attr.is_multiselect ) {
          return $scope.optionalAttrs.indexOf(attr.id) == -1 ? false : true;
        } else {
          return $scope.currentAttrs.indexOf(attr.id) == -1 ? false : true;
        }
      }
      //商品类型是否选中
      function _isComboSelected(combo) {
          if($scope.product.combo.indexOf(combo) == $scope.comboIndex){
            return true;
          }else {
              return false;
          }
      }
      //商品类型选择
      function _touchCombo(combo) {
          $scope.comboIndex = $scope.product.combo.indexOf(combo);

          var currentIndex = [];
          for(var k=0;k<$scope.product.properties.length;k++){
              for ( var j in $scope.product.properties[k].attrs ) {
                  if($scope.product.properties[k].attrs[j].id == $scope.currentAttrs[k]){
                      currentIndex.push(j);
                  }
              }
          }
              API.product
              .get({product:combo.goods_id})
              .then(function (product) {
                  $scope.product.properties     = product.properties;
                  $scope.product.current_price  = product.current_price;
                  $scope.product.id  = product.id;

                  var defaultAttrIds = [];
                  for(var i=0;i<currentIndex.length;i++){
                      defaultAttrIds.push($scope.product.properties[i].attrs[currentIndex[i]].id);
                  }
                  $scope.currentAttrs = defaultAttrIds;

                  _refreshPrice();
              })
      }

      function _reloadProduct() {
        $scope.isLoading = true;
        API.product
        .get({product:productId})
        .then(function(product){

          product.properties.sort(function(a, b){
            return a.is_multiselect - b.is_multiselect;
          })

          $scope.product = product;
          // 将JSON 字符串格式化
          for(var i=0;i<$scope.product.combo.length;i++){
              $scope.product.combo[i].content = JSON.parse($scope.product.combo[i].content);
          }
          //// 改变量notice 赋值
          $scope.notices = product.notice;

          $scope.isLoaded = true;
          $scope.isLoading = false;
          $scope.canPurchase = _checkCanPurchase();

          ConfigModel.fetch().then(function(){
            var config = ConfigModel.getConfig();
            var wechat = config['wxpay.web'];
            _initConfig(wechat,product.share_url);
                  return true;
          });

          if ( product.photos && product.photos.length > 1 ) {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 1500,
                    autoplayDisableOnInteraction: false,
                    loop: true
                });
            }, 1 );
          } else {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: false,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 0,
                    autoplayDisableOnInteraction: false,
                    loop: false
                });
            }, 1 );
          }

          var defaultAttrIds = [];
          var defaultAttrStock = null;

          for ( var i = 0; i < product.properties.length; ++i ) {
            var property = product.properties[i];
            if ( !property.is_multiselect ) {
              defaultAttrIds.push( property.attrs[0].id );
            }
          }

          defaultAttrIds.sort(function(a, b){
            return a - b;
          })

          if ( defaultAttrIds.length ) {
            var stockSelector = defaultAttrIds.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {

              var goods_attr = product.stock[i].goods_attr;
              var goods_attr_array =  goods_attr.split("|");

              goods_attr_array.sort(function(a, b){
                return a - b;
              })

             var goods_attr_str = goods_attr_array.join('|');
              if ( goods_attr_str == stockSelector ) {
                defaultAttrStock = product.stock[i];
                break;
              }
            }
          }
          

          $scope.currentAttrs = defaultAttrIds;
          $scope.currentStock = defaultAttrStock;
          $scope.canPurchase = _checkCanPurchase();
          _refreshPrice();
          _reloadComments();
        });
      }

      function _initConfig(wechat,url){

        if(!AppAuthenticationService.getToken()){
                return;
            }

                if ( !wechat ) {
                    return;
                };

                wx.config({
                    debug: GLOBAL_CONFIG.DEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechat.app_id, // 必填，公众号的唯一标识
                    timestamp: wechat.timestamp, // 必填，生成签名的时间戳
                    nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
                    signature: wechat.signature,// 必填，签名，见附录1
                    jsApiList: ['chooseWXPay',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                var shared_link = url;

                wx.ready( function() {
                    wx.onMenuShareTimeline({
                        title: '商品详情', // 分享标题
                        desc:'',
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: '商品详情', // 分享标题
                        desc:'',
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: '商品详情', // 分享标题
                        desc: '', // 分享描述
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: '商品详情', // 分享标题
                        desc: '', // 分享描述
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                });

                wx.error(function(res){
                    if(GLOBAL_CONFIG.DEBUG){
                        $rootScope.toast(JSON.stringify(res));
                    }
                });

    }

      function _reloadComments() {
        if ( !$scope.product )
          return;

        API.review
        .productList({
            product:productId,
            grade:ENUM.REVIEW_GRADE.ALL,
            page:1,
            per_page:MAX_COMMENTS
        }).then(function(comments){
            $scope.comments = comments;
        });
      }

      function _reload() {
        _reloadProduct();
      }

      //关闭窗口 @wuwp 20170606
      function _msgPickerClose() {
          $scope.msgPicker = false;
      }
      //打开窗口 @wuwp 20170606
      function _msgPickerShow(isPushCar) {
          $scope.isPushCar = isPushCar;
          $scope.msgPicker = true;
      }

      //打开告知
      function _proudtInform() {

          var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
          ConfirmProductService.attrs = attrs;
          $state.go('product-inform', { product: productId,isPushCar:0});
      }

      _reload();
  }

})();
