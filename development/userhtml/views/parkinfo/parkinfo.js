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
            ,address:'[name=address]'
            ,address2:'[name=address2]'
            ,bg:'[name=bg]'
            ,name:'[name=name]'
        }
        ,iscroll:null
        ,nowdata:null
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
            this.c_fill();
        }
        ,setdata:function(data){
            this.nowdata =  data;
            console.log(data);
        }
        ,c_fill:function(){
            this.dom.name.html(this.nowdata.name);
            this.dom.address.html(this.nowdata.address);

            this.dom.bg.attr('src',this.nowdata.image);
            if(this.nowdata.address2){
                this.dom.address2.find('p').html(this.nowdata.address2).show();
            }else{
                this.dom.address2.hide()
            }
        }
        ,c_showInfo:function(){
            this.dom.info.panel.show();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            me.dom.btdaohang.aclick(function(){

                if(window.Myweixinobj.isready){
//                    alert([parseFloat(me.nowdata.lat),parseFloat(me.nowdata.lng)]);
                    wx.openLocation({
                        latitude: parseFloat(me.nowdata.lat),
                        longitude:parseFloat(me.nowdata.lng),
                        name: me.nowdata.name,
                        address: me.nowdata.address,
                        scale: 16,
                        infoUrl: ''
                    });
                }else{
                    sysmanager.loadpage('views/', 'daohang', null, '导 航',function(v){
                        v.obj.settarget(me.nowdata);
                    });
                }
            });
//            window.myajax.userget('index','open_wx_sign',{url:document.location.href}, function(result){
//
//            	/*alert(document.location.href);
//            	alert(result.data.url);
//            	alert(result.data.v);*/
//
//              	wx.config({
//							    debug: false,
//							    appId: result.data.appId,
//							    timestamp: result.data.timestamp,
//							    nonceStr: result.data.nonceStr,
//							    signature: result.data.signature,
//							    jsApiList: [
//							      'checkJsApi',
//							      'openLocation'
//							    ]
//							  });
//            }, null, false);
//            wx.ready(function () {
//            	me.dom.btdaohang.aclick(function(){
////                    wx.openLocation({
////                                        latitude: me.nowdata.lat,
////                                        longitude: me.nowdata.lng,
////                                        name: me.nowdata.name,
////                                        address: me.nowdata.address,
////                                        scale: 16,
////                                        infoUrl: ''
////                                    });
//              	wx.openLocation({
//							    latitude: 31.233624,
//    							longitude: 121.411293,
//    							name: '密讯馆',
//    							address: '中山北路3323号',
//							    scale: 16,
//							    infoUrl: ''
//								});
//            	});
//					  });
        }
        ,close:function(){

        }
    };
    return  ui;
}
