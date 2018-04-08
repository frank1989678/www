/*jshint curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, boss:true, es5:true, laxbreak:true, browser:true, devel:true, jquery:true, node:true */
/*global define require window document */
/**
 * Created with IntelliJ IDEA.
 * User: stupig
 * Date: 14-6-25
 * Time: 下午10:23
 * To change this template use File | Settings | File Templates.
 */
'use strict';
/**
 * 页面的日期选择
 *
 * @module cookie
 */
define(["zepto.js", "mjs.js"], function($, mjs) {
    "use strict";

    var CLASS_PREFIX = 'J_date-',
        START_CLASS = 'start',
        START_DAY_CLASS = 'startDay',
        END_CLASS = 'end',
        HOUR_CLASS = 'hour',
        END_DAY_CLASS = 'endDay',
        SPAN_CLASS = 'select',
        ONE_DAY = 24 * 60 * 60 * 1000,
        start = generateStartDate(),
        end;

    function DatePicker(options) {
        if (!(this instanceof DatePicker)) {
            return new DatePicker(options);
        }

        var defaults = {
            start: 0,
            end: 0,
            cancel: none,
            maxLength: none,    // 时长，为0时是钟点房
            confirm: none
        };

        $.extend(defaults, options);

        if (options.start) {
            start = options.start;
        }

        if (options.end) {
            end = options.end;
        } else if (options.maxLength === 0) {
            end = start;
        } else {
            end = new Date(start + ONE_DAY).valueOf();
        }

        this.cancel = defaults.cancel;
        this.confirm = defaults.confirm;

        buildDatePicker();
        bindEvents.call(this, defaults);
    }

    DatePicker.prototype = {
        constructor: DatePicker,
        show: function () {
            $('.datepicker').removeClass('hide');
        },
        /**
         * 更新日期
         * @param st {Number} 时间戳
         * @param et {Number} 时间戳
         */
        setDate: function (st, et) {
            start = st;
            if (et) {
                end = et;
            } else {
                end = new Date(start + ONE_DAY).valueOf();
            }

            updateSelection();
        },
        /**
         * 获取日期
         * @returns {{start: *, end: *}}
         */
        getDate: function () {
            return {
                start: start,
                end: end
            }
        }
    };

    return DatePicker;

    function none() {}

    function buildDatePicker() {
        var data = generateCalendarData(),
            src,
            template;

        template = '\
            <div class="datepicker hide">\
                <div class="shade"></div>\
                <div class="datepicker-wrap">\
                    <header class="flexbox">\
                        <a class="J_cancel cancel" href="javascript:void(0)">取消</a>\
                        <p class="title weak J_title flex-1">' + (start !== end ? '拖动选择入住时间段' : '点击选择入住时间') + '</p>\
                        <a class="J_confirm confirm" href="javascript:void(0)">完成</a>\
                    </header>\
                        <div class="calendar">\
                        <div class="caption">  \
                            <ul class="flexbox">\
                                <: o.day.forEach(function (s) { :>\
                                    <li class="flex-1 <:= s.klass :>"><:= s.str :>\
                                <: }) :>\
                            </ul>\
                        </div>\
                        <ul class="content">\
                            <: o.date.forEach(function (d) { :>\
                                <: if (d.isBlank) { :>\
                                    <li class="date">\
                                <: } else { :>\
                                    <li class="date <:= d.klass :>" data-ts="<:= d.ts :>">\
                                        <div class="date-wrap">\
                                            <p><:= d.text :></p>\
                                            <span class="J_check-in check-in">入住</span>\
                                            <span class="J_check-out check-out">离店</span>\
                                        </div>\
                                <: }:>\
                            <: }) :>\
                        </ul>\
                    </div>\
                </div>\
            </div>\
        ';

        src = mjs.getTemplet(template, data);

        $('body').append(src);
    }

    function bindEvents(options) {
        if (options.maxLength === 0) {
            bindClickEvents();
        } else {
            bindDragNDropEvents();
        }
        bindBtnControlEvents.call(this, options);
    }

    function bindBtnControlEvents(options) {
        var that = this;

        $('.J_cancel').on('click', function (e) {
            $('.datepicker').addClass('hide');
            if ('function' === typeof that.cancel) {
                that.cancel();
            }
        });

        $('.J_confirm').on('click', function (e) {
            $('.datepicker').addClass('hide');
            if ('function' === typeof that.confirm) {
                if (options.maxLength === 0) {
                    var hour = Number($('.' + HOUR_CLASS).data('ts'));
                    that.confirm(hour, hour);
                } else {
                    var start = Number($('.' + START_CLASS).data('ts')),
                        end = Number($('.' + END_CLASS).data('ts'));

                    that.confirm(start, end);
                }
            }
        })
    }

    function bindClickEvents() {
        var $content = $('.calendar .content');

        $content.on('click', function (e) {
            var $current = $(e.target).closest('.date');

            start = end = $current.data('ts');
            updateSelection();
        });
    }

    function bindDragNDropEvents() {
        var $content = $('.calendar .content'),
            isSelecting = false,
            isStart = true,
            $datePicker = $('.datepicker'),
            $start = $datePicker.find('.' + START_CLASS),
            $end = $datePicker.find('.' + END_CLASS),
            $start, $end, span;

        start = Number($start.data('ts'));
        end = Number($end.data('ts'));

        $content
            .on('touchstart', function (e) {

                if (e.touches) {
                    if (e.touches.length > 1) {
                        return isSelecting = false;
                    } else {
                        isSelecting = true;
                    }

                }

                var $current = $(e.target).closest('.date'),
                    current = Number($current.data('ts')),
                    $temp, temp;

                if (current === start || current === end) {
                    isStart = current === start ? true : false;
                    return;
                }

                $temp = $(e.target).closest('.date');
                temp = Number($temp.data('ts'));

                if (isNaN(temp) || $temp.hasClass(END_DAY_CLASS)) {
                    return isSelecting = false;
                }

                $start = $temp;
                start = temp;
                $end = $('.' + CLASS_PREFIX + (start + ONE_DAY));
                end = Number($end.data('ts'));
                span = (end - start) / ONE_DAY;

                updateSelection();

            })
            .on('touchmove', function (e) {
                e.preventDefault();

                if (!isSelecting) return;

                var x = e.touches[0].pageX - window.pageXOffset,
                    y= e.touches[0].pageY - window.pageYOffset,
                    $current = $(document.elementFromPoint(x, y)).closest('.date'),
                    $temp, temp;

                if (!$current.length) return;

                if (isStart) {
                    $start = $current;
                    start = Number($start.data('ts'));
                    if (!start) {
                        start = generateStartDate();
                        $start = $('.' + CLASS_PREFIX + start);
                    }
                } else {
                    $end = $current;
                    end = Number($end.data('ts'));
                    if (!end) {
                        end = new Date(start + ONE_DAY);
                        $end = $('.' + CLASS_PREFIX + end);
                    }
                }

                if (isStart && start > end) {
                    // 相当于拖动end
                    isStart = false;
                    $temp = $start;
                    $start = $end;
                    $end = $temp;
                    temp = start;
                    start = end;
                    end = temp;

                } else if (!isStart && end < start) {
                    // 相当于拖动start
                    isStart = true;
                    $temp = $end;
                    $end = $start;
                    $start = $temp;
                    temp = end;
                    end = start;
                    start = temp;
                } else if (start === end) {
                    return;
                }

                span = (end - start) / ONE_DAY;
                updateSelection();
            })
            .on('touchend mouseup', touchEndHandler)
            .on('touchcancel', touchEndHandler);

        function touchEndHandler (e) {
            if (!isSelecting) return;

            isSelecting = false;

            // 更新start与end
            start = Number($('.' + START_CLASS).data('ts'));
            end = Number($('.' + END_CLASS).data('ts'));

            $('.J_title')
                .removeClass('weak')
                .text('您将入住' + span + '晚');
        }
    }

    /**
     * 更新选中
     */
    function updateSelection() {
        var $datePicker = $('.datepicker');

        $datePicker.find('.' + START_CLASS).removeClass(START_CLASS);
        $datePicker.find('.' + END_CLASS).removeClass(END_CLASS);
        $datePicker.find('.' + SPAN_CLASS).removeClass(SPAN_CLASS);
        $datePicker.find('.' + HOUR_CLASS).removeClass(HOUR_CLASS);

        if (start !== end) {
            $('.' + CLASS_PREFIX + start).addClass(START_CLASS);
            $('.' + CLASS_PREFIX + end).addClass(END_CLASS);

            for (var i=start; i < end; i+=ONE_DAY ) {
                $('.' + CLASS_PREFIX + i).addClass(SPAN_CLASS);
            }
        } else {
            $('.' + CLASS_PREFIX + start).addClass(HOUR_CLASS);
        }
    }

    function generateCalendarData () {
        var now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth(),
            date = now.getDate(),
            day = now.getDay(),
            i = -day,
            ret = {
                date: [],
                day: [
                    {str: '日', klass: 'weekend'},
                    {str: '一', klass: ''},
                    {str: '二', klass: ''},
                    {str: '三', klass: ''},
                    {str: '四', klass: ''},
                    {str: '五', klass: ''},
                    {str: '六', klass: 'weekend'}
                ]
            };

        for (; i < 30; i++) {
            var tmpDate = new Date(year, month, date + i),
                tmpData = {};

            tmpData = {
                text: tmpDate.getDate(),
                ts: tmpDate.valueOf(),
                klass: ' ' + CLASS_PREFIX + tmpDate.valueOf()
            };

            if (start && tmpDate.valueOf() === start) {
                if (start !== end) {
                    tmpData.klass += ' ' + START_CLASS + ' ' + START_DAY_CLASS;
                } else {
                    tmpData.klass += ' ' + HOUR_CLASS;
                }

            } else if (end && tmpDate.valueOf() === end) {
                if (start !== end) {
                    tmpData.klass += ' ' + END_CLASS;
                } else {
                    tmpData.klass += ' ' + HOUR_CLASS;
                }
            }

            if (i === 29) {
                tmpData.klass += ' ' + END_DAY_CLASS;
            }
            if (tmpDate.getDate() == 1) {
                tmpData.text = (tmpDate.getMonth() + 1) + '月';
            }
            if (i < 0) {
                tmpData.isBlank = true;
            }
            ret.date.push(tmpData);
        }

        return ret;
    }

    function generateStartDate() {
        var now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth(),
            date = now.getDate();

        return new Date(year, month, date).valueOf();
    }
});