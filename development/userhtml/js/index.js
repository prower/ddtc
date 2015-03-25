

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var me = this;
        document.addEventListener('deviceready', function(){
            me.onDeviceReady();
        }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //初始化device
        this.onMyEVENT();
        //app.receivedEvent('deviceready');
    }
    ,onMyEVENT:function(){

    }
    // Update DOM on a Received Event
    /**
    ,receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        receivedElement.innerHTML = 'Received Event: ' + id;

        console.log('Received Event: ' + id);
    },*/

};

app.initialize();

(function($){

//    initmenu();

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
        iframe.attr('src','http://static.duduche.me/redirect/user/indexhtml.php?m={0}&time={1}'.replace('{0}',href).replace('{1}',new Date-0));
        tabs.removeClass(activeclassnamwe);
        tab.addClass(activeclassnamwe);
    });
    init();



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
        $(tabs[0]).trigger(MOUSE_CLICK);
    }
    function initmenu(){
        var tabcontaion = $('.mui-bar-tab');
        tabcontaion.html(
                '<div class="mui-tab-item" href="mapfull">'
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

})(jQuery);


