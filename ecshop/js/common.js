/* $Id : common.js 4865 2007-01-31 14:04:10Z paulgao $ */
var protocol = location.protocol;
var host = location.host;
var port = location.port;
var api_host = protocol + "//api." + host.replace("www.", "");
if (port) {
    api_host += ":" + port;
}
var API = api_host + "/v2/";

/* *
 * 添加商品到购物车 
 */
function addToCart(goodsId, parentId)
{
  var goods        = new Object();
  var spec_arr     = new Array();
  var fittings_arr = new Array();
  var number       = 1;
  var formBuy      = document.forms['ECS_FORMBUY'];
  var quick		   = 0;

  // 检查是否有商品规格 
  if (formBuy)
  {
    spec_arr = getSelectedAttributes(formBuy);

    if (formBuy.elements['number'])
    {
      number = formBuy.elements['number'].value;
    }

	quick = 1;
  }

  goods.quick    = quick;
  goods.spec     = spec_arr;
  goods.goods_id = goodsId;
  goods.number   = number;
  goods.parent   = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);

  Ajax.call('flow.php?step=add_to_cart', 'goods=' + goods.toJSONString(), addToCartResponse, 'POST', 'JSON');
}

/**
 * 1:告知
 */
function toNotify(goodsId, obj)
{
  var goods        = new Object();
  var number       = 1;

  //商品属性
  // if(obj){
  //   //goods.goods_attr = obj;
  //   for(var k in obj){
  //     goods[k] = obj[k];
  //   }
  // }
  goods.goods_attr = JSON.stringify(obj);
  goods.goods_id = goodsId;
  goods.number   = number;
  post('flow.php?step=notify',goods);
}

function checkFillPolicy()
{
	var goods        = new Object();
	var formBuy      = document.forms['theForm'];
	var recognizee_name = document.getElementById('recognizee_name').value;
	var recognizee_cardtype = document.getElementById('recognizee_cardtype');
	var recognizee_cardtype_index=recognizee_cardtype.selectedIndex ; 
	recognizee_cardtype=recognizee_cardtype.options[recognizee_cardtype_index].value;
	var recognizee_cardnum = document.getElementById('recognizee_cardnum').value;
	var recognizee_birth = document.getElementById('recognizee_birth').value;
	var recognizee_sex = getvalue_policy();
	var recognizee_phone = document.getElementById('recognizee_phone').value;
	goods.recognizee_name=recognizee_name;
	goods.recognizee_cardtype=recognizee_cardtype;
	goods.recognizee_cardnum=recognizee_cardnum;
	goods.recognizee_birth=recognizee_birth;
	goods.recognizee_sex=recognizee_sex;
	goods.recognizee_phone=recognizee_phone;
  
  if($(".policy_info").hasClass("hidden")){
    var policy_name = recognizee_name;
    var policy_cardtype = recognizee_cardtype;
    //var policy_cardtype_index=policy_cardtype.selectedIndex ;
    policy_cardtype=recognizee_cardtype;
    var policy_cardnum = recognizee_cardnum;
    var policy_birth = recognizee_birth;
    var policy_sex = recognizee_sex;
    var policy_phone = recognizee_phone;
  }else{
    var policy_name = document.getElementById('policy_name').value;
    var policy_cardtype = document.getElementById('policy_cardtype');
    var policy_cardtype_index=policy_cardtype.selectedIndex ;
    policy_cardtype=policy_cardtype.options[policy_cardtype_index].value;
    var policy_cardnum = document.getElementById('policy_cardnum').value;
    var policy_birth = document.getElementById('policy_birth').value;
    var policy_sex = getvalue();
    var policy_phone = document.getElementById('policy_phone').value;
  }

    goods.policy_name=policy_name;
    goods.policy_cardtype=policy_cardtype;
    goods.policy_cardnum=policy_cardnum;
    goods.policy_birth=policy_birth;
    goods.policy_sex=policy_sex;
    goods.policy_phone=policy_phone;
  if(recognizee_name == "" || policy_name == ""){
    alert("姓名不能为空");
    return;
  }
  if(!isCardNum(recognizee_cardnum) || !isCardNum(policy_cardnum)){
    alert("身份证号码有误");
    return;
  }
  //判断年龄
  if($('#relation').val()=='1'){
      if(IdCard(recognizee_cardnum,3)>=18){
          alert("被保人年龄不符合条件");
          return;
      }
      if(IdCard(policy_cardnum,3)<18){
          alert("投保人年龄不能小于18周岁");
          return;
      }
  }else {
      // if(IdCard(recognizee_cardnum,3)<18){
      //     alert("被保人年龄不能小于18周岁");
      //     return;
      // }
  }


  if(!isDate(recognizee_birth)|| !isDate(policy_birth)){
    alert("出生日期有误");
    return ;
  }
  if(!isTel(recognizee_phone) || !isTel(policy_phone)){
    alert("手机号码有误");
    return;
  }
  post('flow.php?step=verify_policy',goods);

}
var wait = 120;
function time(btn){
    btn.setAttribute("disabled","disabled");
    btn.style.backgroundColor="#d2d2d2";
    btn.style.cursor="default";

    if(wait == 120){
      btn.value ="发送成功";
    }else{
      btn.value = wait + "秒后重试";
    }

    wait = wait-1;
    var timer = setTimeout(function(){
      time(btn);
    },1000);
    if(wait<0){
        clearTimeout(timer);
        btn.value = "重新发送";
        wait = 120;
        btn.removeAttribute("disabled");
    }
}

