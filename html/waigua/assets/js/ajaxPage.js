/**
 * This jQuery plugin displays pagination links inside the selected elements.
 * This plugin needs at least jQuery 1.4.2
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
(function($) {
	$.PaginationCalculator = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
	};

	$.extend($.PaginationCalculator.prototype, {
		numPages: function() {
			return Math.ceil(this.maxentries / this.opts.items_per_page);
		},
		getInterval: function(current_page) {
			var ne_half = Math.floor(this.opts.num_display_entries / 2);
			var np = this.numPages();
			var upper_limit = np - this.opts.num_display_entries;
			var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
			var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);
			return {
				start: start,
				end: end
			};
		}
	});

	$.PaginationRenderers = {};
	$.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
		this.pc = new $.PaginationCalculator(maxentries, opts);
	};
	$.extend($.PaginationRenderers.defaultRenderer.prototype, {
		createLink: function(page_id, current_page, appendopts) {
			var lnk, np = this.pc.numPages();
			page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
			appendopts = $.extend({
				text: page_id + 1,
				classes: ""
			}, appendopts || {});
			if (page_id == current_page) {
				lnk = $("<span class='current'>" + appendopts.text + "</span>");
			} else {
				lnk = $("<a>" + appendopts.text + "</a>")
					.attr('href', this.opts.link_to.replace(/__id__/, page_id + 1));
			}
			if (appendopts.classes) {
				lnk.addClass(appendopts.classes);
			}
			if (appendopts.rel) {
				lnk.attr('rel', appendopts.rel);
			}
			lnk.data('page_id', page_id);
			return lnk;
		},
		appendRange: function(container, current_page, start, end, opts) {
			var i;
			for (i = start; i < end; i++) {
				this.createLink(i, current_page, opts).appendTo(container);
			}
		},
		getLinks: function(current_page, eventHandler) {
			var begin, end,
				interval = this.pc.getInterval(current_page),
				np = this.pc.numPages(),
				fragment = $("<div class='p-num'></div>");

			if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
				fragment.append(this.createLink(current_page - 1, current_page, {
					text: this.opts.prev_text,
					classes: "prev",
					rel: "prev"
				}));
			}
			if (interval.start > 0 && this.opts.num_edge_entries > 0) {
				end = Math.min(this.opts.num_edge_entries, interval.start);
				this.appendRange(fragment, current_page, 0, end, {
					classes: 'sp'
				});
				if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
					$("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
				}
			}
			this.appendRange(fragment, current_page, interval.start, interval.end);
			if (interval.end < np && this.opts.num_edge_entries > 0) {
				if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
					$("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
				}
				begin = Math.max(np - this.opts.num_edge_entries, interval.end);
				this.appendRange(fragment, current_page, begin, np, {
					classes: 'ep'
				});

			}
			if (this.opts.next_text && (current_page < np - 1 || this.opts.next_show_always)) {
				fragment.append(this.createLink(current_page + 1, current_page, {
					text: this.opts.next_text,
					classes: "next",
					rel: "next"
				}));
			}
			$('a', fragment).click(eventHandler);
			return fragment;
		}
	});

	$.fn.pagination = function(maxentries, opts) {
		opts = $.extend({
			items_per_page: 10,
			num_display_entries: 5,
			current_page: 0,
			num_edge_entries: 0,
			link_to: '#',
			link_to: 'javascript:void(0);',
			prev_text: "上一页",
			next_text: "下一页",
			ellipse_text: "...",
			prev_show_always: false,
			next_show_always: false,
			renderer: "defaultRenderer",
			show_if_single_page: false,
			load_first_page: false,
			callback: function() {
				return false;
			}
		}, opts || {});

		var containers = this,
			renderer, links, current_page;
		function paginationClickHandler(evt) {
			var links,
				new_current_page = $(evt.target).data('page_id'),
				continuePropagation = selectPage(new_current_page);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}

		function selectPage(new_current_page) {
			containers.data('current_page', new_current_page);
			links = renderer.getLinks(new_current_page, paginationClickHandler);
			containers.empty();
			links.appendTo(containers);
			var continuePropagation = opts.callback(new_current_page, containers);
			return continuePropagation;
		}

		current_page = parseInt(opts.current_page, 10);
		containers.data('current_page', current_page);
		maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;

		if (!$.PaginationRenderers[opts.renderer]) {
			throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
		}
		renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);

		var pc = new $.PaginationCalculator(maxentries, opts);
		var np = pc.numPages();
		containers.off('setPage').on('setPage', {
			numPages: np
		}, function(evt, page_id) {
			if (page_id >= 0 && page_id < evt.data.numPages) {
				selectPage(page_id);
				return false;
			}
		});
		containers.off('prevPage').on('prevPage', function(evt) {
			var current_page = $(this).data('current_page');
			if (current_page > 0) {
				selectPage(current_page - 1);
			}
			return false;
		});
		containers.off('nextPage').on('nextPage', {
			numPages: np
		}, function(evt) {
			var current_page = $(this).data('current_page');
			if (current_page < evt.data.numPages - 1) {
				selectPage(current_page + 1);
			}
			return false;
		});
		containers.off('currentPage').on('currentPage', function() {
			var current_page = $(this).data('current_page');
			selectPage(current_page);
			return false;
		});

		links = renderer.getLinks(current_page, paginationClickHandler);
		containers.empty();
		if (np > 1 || opts.show_if_single_page) {
			links.appendTo(containers);
		}
		if (opts.load_first_page) {
			opts.callback(current_page, containers);
		}
	};
})(jQuery);


function Page(options) {
    var defaults = {
        pageIndex: 1,
        pageSize: 10,
        wrap: '#tbody',
        temp: 'tableTemp',
        pageWrap: '.pagination',
        pageInfo: true,
        request: false,
        gotop: true,
        pageNum: true,
        debug: false
    }
    this.opts = $.extend(defaults, options || {});
    this.$wrap = $(this.opts.wrap);
    this.$pageWrap = $(this.opts.pageWrap);
    this.totalSize = 0;
    this.size = this.opts.pageSize;
    this.idx = this.opts.pageIndex;
    this.search = {};
    this.init();
}

Page.prototype = {
    init: function() {
        this.action();
        this.opts.request && this.request(true);
    },
    action: function() {
        var that = this;
        // 每页显示
        if (that.opts.pageNum) {
            that.$pageWrap.before('<div class="action"><select class="slt"><option value="10">每页10行</option><option value="20">每页20行</option><option value="50">每页50行</option><option value="100">每页100行</option></select></div>');
            $('.action').find('.slt').on('change', function() {
                that.idx = 1;
                that.size = this.value || this.opts.pageSize;
                that.request(true);
            }).val(that.opts.pageSize).trigger('change.select2');
        }
    },
    request: function(jqPage, data) {
        var that = this;

        $.each(data || {}, function(i, item) {
            if (item.value) {
                that.search[item.name] = item.value;
            } else {
                delete that.search[item.name];
            }
            that.idx = 1;
        })

        that.search.pageSize = that.size;
        that.search.pageIndex = that.idx;
        that.search.pageStart = (that.idx - 1) * that.size;

        that.opts.debug && that.log(that.search);

        fx.request(that.opts.url, that.search, function(res){
            that.opts.gotop && window.scrollTo(0, 0);
            that.totalSize = res.totalSize;
            that.$wrap.empty().html(template(that.opts.temp, res));
            that.paginate(jqPage);
            if (typeof that.opts.callback === 'function') {
                that.opts.callback(res);
            }
            that.res = res;
        });
    },
    paginate: function(refresh) {
        var that = this;
        function pageselectCallback(pageIndex) {
            that.idx = pageIndex + 1;
            that.request(false);
        }
        if (refresh) {
            that.$pageWrap.pagination(that.totalSize, {
                num_edge_entries: 2,
                callback: pageselectCallback,
                items_per_page: that.size // 每页显示数量
            });
        }
        that.opts.pageInfo && that.pageInfo();
    },
    // 分页信息
    pageInfo: function() {
        var that = this;
        that.$pageWrap.prepend('<div class="p-size">第' + that.idx + '页/共' + Math.ceil(that.totalSize/that.size) + '页（共' + that.totalSize + '行）</div>');
    },
    refresh: function(data, type, iid) {
        var that = this;
        var idx = 0;
        if (typeof iid === 'undefined') {
            iid = 'id';
        }
        if (that.res && that.res.list) {
            if (type == '0') {
                that.res.list.unshift(data);
                if (that.res.list.length > that.size) {
                    that.res.list.splice(-1, 1);
                }
                that.totalSize ++;
                that.paginate(true);
            } else {
                $.each(that.res.list, function(i, item) {
                    if (data[iid] == item[iid]) {
                        delete data[iid];
                        $.each(data, function(key, val) {
                            item[key] = data[key];
                        })
                        idx = i;
                        return false;
                    }
                })
            }
            that.$wrap.empty().html(template(that.opts.temp, that.res));
            var $tr = that.$wrap.find('tr').eq(idx).addClass('active');
            setTimeout(function() {
                $tr.removeClass('active');
            }, 2e3)
        }
    },
    log: function() {
        if (typeof console !== 'undefined') {
            $.each(this.search, function(key, val) {
                console.log(key + ':' + val)
            })
        }
    }
}