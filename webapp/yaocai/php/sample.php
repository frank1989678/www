<?php
require_once "jssdk.php";
$jssdk = new JSSDK("yourAppID", "yourAppSecret");
$signPackage = $jssdk->GetSignPackage();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>拍照</title>
    <link rel="icon" href="favicon.ico">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/app.css">
</head>
<body class="yc-body">
<header class="yc-header">
        <div class="yc-header-back">
            <a href="javascript:history.back();">
                <i class="iconfont icon-back"></i>
            </a>
        </div>
        <div class="yc-header-title">拍照</div>
    </header><!-- /yc-header -->

    <section class="yc-content">
        <div class="yc-uploads">
            <div class="title">
                可参考如下示例图及说明拍摄
            </div>
            
            <div class="pic">
                <div class="tab">
                    <ul>
                        <li class="current">手捧照</li>
                        <li>细节照</li>
                        <li>混货照</li>
                        <li>质检报告</li>
                        <li>其它照片</li>
                        <li>其它照片</li>
                    </ul>
                </div>
                <div class="cont">
                    <div class="item">
                        <div class="tit">
                            <span>药材放手心，用于展现规格、外形、颜色的表象</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u1.png" alt="">
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">
                            <span>清晰展现药材细节，如大小、性状、色泽等</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u2.png" alt="">
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">
                            <span>展现药材断面细节</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u3.png" alt="">
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">
                            <span>展现大货整体质量情况</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u4.png" alt="">
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">
                            <span>展现大货整体质量情况</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u4.png" alt="">
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">
                            <span>展现大货整体质量情况</span>
                        </div>
                        <div class="preview">
                            <img src="uploads/u4.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section><!-- /yc-content -->


    <footer class="yc-footer">
        <div class="yc-uploads-op">
            <form method="post" action="upImg.php" target="up" enctype="multipart/form-data">
                <div class="file po">
                    <i class="iconfont icon-folder"></i>
                    <span>上传</span>
                    <input type="file" accept="image/gif,image/jpeg,image/png" id="jUpload" />
                </div>
                <div class="file camera">
                    <i class="iconfont icon-camera"></i>
                    <span>拍照</span>
                    <input type="file" capture="camera" id="jCamera">
                </div>
            </form>
            <iframe name="up" style="display:none;"></iframe> 
        </div>
    </footer>

</body>


    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="js/app.js?id=2"></script>

<script>
  /*
   * 注意：
   * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
   * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
   * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
   *
   * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
   * 邮箱地址：weixin-open@qq.com
   * 邮件主题：【微信JS-SDK反馈】具体问题
   * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
   */
  wx.config({
    debug: false,
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
      // 所有要调用的 API 都要加到这个列表中
    ]
  });
  wx.ready(function () {
    // 在这里调用 API


    $('#jUpload').on('change', function(ev) {
        var index = $('.tab .current').index();

        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              wx.uploadImage({
                  localId: res.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                  isShowProgressTips: 1, // 默认为1，显示进度提示
                  success: function (res) {
                      var serverId = res.serverId; // 返回图片的服务器端ID
                  }
              });
          }
        });

        
    })

  $('.tab').on('click', 'li', function() {
      var index = $(this).index();
      $(this).addClass('current').siblings().removeClass('current');
      $('.cont .item').eq(index).show().siblings().hide();
  });


  // 高亮显示
  var newsType = getQueryStringArgs();
  if (newsType.type) {
      var index = parseInt(newsType.type, 10);
      if (typeof index === 'number' && $('.tab li').length >= index ) {
          index > 1 && $('.tab li').eq(index - 1).trigger('click');
      }
  }

  });
</script>
</html>
