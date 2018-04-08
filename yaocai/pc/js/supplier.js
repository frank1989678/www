$(function() {
    var $jMobile = $('#jMobile');
    var $jName = $('#jName');
    var $jLinkman = $('#jLinkman');
    var $jVariety = $('#jVariety');
    var $jVarietys = $('#jVarietys');
    var $jSubmit = $('#jSave1');
    var isCheckMobile = {};
    var _posY = false;

    var _showMsg = function($el, txt) {
        if (txt) {
            $el.next('.error').html(txt).next('.explain').hide();
        } else {
            $el.next('.error').html('').next('.explain').show();
        }
    }

    var _checkMobile = function() {
        var val = $jMobile.val();
        var msg = '';
        if (!val) {
            msg = '手机必须填写';

        } else if (!/^1\d{10}$|^01\d{10}$/.test(val)) {
            msg = '请输入正确的手机号';

        } else if (isCheckMobile[val] === 1) {
            _showMsg($jMobile, false);
            return true;

        } else if (isCheckMobile[val]) {
            msg = isCheckMobile[val];

        } else {   
                $.ajax({
                    url: '',
                    data: {mobile: val},
                    success: function(data) {
                        if (data.exist) {
                            msg = '手机号已存在：<a href="#">安徽省亳州市（严飞）</a>';
                            isCheckMobile[val] = msg;
                            _showMsg($jMobile, msg); 
                            _posY = $jMobile.offset().top;
                        } else {                            
                            isCheckMobile[val] = 1;
                            _showMsg($jMobile, false);
                        }
                    }
                })   
            
            _showMsg($jMobile, false);
            return true;
        }
        _showMsg($jMobile, msg);   
        _posY = $jMobile.offset().top;     
        return false;
    }

    var _checkName = function() {
        var val = $jName.val();
        var msg = '';
        if (!val) {
            msg = '公司/姓名全称必须填写';

        } else {
            _showMsg($jName, false);
            return true;
        }
        _showMsg($jName, msg);        
        _posY = $jName.offset().top;
        return false;
    }


    var _checkLinkman = function() {
        var val = $jLinkman.val();
        var msg = '';
        if (!val) {
            msg = '联系人必须填写';

        } else {
            _showMsg($jLinkman, false);
            return true;
        }
        _showMsg($jLinkman, msg);        
        _posY = $jLinkman.offset().top;
        return false;
    }

    var _checkVarietys = function() {
        var val = $jVarietys.val();
        var msg = '';
        if (!val) {
            msg = '必须添加主营品种';

        } else {
            _showMsg($jVarietys, false);
            return true;
        }
        _showMsg($jVarietys, msg);        
        _posY = $jVariety.offset().top;
        return false;
    }


    function checkIpt() {
        var c4 = _checkVarietys();
        var c3 = _checkLinkman();
        var c2 = _checkName();
        var c1 = _checkMobile();        
        if (c1 && c2 && c3 && c4) {
            return true;
        } 
        window.scrollTo(0, _posY - 10);
        return false;
    }

    $jName.on('blur', _checkName);
    $jMobile.on('blur', _checkMobile);
    $jLinkman.on('blur', _checkLinkman);
    $jVariety.on('blur', _checkVarietys);

    $jSubmit.on('click', function() {
        return checkIpt();
    });

    var $jMyTags = $('#jMyTags');
    var $varietyTags = $('#jVarietyTags');
    var attentionArr = [];

    $jVariety.on({
        'input': function() {
            if ($.trim(this.value) !== '') {
                debounce(getKeywords, 400);
            }
        },
        'keydown': function(event) {
            var e = event.which;
            switch(e){
                case 38: // up
                    move($varietyTags, -1);
                    break;
                case 40: // down
                    move($varietyTags, 1);
                    break;
                case 13: // enter
                    var $this = $varietyTags.find('.on');
                    if ($this.html().length > 0) {
                        addVariety($this);
                    }
                    break;
                case 27: //Esc
                    // hidePop();              
                    break;
                // no default
            }
        }
    })

    // 添加主营品种
    $varietyTags.on('click', 'span', function() {
        addVariety($(this));
        return false;
    });

    // 删除品种
    $jMyTags.on('click', 'i', function() {
        var key = $(this).closest('li').data('key') || '';
        arrRemoveVal(attentionArr, key);
        $(this).closest('li').remove();
        $jVarietys.val(attentionArr.join('、'));
    });

    $('body').on('click', hidePop);

    function move(elem, k) {
        var $ele = elem.find('.search span'),
            idx = $ele.parent().find(".on").index(),
            count = $ele.size();
        idx += k;   
        idx = count === idx ? 0 : idx;
        $ele.eq(idx).addClass("on").siblings().removeClass("on");
    }

    // 删除数组元素
    function arrRemoveVal(arr, val) {
        var i = 0;
        while(i < arr.length) {
            if(arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
            i++;
        }
    }

    $jMyTags.find('li').each(function() {
        var key = $(this).data('key');
        attentionArr.push(key);
    });

    function addVariety($this) {
        var key = $this.data('key');
        if (attentionArr.join("/").indexOf(key) === -1) {
            attentionArr.push(key);
            $jMyTags.append('<li data-key="' + key + '"><span>' + $this.html() + '<i></i></span></li>');
            _showMsg($jVarietys, false);
        } else {
            _showMsg($jVarietys, '请勿重复添加');
        }
        $jVariety.val('');
        $jVarietys.val(attentionArr.join('、'));
        hidePop();
    }

    function debounce(func, wait) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(function() {func()}, wait);
    }
    // 关闭所有弹层
    function hidePop() {
        $varietyTags.hide();
    }


    // 药材品种
    function getKeywords() {
        var keywords = $jVariety.val();
        $.ajax({
            url: 'json/keywords.json',
            dataType: 'json',
            data: {key: keywords},
            success: function(data) {
                var html = [];
                if (data.status === 'success') {
                    var html = [];
                    $.each(data.list, function(i, v){
                        html.push('<span data-key="' + v.number + '"' + (i === 0 ? ' class="on"' : '') + '>' + v.name + '</span>');
                    });

                } else if (data.status === 'notsupport') {
                    html.push('<em style="padding:4px;color:#f00;">暂不支持该品种请致电客服</em>');

                } else {
                    html.push(data.msg);
                }
                $varietyTags.show().find('dd').html(html.join(''));
            },
            error: function() {
            }
        })
    }


    // 推荐人
    var $jReferrerList = $('#jReferrerList');
    $jReferrerList.prevAll('.btn').on('click', function() {
        var val = $(this).prev().val();
        if (val != '') {
            $.ajax({
                url: '',
                data: {keywords: val},
                success: function(data) {
                    var html = [];
                    data = {
                        status: 'success',
                        // status: 'null',
                        list: [
                            {
                                "number": 1131,
                                "name": "安徽省亳州市（严飞）"
                            }, 
                            {
                                "number": 1132,
                                "name": "亳州市（严飞）"
                            }
                        ]
                    }
                    if (data.status === 'success') {
                        var html = [];
                        $.each(data.list, function(i, v){
                            html.push('<label><input type="radio" class="cbx" name="referrer1">', v.name, '</label>');
                        });
                        html.push('<button type="button" class="btn btn-gray">清空</button>')

                    } else if (data.status === 'null') {
                        html.push('<em style="padding:4px;color:#f00;">搜索不到匹配的供货商</em>');

                    } else {
                        html.push(data.msg);
                    }
                    $jReferrerList.html(html.join(''));  
                }
            })
			_showMsg($(this), false);
        } else {
        	_showMsg($(this), '推荐人姓名或手机号');
        }
    });
    $jReferrerList.on('click', '.btn', function() {
        $jReferrerList.find('.cbx').prop('checked', false);
    })

});