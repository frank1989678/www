!(function($) {
    /**
     * @class Class for calculating pagination values
     */
    $.PaginationCalculator = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
    };

    $.extend($.PaginationCalculator.prototype, {
        /**
         * Calculate the maximum number of pages
         * @method
         * @returns {Number}
         */
        numPages: function() {
            return Math.ceil(this.maxentries / this.opts.items_per_page);
        },
        /**
         * Calculate start and end point of pagination links depending on 
         * current_page and num_display_entries.
         * @returns {Array}
         */
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

    // Initialize jQuery object container for pagination renderers
    $.PaginationRenderers = {};

    /**
     * @class Default renderer for rendering pagination links
     */
    $.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.PaginationCalculator(maxentries, opts);
    };
    $.extend($.PaginationRenderers.defaultRenderer.prototype, {
        /**
         * Helper function for generating a single link (or a span tag if it's the current page)
         * @param {Number} page_id The page id for the new item
         * @param {Number} current_page 
         * @param {Object} appendopts Options for the new item: text and classes
         * @returns {jQuery} jQuery object containing the link
         */
        createLink: function(page_id, current_page, appendopts) {
            var lnk, np = this.pc.numPages();
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
            appendopts = $.extend({
                text: page_id + 1,
                classes: ""
            }, appendopts || {});
            if (page_id == current_page) {
                lnk = $("<span class='current'>" + appendopts.text + "</span>");
            } else {
                lnk = $("<a>" + appendopts.text + "</a>")
                    .attr('href', this.opts.link_to.replace(/__id__/, page_id));
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
        // Generate a range of numeric links 
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

            if (this.opts.pageInfo) {
                fragment.append('第' + (current_page + 1) + '页/共' + np + '页（共' + this.maxentries + '行）');
            }

            // Generate "Previous"-Link
            if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
                fragment.append(this.createLink(current_page - 1, current_page, {
                    text: this.opts.prev_text,
                    classes: "prev",
                    rel: "prev"
                }));
            }
            // Generate starting points
            if (interval.start > 0 && this.opts.num_edge_entries > 0) {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {
                    classes: 'sp'
                });
                if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
                    $("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
            }
            // Generate interval links
            this.appendRange(fragment, current_page, interval.start, interval.end);
            // Generate ending points
            if (interval.end < np && this.opts.num_edge_entries > 0) {
                if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
                    $("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
                begin = Math.max(np - this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {
                    classes: 'ep'
                });

            }
            // Generate "Next"-Link
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

    // Extend jQuery
    $.fn.pagination = function(maxentries, opts) {

        // Initialize options with default values
        opts = $.extend({
            pageInfo: true,
            items_per_page: 10,
            num_display_entries: 11,
            current_page: 0,
            num_edge_entries: 0,
            link_to: "javascript:;",
            prev_text: "Prev",
            next_text: "Next",
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
            renderer, links, current_page, texts;

        /**
         * This is the event handling function for the pagination links. 
         * @param {int} page_id The new page number
         */
        function paginationClickHandler(evt) {
            var links,
                new_current_page = $(evt.target).data('page_id'),
                continuePropagation = selectPage(new_current_page);
            if (!continuePropagation) {
                evt.stopPropagation();
            }
            return continuePropagation;
        }

        /**
         * This is a utility function for the internal event handlers. 
         * It sets the new current page on the pagination container objects, 
         * generates a new HTMl fragment for the pagination links and calls
         * the callback function.
         */
        function selectPage(new_current_page) {
            // update the link display of a all containers
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, paginationClickHandler);
            containers.empty();
            links.appendTo(containers);
            // call the callback and propagate the event if it does not return false
            var continuePropagation = opts.callback(new_current_page, containers);
            return continuePropagation;
        }

        // -----------------------------------
        // Initialize containers
        // -----------------------------------
        current_page = parseInt(opts.current_page, 10);
        containers.data('current_page', current_page);
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;

        if (!$.PaginationRenderers[opts.renderer]) {
            throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
        }
        renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);

        // Attach control events to the DOM elements
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

        // When all initialisation is done, draw the links
        links = renderer.getLinks(current_page, paginationClickHandler);
        containers.empty();
        if (np > 1 || opts.show_if_single_page) {
            links.appendTo(containers);
        }
        // call callback function
        if (opts.load_first_page) {
            opts.callback(current_page, containers);
        }
    }; // End of $.fn.pagination block


    function Page(options) {
        var defaults = {
            pageIndex: 1,
            pageSize: 10,
            title: '',
            type: 'POST',
            wrapId: '#tbody', // 内容区域
            template: 'tableTemp', // 模板容器
            pageId: '.pagination', // 页码容器
            pageInfo: true, // 分页信息
            request: false, // 初始化后立即请求数据
            gotop: true, // 回滚到顶部
            pageNum: [10, 20, 50, 100], // 开启每页显示数目选择
            api: {
                name: '', //页面标题
                del: '', // 删除操作接口
                add: '', // 新增操作接口
                edit: '' // 编辑操作接口
            }
        }
        this.opts = $.extend(defaults, options || {});
        this.$tbody = $(this.opts.wrapId);
        this.$pageWrap = $(this.opts.pageId);
        this.totalSize = 0;
        this.size = this.opts.pageSize;
        this.idx = this.opts.pageIndex;
        this.pageInit = false; // 是否已分页
        this.params = {};
        this.init();
    }

    Page.prototype = {
        init: function() {
            var that = this;
            that.cbx();
            that.pageSizeAction();
            that.bindEvent();
            that.opts.request && that.request();
        },
        cbx: function() {
            var that = this;
            var $cbxs = that.$tbody.prev().find('.cbx');
            that.$cbxs = $cbxs;
            // 全选
            $cbxs.on('click', function() {
                var checked = this.checked;
                that.$tbody.find('.cbx').each(function() {
                    this.checked = checked;
                })
            }).prop('checked', false);

            // 单个选择
            that.$tbody.on('click', '.cbx', function() {
                var checked = this.checked;
                if (checked) {
                    that.$tbody.find('.cbx').each(function() {
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
        },
        pageSizeAction: function() {
            var that = this;
            if ($.isArray(that.opts.pageNum)) {
                var $action = that.$pageWrap.prev('.action');
                var temp = [];
                $.each(that.opts.pageNum, function() {
                    temp.push('<option value="' + this + '">每页' + this + '行</option>');
                })
                if ($action.length === 0) {
                    $action = $('<div class="action hide"></div>');
                }
                temp.push('</select>');
                temp.unshift('<select class="slt">');
                $action.append(temp.join('')).insertBefore(that.$pageWrap);
                $action.find('.slt').on('change', function() {
                    that.idx = 1;
                    that.pageInit = false;
                    that.size = this.value || that.opts.pageSize;
                    that.request();
                })
            }
        },
        // 新增、编辑、删除
        bindEvent: function() {
            var that = this;
            var api = that.opts.api;
            // 编辑
            that.$tbody.on('click', '.j_edit', function() {
                var keyId = $(this).data('id');
                var $form = _add(); // 打开弹出框
                fx.ajax(api.edit, 'GET', {key: keyId}, function(res) {
                    $form.find('.ipt, .slt').each(function(i, item) {
                        this.value = res.data[this.name] || '';
                        $(this).hasClass('slt') && $(this).trigger('change.select2');
                    })
                })
            })

            // 删除
            that.$tbody.on('click', '.j_del', function() {
                var keyId = $(this).data('id');
                that.del({key: keyId}, '是否删除此' + api.name + '信息？');
            })

            // 批量删除
            that.$pageWrap.prev().find('.del-all').on('click', function() {
                var index = [];
                that.$tbody.find('.cbx:checked').each(function() {
                    index.push(this.value);
                })
                if (index.length === 0) {
                    $.notify({
                        title: '请勾选要删除的项',
                        type: 'danger'
                    })
                } else {
                    that.del({key: index.join(',')}, '是否删除选中的' + index.length + '条' + api.name + '信息？');
                }
                try{
                    that.$cbxs.prop('checked', false);
                } catch(err) {}
            })
        },
        // 单项删除、批量删除 params{key: 1,2,3,4,5}
        del: function(params, text) {
            var that = this;
            var api = that.opts.api;
            layer.open({
                title: '&nbsp;',
                area: '600px',
                skin: 'layer-confirm', 
                content: text,
                btn: ['取消', '确定'],
                btn2: function() {
                    layer.closeAll();
                    fx.ajax(api.del, 'GET', params, function() {
                        $.notify({
                            title: '删除成功'
                        })
                        that.reload();
                    }, function(msg, res) {
                        $.notify({
                            title: res.msg
                        })
                    })
                }
            })
        },
        request: function(params) {
            var that = this;
            var opts = that.opts;
            $.each(params || {}, function(i, item) {
                if (item.value) {
                    that.params[item.name] = item.value;
                } else {
                    delete that.params[item.name];
                }
                that.idx = 1;
                that.pageInit = false;
            })

            that.params.pageSize = that.size;
            that.params.pageIndex = that.idx;
            that.params.pageStart = (that.idx - 1) * that.size;

            fx.ajax(opts.url, opts.type, that.params, function(res) {
                that.$tbody.html(template(opts.template, res));
                that.$pageWrap.prev('.action').show();
                opts.gotop && window.scrollTo(0, 0);
                that.totalSize = res.totalSize;
                that.paginate();
                if (typeof opts.callback === 'function') {
                    opts.callback(res);
                }
            }, function(msg, res) {
                that.$tbody.empty();
                that.$pageWrap.empty();
                $.notify({
                    title: msg
                })
            })
        },
        reload: function() {
            var that = this;
            that.request();
        },
        paginate: function() {
            var that = this;
            if (that.pageInit) {
                return this;
            }
            function pageselectCallback(pageIndex) {
                that.idx = pageIndex + 1;
                that.request();
            }
            that.$pageWrap.pagination(that.totalSize, {
                pageInfo: that.opts.pageInfo,
                num_edge_entries: 2,
                callback: pageselectCallback,
                prev_text: '上一页',
                next_text: '下一页',
                items_per_page: that.size // 每页显示数量
            });
            that.pageInit = true;
        },
        destory: function() {
            that.$pageWrap.prev().find('.slt').off();
        }
    }


    window.Page = Page;
})(jQuery);

// 新增
function _add() {
    var $temp = $('#tempForm');
    var $form = $temp.find('form');
    $form[0].reset();
    $form.find('.slt').trigger('change.select2');
    $('body').addClass('noscroll');
    layer.open({
        type: 1,
        area: ['600px'],
        content: $temp,
        btn: ['取消', '确定'],
        btn2: function() {
            $form.submit();
            return false;
        },
        end: function() {
            $('body').removeClass('noscroll');
        }
    })
    return $form;
}
