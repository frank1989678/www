/**
 * 通过 & 不通过
 * @param  {String/Number} id 业务id
 * @param  {Boolean} passed true:通过 false：未通过
 * @return {null}
 */
function passed(id, passed) {
    var temp, okey;
    if (passed) {
        temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd">提示</div>'
           + '<div class="note">受理编号：<input type="text" name="number" class="ipt" autocomplete="off" /></div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">保存</button>'
                + '<button type="button" class="ubtn ubtn-gray layer-close">取消</button>'
            + '</div>'
        + '</div>';
        okey = function() {
            var data = {
                id: id,
                number: $('.layer-msg').find('.ipt').val().replace(/^\s+|\s+$/g, '')
            }
            if (data.number.length === 0) {
                $.notify({title: '受理编号未填写'})
            } else {
                fx.request('', data, function(res) {
                    
                })
            }
        }
    } else {
        temp = ''
        + '<div class="layer-msg" style="display:block;">'
           + '<div class="hd">提示</div>'
           + '<div class="note"><textarea name="note" class="ipt ipt-mul" placeholder="请输入受理不通过的原因"></textarea></div>'
            + '<div class="ft">'
                + '<button type="button" class="ubtn ubtn-primary" id="okey">保存</button>'
                + '<button type="button" class="ubtn ubtn-gray layer-close">取消</button>'
            + '</div>'
        + '</div>';
        okey = function() {
            var data = {
                id: id,
                note: $('.layer-msg').find('.ipt').val().replace(/^\s+|\s+$/g, '')
            }
            if (data.note.length === 0) {
                $.notify({title: '受理不通过的原因未填写'})
            } else {
                fx.request('', data, function(res) {
                    
                })
            }
        }
    }

    layer.open({
        area: '390px',
        type: 1,
        title: 0,
        closeBtn: 0,
        content: temp
    })
    $('#okey').off().on('click', function() {
        okey();
    })
}