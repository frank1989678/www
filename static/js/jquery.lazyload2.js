!(function($, window) {
    var $window = $(window);
    $.fn.lazyload = function(options) {
        var elements = this;
        var settings = {
            threshold       : 80,
            effectSpeed		: 700,
            effect          : 'fadeIn',
            dataAttribute  	: 'data-original',
            defaultImg      : 'images/default-img.png'
        };

        $.extend(settings, options || {});

        function update() {
            var counter = 0;
            var stop = $window.scrollTop();
            var winHeight = window.innerHeight ? window.innerHeight : $window.height();

            elements.each(function() {
            	var y = $(this).offset().top,
            		h = $(this).height();

            	if (stop >= y + h + settings.threshold) {
            		// 图片在可视区域的上面
            	} else if (stop > y - winHeight - settings.threshold) {
					counter = 0;
                    $(this).trigger('appear');
            	}
            });
        }

        elements.each(function() {
            var self = this;
            var $self = $(this);
            var original = $self.attr(settings.dataAttribute) || settings.defaultImg;
            self.loaded = false;
            $self.one('appear', function() {
                if (!self.loaded) {
		            self.loaded = true;
		            var img = new Image();
		            img.onload = function() {
                		$self.attr('src', original).hide()[settings.effect](settings.effectSpeed);
		            }
		            img.src = original;
		            var temp = $.grep(elements, function(element) {
                        return !element.loaded;
                    });
                    elements = $(temp);
                }
            })
        });

        $window.on('resize scroll', function() {
            update();
        })
        update();
    };

})(jQuery, window);