/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_parkinfo(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
					btdaohang:'[name=btdaohang]'
        }
        ,iscroll:null
        ,init:function(context){
            if (!this.isInit){
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            this.c_init();
        }
        ,c_init:function(){
            var me = this;

        }
        ,c_showInfo:function(){
            this.dom.info.panel.show();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            
            window.myajax.userget('index','open_wx_sign',{url:document.location.href}, function(result){
            	
            	/*alert(document.location.href);
            	alert(result.data.url);
            	alert(result.data.v);*/
            	
              	wx.config({
							    debug: false,
							    appId: result.data.appId,
							    timestamp: result.data.timestamp,
							    nonceStr: result.data.nonceStr,
							    signature: result.data.signature,
							    jsApiList: [
							      'checkJsApi',
							      'openLocation'
							    ]
							  });
            }, null, false);
            wx.ready(function () {
            	me.dom.btdaohang.aclick(function(){
              	wx.openLocation({
							    latitude: 31.233624,
    							longitude: 121.411293,
    							name: '密讯馆',
    							address: '中山北路3323号',
							    scale: 16,
							    infoUrl: ''
								});
            	});
					  });
        }
        ,close:function(){

        }
    };
    return  ui;
}
