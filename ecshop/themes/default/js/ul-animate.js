/* 大特保 动态图 效果 @wuwp 20170524 */
$('.floor-aboutus ul li').hover(
    function () {
        // 清除 .active  样式
        $('.floor-aboutus ul li.active').removeClass('active');
        // 当前栏 添加 active 样式
        $(this).addClass('active');
        // 更改当前栏 背景图片的位置
        $(this).find('.n').css({
            "background-position-y" : '-285px'
        });
    },function () {
        // 重置图片背景
        $(this).find('.n').css({
            "background-position-y" : '-155px'
        });
    }
);

/**/
$('.floor-us .con li').hover(
    function () {
        // 更改当前栏 背景图片的位置
        $(this).find('img').css({
            "margin" : '0px auto 0px',
            "transition": 'margin .5s'         //添加时间延迟效果
        });
    },function () {
        // 重置图片背景
        $(this).find('img').css({
            "margin" : '40px auto 50px'
        });
    }
);

//暖心推荐
$('.goods-wrap-recommend ul li.a').hover(
    function () {
        $('.goods-wrap-recommend ul li.c').css({
            'margin-left':'1010px',
            "transition": 'margin .5s'
        });
        $('.goods-wrap-recommend ul li.b').css({
            'margin-left':'820px',
            "transition": 'margin .5s'
        });
    },function () {
        $('.goods-wrap-recommend ul li.b').css({
            'margin-left':'190px',
            "transition": 'margin .5s'
        });
        $('.goods-wrap-recommend ul li.c').css({
            'margin-left':'380px',
            "transition": 'margin .5s'
        });
    }
);
$('.goods-wrap-recommend ul li.b').hover(
    function () {
        $('.goods-wrap-recommend ul li.c').css({
            'margin-left':'1010px',
            "transition": 'margin .5s'
        });
    },function () {
        $('.goods-wrap-recommend ul li.c').css({
            'margin-left':'380px',
            "transition": 'margin .5s'
        });
    }
);