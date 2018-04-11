// 立即显示新增&编辑的数据 
function _reload() {
	if ($('#filter').length === 1) {
		$('#filter')[0].reset()
		$('#filter').trigger('submit')
	} else {
		window.location.reload(true);
	}
}


// 提交表单
function _submitForm() {
	var $temp = $('#tempForm');
	var $form = $temp.find('form');
	var pass = true;
	var tips = function() {
		$.notify({
			title: pageSetting.name + '信息没有填写完全',
			type: 'warning'
		})
		pass = false;
	}
	$form.find('.req input, .req select').each(function() {
		if (this.value == '') {
			tips();
			return false;
		}
	})
	$form.find('._cbx').each(function() {
		if ($(this).find('input:checked').length === 0 && pass) {
			tips();
			return false;
		}
	})
	if (pass) {
		// 根据iid的值来判断是新增(等于0时)或修改
		// 提交表单
		var data = {
			iid: pageSetting.iid
		}
		$.each($form.serializeArray(), function(i, item) {
			data[item.name] = item.value;
		})
		$.ajax({
			url: pageSetting.submitURL,
			data: data,
			success: function() {
				_reload();
			}
		})
	}
}

// 新增
function _add(status) {
    if (status) {
        $('#formDiv').show().prev().hide();
        $('#formDiv').find('form')[0].reset();
    } else {
        $('#formDiv').hide().prev().show();
        $('#formDiv').find('.tit').html('新增' + pageSetting.name);
    }
}

// 编辑
function _edit(id) {
	var $temp = $('#formDiv');
	var $form = $temp.find('form');
	$temp.find('.tit').html('编辑' + pageSetting.name);
	_add(1); // 显示form表单

    if (id) {
        $.ajax({
			url: pageSetting.getURL,
            data: {id: id},
            cache: false,
            success: function(res) {
                if (res.result === 'SUCCESS') {
	                $form.find('.ipt, .slt').each(function(i, item) {
	                    this.value = res.data[this.name] || '';
	                })
                }
            }
        })
	}
}
// 删除一行
function _del(id) {
	fx.confirm('确定要删除该' + pageSetting.name + '么？', function(k) {
		$.ajax({
			url: pageSetting.delURL,
			data: {id: id},
			success: function(res) {
				if (res.result === "SUCCESS") {
					$.notify({
						title: "删除成功",
						type: "success"
					})
				}
			}
		})
		layer.closeAll();
	})
}
