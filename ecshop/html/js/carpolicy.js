// 变量
var pageStart   = 0;
var pageSize    = 5;
var curentPage  = 1;
var initResult  = [];

//时间格式转换
function dateTrans(e) {
    var test        = new Date(parseInt(e) * 1000);
    var $_year      = test.getFullYear();
    var $_month     = parseInt(test.getMonth())+1;
    var $_day       = test.getDate();
    var $_f_date    =  $_year +"-"+$_month+"-"+$_day
    return $_f_date;
}

//列表
function allOrderForm(e, nowPage) {
    var bufVal      = e.content;
    pageStart       = (nowPage-1)*pageSize;
    var buffParam   = bufVal.length - (nowPage-1)*pageSize;
    var pagEnd      = (buffParam < pageSize) ? (buffParam + pageStart) : (pageStart + pageSize);
    var listHtml    = '';
    for(var i=pageStart;i<pagEnd;i++){
        listHtml +=
            '<div class="list">'+
            '<div class="tit">'+
            '<a href="/user.php?act=car_order_detail&order_id='+bufVal[i].order_id+'" >查看详情 &gt;</a>'+
            '<span>投保时间：'+ dateTrans(bufVal[i].add_time) +'</span>'+
            '<span>保单号：'+ bufVal[i].order_sn +'</span>'+
            '</div>'+
            '<ul class="con clearfix"  >'+
            '<li class="mproduct">'+
            '<h2>'+
            '<a  href="/user.php?act=car_order_detail&order_id='+bufVal[i].order_id+'" class="t">'+ bufVal[i].goods_name +'</a>'+
            '</h2>'+
            '<p>汽车品牌:'+ bufVal[i].car_brand +'</p>';
            if(bufVal[i].status == 1){
                listHtml += '<p>保单状态:处理中</p>';
            }else if(bufVal[i].status == 2){
                listHtml += '<p>保单状态:待支付</p>';
            }else if(bufVal[i].status == 3){
                listHtml += '<p>保单状态:保障中</p>';
            }else if(bufVal[i].status == 4){
                listHtml += '<p>保单状态:保障中</p>';
            }else if(bufVal[i].status == 5){
                listHtml += '<p>保单状态:已取消</p>';
            }else if(bufVal[i].status == 6){
                listHtml += '<p>保单状态:已完成</p>';
            }else{
                listHtml += '<p>保单状态:无效订单</p>';
            }
        listHtml +=
            '</li>'+
            '<li class="cname">'+
            '<p>车牌号: '+ bufVal[i].car_num +'</p>'+
            '<p>车架号: '+ bufVal[i].frame_number +'</p>'+
            '</li>'+
            '<li class="mprice">'+
            '</li>'+
            '<li class="mstutas">'+
            '</li>'+
            '<li class="mopreat">';
            if(bufVal[i].status == 1){
                listHtml += '<p><a class="mt28 rig20" id="" href="javascript:orderCancel('+bufVal[i].order_id+')">取消订单</a><p/>';
            }else if(bufVal[i].status == 2){
                listHtml += '<p class="pay-contan">'+
                    '<a id=""  href="javascript:pay_now('+bufVal[i].order_id+')" class="pay-curent">立即支付</a></p>' +
                    //'<a id="" href="javascript:orderDelete('+bufVal[i].order_id+');" class="mt28">删除</a>'+
                    '<p><a id="" href="javascript:orderCancel('+bufVal[i].order_id+')">取消订单</a><p/>';
            }else if(bufVal[i].status == 5){
                listHtml += '<p class="mt28 rig20" id="">已取消</p>';
            }else if(bufVal[i].status == 3){
                listHtml += '<p class="mt28 rig20" id="">保障中</p><a class="rig20" href="goods.php?id='+bufVal[i].goods_id+'#ECS_COMMENT">去评价</a>';
            }else if(bufVal[i].status == 4){
                listHtml += '<p class="mt28 rig20" id="">保障中</p><p class="mt28 rig20" id="">已评价</p>';
            }else if(bufVal[i].status == 6){
                listHtml += '<p class="mt28 rig20" id="">已完成</p>';
            }else {
                listHtml += '<p class="mt28 rig20" id="">无效订单<p/>';
            }
        listHtml +=  '</li>'+
            '<a href="#" target="_blank" class="alink"></a>'+
            '</ul>'+
            '</div>';
    }
    // 列表
    $('.allorder .list-order .mypolicy-lists').html(listHtml);
}
// 页脚
function allOrgerFooter(e) {
    if(e.content.length <= 0 || e == null){return;}
    var arrLength = e.content.length;
    var footerHtml = '<label>订单总数：'+arrLength+' 条，当前显示第 '+curentPage+' 页</label>';

    if(curentPage > 1){
        footerHtml += '<span class="current prev curs" onclick="toPrePage();">上一页</span>';
    }else {
        footerHtml += '<span class="current prev" onclick="toPrePage();">上一页</span>';
    }
    var leftLength,rightLength;
    if((curentPage+2)<arrLength/pageSize){
        rightLength = curentPage+2;
        if((curentPage-3)<=0) {rightLength += Math.abs(curentPage-3);}
    }else {
        rightLength = arrLength/pageSize;
    }
    if((curentPage-3)>0 ){
        leftLength  = curentPage-3;
        if((curentPage+2)>=arrLength/pageSize){
            leftLength = Math.ceil(arrLength/pageSize)-5;
        }
    }else {
        leftLength  = 0;
    }

    if(leftLength>0){
        footerHtml += '<span class="current" onclick="reAllOrderPage(1);">...</span>';
    }
    //第二页
    for(var j=0;j<(arrLength/pageSize);j++){
        if((j+1) == curentPage){
            footerHtml += '<span class="current curs" onclick="reAllOrderPage('+ (j+1) +');">'+ (j+1) +'</span>';       //这里的class 要替换掉
        }else {
            footerHtml += '<span class="current" onclick="reAllOrderPage('+ (j+1) +');">'+ (j+1) +'</span>';       //这里的class 要替换掉
        }
    }
    if(rightLength<arrLength/pageSize){
        footerHtml += '<span class="current" onclick="reAllOrderPage('+Math.ceil(arrLength/pageSize)+');">...</span>';
    }
    if(curentPage < arrLength/pageSize){
        footerHtml +=  '<span class="current next curs" onclick="toNextPage();">下一页</span>';
    }else {
        footerHtml +=  '<span class="current next" onclick="toNextPage();">下一页</span>';
    }
    $('#allorderPage').html(footerHtml);
}

