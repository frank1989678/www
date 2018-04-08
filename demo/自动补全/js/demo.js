;(function($, window, undefined) {

	var 
		keys  = {
			tab: 	9
			enter: 	13,
			esc: 	27,
			left: 	37,
			up: 	38,
			right: 	39,
			down: 	40
		},
		defaults = {
			ajaxSettings: {},
            autoSelectFirst: false,
            appendTo: document.body,
            serviceUrl: null,
            lookup: null,
            onSelect: null,
            width: 'auto',
            minChars: 1,
            maxHeight: 300,
            deferRequestBy: 0,
            zIndex: 9999,
            type: 'GET'
		};


	$.fn.autocomplete = function(options) {
		options = $.extend({}, defaults, options);
		$(this).initialize();
	}

	$.autocomplete.extend({
		initialize: function () {
			$(this).on('keydown', function (e) { that.onKeyPress(e); });
            $(this).on('keyup', function (e) { that.onKeyUp(e); });
            $(this).on('blur', function () { that.onBlur(); });
            $(this).on('focus', function () { that.onFocus(); });
            $(this).on('change', function (e) { that.onKeyUp(e); });
            $(this).on('input', function (e) { that.onKeyUp(e); });
		}
		onFocus: function () {
            var that = this;
            if (that.options.minChars <= that.el.val().length) {
                that.onValueChange();
            }
        },

        onBlur: function () {
            this.enableKillerFn();
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            $.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }

            options.orientation = that.validateOrientation(options.orientation, 'bottom');

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex
            });
        }
	})


}(jQuery, window))