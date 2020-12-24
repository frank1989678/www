// 正则表达式

// 只能输入正整数（正整数不包括0）
function checkVal(val, maxNum = 0) {
    // if (val == 0) {
    //     val = '';
    // } else {
    //     val = val.replace(/\D/g,'');
    // }
    // return val;
    val = val.replace(/^0/g, '').replace(/\D/g,'');
    return val && maxNum && maxNum < val ? maxNum : val;
}

// 最大数为1，2为小数
function checkVal(item, key) {
    const val = item[key];
    if (val.length > 1 && val.charAt(0) == 1) {
        item[key] = 1;
    } else if (val.length == 4 && val.indexOf('0.0') == 0) {
        const num = val.charAt(3);
        if (isNaN(num) || num == 0) {
            item[key] = '0.0';
        }
    } else if (val.length > 4) {
        item[key] = val.substring(0, 4);
    } else if (isNaN(val)) {
        item[key] = parseFloat(val) || '';
    } else if (val > 1) {
        item[key] = 1;
    }
}

// 限制最多4个字（仅支持输入汉字、字母或数字）
function checkNameValid(val) {
    return val.substring(0, 4).replace(/[^\u4E00-\u9FA5A-Za-z0-9]/g,'');
}