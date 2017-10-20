/**
 * Created by Administrator on 2017/5/24.
 */
var targetIndex = 0;
$('.left-nav li').click(function () {
     $(this).addClass('active').siblings().removeClass('active');
     targetIndex = $('.left-nav li').index($(this));
     $('.new_about_company:nth-child('+(targetIndex+1)+')')
         .addClass('hidden-container').siblings().removeClass('hidden-container');
});

//初始化
// $('.left-nav li:nth-child('+(targetIndex+1)+')').addClass('active');
// $('.new_about_company:nth-child('+(targetIndex+1)+')')
//     .removeClass('hidden-container').siblings().addClass('hidden-container');
