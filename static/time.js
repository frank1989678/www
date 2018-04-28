var second = Math.floor(lag % 60);    
var minite = Math.floor((lag / 60) % 60);
var hour = Math.floor((lag / 3600) % 24);
var day = Math.floor((lag / 3600) / 24);
var ms = (parseInt(mst%1000).toString()).charAt(0);