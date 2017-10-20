// alert(jQuery.fn.jquery);
//获取表单数据
function getParams() {
    var name                = $('#name').val();
    var drive_city          = $('#drive-city').val();
    var verification_code   = $('#verification-code').val();
    var car_num             = $('#car-num').val();
    var frame_number        = $('#frame-number').val();
    var card_num            = $('#card-num').val();
    var engine_number       = $('#engine-number').val();
    var car_birthday        = $('#car-birthday').val();
    var car_brand           = $('#car-brand').val();
    var mobile              = $('#mobile').val();
    var record_date         = $('#record-date').val();
    var is_new              = $(":radio[name='is-new'][checked]").val();
    var is_transfer         = $(":radio[name='is-transfer'][checked]").val();
    var deduction_voucher   = $("#deduction-voucher").val();
    //为空校验
    if(!name){
        openMsg('请填写车主姓名');
        return;
    }
    if(!drive_city){
        openMsg('请填写行驶城市');
        return;
    }
    if(!drive_city || drive_city.length<2){
        openMsg('行驶城市名称长度至少为两位');
        return;
    }

    if(is_new!=null && is_new!='1'){
        if(!car_num){
            openMsg('请填写车牌号');
            return;
        }
        var carNumReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]{1}\s|[A-Z]{1})[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if(!carNumReg.test(car_num)){
            openMsg('请输入正确的车牌号！');
            return;
        }
    }

    if(!card_num){
        openMsg('请填写身份证号');
        return;
    }
    if(!mobile){
        openMsg('请填写手机号码');
        return;
    }
    var mobileReg = /^1[345678][0-9]\d{4,8}$/;
    if(!mobileReg.test(mobile)){
        openMsg('请输入有效的手机号码！');
        return;
    }
    if(!verification_code){
        openMsg('请填写验证码');
        return;
    }
    if(!frame_number || frame_number.length <10){
        openMsg('请填写车架号-且长度至少是10位');
        return;
    }
    if(!engine_number || engine_number.length < 8){
        openMsg('请填写发动机号-且长度至少是8位');
        return;
    }
    if(!car_brand || car_brand.length > 16){
        openMsg('请填写品牌型号-且长度不能大于16位');
        return;
    }
    if(!record_date){
        openMsg('请填写注册登记日期-格式2017-01-01');
        return;
    }
    if(!deduction_voucher){
        openMsg('请填写贵宾抵扣券');
        return;
    }

    var params ={};
    params.name                 = name;
    params.drive_city           = drive_city;
    params.code                 = verification_code;
    params.car_num              = car_num;
    params.frame_number         = frame_number;
    params.card_num             = card_num;
    params.engine_number        = engine_number;
    params.car_birthday         = car_birthday;
    params.mobile               = mobile;
    params.car_brand            = car_brand;
    params.record_date          = record_date;
    params.is_new               = is_new;
    params.is_transfer          = is_transfer;
    params.deduction_voucher    = deduction_voucher;
    return params;

}

//点击提交
function carSubmit() {
    var param = getParams();
    if(!param){return;}
    $.ajax({
        url: interface.indexSubmit.url,		                //对应的URL
        data:JSON.stringify(param),							//格式化参数信息
        type:'POST',									    //ajax的类型
        cache:false,
        dataType:'json',
        contentType:'application/json',						//传参的类型
        error:function(response){							//数据加载失败事件
            openMsg('提交失败，请联系客服');
        },
        success:function(response){                         //数据增加在成功事件
            if(!response.error_code){
                openMsg('车险订单已提交');
            }else{
                if(response.error_code == '414'){
                    openMsg(response.error_desc);
                }else {
                    openMsg('车险订单提交失败，请联系客服');
                }
            }
        }
    });
}

//生日信息
function onCardNumChange() {
    var cardNum = $('#card-num').val();
    var carBirth = cardNum.substr(6,4)+'-'+cardNum.substr(10,2)+'-'+cardNum.substr(12,2);
    $('#car-birthday').val(carBirth);
}

//验证码
function getCode() {
    var mobile                = $('#mobile').val();
    if(!mobile){
        openMsg('请填写手机号码');
        return;
    }
    var mobileReg = /^1[345678][0-9]\d{4,8}$/;
    if(!mobileReg.test(mobile)){
        openMsg('请输入有效的手机号码！');
        return;
    }
    var param = {
        mobile  :mobile,
        code    :'86'
    }
    $.ajax({
        url: interface.indexVerificationCode.url,
        data:JSON.stringify(param),
        type:'POST',
        dataType:'json',
        cache:false,
        contentType:'application/json',
        error:function(response){
            openMsg('获取验证码失败，请联系客服');
        },
        success:function(response){
            if(!response.error_code){
                $('#codeBtn').text('短信发送中');
                codeBtnTime();
                openMsg('短信已发送，请注意查收');
            }else {
                openMsg('短信发送失败，请联系客服');
            }
        }
    });

}

var waitTime = 120;
function codeBtnTime() {
    if(waitTime <= 0){
        clearTimeout(tempTime);
        $('#codeBtn').val('重新发送验证码');
        waitTime = 120;
        return;
    }
    var tempTime = setTimeout(function () {
        waitTime --;
        $('#codeBtn').val(waitTime+'秒后重试');
        codeBtnTime();
    },1000);
}

//自适应
function selfAdaption() {
    var browser = myBrowser();
    //设置临界值-图片大小
    var criticalHeight  = 950;
    var criticalWidth   = 1920;
    var webHeight       = (browser!='IE') ? window.innerHeight : document.documentElement.clientHeight;
    var webWidth        = document.body.offsetWidth;

    $('body').css({
        "margin-top"    : (webHeight>criticalHeight) ? (webHeight-criticalHeight)/2 : 0,
        "margin-left"   : (webWidth >criticalWidth)  ? (webWidth-criticalWidth)/2 : 0
    })
}

//当前浏览器
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}

//是否新车未上保险
// $('#car-num').removeAttr("disabled");
function openMsg(msg) {
    $('.msgTips-container').show();
    $('#msgTips').show();
    $('#msgTips #msgLabel').text(msg);
}
function closeMsg() {
    $('.msgTips-container').hide();
    $('#msgTips').hide();
}

//是否填写车牌号
$("input[name='is-new']").click(function(){
    if($(this)[0].value == '0'){
        $("#car-num").attr("disabled", false);
        $("#car-num").attr("placeholder","请填写车牌号");
    }else{
        $("#car-num").attr("disabled", true);
        $("#car-num").attr("placeholder","");
    }
});

//初始化--表单清空
$('#car-form')[0].reset();
selfAdaption();


