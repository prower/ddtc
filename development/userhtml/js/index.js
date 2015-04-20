



(function($){

    initmenu();

    var iframebody = $('.body');
    var iframe = $('iframe');
    var iframetop = 0;
    var iframeheight = iframe.height();
    var tabs = $('.mui-bar-tab>*');
    var activeclassnamwe = 'mui-active';
    var MOUSE_CLICK = 'touchend';
    tabs.bind(MOUSE_CLICK,function(){
        var tab = $(this);
        var href = tab.attr('href');
        iframe.attr('src','http://static.duduche.me/redirect/user/indexhtml.php?isapp=1&m={0}&time={1}'.replace('{0}',href).replace('{1}',new Date-0));
        tabs.removeClass(activeclassnamwe);
        tab.addClass(activeclassnamwe);
    });




    function init(){
        $(document.body).bind('touchmove', function(){
            return false;
        });
        var iphonever = iOSversion();
        if(iphonever){
            if(parseInt(iphonever[0])>=7){        //ios大版本号》7  那么要注意手机的状态栏
                var height = iframe.height();
                iframeheight = height-top;
                iframetop = 20;
                iframe.css({
                   top:iframetop + 'px'
                    ,height:iframeheight+'px'
                });
            }
        }
        setTimeout(function(){
            $(tabs[0]).trigger(MOUSE_CLICK);
        });
    }
    function initmenu(){
        var tabcontaion = $('.mui-bar-tab');
        tabcontaion.html(
                '<div class="mui-tab-item" href="map">'
                +'<span class="mui-icon mui-icon-map"></span>'
                +'<span class="mui-tab-label">搜索</span>'
                +'</div>'
                +'<div class="mui-tab-item" href="myjiesuan">'
                +'<span class="mui-icon mui-icon-bars"></span>'
                +'<span class="mui-tab-label">缴费</span>'
                +'</div>'
                +'<div class="mui-tab-item" href="myorder">'
                +'<span class="mui-icon mui-icon-list"></span>'
                +'<span class="mui-tab-label">订单</span>'
                +'</div>'
                +'<div class="mui-tab-item" href="userinfo">'
                +'<span class="mui-icon mui-icon-contact"></span>'
                +'<span class="mui-tab-label">我</span>'
                +'</div>'
                +'<div class="mui-tab-item" href="coupon">'
                +'<span class="mui-icon mui-icon-more"></span>'
                +'<span class="mui-tab-label">卡券</span>'
                +'</div>'
        )

    }
    function iOSversion() {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }else{
        return false;
      }
    }

    init();

})(jQuery);


(function(){
    window.onerror= function(msg,url,l){
       txt="There was an error on this page.\n\n"
       txt+="Error: " + msg + "\n"
       txt+="URL: " + url + "\n"
       txt+="Line: " + l + "\n\n"
       txt+="Click OK to continue.\n\n"
       alert(txt);
       return true
    }

    //接受子窗口事件
    window.addEventListener('message', function(event){
        //e.origin

        var paydata = JSON.parse(event.data);
        weixinapppay(paydata);
    }, false);


    // 通过 postMessage 向子窗口发送数据
    function sendToIframe(data){
        $('iframe')[0].contentWindow.postMessage(data,"*");
    }

    function weixinapppay(paydata){
        alert('父窗口 准备支付');
        alert(JSON.stringify(paydata));
        Pgwxpay.wxpay2({"appid":paydata.appid, "noncestr":paydata.noncestr, "partnerid":paydata.partnerid, "prepayid":paydata.prepayid, "timestamp":paydata.timestamp},
              function(success) {
                  alert('parent: 支付成功');
                  sendToIframe(JSON.stringify(success));

            }, function(fail) {
                alert('parent: 支付调用失败');
           });
    }

})();




