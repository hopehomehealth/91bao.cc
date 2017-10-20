/**
 * Created by Administrator on 2017/5/24.
 */
$('.left-nav li:first-child').addClass('active');
$('.left-nav li').click(function () {
    $('.left-nav li').removeClass('active');
    $(this).addClass('active');
});

function manageTeam() {
    //$('.about-right').innerHTML = 'child-manage-team.html';
}