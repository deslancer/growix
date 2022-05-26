window.addEventListener("DOMContentLoaded", function(){
    let msg_box = $('.message_box p');
    let action_dot = $('.a_dot');
    let video = document.getElementById('growth_video');
  $('.instructions').click(function () {
      $(this).hide();
  })
    action_dot.mouseover(function () {
        let text = $(this).data('text');
        msg_box.html(text);
    })
    action_dot.mouseout(function () {
        msg_box.html('Choose an Action');
    })
    action_dot.click(function () {
        let text = $(this).data('text');
        msg_box.html('');
        msg_box.html(text);
        action_dot.removeClass('hovered');
        $(this).toggleClass('hovered');
        $(this).unbind('mouseout');
    })
    $(document).on('mouseover','.copyright', function() {
        $('.copyright_dot').css('transform','translateX(0px)')
        $('.copyright_line').css('width','2rem')
    })
    $(document).on('mouseout','.copyright', function() {
        $('.copyright_dot').css('transition-duration','450ms')
        $('.copyright_dot').css('transform','translateX(50px)')
        $('.copyright_line').css('width','0')
    })

    $('#growth_video').click(function () {
        $(this).hide();
        $('.back_arrow_video').hide();
        $('.video_overlay').fadeOut('600',function () {
            video.currentTime = 0;
        });

    })
    $('.back_arrow_video').click(function () {
        $(this).hide();
        $('.video_overlay').fadeOut();
        $('#growth_video').fadeOut('600',function () {
            video.currentTime = 0;
        });
    })
})