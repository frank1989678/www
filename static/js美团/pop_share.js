define(['zepto.js', 'amd_pop_v2.js'], function ($){
    MT.pop = MT.pop || {};
    MT.pop.plus = MT.pop.plus || {};

    var share = {
        _css : ".mt-share li{float:left;margin-left:10px;}.mt-share li a{display:block;width:55px;height:55px;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAABuCAMAAAB2vaqjAAAAA3NCSVQICAjb4U/gAAAAwFBMVEX////mITr///8oo80phjgsteTKGzMmejPJGzOcxqQlejM7iUn2/f662MDM4tBUm2FZvNoqrdn+9fd9tYkyp8/WTV7ol6DfITrsqrHN7PXMIzrg9Piv4vHPM0fzxctzx99urHtanmfTPU/209f+8PHd7OCCzuPhdYK45PBAsNXebHrq+f743uKW1+qN1Ogyg0HsTGAsteTmITrmipVLlVk2vOgsteQphjjmITrifovcX28phjjq9e1bzO9Nttd82PI74UmzAAAAQHRSTlMA////////////////////////////////////////////////////////////////Zmb///8RERH//2b/////tbjf7QAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAABIpSURBVHic1Z0LV+q8EoaPZVuqoCJQKFcVUAS84xW37v//r05z7SSZtCm0rHNmfetToNDN4zuXTNLmP/8x7PPz5eVgZ3t5+fw0P9u09/fn58Od7fn5/d3lbB8f399/drbv74+P7HN9FkAR8Myg+V4ARWbnhGcGzY8CKAKe6TQ/i+TILAXme1EcGUliKTA/iuTIzA6zWEUKsymzOEVCsymzWEUKsymzFJAUJna2UkBSmNjZSgFJYe6VJMqyNJIoy9JIYixLiJLQNCcvMEpipjl5CVESmu7k5ZI8OFDPVi7Jw0P1bOWS/PNnvyRVlmWTVFmWTVJlWWKcFAbiZYlxUhiIlyXGSWHfeyUJWO6BJGC5B5KAZckpRxhPPSWnHGE89ZSccoSJ1LMfkiJc7oekCJf7ISnC5Z5EyWW5J1FyWe5JlEKW+yLJZLkvkkyW+yLJZLk3UVJZFirKt7e0V9/3KEomy72kb2YvxaXvt3/Dled5q9t/VpzPW6Xvx1psW6D83qt/Ew8vCOR93ZM2fDvHj8rp36+XRyfX4nOvT49aZ7nevlf/jj28GP/+GXhefXjR+G1cDOPvvmrgh73n8O/Lo7+eYfWTlrtAP/4fUf7UvfpDu8KsfRM7+s1uKM8wjtxOLp1R7jFUxsGyiFD543mDRSWxRc/zLrADn91C5eWp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') no-repeat;background-size:auto 55px;text-indent:-9999px;overflow:hidden;}.mt-share li a.mt-share-tqq{background-position:-55px 0;}",
        _conf : {
            id : 'share',
            priority : 10000,
            closable : true
        },
        /**
         * 生成分享按钮的内容
         * @namespace MT.pop.plus.share
         * @method _getContent.XXX
         * @param {String} title 分享的标题
         * @param {String} [url] 分享要带的链接
         * @param {String} [img] 分享要带的图片
         * @param {String} [conf] 配置
         * @retuan {String} 单个分享按钮的HTML代码
         * @private
         */
        _getContent : {
            WeiBo : function(title, url, img, conf){
                return '<a class="mt-share-weibo" gaevent="imt/bshare/weibo"'+ (!conf.gaext ? '' : ' geext='+conf.gaext) +' href="http://service.weibo.com/share/share.php?appkey=1550938859&title='+ title +'&url='+ url + (!img ? '' : '&pic='+ img) +'">新浪微博</a>';
            },
            tQQ : function(title, url, img, conf){
                return '<a class="mt-share-tqq" gaevent="imt/bshare/tqq"'+ (!conf.gaext ? '' : ' geext='+conf.gaext) +' href="http://share.v.t.qq.com/index.php?c=share&a=index&appkey=801073860&title='+ title +'&url='+ url + (!img ? '' : '&pic='+ img) +'&site=i.meituan.com">腾讯微博</a>';
            }
        },
        /**
         * 显示分享条
         * @method show
         * @method _getContent.XXX
         * @param {String} title 分享的标题
         * @param {String} [url] 分享要带的链接
         * @param {String} [img] 分享要带的图片
         * @param {String} [conf] 配置
         * @public
         */
        show : function(title, url, img, conf){
            //encode数据
            title = encodeURIComponent(title);
            url = encodeURIComponent(url);
            img = !img ? undefined : encodeURIComponent(img);

            //得到数据
            var html = '<div class="mt-share"><ul>';
            for(var k in this._getContent){
                html += '<li>' + this._getContent[k](title, url, img, this._conf) + '</li>';
            }
            html += '</ul></div>';

            MT.pop.show(html, this._conf);
            MT.pop.addCss(this._css);
        }
    };

    /**
     * 分享
     * @namespace MT.pop.plus.share
     * @param $shareBtn {Zepto Object} 分享按钮
     * @param params
     *      content [String] 分享内容，没有取data，再没有取title
     *      title [String] 分享title，没有取data，再没有取title
     *      img [String] 分享图片链接，没有取data
     *      utmTerm [String] 客户端版本信息
     *      url [String] 客户端分享地址，没有取data
     *      pageId [String] 页面id
     *      isWebview [Boolean] 是否是webview
     */
    MT.pop.plus.share = function ($shareBtn, params) {
        if (!params) params = {};

        $shareBtn.on('click', function (e) {

            var content =  params.content || $shareBtn.data('content')  || $('title').text(),
                title = params.title || $shareBtn.data('title') || $('title').text(),
                img = params.img || $shareBtn.data('img'),
            // 分享出去的链接不要去头尾
                shareUrl = $shareBtn.data('link') || location.origin + location.pathname + '?nodown',
                link = $shareBtn.data('maoyan_id') ? 'http://m.maoyan.com/guide/' + $shareBtn.data('maoyan_id') : shareUrl,
                shareLink = params.url || $shareBtn.data('url') || '',
                channel = "",
                enableRedirect = $shareBtn.data('redirectURL') || $shareBtn.data('redirecturl'),
                shareByClient = false,
                getOS = function (o) {
                    o = window.navigator.userAgent.match(/Macintosh|iPod|iPhone|iPad|Android|Windows Phone|Windows/i);
                    return o && o[0] || 'other'
                },
                getUrlKV = function (a, b) {
                    b = location.href.toLowerCase().match("([\?]|&)" + a + "=([^&]+)(&|$)");

                    return b && b[2]
                },
                utmTerm = params.utmTerm || '4.2.1';

            // 没有后端传的分享链接，则先拼出分享链接
            if (!shareLink) {
                shareByClient = true;
                channel = '385';
                channel = params.channel || channel;
                shareLink = "imeituan://www.meituan.com/share?channel=" + channel + "&title=" + encodeURIComponent(title) + "&imageURL=" + encodeURIComponent(img) + "&detailURL=" + encodeURIComponent(link) + "&content_-1=" + encodeURIComponent(content);

                // 只要后端有传分享链接，就调用客户端
            } else {
                shareByClient = true;
                params.isWebview = true;
            }

            shareLink += "&cid=" + (params.pageId);

            if (getUrlKV('ieic')) {
                shareLink += '&ieic=' + encodeURIComponent(getUrlKV('ieic'));
            }

            if (getUrlKV('msid')) {
                shareLink += '&msid=' + encodeURIComponent(getUrlKV('msid'));
            }


            if (enableRedirect) {
                shareLink += '&redirectURL=' + encodeURIComponent( location.origin + location.pathname );
            }

            if (params.isWebview && shareByClient) {
                location.href = shareLink;
                return false;
            }

            if (link && content) {
                share.show(content, link, img);
            }
        });
    }

    MT.pop.plus.share.show = function () {
        share.show.apply(share, arguments);
    };
    return share;
});

