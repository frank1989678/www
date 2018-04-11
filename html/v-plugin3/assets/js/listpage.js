// 页面重载
function _reload() {
    if ($('#filter').length === 1) {
        $('#filter')[0].reset()
        $('#filter').trigger('submit')
    } else {
        window.location.reload(true);
    }
}

// 新增
function add() {
    var $temp = $('#tempForm');
    var $form = $temp.find('form');
    $form[0].reset();
    $form.prev('.ftit').html('新增' + pageSetting.name);
    layer.open({
        area: '560px',
        type: 1,
        title: false,
        content: $temp
    })
}

// 编辑
function edit(id) {
    var $temp = $('#tempForm');
    var $form = $temp.find('form');
    $form[0].reset();
    $form.prev('.ftit').html('编辑' + pageSetting.name);
    if (id) {
        $.ajax({
            url: pageSetting.getURL,
            data: {id: id},
            // dataType: 'json',
            cache: false,
            success: function(res) {
                res = {data:{}}
                $form.find('.ipt, .slt').each(function(i, item) {
                    var k = res.data[this.name];
                    if (typeof k === 'undefined' || k == 'undefined') {
                        k = '';
                    }
                    this.value = k;
                })
                layer.open({
                    area: '560px',
                    type: 1,
                    title: false,
                    content: $temp
                })
            }
        })
    }
}

// 权限配置
function limits(id) {
    $.ajax({
        url: pageSetting.limit,
        dataType: 'json',
        data:{'id': id},
        success: function(res) {
            $.fn.zTree.init($('#ztree'), setting, res);
            layer.open({
                fix: false,
                area: '540px',
                type: 1,
                title: false,
                content: $('#treeForm')
            })
        },
        error: function() {
            $.notify({
                type: 'danger',
                title: '数据加载失败!'
            })
        }
    })
}

// 重置密码
function reset(id) {
    fx.confirm('确定重置密码', function() {
        $.ajax({
            url: pageSetting.resetURL,
            data: {id: id},
            dataType: 'json',
            cache: false,
            success: function(res) {
                if (res.result === "SUCCESS") {
                    $.notify({
                        title: '重置成功',
                        type: "success"
                    })
                    layer.closeAll();
                } else {
                    $.notify({
                        title: res.message,
                        type: res.result
                    })
                }
            }
        })
    });
}

// 删除
function del(id) {
    fx.confirm('确定要删除该' + pageSetting.name + '么？', function(k) {
        $.ajax({
            url: pageSetting.delURL,
            data: {id: id},
            dataType: 'json',
            cache: false,
            success: function(res) {
                if (res.result === "SUCCESS") {
                    $.notify({
                        title: "删除成功",
                        type: "success"
                    })
                    _reload();
                } else {
                    $.notify({
                        title: res.message,
                        type: res.result
                    })
                }
            }
        })
    });
}