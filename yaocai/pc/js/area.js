
!(function($){
// 地区级联菜单
	var citys = {};
	function getCity(url) {
		$.ajax({
			url: 'json/' + url + '.json',
			dataType: 'json',
			success: function(data) {
				citys[url] = data;
				fillCity(url);
			},
			error: function() {
				setTimeout(function() {
					getCity(url);
				}, 1e3);
			}
		});
	}

	function fillCity(val) {
		var arr = [];
		$.each(citys[val], function(i, item){
			arr.push('<span data-val="' + item.i + '">' + item.n + '</span>');
		});
		$('#jCity dd').html(arr.join(''));
	}

	$.ajax({
		url: 'json/index.json',
		dataType: 'json',
		success: function(data) {
			var arr = [];
			$.each(data, function(i, item){
				arr.push('<span data-val="' + item.i + '">' + item.n + '</span>');
			});
			arr.length > 10 && $('#jProvince dd').addClass('fold');
			$('#jProvince dd').html(arr.join(''));
		},
		error: function() {
			setTimeout(function() {
				fillProvince();
			}, 1e3);
		}
	});
	$('#jProvince').on('click', 'span', function() {
		var val = $(this).attr('data-val');
		$('#jCity dt').html('省/县').attr('data-val', '0');

		if (citys[val]) {
			fillCity(val);
		} else {
			getCity(val);
		}
	})
})(jQuery);

