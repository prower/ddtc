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
            ,rules:'[name=rules]'
            ,spaces:'[name=spaces]'
            ,numberstatus1:'[name=numberstatus1]'
            ,numberstatus2:'[name=numberstatus2]'
            ,numberstatus2t:'[name=numberstatus2t]'
            ,tags:'[name=tags]'
            ,btios:'#map-list [name=btios]'
            ,btbaidu:'#map-list [name=btbaidu]'
            ,btgaode:'#map-list [name=btgaode]'
            ,btlocal:'#map-list [name=btlocal]'
            ,infoarea:'[name=infoarea]'
            ,reserve:'[name=reserve]'
            ,scrollparent:'[name=scrollparent]'
            ,bgbox:'[name=bgbox]'
            ,daohanglist:'#map-list'
            ,close_map_list:'[name=close_map-list]'
            ,tags_item:'.template [name=tags-item]'
            ,mytag:'[name=spaces] mytag'
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
        ,setdata:function(data,ext,showbt){
            this.nowdata =  data;
            this.extinfo = ext;
            this.showbt = showbt;
        }
        ,c_fill:function(){
            var me = this;
            this.dom.name.html(this.nowdata.n);
            this.dom.address.html(this.nowdata.a);
            var imgurl = this.nowdata.i;
            if(this.extinfo && imgurl && imgurl != '' && imgurl.indexOf('http://') != 0){
                imgurl = this.extinfo.u+imgurl;
            }
            this.dom.bgbox.hide();
            if(imgurl && imgurl != ''){
                setTimeout(function(){
                    me.dom.bg.attr('src',imgurl);
                    me.dom.bg.load(function(){me.dom.bgbox.show();});
                });
            }
            if(this.nowdata.b){
                this.dom.address2.html(this.nowdata.b).show();
            }else{
                this.dom.address2.hide()
            }
            this.dom.rules.html(this.nowdata.r);
            if(this.nowdata.s){
            this.dom.numberstatus1.html(window.cfg.parkstatestring2[this.nowdata.s]);
            if(this.nowdata.e && this.nowdata.e[1]){
                this.dom.numberstatus2.html(window.cfg.parkstatestring2[this.nowdata.e[0]]);
                this.dom.numberstatus2t.html(this.nowdata.e[1].substr(0,5));
                this.dom.mytag.show();
            }}else if(this.nowdata.startTime){
                this.dom.spaces.html('开始计费：'+this.nowdata.startTime);
            }else{
                this.dom.spaces.hide();
            }
            if(this.nowdata.t){for(var i=0;i<this.nowdata.t.length;i++){
                var tagstr = this.nowdata.t[i];
                var row = this.c_gettags(tagstr);
                this.dom.tags.append(row);
            }}
            if(this.showbt){
                this.dom.reserve.show();
            }else{
                this.dom.reserve.hide();
            }
            
            //是否显示滚动
            setTimeout(function(){
                       var thisvar = me.dom.bgbox.parent();
                       var imgheight = (imgurl && imgurl != '')?me.dom.bgbox.height():0;
                       var scrollheight = thisvar.height() - imgheight - me.dom.reserve.height();
                       var contentheight = me.dom.scrollparent.height();
                       if(contentheight > scrollheight){
                        me.dom.scrollparent.css('height',scrollheight+'px');
                        me.iscroll = new iScroll(me.dom.infoarea[0], {desktopCompatibility:true});
                       }
            });
        }
        ,c_gettags:function(str){
            var row = this.dom.tags_item.clone();
            row.html(str);
            return row;
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
                    me.dom.daohanglist.addClass('mui-active');
                }
            });
            me.dom.btlocal.aclick(function(){
                sysmanager.loadpage('views/', 'daohang', null, '导航：'+me.nowdata.n,function(v){
                    v.obj.settarget(me.nowdata);
                });
                me.c_danghang_close();
            });
            me.dom.btios.aclick(function(){
                me.c_daohang_ios_official();
                me.c_danghang_close();
            });
            me.dom.btgaode.aclick(function(){
                me.c_daohang_gaode();
                me.c_danghang_close();
            });
            me.dom.btbaidu.aclick(function(){
                me.c_daohang_baidu();
                me.c_danghang_close();
            });
            me.dom.close_map_list.aclick(function(){
                me.c_danghang_close();
            });
            me.dom.reserve.aclick(function(){
                sysmanager.loadpage('views/', 'orderpay', null, '预订：'+me.nowdata.n,function(v){
                    v.obj.setdata(me.nowdata,me.extinfo);
                });
            });
            
        }
        ,c_danghang_close:function(){
            this.dom.daohanglist.removeClass('mui-active');
        }
        ,close:function(){

        }
    };
    return  ui;
}
