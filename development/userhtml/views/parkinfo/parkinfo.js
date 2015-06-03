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
            ,btios:'[name=parkinfo_pagecontainer] [name=nav_ios]'
            ,btbaidu:'[name=parkinfo_pagecontainer] [name=nav_baidu]'
            ,btgaode:'[name=parkinfo_pagecontainer] [name=nav_gaode]'
            ,btlocal:'[name=parkinfo_pagecontainer] [name=nav_local]'
            ,navpanel:'[name=parkinfo_pagecontainer]'
            ,btnavclose:'[name=parkinfo_pagecontainer] [name=btclose]'
        }
        ,iscroll:null
        ,nowdata:null
        ,extinfo:null
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
        ,setdata:function(data,ext){
            this.nowdata =  data;
            this.extinfo = ext;
            console.log(data);
        }
        ,c_fill:function(){
            this.dom.name.html(this.nowdata.n);
            this.dom.address.html(this.nowdata.a);
            var imgurl = this.nowdata.i;
            if(this.extinfo && imgurl.indexOf('http://') != 0){
                imgurl = this.extinfo.u+imgurl;
            }
            this.dom.bg.attr('src',imgurl);
            if(this.nowdata.b){
                this.dom.address2.find('p').html(this.nowdata.b).show();
            }else{
                this.dom.address2.hide()
            }
        }
        ,c_showInfo:function(){
            this.dom.info.panel.show();
        }
        ,c_daohang_ios_official:function(){
            var href='http://maps.apple.com/?q='+this.nowdata.address;
            window.open(href, '_system');
        }
        ,c_daohang_baidu:function(){
            var iosinfo = {
            root:'baidumap://map/marker?'
                ,key: {
                src: '嘟嘟停车'            //应用名称
                    , location: this.nowdata.lat+','+this.nowdata.lng
                    , title: this.nowdata.n
                    , content: this.nowdata.a
                    , coord_type: 'gcj02'
                }
            };
            
            var androidinfo = {
            root:'bdapp://map/marker?'
                ,key: {
                src: '嘟嘟停车'            //应用名称
                    , location: this.nowdata.lat+','+this.nowdata.lng
                    , title: this.nowdata.n
                    , content: this.nowdata.a
                    , coord_type: 'gcj02'
                }
            };
            
            var info = utils.browser.versions.ios?iosinfo:androidinfo;
            
            var href = info.root;
            var first = true;
            for(var k in info.key){
                var v = info.key[k];
                if(!first){
                    href+='&';
                }else{
                    first = false;
                }
                href+=k+'='+v;
            }
            //alert(href);
            //console.log(href);
            window.open(href, '_system');
            
        }
        ,c_daohang_gaode:function(){
            var iosinfo = {
            root:'iosamap://viewMap?'
                ,key: {
                sourceApplication: '嘟嘟停车'            //应用名称
                    , backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: this.nowdata.n                             //poi 名称
                    , poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.lat                           //经度
                    , lon: this.nowdata.lng                             //纬度
                    , dev: 0                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    
                }
            };
            
            var androidinfo = {
            root:'androidamap://viewMap?'
                ,key: {
                sourceApplication: '嘟嘟停车'            //应用名称
                    //, backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: this.nowdata.n                             //poi 名称
                    //, poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.lat                           //经度
                    , lon: this.nowdata.lng                             //纬度
                    , dev: 0                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    
                }
            };
            
            var info = utils.browser.versions.ios?iosinfo:androidinfo;
            
            var href = info.root;
            var first = true;
            for(var k in info.key){
                var v = info.key[k];
                if(!first){
                    href+='&';
                }else{
                    first = false;
                }
                href+=k+'='+v;
            }
            
            //alert(href);
            //console.log(href);
            window.open(href, '_system');
            
        }
        ,r_init:function(){
            var me = this;
            if(utils.browser.versions.ios){
                me.dom.btios.show();
            }
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            me.dom.btdaohang.aclick(function(){

                if(window.Myweixinobj.isready){
//                    alert([parseFloat(me.nowdata.lat),parseFloat(me.nowdata.lng)]);
                    wx.openLocation({
                        latitude: parseFloat(me.nowdata.lat),
                        longitude:parseFloat(me.nowdata.lng),
                        name: me.nowdata.n,
                        address: me.nowdata.a,
                        scale: 16,
                        infoUrl: ''
                    });
                }else{
                                    me.dom.navpanel.show();
                }
            });
            me.dom.btlocal.aclick(function(){
                sysmanager.loadpage('views/', 'daohang', null, '导 航',function(v){
                    v.obj.settarget(me.nowdata);
                });
                me.dom.navpanel.hide();
            });
            me.dom.btnavclose.aclick(function(){
                me.dom.navpanel.hide();
            });
            me.dom.btios.aclick(function(){
                me.c_daohang_ios_official();
                me.dom.navpanel.hide();
            });
            me.dom.btgaode.aclick(function(){
                me.c_daohang_gaode();
                me.dom.navpanel.hide();
            });
            me.dom.btbaidu.aclick(function(){
                me.c_daohang_baidu();
                me.dom.navpanel.hide();
            });
        }
        ,close:function(){

        }
    };
    return  ui;
}
