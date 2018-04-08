$(function() {
    var $menuIcon = $('.menu-icon');
    $('.menu-icon').on('click', 'span', function() {
        var _top = $menuIcon.position().top + 10,
            _height = $menuIcon.outerHeight();

        $('nav').toggleClass('active').find('ul').css('top',_top + _height);
    })
});