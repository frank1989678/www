define(['jquery'], function($) {
    var getTime = function() {
        var formatNumber = function(n) {
            return n < 10 ? '0' + n : n;
        }
        var time = new Date(),
            yyyy = time.getFullYear(),
            MM = formatNumber(time.getMonth() + 1),
            DD = formatNumber(time.getDate()),
            hh = formatNumber(time.getHours()),
            mm = formatNumber(time.getMinutes());

        var s = yyyy + '年' + MM + '月' + DD + '日 ' + hh + ':' + mm;
        return s;
    }
    return getTime;
});
