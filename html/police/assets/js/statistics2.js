function DataTable(options) {
    var defaults = {
        pageIndex: 0,
        pageSize: 5,
        wrap: '',
        temp: '',
        pageWrap: '',
        pageInfo: true
    }
    this.opts = $.extend(defaults, options || {});
    this.$wrap = $(this.opts.wrap);
    this.$pageWrap = $(this.opts.pageWrap);
    this.cacheData = [];
    this.tempData = [];
    this.size = this.opts.pageSize;
    this.page = this.opts.pageIndex;
    this.iid = {};
    this.init();
}
DataTable.prototype = {
    init: function() {
        // this.cbx();
    },
    cbx: function() {
        // 每页显示
        $('.action').find('.slt').on('change', function() {
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
        this.cacheData = data.concat([]);
        this.page = 0;
        this.datatable();
    }
}
var _pageInit = {
    init: function() {
        this.chart1();
        this.getDate();
        this.resize();
    },
    chart1: function() {
        this.myChart1 = echarts.init(document.getElementById('chart1'));
        this.option1 = {
            backgroundColor: '#104582',
            legend: {
                orient: 'vertical',
                data: [],
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                },
                top: 'middle',
                left: '65%',
                itemWidth: 12,
                itemHeight: 12,
                selectedMode: false
            },
            tooltip : {
                trigger: 'item',
                formatter: '{b}: {c} <br />占比({d}%)',
                backgroundColor: '#fff',
                borderColor: '#0199e1',
                borderWidth: 1,
                textStyle: {
                    color: '#000',
                    padding: 0
                }
            },
            series: [{
                type:'pie',
                radius: ['0%', '55%'],
                center: ['35%', '50%'],
                color: {
                    type: 'linear',
                    x: 0.5,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#fbfbfb' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#dadada' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                labelLine: {
                    show: false
                },
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center',
                        color: '#000',
                        fontSize: 18,
                        formatter: '{b} \n\n {c}'
                    }
                },
                data: []
            }, {
                type:'pie',
                radius: ['60%', '80%'],
                center: ['35%', '50%'],
                color: ['#6ce9f6', '#88c59a', '#95c75f', '#ffdb6f', '#f27048', '#e9413e', '#feafcb', '#d2a6ec', '#2cb6df'],
                label: {
                    show: false,
                },
                data: []
            }]
        };

        var $table = $('.tablebox');
        var flag = false;

        var dt = new DataTable({
            wrap: $table.find('tbody'),
            pageWrap: $table.find('.pagination'),
            temp: 'temp1'
        });

        // 点击内圆显示table列表
        this.myChart1.on('click', function (param) {
            if (param.name === '档案扫描总量') {
                $table.show();
                if (flag) {
                    return;
                }
                $.ajax({
                    url: 'json/temp2.json',
                    success: function(res) {
                        flag = true;
                        var total = 0;
                        $.each(res.data, function(i, item) {
                            total += parseInt(item.count, 10);
                        })
                        $.each(res.data, function(i, item) {
                            item.percent = (item.count / total * 100).toFixed(2);
                        })
                        dt.refresh(res.data);
                        $('.content').scrollTop(99999);
                    }
                })
            }
        });
    },
    getDate: function() {
        var that = this;
        this.option1.legend.data = ['注册登记','转移登记','变更登记','抵押登记','注销登记','转入业务','档案更正','其他'];
        this.option1.series[0].data = [
            {value:180, name:'档案扫描总量'}
        ]
        this.option1.series[1].data = [
            {value:20, name:'注册登记'},
            {value:20, name:'转移登记'},
            {value:30, name:'变更登记'},
            {value:29, name:'抵押登记'},
            {value:12, name:'注销登记'},
            {value:25, name:'转入业务'},
            {value:22, name:'档案更正'},
            {value:22, name:'其他'}
        ]
        this.myChart1.setOption(this.option1, false, true);
    },
    resize: function() {
        var that = this;
        var timer;
        var _resize = function() {
            that.myChart1.resize();
        }
        $(window).on('resize', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                _resize();
            }, 50);
        })
    }    
}