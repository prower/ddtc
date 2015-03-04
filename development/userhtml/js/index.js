

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
    var iframe = $('iframe');
    var tabs = $('.mui-bar-tab>*');
    var activeclassnamwe = 'mui-active';
    tabs.click(function(){
        var tab = $(this);
        var href = tab.attr('href');
        iframe.attr('src','http://duduche.me/html/userhtml/index.html?m='+href);
        tabs.removeClass(activeclassnamwe);
        tab.addClass(activeclassnamwe);
    });

    init();

    function init(){
        alert( 'Device Version: '  + device.version );
    }
})(jQuery);


