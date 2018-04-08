var BAIDU_OVERLAYS = {}; // 覆盖物列表

// 画图工具
!(function(window) {
    var dm;
    var idx = 1;
    var styleOptions = {
        strokeColor: 'red',    //边线颜色。
        fillColor: "green",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2,       //边线的宽度，以像素为单位。
        strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }

    function modifyName(id) {
        var oldName = BAIDU_OVERLAYS[id].name;
        var val = prompt('请输入名称', oldName);
        if (val) {
            BAIDU_OVERLAYS[id].name = val;
        }
    }

    function removeMarker(id) {
        map.removeOverlay(BAIDU_OVERLAYS[id].overlay);
        delete BAIDU_OVERLAYS[id];
    }

    function overlaycomplete(e) {
        var id = 'overlay' + (idx ++);
        var markerMenu = new BMap.ContextMenu();
        markerMenu.addItem(new BMap.MenuItem('重命名',function(){modifyName(id)}));
        markerMenu.addItem(new BMap.MenuItem('删除',function(){removeMarker(id)}));
        e.overlay.addContextMenu(markerMenu);
        BAIDU_OVERLAYS[id] = {
            type: e.drawingMode,
            overlay: e.overlay,
            name: id,
            path: e.overlay.getPath()
        }
        dm.close();
    }

    function drawingManager(opts) {
        dm = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableCalculate: false, //绘制完成后是否计算面积
            enableDrawingTool: true, //是否显示工具栏
            drawingType: BMAP_DRAWING_POLYGON,
            drawingToolOptions: {
                drawingModes: [
                    // BMAP_DRAWING_CLEAR,
                    // BMAP_DRAWING_MARKER,
                    // BMAP_DRAWING_POLYLINE,
                    BMAP_DRAWING_CIRCLE,
                    BMAP_DRAWING_RECTANGLE,
                    BMAP_DRAWING_POLYGON
                ],
                anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                offset: new BMap.Size(5, 5) //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });
         //添加鼠标绘制工具监听事件，用于获取绘制结果
        dm.addEventListener('overlaycomplete', overlaycomplete);
    }

    window.drawingManager = drawingManager;
})(window);

/**
 * @fileoverview 百度地图的轨迹跟随类，对外开放。
 * 用户可以在地图上自定义轨迹运动
 * 可以自定义路过某个点的图片，文字介绍等。
 * 主入口类是<a href="symbols/BMapLib.LuShu.html">LuShu</a>，
 * 基于Baidu Map API 1.2。.
 * @author Baidu Map Api Group
 * @version 1.2
 */
!(function(window) {
    //是否在多边形内（true:在内部，false:在外部）
    var _isInPolygon = function(pt, ply) {
        return BMapLib.GeoUtils.isPointInPolygon(pt, ply);
    };
    //是否在圆内（true:在内部，false:在外部）
    var _isInCircle = function(pt, circle) {
        return BMapLib.GeoUtils.isPointInCircle(pt, circle);
    };
    var _isInOverlay = function(pt, bds, type) {
        return type == 'circle' ? _isInCircle(pt, bds) : _isInPolygon(pt, bds);
    };

    var idx = 1;

    /**
     * @exports LuShu as BMapLib.LuShu
     * LuShu类的构造函数
     * @class LuShu <b>入口</b>。
     * 实例化该类后，可调用refresh等方法控制覆盖物的运动。
     * @constructor
     * @param {Map} map Baidu map的实例对象.
     * @param {Array} path 构成路线的point的数组.
     * @param {Json Object} opts 可选的输入参数
     */
    var LuShu = function(map, path, opts) {
        if (!path || path.length < 1) {
            return;
        }
        this._map = map;
        //存储一条路线
        this._path = path;
        //移动到当前点的索引
        this.i = 0;
        this.id = 'car' + (idx ++);
        //进行坐标转换的类
        this._projection = this._map.getMapType().getProjection();
        this._opts = {
            isCross: false,
            crossFn: null, // 越界回调
            showPath: false,
            icon: null,
            //默认速度 秒
            duration: 1e3,
            autoView: false, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整，如果有多辆车的时候需要关闭
            defaultContent: '',
            enableRotation: true //是否设置marker随着道路的走向进行旋转
        };
        this._setOptions(opts);
        this._rotation = 0; //小车转动的角度

        //如果不是默认实例，则使用默认的icon
        if (!this._opts.icon instanceof BMap.Icon) {
            this._opts.icon = defaultIcon;
        }
        if (typeof this._opts.crossFn !== 'function') {
            this._opts.crossFn = function() {};
        }
        this._addMarker();
    }

    LuShu.prototype = {
        /**
         * 根据用户输入的opts，修改默认参数_opts
         * @param {Json Object} opts 用户输入的修改参数.
         * @return 无返回值.
         */
        _setOptions: function(opts) {
            for (var p in opts) {
                if (opts.hasOwnProperty(p)) {
                    this._opts[p] = opts[p];
                }
            }
        },
        /**
         * 更新坐标继续运动
         * @param {Array} path 构成路线的point的数组.
         * @return 无返回值.
         */
        move: function(path, time) {
            var me = this;
            clearInterval(me._intervalFlag);
            me.i = 0;
            me._path = path;
            me.duration = me._opts.duration;
            me.step = path.length - 1;
            me.count = (me.duration - time)/ 10 / me.step;
            me._moveNext(me.i);
        },
        /**
         * 添加marker到地图上
         * @param {Function} 回调函数.
         * @return 无返回值.
         */
        _addMarker: function() {
            if (this._marker) {
                return this;
            }
            this._marker = new BMap.Marker(this._path[0]);
            this._marker.setIcon(this._opts.icon);
            this._map.addOverlay(this._marker);
            this._opts.defaultContent && this._addInfoWin();

        },
        /**
         * 添加上方overlay
         * @return 无返回值.
         */
        _addInfoWin: function() {
            var me = this;
            var label = new BMap.Label(me._opts.defaultContent, {offset:new BMap.Size(-4,-20)});
            me._marker.setLabel(label);
        },
        /**
         * 移动到下一个点
         * @param {Number} index 当前点的索引.
         * @return 无返回值.
         */
        _moveNext: function(index) {
            var me = this;
            if (index < this._path.length - 1) {
                me._move(me._path[index], me._path[index + 1], me._tween.linear);
            }
        },
        //目标点的  当前的步长,position,总的步长,动画效果,回调
        /**
         * 移动小车
         * @param {Number} poi 当前的步长.
         * @param {Point} initPos 经纬度坐标初始点.
         * @param {Point} targetPos 经纬度坐标目标点.
         * @param {Function} effect 缓动效果.
         * @return 无返回值.
         */
        _move: function(initPos, targetPos, effect) {
            var me = this,
                //当前的帧数
                currentCount = 0,
                //初始坐标
                init_pos = this._projection.lngLatToPoint(initPos),
                //获取结束点的(x,y)坐标
                target_pos = this._projection.lngLatToPoint(targetPos),
                //总的步长
                count = me.count;

            this._opts.showPath && this._map.addOverlay(new BMap.Polyline([initPos, targetPos], {
                strokeColor: "#000",
                strokeWeight: 5
            })); // 画线 

            //如果小于1直接移动到下一点
            if (count < 1) {
                me._moveNext(++me.i);
                return;
            }
            //两点之间匀速移动
            me._intervalFlag = setInterval(function() {
                //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
                if (currentCount >= count) {
                    clearInterval(me._intervalFlag);
                    //移动的点已经超过总的长度
                    if (me.i > me._path.length) {
                        return;
                    }
                    //运行下一个点
                    me._moveNext(++me.i);
                } else {
                    currentCount++;
                    var x = effect(init_pos.x, target_pos.x, currentCount, count),
                        y = effect(init_pos.y, target_pos.y, currentCount, count),
                        pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
                    //设置marker
                    if (currentCount == 1) {
                        if (me._opts.enableRotation == true) {
                            me._setRotation(initPos, targetPos);
                        }
                        if (me._opts.autoView) {
                            if (!me._map.getBounds().containsPoint(pos)) {
                                me._map.setCenter(pos);
                            }
                        }
                    }
                    //正在移动
                    me._marker.setPosition(pos);
                    // 电子围栏
                    me._opts.isCross && me._isCross(pos);
                }
            }, 10);
        },
        _isCross: function(pos) {
            var me = this;
            var count = 0;
            for (var i in BAIDU_OVERLAYS) {
                count ++;
                var curr = BAIDU_OVERLAYS[i];
                if (!curr[me.id]) {
                    curr[me.id] = 'unknow';
                }
                if (_isInOverlay(pos, curr.overlay, curr.type)) {
                    if (curr[me.id] !== 'out') {
                        me._opts.crossFn(false, curr, me._marker);
                    }
                    curr[me.id] = 'out';
                    break;
                } else {
                    if (curr[me.id] !== 'in') {
                        me._opts.crossFn(true, curr, me._marker);
                    }
                    curr[me.id] = 'in';
                }
            }
            if (count === 0) {
                me._opts.setStatus(me._marker);
            }
        },
        /**
         *在每个点的真实步骤中设置小车转动的角度
         */
        _setRotation: function(curPos, targetPos) {
            var me = this;
            var deg = 0;
            curPos = me._map.pointToPixel(curPos);
            targetPos = me._map.pointToPixel(targetPos);

            if (targetPos.x != curPos.x) {
                var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
                    atan = Math.atan(tan);
                deg = atan * 360 / (2 * Math.PI);
                if (targetPos.x < curPos.x) {
                    deg = -deg + 90 + 90;
                } else {
                    deg = -deg;
                }
                me._marker.setRotation(-deg);
            } else {
                var disy = targetPos.y - curPos.y;
                var bias = 0;
                if (disy > 0)
                    bias = -1
                else
                    bias = 1
                me._marker.setRotation(-bias * 90);
            }
            return;
        },
        //缓动效果
        _tween: {
            //初始坐标，目标坐标，当前的步长，总的步长
            linear: function(initPos, targetPos, currentCount, count) {
                var b = initPos,
                    c = targetPos - initPos,
                    t = currentCount,
                    d = count;
                return c * t / d + b;
            }
        }
    }

    window.LuShu = LuShu;
})(window);