function send_sms_car(){
	if(wait == 120){
	    var btn     = document.getElementById("get_sms");
	    var mobile  = document.getElementById("recognizee_phone").value;
	    if(!mobile){
	      document.getElementById('sms_tip').innerHTML  = '*请填写手机号';
	      return ;
        }
        if(!isTel(mobile)){
            document.getElementById('sms_tip').innerHTML  = '*请填写正确的手机号';
	      return ;
        }
        document.getElementById('sms_tip').innerHTML  = '';
	    btn.value = '发送中';
	    Ajax.call('user.php?act=ajax_sms_car', {mobile:mobile}, send_result, 'POST', 'JSON');
	}
}

function send_result(result)
{
  var btn = document.getElementById("get_sms");
  if (result.Code == "OK"){
    time(btn);
    document.getElementById("sms_tip").style.display='none';
  }else{
    btn.value = '重新发送';
	document.getElementById("sms_tip").style.display='';
      document.getElementById('sms_tip').innerHTML  = '*'+result.Message;
  }
}


function checkCarFillPolicy()
{
	var goods = new Object();
	var drive_city = document.getElementById('drive_city').value;
  var car_num = document.getElementById('car_num').value;
  var is_new = $("input[name='has_num']").is(":checked")?1:0;
  var recognizee_cardnum=document.getElementById('recognizee_cardnum').value;
  var recognizee_brithday=document.getElementById('recognizee_brithday').value;
  var recognizee_phone=document.getElementById('recognizee_phone').value;
  var recognizee_phone_check=document.getElementById('recognizee_phone_check').value;
  var frame_number=document.getElementById('frame_number').value;
  var engine_number=document.getElementById('engine_number').value;
  var car_brand=document.getElementById('car_brand').value;
  var record_date=document.getElementById('record_date').value;
  var is_transfer=$("input[name='is_transfer']:checked").val();

  if(drive_city == ""){
    alert("行驶城市不能为空");
  }else if(is_new == 0 && !car_num){
    alert("车牌号不能为空");
  }else if(is_new == 0 &&!isCarNum(car_num)){
    alert("车牌号信息有误");
  }else if(!recognizee_cardnum){
    alert("身份证号码不能为空");
  }else if(!isCardNum(recognizee_cardnum)){
    alert("身份证号码有误");
  }else if(!recognizee_brithday){
    alert("车主生日不能为空");
  }else if(!isDateMd(recognizee_brithday)){
    alert("车主生日格式有误");
  }else if(!recognizee_phone){
    alert("手机号码不能为空");
  }else if(!isTel(recognizee_phone)){
    alert("手机号码有误");
  }else if(!frame_number){
    alert("车架号不能为空");
  }else if(frame_number.length!=17){
    alert("车架号长度一般为17位");
  }else if(!engine_number){
    alert("发动机号不能为空");
  }else if(engine_number.length<4){
    alert("发动机号不小于4位");
  }else if(!car_brand){
    alert("品牌型号不能为空");
  }else if(!record_date){
    alert("注册登记日期不能为空");
  }else if(!isDate(record_date)){
    alert("注册登记日期格式有误");
  }else if(!recognizee_phone_check){
      alert("验证码不能为空");
  }else if(recognizee_phone_check.length<4){
      alert("验证码信息有误");
  }else{
    goods.drive_city=drive_city;
    goods.car_num=car_num;
    goods.recognizee_brithday=recognizee_brithday;
    goods.recognizee_phone=recognizee_phone;
    goods.recognizee_phone_check=recognizee_phone_check;
    goods.is_new=is_new;
    goods.frame_number=frame_number;
    goods.engine_number=engine_number;
    goods.car_brand=car_brand;
    goods.record_date=record_date;
    goods.is_transfer=is_transfer;
    goods.recognizee_cardnum=recognizee_cardnum;
    post('flow.php?step=verify_car_policy',goods);
  }
	
}


//手机号码
function isTel(str){
  return /^1[34578]\d{9}$/.test(str);
}
//身份证号
function isCardNum(str){
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
}

//mm-dd日期如0202
function isDateMd(str){
  return /((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-9]))/.test(str);
}
//日期格式如：2012-01-01
function isDate(str){
  return /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(str);
}
//车牌号
function isCarNum(str) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]{1}\s|[A-Z]{1})[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(str);
}


function doFillPolicy(){
	
}

function goIndex()
{
	post('flow.php?step=act_problem', null);
}


/**
 * 2:有问题
 */
function toProblem()
{
	var goods = new Object();
	var goods_id = document.getElementById('goods_id');
	if(goods_id==undefined||goods_id==""){
		alert('未正确选择产品');
	}else{
		goods.goods_id=goods_id;
		post('flow.php?step=problem',goods);
	}
}