// 第 N 页
function reAllOrderPage(nowPage) {
    resetCurs(nowPage);
    curentPage = nowPage;
    allOrderForm(initResult,curentPage);
    //
    allOrgerFooter(initResult);
}

//上一页
function toPrePage(){
    if((curentPage-1) < 1){return;}                                         //能否下一页 判断
    curentPage--;
    resetCurs(curentPage);
    allOrderForm(initResult,curentPage);
    //
    allOrgerFooter(initResult);
}

//下一页
function toNextPage() {
    if(curentPage > (initResult.content.length/pageSize)){return;}          //能否下一页 判断
    curentPage++;
    resetCurs(curentPage);
    allOrderForm(initResult,curentPage);
    //
    allOrgerFooter(initResult);
}

//第一页
function myPolicy(){
    Ajax.call( 'user.php?act=ajax_car_order_list',null , date_callback , 'GET', 'TEXT', true, true );
}
function date_callback(result){
    if(result == null){ return ;}
    initResult = JSON.parse(result);
    allOrderForm(initResult,curentPage);
    allOrgerFooter(initResult);
}
myPolicy();

//删除
var delOrderId;
function orderDelete(orderId) {
    $('#deleteOrder').show();
    delOrderId = orderId;
}
$('#deleteOrder .t b,#deleteOrder #button_right').on("click",function () {
    $('#deleteOrder').hide();
});

$('#deleteOrder #button_left').on("click",function () {
    Ajax.call( 'user.php?act=ajax_car_order_delete','order_id='+delOrderId , orderdelete_callback , 'GET', 'TEXT', true, true );
    $('#deleteOrder').hide();
});
function orderdelete_callback(result) {
    result = JSON.parse(result);
    myPolicy();
}
//取消
function orderCancel(orderId) {
    $('#cancelOrder').show();
    delOrderId = orderId;
}
$('#cancelOrder .t b,#cancelOrder #button_right').on("click",function () {
    $('#cancelOrder').hide();
});
$('#cancelOrder #button_left').on("click",function () {
    Ajax.call( 'user.php?act=ajax_order_cancel','order_id='+delOrderId , ordercancel_callback , 'GET', 'TEXT', true, true );
    $('#cancelOrder').hide();
});
function ordercancel_callback(result) {
    result = JSON.parse(result);
    myPolicy();
}

//添加 curs
function resetCurs(page) {
    $('.pagination-page').find('.curs').removeClass('curs');
    $('.pagination-page span:nth-child('+ (page+1)+')').addClass('curs');
}

//详情
function orderDetail(orderId) {
    window.location.href = "/user.php?act=car_order_detail&order_id="+ orderId;
}

//立即支付
function pay_now(orderId) {
    post('/user.php?act=order_buy_car',{'order_id': orderId});
}