$('#password').focusin(function(){
    // 密码框选中
    $('.login-box').addClass('up');
}).focusout(function(){
    // 密码框非选中
    $('.login-box').removeClass('up');
})
// 眼球移动
$(document).on('mousemove',function(e){
    let dw=$(document).width() / 10;
    let dh=$(document).height() / 18;
    let x=e.pageX / dw;
    let y=e.pageY / dh;
    $('.eye-ball').css({
        left:x,
        top:y
    })
})