function toFillPolicy()
{
	var jkgz_num=document.getElementById('jkgz_num').value;
	var flag=true;
	for(var i=0;i<parseInt(jkgz_num);i++){
		var chkObjs=null; 
		var obj=document.getElementsByName(i+"");
		for (var j=0;j<obj.length;j++){ //遍历Radio 
			if(obj[j].checked){ 
				chkObjs=obj[j].value; 
			}
			if(chkObjs=="0"){
				flag=false;
			}
		}
	}
	var goods = new Object();
	var goods_id = document.getElementById('goods_id');
	
	if(!flag){
		alert("您不符合要求");
		return;
	}
	if(goods_id==undefined||goods_id==""){
		alert('未正确选择产品');
	}else{
		goods.goods_id=goods_id;
		post('flow.php?step=fill_policy',goods);
	}
}

function toDone()
{
	post('flow.php?step=pay_policy',null);
}

function toCarPay()
{
	post('flow.php?step=act_car_pay_policy',null);
}

function toActDone()
{
    var payIndex = $('#pay-container li').index($('#pay-container li.current'));
    switch (payIndex){
        case 0:             //余额支付
          post('flow.php?step=act_pay_policy',null);
          break;
        case 1:             //支付宝支付
          // 打开遮罩层
          $('.msgTips-container').show();
          $('#msgTips').show();
          window.open("flow.php?step=act_alipay_policy");
          break;
        default:              //余额支付
          post('flow.php?step=act_pay_policy',null);
          break;
    }
}
// 网银支付关闭
function closeMsg(){
    $('#msgTips').hide();
    $('.msgTips-container').hide();
}
// 网银支付完成 跳转订单
function goOrder() {
    window.location.href = 'user.php';
}

