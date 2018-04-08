/*
 实现翻页功能
 by gyx
 */
1;
define([
    'util/act/gesture.js',
    'util/act/page.js',
    'zepto.js'
], function(Gesture, Page, $) {

    var emptyPage = new Page($('<div></div>'));
    //翻页完成，判断翻页方向并完成剩余翻页
    function end(offsetX, offsetY) {
        var offset = this.dir == 'h' ? offsetX : offsetY;
        var prev = this.prev(), next = this.next(), current = this.current();
        //TODO:阈值做成可调节
        if (next != emptyPage && offset < -this.hold) {
            this.nextPage();
        } else if (prev != emptyPage && offset > this.hold) {
            this.prevPage();
        } else {
            current.show('current');
            prev.hide('prev');
            next.hide('next');
            if (this.options.bigBuffer) {
                this.prev(2).hide('prev2');
                this.next(2).hide('next2');
            }
        }
    }

    function moving(offsetX, offsetY) {
        var offset = this.dir == 'h' ? offsetX : offsetY;
        var margin = this.dir == 'h' ? window.innerWidth : window.innerHeight;
        if (!this.options.margindrag || (!(offset > 0 && this.prev() == emptyPage) && !(offset < 0 && this.next() == emptyPage))) {

            this.prev().showing(offset - margin, 'prev', offset);
            this.current().showing(offset, "current", offset);
            this.next().showing(offset + margin, 'next', offset);
            this.options.moving && this.options.moving(offset, offsetY);
        }
    }

    //TODO: 增加方向和页面联动选项
    function Pageable(pages, container, options) {
        this.options = options || {};
        this.hold = options.hold || 20;
        this.pages = pages;
        this._currentIndex = this.options.startIndex || 0;
        var _this = this;
        this.dir = 'h';
        if (this.options.dir == 'ver') {
            this.dir = 'v'
        }
        this.gesture = new Gesture(container, this.dir, {
            begin: function (offsetX, offsetY) {
                options.begin && options.begin();
                Pageable.root.removeClass('automove');
            },
            moving: function (offsetX, offsetY) {
                moving.call(_this, offsetX, offsetY);
            },
            end: function (offsetX, offsetY) {
                Pageable.root.addClass('automove');
                end.call(_this, offsetX, offsetY);
                options.end && options.end();
            }
        });
    }

    Pageable.root = $('body')
    Pageable.root.addClass('automove');
    Pageable.prototype = {
        moving: moving,
        end: end,
        next: function (count) {
            var dest = this._currentIndex + (count || 1);
            if(this.options.cycle){
                dest = (dest + this.pages.length) % this.pages.length;
            }
            return this.pages[dest] || emptyPage;
        },
        current: function () {
            return this.pages[this._currentIndex] || emptyPage;
        },
        prev: function (count) {
            var dest = this._currentIndex - (count || 1);
            if(this.options.cycle){
                dest = (dest + this.pages.length) % this.pages.length;
            }
            return this.pages[dest] || emptyPage;
        },
        nextPage: function () {
            var prev = this.prev(), next = this.next(), current = this.current();
            current.hide('prev');
            next.show('current');
            if (this.options.bigBuffer) {
                prev.hide('prev2');
                this.next(2).hide('next');
            } else {
                //只保留最近的3页显示，提高性能
                prev.hide('full');
                this.next(2).prepare();
            }
            this._currentIndex++;
            if(this.options.cycle){
                this._currentIndex = this._currentIndex % this.pages.length;

                var _this = this;
                _this.next().dom.css('display','none');
                setTimeout(function () {
                    setTimeout(function(){
                        _this.next().dom.css('display','');
                    },10);
                    _this.next().hide('next');
                },10);
            }

            this.options.changed && this.options.changed(this._currentIndex);
        },
        prevPage: function () {
            var prev = this.prev(), next = this.next(), current = this.current();
            current.hide('next');
            prev.show('current');
            if (this.options.bigBuffer) {
                next.hide('next2');
                this.prev(2).hide('prev');
            } else {
                //只保留最近的3页显示，提高性能
                next.hide('full');
                this.prev(2).prepare();
            }
            this._currentIndex--;
            if(this.options.cycle){
                this._currentIndex = (this._currentIndex + this.pages.length) % this.pages.length;
            }
            this.options.changed && this.options.changed(this._currentIndex);
        },
        goPage: function (index) {
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].dom.removeClass('prev').removeClass('current').removeClass('next');
            }
            for (var i = 0; i < index; i++) {
                this.pages[i].dom.addClass('prev');
            }
            this.pages[i].dom.addClass('current');
            for (var i = index + 1; i < this.pages.length; i++) {
                this.pages[i].dom.addClass('next');
            }
            this._currentIndex = index;
            this.current().prepare();
            this.next().prepare();
            this.prev().prepare();
	        this.options.end && this.options.end();   
        },
        destory: function () {
            this.options = null;
            this.pages = null;
            this.gesture.destory();
            this.gesture = null;
        },
        active: function (value) {
            this.gesture.active(value);
            if (value) {
                this.pages[this._currentIndex].show();
            }
        },
        constructor: Pageable
    }
    return Pageable;
});