var second = Math.floor(lag % 60);    
var minite = Math.floor((lag / 60) % 60);
var hour = Math.floor((lag / 3600) % 24);
var day = Math.floor((lag / 3600) / 24);
var ms = (parseInt(mst%1000).toString()).charAt(0);

  // 2020-12-12转2020年12月12日（注意是否需要去掉数字前面的0）
  return time.replace(/(\d{4})-0?(\d+)-0?(\d+)/, '$1年$2月$3日')
  return time.replace(/(\d{4})-(\d+)-(\d+)/, '$1年$2月$3日').replace(/([^\u0000-\u00FF])0/, '$1');