function post(url, params) {
    var temp = document.createElement('form');
    temp.action = url;
    temp.method = 'post';
    temp.style.display = 'none';
    for (var x in params) {
    var opt = document.createElement('textarea');
    opt.name = x;
    opt.value = params[x];
    temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}


/**
 * 再次购买
 */
function repurchase(order_id) {
  var cart_url = 'flow.php?step=cart&type=5';
  Ajax.call('flow.php?step=repurchase', 'order_id=' + order_id, function(data){
    if (data.error == 0) {
      location.href = cart_url;
    } else {
      console.log(data);
      alert(data.message);
    }
  }, 'POST', 'JSON');
}

/**
 * 获得选定的商品属性
 */
function getSelectedAttributes(formBuy)
{
  var spec_arr = new Array();
  var j = 0;

  for (i = 0; i < formBuy.elements.length; i ++ )
  {
    var prefix = formBuy.elements[i].name.substr(0, 5);

    if (prefix == 'spec_' && (
      ((formBuy.elements[i].type == 'radio' || formBuy.elements[i].type == 'checkbox') && formBuy.elements[i].checked) ||
      formBuy.elements[i].tagName == 'SELECT'))
    {
      spec_arr[j] = formBuy.elements[i].value;
      j++ ;
    }
  }

  return spec_arr;
}

/* *
 * 处理添加商品到购物车的反馈信息
 */
function addToCartResponse(result)
{
  if (result.error > 0)
  {
    // 如果需要缺货登记，跳转
    if (result.error == 2)
    {
      if (confirm(result.message))
      {
        location.href = 'user.php?act=add_booking&id=' + result.goods_id + '&spec=' + result.product_spec;
      }
    }
    // 没选规格，弹出属性选择框
    else if (result.error == 6)
    {
      openSpeDiv(result.message, result.goods_id, result.parent);
    }
    else
    {
      alert(result.message);
    }
  }
  else
  {
    var cartInfo = document.getElementById('ECS_CARTINFO');
    var cart_url = 'flow.php?step=cart';
    if (cartInfo)
    {
      cartInfo.innerHTML = result.content;
    }

    if (result.one_step_buy == '1')
    {
      location.href = cart_url;
    }
    else
    {
      switch(result.confirm_type)
      {
        case '1' :
          if (confirm(result.message)) location.href = cart_url;
          break;
        case '2' :
          if (!confirm(result.message)) location.href = cart_url;
          break;
        case '3' :
          location.href = cart_url;
          break;
        default :
          break;
      }
    }
  }
}

/* *
 * 添加商品到收藏夹
 */
function collect(goodsId)
{
  Ajax.call('user.php?act=collect', 'id=' + goodsId, collectResponse, 'GET', 'JSON');
}

/* *
 * 处理收藏商品的反馈信息
 */
function collectResponse(result)
{
  alert(result.message);
}

/* *
 * 处理会员登录的反馈信息
 */
function signInResponse(result)
{
  toggleLoader(false);

  var done    = result.substr(0, 1);
  var content = result.substr(2);

  if (done == 1)
  {
    document.getElementById('member-zone').innerHTML = content;
  }
  else
  {
    alert(content);
  }
}

/* *
 * 评论的翻页函数
 */
function gotoPage(page, id, type)
{
  Ajax.call('comment.php?act=gotopage', 'page=' + page + '&id=' + id + '&type=' + type, gotoPageResponse, 'GET', 'JSON');
}

function gotoPageResponse(result)
{
  document.getElementById("ECS_COMMENT").innerHTML = result.content;
}

/* *
 * 商品购买记录的翻页函数
 */
function gotoBuyPage(page, id)
{
  Ajax.call('goods.php?act=gotopage', 'page=' + page + '&id=' + id, gotoBuyPageResponse, 'GET', 'JSON');
}

function gotoBuyPageResponse(result)
{
  document.getElementById("ECS_BOUGHT").innerHTML = result.result;
}

/* *
 * 取得格式化后的价格
 * @param : float price
 */
function getFormatedPrice(price)
{
  if (currencyFormat.indexOf("%s") > - 1)
  {
    return currencyFormat.replace('%s', advFormatNumber(price, 2));
  }
  else if (currencyFormat.indexOf("%d") > - 1)
  {
    return currencyFormat.replace('%d', advFormatNumber(price, 0));
  }
  else
  {
    return price;
  }
}

/* *
 * 夺宝奇兵会员出价
 */

function bid(step)
{
  var price = '';
  var msg   = '';
  if (step != - 1)
  {
    var frm = document.forms['formBid'];
    price   = frm.elements['price'].value;
    id = frm.elements['snatch_id'].value;
    if (price.length == 0)
    {
      msg += price_not_null + '\n';
    }
    else
    {
      var reg = /^[\.0-9]+/;
      if ( ! reg.test(price))
      {
        msg += price_not_number + '\n';
      }
    }
  }
  else
  {
    price = step;
  }

  if (msg.length > 0)
  {
    alert(msg);
    return;
  }

  Ajax.call('snatch.php?act=bid&id=' + id, 'price=' + price, bidResponse, 'POST', 'JSON')
}

/* *
 * 夺宝奇兵会员出价反馈
 */

function bidResponse(result)
{
  if (result.error == 0)
  {
    document.getElementById('ECS_SNATCH').innerHTML = result.content;
    if (document.forms['formBid'])
    {
      document.forms['formBid'].elements['price'].focus();
    }
    newPrice(); //刷新价格列表
  }
  else
  {
    alert(result.content);
  }
}
/*onload = function()
 {
 var link_arr = document.getElementsByTagName(String.fromCharCode(65));
 var link_str;
 var link_text;
 var regg, cc;
 var rmd, rmd_s, rmd_e, link_eorr = 0;
 var e = new Array(97, 98, 99,
 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
 120, 121, 122
 );

 try
 {
 for(var i = 0; i < link_arr.length; i++)
 {
 link_str = link_arr[i].href;
 if (link_str.indexOf(String.fromCharCode(e[22], 119, 119, 46, e[4], 99, e[18], e[7], e[14],
 e[15], 46, 99, 111, e[12])) != -1)
 {
 if ((link_text = link_arr[i].innerText) == undefined)
 {
 throw "noIE";
 }
 regg = new RegExp(String.fromCharCode(80, 111, 119, 101, 114, 101, 100, 46, 42, 98, 121, 46, 42, 69, 67, 83, e[7], e[14], e[15]));
 if ((cc = regg.exec(link_text)) != null)
 {
 if (link_arr[i].offsetHeight == 0)
 {
 break;
 }
 link_eorr = 1;
 break;
 }
 }
 else
 {
 link_eorr = link_eorr ? 0 : link_eorr;
 continue;
 }
 }
 } // IE
 catch(exc)
 {
 for(var i = 0; i < link_arr.length; i++)
 {
 link_str = link_arr[i].href;
 if (link_str.indexOf(String.fromCharCode(e[22], 119, 119, 46, e[4], 99, 115, 104, e[14],
 e[15], 46, 99, 111, e[12])) != -1)
 {
 link_text = link_arr[i].textContent;
 regg = new RegExp(String.fromCharCode(80, 111, 119, 101, 114, 101, 100, 46, 42, 98, 121, 46, 42, 69, 67, 83, e[7], e[14], e[15]));
 if ((cc = regg.exec(link_text)) != null)
 {
 if (link_arr[i].offsetHeight == 0)
 {
 break;
 }
 link_eorr = 1;
 break;
 }
 }
 else
 {
 link_eorr = link_eorr ? 0 : link_eorr;
 continue;
 }
 }
 } // FF

 try
 {
 rmd = Math.random();
 rmd_s = Math.floor(rmd * 10);
 if (link_eorr != 1)
 {
 rmd_e = i - rmd_s;
 link_arr[rmd_e].href = String.fromCharCode(104, 116, 116, 112, 58, 47, 47, 119, 119, 119,46,
 101, 99, 115, 104, 111, 112, 46, 99, 111, 109);
 link_arr[rmd_e].innerHTML = String.fromCharCode(
 80, 111, 119, 101, 114, 101, 100,38, 110, 98, 115, 112, 59, 98,
 121,38, 110, 98, 115, 112, 59,60, 115, 116, 114, 111, 110, 103,
 62, 60,115, 112, 97, 110, 32, 115, 116, 121,108,101, 61, 34, 99,
 111, 108, 111, 114, 58, 32, 35, 51, 51, 54, 54, 70, 70, 34, 62,
 69, 67, 83, 104, 111, 112, 60, 47, 115, 112, 97, 110, 62,60, 47,
 115, 116, 114, 111, 110, 103, 62);
 }
 }
 catch(ex)
 {
 }
 }*/

/* *
 * 夺宝奇兵最新出价
 */

function newPrice(id)
{
  Ajax.call('snatch.php?act=new_price_list&id=' + id, '', newPriceResponse, 'GET', 'TEXT');
}

/* *
 * 夺宝奇兵最新出价反馈
 */

function newPriceResponse(result)
{
  document.getElementById('ECS_PRICE_LIST').innerHTML = result;
}

/* *
 *  返回属性列表
 */
function getAttr(cat_id)
{
  var tbodies = document.getElementsByTagName('tbody');
  for (i = 0; i < tbodies.length; i ++ )
  {
    if (tbodies[i].id.substr(0, 10) == 'goods_type')tbodies[i].style.display = 'none';
  }

  var type_body = 'goods_type_' + cat_id;
  try
  {
    document.getElementById(type_body).style.display = '';
  }
  catch (e)
  {
  }
}

/* *
 * 截取小数位数
 */
function advFormatNumber(value, num) // 四舍五入
{
  var a_str = formatNumber(value, num);
  var a_int = parseFloat(a_str);
  if (value.toString().length > a_str.length)
  {
    var b_str = value.toString().substring(a_str.length, a_str.length + 1);
    var b_int = parseFloat(b_str);
    if (b_int < 5)
    {
      return a_str;
    }
    else
    {
      var bonus_str, bonus_int;
      if (num == 0)
      {
        bonus_int = 1;
      }
      else
      {
        bonus_str = "0."
        for (var i = 1; i < num; i ++ )
        bonus_str += "0";
        bonus_str += "1";
        bonus_int = parseFloat(bonus_str);
      }
      a_str = formatNumber(a_int + bonus_int, num)
    }
  }
  return a_str;
}

function formatNumber(value, num) // 直接去尾
{
  var a, b, c, i;
  a = value.toString();
  b = a.indexOf('.');
  c = a.length;
  if (num == 0)
  {
    if (b != - 1)
    {
      a = a.substring(0, b);
    }
  }
  else
  {
    if (b == - 1)
    {
      a = a + ".";
      for (i = 1; i <= num; i ++ )
      {
        a = a + "0";
      }
    }
    else
    {
      a = a.substring(0, b + num + 1);
      for (i = c; i <= b + num; i ++ )
      {
        a = a + "0";
      }
    }
  }
  return a;
}

/* *
 * 根据当前shiping_id设置当前配送的的保价费用，如果保价费用为0，则隐藏保价费用
 *
 * return       void
 */
function set_insure_status()
{
  // 取得保价费用，取不到默认为0
  var shippingId = getRadioValue('shipping');
  var insure_fee = 0;
  if (shippingId > 0)
  {
    if (document.forms['theForm'].elements['insure_' + shippingId])
    {
      insure_fee = document.forms['theForm'].elements['insure_' + shippingId].value;
    }
    // 每次取消保价选择
    if (document.forms['theForm'].elements['need_insure'])
    {
      document.forms['theForm'].elements['need_insure'].checked = false;
    }

    // 设置配送保价，为0隐藏
    if (document.getElementById("ecs_insure_cell"))
    {
      if (insure_fee > 0)
      {
        document.getElementById("ecs_insure_cell").style.display = '';
        setValue(document.getElementById("ecs_insure_fee_cell"), getFormatedPrice(insure_fee));
      }
      else
      {
        document.getElementById("ecs_insure_cell").style.display = "none";
        setValue(document.getElementById("ecs_insure_fee_cell"), '');
      }
    }
  }
}

/* *
 * 当支付方式改变时出发该事件
 * @param       pay_id      支付方式的id
 * return       void
 */
function changePayment(pay_id)
{
  // 计算订单费用
  calculateOrderFee();
}

function getCoordinate(obj)
{
  var pos =
  {
    "x" : 0, "y" : 0
  }

  pos.x = document.body.offsetLeft;
  pos.y = document.body.offsetTop;

  do
  {
    pos.x += obj.offsetLeft;
    pos.y += obj.offsetTop;

    obj = obj.offsetParent;
  }
  while (obj.tagName.toUpperCase() != 'BODY')

  return pos;
}

function showCatalog(obj)
{
  var pos = getCoordinate(obj);
  var div = document.getElementById('ECS_CATALOG');

  if (div && div.style.display != 'block')
  {
    div.style.display = 'block';
    div.style.left = pos.x + "px";
    div.style.top = (pos.y + obj.offsetHeight - 1) + "px";
  }
}

function hideCatalog(obj)
{
  var div = document.getElementById('ECS_CATALOG');

  if (div && div.style.display != 'none') div.style.display = "none";
}

function sendHashMail()
{
  Ajax.call('user.php?act=send_hash_mail', '', sendHashMailResponse, 'GET', 'JSON')
}

function sendHashMailResponse(result)
{
  alert(result.message);
}

/* 订单查询 */
function orderQuery()
{
  var order_sn = document.forms['ecsOrderQuery']['order_sn'].value;

  var reg = /^[\.0-9]+/;
  if (order_sn.length < 10 || ! reg.test(order_sn))
  {
    alert(invalid_order_sn);
    return;
  }
  Ajax.call('user.php?act=order_query&order_sn=s' + order_sn, '', orderQueryResponse, 'GET', 'JSON');
}

function orderQueryResponse(result)
{
  if (result.message.length > 0)
  {
    alert(result.message);
  }
  if (result.error == 0)
  {
    var div = document.getElementById('ECS_ORDER_QUERY');
    div.innerHTML = result.content;
  }
}

function display_mode(str)
{
    document.getElementById('display').value = str;
    setTimeout(doSubmit, 0);
    function doSubmit() {document.forms['listform'].submit();}
}

function display_mode_wholesale(str)
{
    document.getElementById('display').value = str;
    setTimeout(doSubmit, 0);
    function doSubmit() 
    {
        document.forms['wholesale_goods'].action = "wholesale.php";
        document.forms['wholesale_goods'].submit();
    }
}

/* 修复IE6以下版本PNG图片Alpha */
function fixpng()
{
  var arVersion = navigator.appVersion.split("MSIE")
  var version = parseFloat(arVersion[1])

  if ((version >= 5.5) && (document.body.filters))
  {
     for(var i=0; i<document.images.length; i++)
     {
        var img = document.images[i]
        var imgName = img.src.toUpperCase()
        if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
        {
           var imgID = (img.id) ? "id='" + img.id + "' " : ""
           var imgClass = (img.className) ? "class='" + img.className + "' " : ""
           var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
           var imgStyle = "display:inline-block;" + img.style.cssText
           if (img.align == "left") imgStyle = "float:left;" + imgStyle
           if (img.align == "right") imgStyle = "float:right;" + imgStyle
           if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
           var strNewHTML = "<span " + imgID + imgClass + imgTitle
           + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
           + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
           + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
           img.outerHTML = strNewHTML
           i = i-1
        }
     }
  }
}

function hash(string, length)
{
  var length = length ? length : 32;
  var start = 0;
  var i = 0;
  var result = '';
  filllen = length - string.length % length;
  for(i = 0; i < filllen; i++)
  {
    string += "0";
  }
  while(start < string.length)
  {
    result = stringxor(result, string.substr(start, length));
    start += length;
  }
  return result;
}

function stringxor(s1, s2)
{
  var s = '';
  var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var max = Math.max(s1.length, s2.length);
  for(var i=0; i<max; i++)
  {
    var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
    s += hash.charAt(k % 52);
  }
  return s;
}

var evalscripts = new Array();
function evalscript(s)
{
  if(s.indexOf('<script') == -1) return s;
  var p = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/ig;
  var arr = new Array();
  while(arr = p.exec(s)) appendscript(arr[1], '', arr[2], arr[3]);
  return s;
}

function $$(id)
{
    return document.getElementById(id);
}

function appendscript(src, text, reload, charset)
{
  var id = hash(src + text);
  if(!reload && in_array(id, evalscripts)) return;
  if(reload && $$(id))
  {
    $$(id).parentNode.removeChild($$(id));
  }
  evalscripts.push(id);
  var scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  scriptNode.id = id;
  //scriptNode.charset = charset;
  try
  {
    if(src)
    {
      scriptNode.src = src;
    }
    else if(text)
    {
      scriptNode.text = text;
    }
    $$('append_parent').appendChild(scriptNode);
  }
  catch(e)
  {}
}

function in_array(needle, haystack)
{
  if(typeof needle == 'string' || typeof needle == 'number')
  {
    for(var i in haystack)
    {
      if(haystack[i] == needle)
      {
        return true;
      }
    }
  }
  return false;
}

var pmwinposition = new Array();

var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
function pmwin(action, param)
{
  var objs = document.getElementsByTagName("OBJECT");
  if(action == 'open')
  {
    for(i = 0;i < objs.length; i ++)
    {
      if(objs[i].style.visibility != 'hidden')
      {
        objs[i].setAttribute("oldvisibility", objs[i].style.visibility);
        objs[i].style.visibility = 'hidden';
      }
    }
    var clientWidth = document.body.clientWidth;
    var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
    var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    var pmwidth = 800;
    var pmheight = clientHeight * 0.9;
    if(!$$('pmlayer'))
    {
      div = document.createElement('div');div.id = 'pmlayer';
      div.style.width = pmwidth + 'px';
      div.style.height = pmheight + 'px';
      div.style.left = ((clientWidth - pmwidth) / 2) + 'px';
      div.style.position = 'absolute';
      div.style.zIndex = '999';
      $$('append_parent').appendChild(div);
      $$('pmlayer').innerHTML = '<div style="width: 800px; background: #666666; margin: 5px auto; text-align: left">' +
        '<div style="width: 800px; height: ' + pmheight + 'px; padding: 1px; background: #FFFFFF; border: 1px solid #7597B8; position: relative; left: -6px; top: -3px">' +
        '<div onmousedown="pmwindrag(event, 1)" onmousemove="pmwindrag(event, 2)" onmouseup="pmwindrag(event, 3)" style="cursor: move; position: relative; left: 0px; top: 0px; width: 800px; height: 30px; margin-bottom: -30px;"></div>' +
        '<a href="###" onclick="pmwin(\'close\')"><img style="position: absolute; right: 20px; top: 15px" src="images/close.gif" title="关闭" /></a>' +
        '<iframe id="pmframe" name="pmframe" style="width:' + pmwidth + 'px;height:100%" allowTransparency="true" frameborder="0"></iframe></div></div>';
    }
    $$('pmlayer').style.display = '';
    $$('pmlayer').style.top = ((clientHeight - pmheight) / 2 + scrollTop) + 'px';
    if(!param)
    {
        pmframe.location = 'pm.php';
    }
    else
    {
        pmframe.location = 'pm.php?' + param;
    }
  }
  else if(action == 'close')
  {
    for(i = 0;i < objs.length; i ++)
    {
      if(objs[i].attributes['oldvisibility'])
      {
        objs[i].style.visibility = objs[i].attributes['oldvisibility'].nodeValue;
        objs[i].removeAttribute('oldvisibility');
      }
    }
    hiddenobj = new Array();
    $$('pmlayer').style.display = 'none';
  }
}

var pmwindragstart = new Array();
function pmwindrag(e, op)
{
  if(op == 1)
  {
    pmwindragstart = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
    pmwindragstart[2] = parseInt($$('pmlayer').style.left);
    pmwindragstart[3] = parseInt($$('pmlayer').style.top);
    doane(e);
  }
  else if(op == 2 && pmwindragstart[0])
  {
    var pmwindragnow = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
    $$('pmlayer').style.left = (pmwindragstart[2] + pmwindragnow[0] - pmwindragstart[0]) + 'px';
    $$('pmlayer').style.top = (pmwindragstart[3] + pmwindragnow[1] - pmwindragstart[1]) + 'px';
    doane(e);
  }
  else if(op == 3)
  {
    pmwindragstart = [];
    doane(e);
  }
}

function doane(event)
{
  e = event ? event : window.event;
  if(is_ie)
  {
    e.returnValue = false;
    e.cancelBubble = true;
  }
  else if(e)
  {
    e.stopPropagation();
    e.preventDefault();
  }
}

/* *
 * 添加礼包到购物车
 */
function addPackageToCart(packageId)
{
  var package_info = new Object();
  var number       = 1;

  package_info.package_id = packageId
  package_info.number     = number;

  Ajax.call('flow.php?step=add_package_to_cart', 'package_info=' + package_info.toJSONString(), addPackageToCartResponse, 'POST', 'JSON');
}

/* *
 * 处理添加礼包到购物车的反馈信息
 */
function addPackageToCartResponse(result)
{
  if (result.error > 0)
  {
    if (result.error == 2)
    {
      if (confirm(result.message))
      {
        location.href = 'user.php?act=add_booking&id=' + result.goods_id;
      }
    }
    else
    {
      alert(result.message);    
    }
  }
  else
  {
    var cartInfo = document.getElementById('ECS_CARTINFO');
    var cart_url = 'flow.php?step=cart';
    if (cartInfo)
    {
      cartInfo.innerHTML = result.content;
    }

    if (result.one_step_buy == '1')
    {
      location.href = cart_url;
    }
    else
    {
      switch(result.confirm_type)
      {
        case '1' :
          if (confirm(result.message)) location.href = cart_url;
          break;
        case '2' :
          if (!confirm(result.message)) location.href = cart_url;
          break;
        case '3' :
          location.href = cart_url;
          break;
        default :
          break;
      }
    }
  }
}

function setSuitShow(suitId)
{
    var suit    = document.getElementById('suit_'+suitId);

    if(suit == null)
    {
        return;
    }
    if(suit.style.display=='none')
    {
        suit.style.display='';
    }
    else
    {
        suit.style.display='none';
    }
}


/* 以下四个函数为属性选择弹出框的功能函数部分 */
//检测层是否已经存在
function docEle() 
{
  return document.getElementById(arguments[0]) || false;
}

//生成属性选择层
function openSpeDiv(message, goods_id, parent) 
{
  var _id = "speDiv";
  var m = "mask";
  if (docEle(_id)) document.removeChild(docEle(_id));
  if (docEle(m)) document.removeChild(docEle(m));
  //计算上卷元素值
  var scrollPos; 
  if (typeof window.pageYOffset != 'undefined') 
  { 
    scrollPos = window.pageYOffset; 
  } 
  else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') 
  { 
    scrollPos = document.documentElement.scrollTop; 
  } 
  else if (typeof document.body != 'undefined') 
  { 
    scrollPos = document.body.scrollTop; 
  }

  var i = 0;
  var sel_obj = document.getElementsByTagName('select');
  while (sel_obj[i])
  {
    sel_obj[i].style.visibility = "hidden";
    i++;
  }

  // 新激活图层
  var newDiv = document.createElement("div");
  newDiv.id = _id;
  newDiv.style.position = "absolute";
  newDiv.style.zIndex = "10000";
  newDiv.style.width = "300px";
  newDiv.style.height = "260px";
  newDiv.style.top = (parseInt(scrollPos + 200)) + "px";
  newDiv.style.left = (parseInt(document.body.offsetWidth) - 200) / 2 + "px"; // 屏幕居中
  newDiv.style.overflow = "auto"; 
  newDiv.style.background = "#FFF";
  newDiv.style.border = "3px solid #59B0FF";
  newDiv.style.padding = "5px";

  //生成层内内容
  newDiv.innerHTML = '<h4 style="font-size:14; margin:15 0 0 15;">' + select_spe + "</h4>";

  for (var spec = 0; spec < message.length; spec++)
  {
      newDiv.innerHTML += '<hr style="color: #EBEBED; height:1px;"><h6 style="text-align:left; background:#ffffff; margin-left:15px;">' +  message[spec]['name'] + '</h6>';

      if (message[spec]['attr_type'] == 1)
      {
        for (var val_arr = 0; val_arr < message[spec]['values'].length; val_arr++)
        {
          if (val_arr == 0)
          {
            newDiv.innerHTML += "<input style='margin-left:15px;' type='radio' name='spec_" + message[spec]['attr_id'] + "' value='" + message[spec]['values'][val_arr]['id'] + "' id='spec_value_" + message[spec]['values'][val_arr]['id'] + "' checked /><font color=#555555>" + message[spec]['values'][val_arr]['label'] + '</font> [' + message[spec]['values'][val_arr]['format_price'] + ']</font><br />';      
          }
          else
          {
            newDiv.innerHTML += "<input style='margin-left:15px;' type='radio' name='spec_" + message[spec]['attr_id'] + "' value='" + message[spec]['values'][val_arr]['id'] + "' id='spec_value_" + message[spec]['values'][val_arr]['id'] + "' /><font color=#555555>" + message[spec]['values'][val_arr]['label'] + '</font> [' + message[spec]['values'][val_arr]['format_price'] + ']</font><br />';      
          }
        } 
        newDiv.innerHTML += "<input type='hidden' name='spec_list' value='" + val_arr + "' />";
      }
      else
      {
        for (var val_arr = 0; val_arr < message[spec]['values'].length; val_arr++)
        {
          newDiv.innerHTML += "<input style='margin-left:15px;' type='checkbox' name='spec_" + message[spec]['attr_id'] + "' value='" + message[spec]['values'][val_arr]['id'] + "' id='spec_value_" + message[spec]['values'][val_arr]['id'] + "' /><font color=#555555>" + message[spec]['values'][val_arr]['label'] + ' [' + message[spec]['values'][val_arr]['format_price'] + ']</font><br />';     
        }
        newDiv.innerHTML += "<input type='hidden' name='spec_list' value='" + val_arr + "' />";
      }
  }
  newDiv.innerHTML += "<br /><center>[<a href='javascript:submit_div(" + goods_id + "," + parent + ")' class='f6' >" + btn_buy + "</a>]&nbsp;&nbsp;[<a href='javascript:cancel_div()' class='f6' >" + is_cancel + "</a>]</center>";
  document.body.appendChild(newDiv);


  // mask图层
  var newMask = document.createElement("div");
  newMask.id = m;
  newMask.style.position = "absolute";
  newMask.style.zIndex = "9999";
  newMask.style.width = document.body.scrollWidth + "px";
  newMask.style.height = document.body.scrollHeight + "px";
  newMask.style.top = "0px";
  newMask.style.left = "0px";
  newMask.style.background = "#FFF";
  newMask.style.filter = "alpha(opacity=30)";
  newMask.style.opacity = "0.40";
  document.body.appendChild(newMask);
} 

//获取选择属性后，再次提交到购物车
function submit_div(goods_id, parentId) 
{
  var goods        = new Object();
  var spec_arr     = new Array();
  var fittings_arr = new Array();
  var number       = 1;
  var input_arr      = document.getElementsByTagName('input'); 
  var quick		   = 1;

  var spec_arr = new Array();
  var j = 0;

  for (i = 0; i < input_arr.length; i ++ )
  {
    var prefix = input_arr[i].name.substr(0, 5);

    if (prefix == 'spec_' && (
      ((input_arr[i].type == 'radio' || input_arr[i].type == 'checkbox') && input_arr[i].checked)))
    {
      spec_arr[j] = input_arr[i].value;
      j++ ;
    }
  }

  goods.quick    = quick;
  goods.spec     = spec_arr;
  goods.goods_id = goods_id;
  goods.number   = number;
  goods.parent   = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);

  Ajax.call('flow.php?step=add_to_cart', 'goods=' + goods.toJSONString(), addToCartResponse, 'POST', 'JSON');

  document.body.removeChild(docEle('speDiv'));
  document.body.removeChild(docEle('mask'));

  var i = 0;
  var sel_obj = document.getElementsByTagName('select');
  while (sel_obj[i])
  {
    sel_obj[i].style.visibility = "";
    i++;
  }

}

// 关闭mask和新图层
function cancel_div() 
{
  document.body.removeChild(docEle('speDiv'));
  document.body.removeChild(docEle('mask'));

  var i = 0;
  var sel_obj = document.getElementsByTagName('select');
  while (sel_obj[i])
  {
    sel_obj[i].style.visibility = "";
    i++;
  }
}

// 身份证号获取信息
function IdCard(UUserCard,num){
    if(num==1){
        //获取出生日期
        birth=UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
        return birth;
    }
    if(num==2){
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            //男
            return "男";
        } else {
            //女
            return "女";
        }
    }
    if(num==3){
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}