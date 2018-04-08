$(function() {
    var $imgs = $('#originalpic img'),
        $thumb = $('.thumbpic').find('li'),
        curr = 0,
        show = 6,
        r = 1,
        count = $imgs.length;

    function play() {
        $imgs.eq(curr).stop(true, true).fadeIn(800).siblings('img').hide();
        $thumb.eq(curr).addClass("hover").siblings().removeClass("hover")
    }

    function playNext() {
        if (curr >= count-1) return false;
        curr < count-1 && (++curr, play(curr));				
        if (r < 0 || r > count - show) return ! 1;
        $("#piclist ul").animate({
            left: "-=134px"
        },
        200),
        r++
    }
    function playPrev() {
        if (curr <= 0) return false;
        curr >= 1 && (--curr, play(curr));
        if (r < 2 || r > count + show) return ! 1;
        $("#piclist ul").animate({
            left: "+=134px"
        },
        200),
        r--
    }
    $imgs.eq(curr).show();
    $thumb.eq(curr).addClass('hover');
    $thumb.find('i').each(function(i) {
        $(this).html(1 + i + '/' + count);
    })
    $('.bntnext,#aNext').click(function() {
        playNext();
    }),
    $('.bntprev,#aPrev').click(function() {
        playPrev();
    }),
    $('.thumbpic li').click(function() {
        curr = $(this).index();
        play();
    })
})