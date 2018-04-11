require(['config'], function () {
    require(['app/page1'], function (showTime) {
        var $clock = $('#jclock');

        $clock.html(showTime());

        setInterval(function() {
            $clock.html(showTime());
        }, 1e3);
    });
});
