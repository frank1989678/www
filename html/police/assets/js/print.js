    // 打印后台地址与端口
    var ws;
    var wsUrl = 'ws://localhost:2012';
    
function connection() {
    if ('WebSocket' in window) {
        ws = new WebSocket(wsUrl);
    }
    else if ('MozWebSocket' in window) {
        ws = new MozWebSocket(wsUrl);
    } else {
        alert('当前浏览器不支持');
    }
    
    //注册各类回调
    ws.onopen = function () {
        //alert('连接打印后台成功');
    }
    ws.onclose = function () {
        //alert('与打印后台断开连接');
    }
    ws.onerror = function () {
        //alert('数据传输发生错误');
    }
    ws.onmessage = function (receiveMsg) {
        if(receiveMsg.data.split("|")[0] == "A_GetPrinterStatus"){
        
        var ret=receiveMsg.data.split("|")[1] ;
    if (ret == 0) {
        //document.getElementById("status").value = "无返回值";
        return; 
      }
    else if (ret== 1)
        {
        //document.getElementById("status").value = "打印机命令解析器忙碌中！";
        return; 
        }        
    else if (ret== 2)
        {
        //document.getElementById("status").value ="2 纸张用完或安装错误！";          //纸张用完或安装错误！
        return; 
    } 
    else if (ret== 4)
        {
        //document.getElementById("status").value ="4 碳带用完或安装错误！";                       //碳带用完或安装错误！";
        return;
        }  
     else if (ret== 8)
        {
        //document.getElementById("status").value ="8 打印批次文档中！";           //打印批次文档中！";
        return;
        }  
     else if (ret== 16)
        {
        //document.getElementById("status").value ="16 正在打印文件！";                 //正在打印文件！
        return;
        }  
     else if (ret== 32)
        {
        //document.getElementById("status").value = "32 打印机暂停！";                 //打印机暂停！
        return;
        }  
    else if (ret== 64)
        {
        //document.getElementById("status").value = "64 正在送出标签纸！";                 //正在送出标签纸！
        return;
        } 
    else if (ret== 9)
        {
        //document.getElementById("status").value = "9 打印机待机中！";                 //打印机待机中！
        return;
        } 
            
        }
    }
}






function sendMessage(dabh, lsh, clsbdh, hpzl, hphm) {
    //尝试向打印后台发送消息
    dabh = 'A-1-001-300982'
    txm ='1171227020057' 
    lsh ='1171227020057'
    clsbdh ='LHGGM663XG2030182'
    hpzl = '02';
    hphm = 'A08X5D'
    // hpzl-hphm 02-A08X5D
    ws.send('A_EnumUSB');
    ws.send('A_CreateUSBPort|1');
    //档案编号
    ws.send('A_Prn_Text_TrueType|50|150|60|Arial|1|900|0|0|0|AA|' + dabh + '|1');
    //条形码
    ws.send('A_Prn_Barcode|85|100|1|e|2|8|50|B|1|' + lsh);
    //流水号
    ws.send('A_Prn_Text_TrueType|140|65|60|Arial|1|900|0|0|0|BB|' + lsh + '|1');
    //车辆识别代号
    ws.send('A_Prn_Text_TrueType|50|38|60|Arial|1|900|0|0|0|CC|' + clsbdh + '|1');
    //车辆类型+车牌号          
    ws.send('A_Prn_Text_TrueType|50|9|60|Arial|1|900|0|0|0|DD|' + hpzl + '-' + hphm + '|1');
    ws.send('A_Print_Out|1|1|1|1');
    ws.send('A_ClosePrn');
}
