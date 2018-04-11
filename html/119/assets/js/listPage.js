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
function _add() {
	var $temp = $('#tempForm');
	var $form = $temp.find('form');
	pageSetting.iid = 0; // 保存iid
	$form[0].reset();
	$form.prev('.ftit').html('新增' + pageSetting.name);
	$form.find('.select2').trigger('change.select2');
	layer.open({
		fix: false,
		offset: '30px',
		area: '570px',
		type: 1,
		title: false,
		content: $temp
	})
}

// 编辑
function _edit(id) {
	var $temp = $('#tempForm');
	var $form = $temp.find('form');
	pageSetting.iid = id; // 保存iid
	$form[0].reset();
	$form.prev('.ftit').html(pageSetting.name + '信息编辑');
	if (id) {
		$.ajax({
			url: pageSetting.getURL,
			type: 'POST',
			data: {id: id},
			dataType: 'json',
			success: function(res) {
				$form.find('.ipt, .slt').each(function(i, item) {
					var k = res.data[this.name];
					if (typeof k === 'undefined' || k == 'undefined') {
						k = '';
					}
					this.value = k;
				})
				$form.find('.select2').trigger('change.select2');
				layer.open({
					fix: false,
					offset: '30px',
					area: '570px',
					type: 1,
					title: false,
					content: $temp
				})
			}
		})
	}
}

// 删除一行
function _del(id) {
	layer.confirm('确定要删除该' + pageSetting.name + '么？', function(k) {
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
		layer.close(k);
	})
}
