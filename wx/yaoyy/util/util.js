function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
}

var timeago = {
    format: function(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    },
    fullTime: function(e) {
        var t = new Date(e);
        return this.format(t);
    },
    elapsedTime: function(e) {
        var t = new Date(e),
            s = new Date,
            a = (s - t) / 1e3;
        return 10 > a ? "刚刚" : 60 > a ? Math.round(a) + "秒前" : 3600 > a ? Math.round(a / 60) + "分钟前" : 86400 > a ? Math.round(a / 3600) + "小时前" : this.format(t)
    }
}

module.exports = {
    timeago: timeago
}

