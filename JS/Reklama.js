

$(document).ready(function(){
    $(window).on('beforeunload', function () {
        return "Хотите уйти?";
    });
    setTimeout(function(){
        $('.block-popup, .overlay2').fadeIn();
    },5000)
    $('.open-modal').mouseover(function(){
        $('.block-popup, .overlay2').fadeIn();
    })
    $('.open-modal2').click(function(){
        $('.block-popup, .overlay2').fadeIn();
    })
    $('.block-popup span').click(function(){
        $('.block-popup, .overlay2').fadeOut();
    })
    $(window).mouseleave(function(e){
        if (e.clientY < 0) {
            $('.block-popup, .overlay2').fadeIn();
        }
    })
});

