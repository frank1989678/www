!(function($) {
	var modal = '<select name="areaSelect" />';
	var cache = {};
	
	if (typeof CITYLIST !== 'undefined') {
		cache = CITYLIST;
		CITYLIST = {};
	}

	function addOptions($wrap, data, currentId) {
		var arr = [];
		arr.push('<option value="">请选择...</option>');
		$.each(data || {}, function(value, item){
			var select = value == currentId ? '" selected="selected"' : '';
			arr.push('<option value="', value, '"', select , '>', item.name, '</option>');
		});

		$wrap.html(arr.join(''));
	}

	function getData(depth1, depth2) {	
		if (cache[depth1]) {
			if (depth2 === '') {
				return {};

			} else if (depth2) {
				if (cache[depth1]['node'][depth2]) {
					return cache[depth1]['node'][depth2]['node'];
				}
				return {};
			} 
			return cache[depth1]['node'];
		}
		return {};
	}


	$.fn.areaSelect = function() {
		return this.each(function() {	
			var $input = $(this);
			var $select_1 = $(modal).insertAfter($input);
			var $select_2 = $(modal).insertAfter($select_1);
			var $select_3 = $(modal).insertAfter($select_2);
			var ids = $input.val().split(',');
			var val0 = ids[0];
			var val1 = ids[1];
			var val2 = ids[2];


			addOptions($select_1, cache, val0);
			addOptions($select_2, getData(val0), val1);
			addOptions($select_3, getData(val0, val1), val2);

			$select_1.on('change', function() {
				val0 = this.value;
				ids[0] = val0;
				ids.splice(1,2)
				addOptions($select_2, getData(val0));
				addOptions($select_3);
				$input.val(ids.join(','));
			});
			$select_2.on('change', function() {
				val1 = this.value;
				ids[1] = val1;
				ids.splice(2,1);
				addOptions($select_3, getData(val0, val1));
				$input.val(ids.join(','));
			});
			$select_3.on('change', function() {
				val2 = this.value;
				ids[2] = val2;
				$input.val(ids.join(','));
			});
		});
	}
})(jQuery);