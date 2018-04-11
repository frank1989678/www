// 设置打印页眉页脚为空，
// 需要将ie的安全模式设置成“中”，如果javascript脚本中报这个错误， 还应将IE的安全设置“不允许运行未标记为安全的activeX控件”启用即可。
function pagesetup_null() {
    // 打印机驱动
    $('body').append('<object id="WebBrowser" height="0" width="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>');

    var hkey_root,hkey_path,hkey_key;
    hkey_root="HKEY_CURRENT_USER";
    hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
    try{
        var RegWsh = new ActiveXObject("WScript.Shell");
        hkey_key="header";
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
        hkey_key="footer";
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key, "&b第 &p 页/共 &P 页&b"); 
    }catch(e){}
}
pagesetup_null();

// 打印
function _print(url) {
    $('body').addClass('printing');
    try {
        WebBrowser.ExecWB(7,1);
    } catch (err) {
        window.print();
    }
    $('body').removeClass('printing');
}

// 取消打印
function _close() {
    $('.print').empty().hide();
}


// 获取时间
function getNowFormatDate() {
    var date   = new Date();
    var year   = date.getFullYear();
    var month  = date.getMonth() + 1
    var day    = date.getDate();
    var hour   = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return ([year, '-', month, '-', day, '-', hour, ':', minute, ':', second]).map(function (n) {
        if (n < 10) {
            n = '0' + n;
        }
        return n;
    }).join('');
} 


function DataTable(options) {
    var defaults = {
        pageIndex: 0,
        pageSize: 10,
        wrap: '#tbody',
        temp: 'tableTemp',
        pageWrap: '.pagination',
        pageInfo: true,
        msg: '已添加'
    }
    this.opts = $.extend(defaults, options || {});
    this.$wrap = $(this.opts.wrap);
    this.$pageWrap = $(this.opts.pageWrap);
    this.$action = this.$pageWrap.prev();
    this.cacheData = [];
    this.tempData = [];
    this.size = this.opts.pageSize;
    this.page = this.opts.pageIndex;
    this.iid = {};
    this.init();
}
DataTable.prototype = {
    init: function() {
        this.cbx();
    },
    cbx: function() {
        var that = this;
        var $tbody = that.$wrap;
        var $cbxs = $tbody.prev().find('.cbx');
        // 全选
        $cbxs.on('click', function() {
            var checked = this.checked;
            $tbody.find('.cbx').each(function() {
                this.checked = checked;
            })
        }).prop('checked', false);

        // 单个选择
        $tbody.on('click', '.cbx', function() {
            var checked = this.checked;
            if (checked) {
                $tbody.find('.cbx').each(function() {
                    if (this.checked === false) {
                        checked = false;
                        return false;
                    }
                });
                $cbxs.prop('checked', checked);
            } else {
                $cbxs.prop('checked', false);
            }
        });

        // 删除一行
        $tbody.on('click', '.del', function() {
            var idx = $(this).closest('tr').index() + that.page * that.size;
            that.iid[that.cacheData[idx]['id']] = false;
            that.cacheData.splice(idx, 1);
            that.datatable();
        })

        // 批量删除
        that.$action.find('.del-all').on('click', function() {
            var index = [];
            $tbody.find('.cbx:checked').each(function() {
                index.push($(this).closest('tr').index());
            })
            // 倒序
            index.sort(function(a, b){return b - a});
            $.each(index, function(i, key) {
                var idx = key + that.page * that.size;
                that.iid[that.cacheData[idx]['id']] = false;
                that.cacheData.splice(idx, 1);
            })
            if (index.length > 0) {
                that.datatable();
            } else {
                $.notify({
                    title: '请勾选要删除的项',
                    type: 'danger'
                })
            }
            $cbxs.prop('checked', false);
        })

        // 每页显示
        that.$action.find('.slt').on('change', function() {
            that.page = 0;
            that.size = parseInt(this.value, 10);
            that.datatable();
        }).trigger('change');
    },
    datatable: function() {
        var that = this;
        var total = that.cacheData.length;
        var pageselectCallback = function(index) {
            that.page = index;
            that.datatable();
        }
        that.$pageWrap.pagination(total, {
            num_edge_entries: 2,
            callback: pageselectCallback,
            prev_text: '&nbsp;',
            next_text: '&nbsp;',
            current_page: that.page,
            items_per_page: that.size
        });
        var start = that.page * that.size;
        var end = start + that.size;
        var data = that.cacheData.slice(start, end);
        that.$wrap.html(template(that.opts.temp, {list:data}));
        if (total > 0) {
            that.$pageWrap.prepend('<div class="p-size">第' + (that.page + 1) + '页/共' + Math.ceil(total/that.size) + '页（共' + total + '行）</div>');
        }  
    },
    refresh: function(data) {
        this.cacheData = data.concat(this.cacheData);
        this.datatable();
    },
    add: function(data) {
        var that = this;
        var newData = [];
        $.each(data, function(i, item) {
            if (that.iid[item.id] !== true) {
                that.iid[item.id] = true;
                newData.push(item);
            } else {
                $.notify({
                    title: that.opts.msg
                })
            }
        })
        if (newData.length > 0) {
            that.refresh(newData);
        }
    },
    remove: function(id, callback) {
        var that = this;
        var result = false;
        $.each(that.cacheData, function(i, item) {
            if (item.streamId == id) {
                result = true;
                that.tempData = that.tempData.concat(that.cacheData.splice(i, 1));
                that.datatable();
                return false;
            }
        })
        if (typeof callback === 'function') {
            callback(result)
        }
    },
    remove2: function(id) {
        var that = this;
        var result = false;
        $.each(that.cacheData, function(i, item) {
            if (item.streamId == id) {
                result = true;
                that.cacheData.splice(i, 1)
                that.datatable();
                return false;
            }
        })
    },
    reset: function(data) {
        this.tempData = [];
        this.cacheData = data.concat([]); // copy一个array副本，避免data源被修改
        this.page = 0;
        this.datatable();
    },
    empty: function() {
        this.reset([]);
    }
}
