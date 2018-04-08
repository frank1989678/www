// $(window).load(function() {
//     $('.idx-swiper .slide').unslider({
//         fluid: true,
//         dots: true,
//         speed: 500,
//         delay: 4000
//     });
//     $('.idx-col .slide').unslider({
//         fluid: true,
//         dots: true,
//         speed: 500,
//         delay: 4000
//     });
// });


$(function() {
    // return false;
    var $menuIcon = $('.menu-icon');
    $('.menu-icon').on('click', 'span', function() {
        var _top = $menuIcon.position().top + 10,
            _height = $menuIcon.outerHeight();
            
        $('nav').toggleClass('active').find('ul').css('top',_top + _height);
    })

    var _bannerSwiper = new Swiper('.idx-banner .swiper-container', {
        loop: true,
        autoplay: 5e3,
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        pagination: '.idx-banner .swiper-guide'
    });


    var _newSwiperMini = new Swiper('#jSwiper2 .swiper-container', {
        loop: true,
        autoResize: false,
        slidesPerView: 1
    });  
    
    var _newSwiper = new Swiper('#jSwiper1 .swiper-container', {
        loop: true,
        autoResize: false,
        slidesPerView: 4
    });  
    $('#jSwiper1 .swiper-prev').on('click', function(){
        _newSwiper.swipePrev();
    })
    $('#jSwiper1 .swiper-next').on('click', function(){
        _newSwiper.swipeNext();
    })
    $('#jSwiper2 .swiper-prev').on('click', function(){
        _newSwiperMini.swipePrev();
    })
    $('#jSwiper2 .swiper-next').on('click', function(){
        _newSwiperMini.swipeNext();
    })

    var _swiper3 = new Swiper('#jSwiper3', {
        loop: true,
        autoplay: 5e3,
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        pagination: '#jSwiper3 .swiper-guide'
    });
    var _swiper4 = new Swiper('#jSwiper4', {
        loop: true,
        autoplay: 5e3,
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        pagination: '#jSwiper4 .swiper-guide'
    });


    $('.swiper-slide').show();
});

