/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_map(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            list:'.innerlist>ul'
            ,row:'.template [name=row]'
            ,listcontaion:'.list'

            ,bttitle:'[name=title]'

            ,daohangmenu:'[name=daohangmenu]'
            ,daohang_gaode:'[name=daohang_gaode]'
            ,daohang_my:'[name=daohang_my]'
            ,btclosemenu:'[name=btclosemenu]'
            ,btclosemenu:'[name=btclosemenu]'
            ,mk1:'.template [name=mk1]'
            ,infopanel:{
                panel:'[name=infopanel]'
                ,btback:'[name=infopanel] [name=btback]'
                ,btdaohang:'[name=infopanel] [name=btdaohang]'
                ,btpay:'[name=infopanel] [name=btpay]'
                ,title:'[name=infopanel] [name=title]'
                ,address:'[name=infopanel] [name=address]'
                ,note:'[name=infopanel] [name=note]'
                ,rules:'[name=infopanel] [name=rules]'
                ,numberstatus:'[name=infopanel] [name=numberstatus]'
                ,numbermax:'[name=infopanel] [name=numbermax]'
            }
        }
        ,iscroll:null
        ,mapObj:null
        ,datas:null
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
            this.c_searchPosition(function(placedata){
                me.c_initMap(function(center){
                    me.m_getdata(center,function(datas){
                        me.c_addpoint(me.mapObj,datas);
                        me.c_fill(datas);
                    });
                }, placedata);
            });
        }
        ,c_searchPosition:function(fn){     //搜索地图

            var model = utils.tools.getUrlParam('m');
            if('mapsearch' == model){
                sysmanager.loadpage('views/', 'searchmap', $('#pop_pagecontaion'),'搜索地图', function(view){
                    view.obj.onclose = function(placedata){
                        fn && fn(placedata);
                    }
                });
            }else{
                fn && fn(null);
            }
        }
        ,c_initMap:function(fn, placedata){//fn 加载后的回调， placedata 预定义的地图搜索位置

              var mapObj = this.mapObj = window.mapobj = new AMap.Map("map_html_mapid",{
              view: new AMap.View2D({//创建地图二维视口
              //center:position,//创建中心点坐标
              zoom:15, //设置地图缩放级别
              rotation:0 //设置地图旋转角度
             }),
             lang:"zh_cn"//设置地图语言类型，默认：中文简体
            });//创建地图实例

                var homecontrol = new AMap.myHomeControl();
            var maptool = null;

                mapObj.plugin(["AMap.ToolBar","AMap.Scale","AMap.myHomeControl"],function(){

                     //加载工具条
                    maptool = window.maptool = new AMap.ToolBar({
                       direction:false,//隐藏方向导航
                       ruler:false,//隐藏视野级别控制尺
                       autoPosition:false//自动定位
                     });
                     mapObj.addControl(maptool);
                     //加载比例尺
                     var scale = new AMap.Scale();
                     mapObj.addControl(scale);
                       //加载回原点
                     mapObj.addControl(homecontrol);
               });

            AMap.event.addListener(mapObj,'complete', function(){
                var center = this.getCenter();
                console.log(center);
                /**
                 * B: 39.9092295056561lat: 39.90923lng: 116.397428r: 116.39742799999999
                 */
                if(placedata){
                    mapObj.setCenter(placedata);
                    setTimeout(function(){
                        homecontrol.setPosition(placedata,mapObj);
                        fn && fn(placedata);
                    });

                }else{
                    AMap.event.addListener(maptool,'location',function callback(e){
                        locposition = e.lnglat;
                        homecontrol.setPosition(locposition);
                        fn && fn(locposition);
                    });
                    maptool.doLocation();
                }
                mapObj.gotoHome = function(){
                    this.panTo(homecontrol.position);
                }
            });

        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.dom.list[0], {desktopCompatibility:true});

            this.dom.infopanel.btback.aclick(function(){
                me.c_back();
            });
            this.dom.infopanel.btdaohang.aclick(function(){
                me.c_daohang();
            });
            this.dom.daohang_gaode.aclick(function(){
                me.c_daohang_gaode($(this));
            });
            this.dom.btclosemenu.aclick(function(){
               me.dom.daohangmenu.hide();
            });
            this.dom.daohang_my.aclick(function(){
                me.c_daohang_my();
            });
            //this.dom.bttitle.aclick(function(){alert('title');});
            this.dom.infopanel.btpay.aclick(function(){
               me.c_startPay()
            });
        }
        ,c_startPay:function(){
            var me = this;
            this.m_startPay(this.nowdata.pid, function(data){
                /**
                 * WeixinJSBridge.invoke('getBrandWCPayRequest',<?php echo $wxPayHelper->create_biz_package(); ?>,function(res){
                     WeixinJSBridge.log(res.err_msg);
                     alert(res.err_code+res.err_desc+res.err_msg);
                     });
                 */
                //return me.c_startPayok();

                WeixinJSBridge.invoke('getBrandWCPayRequest', data,function(res){
                    //WeixinJSBridge.log(res.err_msg);
                    //alert(res.err_code+'\n'+res.err_desc+'\n'+res.err_msg);
                     if('get_brand_wcpay_request:ok' == res.err_msg){
                         me.c_startPayok();
                     }else{
                         me.c_startPayfalid();
                     }
                 });
            });
        }
        ,c_startPayok:function(){           //预付款成功
            var me = this;
            sysmanager.loadpage('views/', 'orderpay', null, '当前停车订单',function(view){
                view.obj.c_initinfo(me.nowdata);
                view.obj.onclose = function(){
                }
            });


        }
        ,c_startPayfalid:function(){        //预付款失败
            alert('预付款失败');
            this.c_startPayok();
        }
        ,c_fill:function(datas){
            var me = this;
            this.datas = datas;
            this.dom.list.empty();
            for(var i=0;i<datas.length;i++){
                var row = this.c_getrow(datas[i]);
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll.refresh();
            });
        }
        ,c_addpoint:function(map,datas){

            for(var i=0;i<datas.length;i++){
                var data = datas[i];
                var maker = this.c_getpoint(map,data, i);

            }
        }
        ,c_getpoint:function(map,data, index){
            var me = this;
            var content = this.dom.mk1.html();
            content = content.replace('{0}', '$'+data.prepay);
            var marker = new AMap.Marker({                 
              map:map,                 
              position:data.point,
              icon:"http://webapi.amap.com/images/0.png",
             content:content,
             offset:new AMap.Pixel(-10,-35)               
           });
            data.marker = marker;
            AMap.event.addListener(marker,'touchstart',function callback(e){
                me.c_activeRow(index);
            });
        }
        ,c_showinfo:function(data){
            this.nowdata = data;
            this.dom.listcontaion.addClass('next');
            //fill
            this.dom.infopanel.btpay.html('确认,预付{0}元'.replace('{0}',data.prepay));
            this.dom.infopanel.title.html(data.name);
            this.dom.infopanel.address.html(data.address);
            this.dom.infopanel.rules.html(data.rules);
            this.dom.infopanel.numbermax.html(data.spacesum);
            this.dom.infopanel.numberstatus.html((['满了','少量','很多'][data.spacesum])||'未知');
        }
        ,c_back:function(){
            this.dom.listcontaion.removeClass('next');
        }
        ,c_daohang:function(){
            var me = this;
            this.dom.daohangmenu.show();

        }
        ,c_daohang_gaode:function(alink){
            var me = this;

            var iosinfo = {
                root:'iosamap://navi?'
                ,ioskey: {
                    sourceApplication: 'dudutingche'            //应用名称
                    , backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: ''                             //poi 名称
                    , poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.point.lat                           //经度
                    , lon: this.nowdata.point.lng                             //纬度
                    , dev: 1                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    , style: 2                       //导航方式：(=0：速度最快，=1：费用最少，=2：距离最短，=3：不走高速，=4：躲避拥堵，=5：不走高速且避免收费，=6：不走高速且躲避拥堵，=7：躲避收费和拥堵，=8：不走高速躲避收费和拥堵)
                }
            };

            var androidinfo = {
                root:'androidamap://navi?'
                ,ioskey: {
                    sourceApplication: 'dudutingche'            //应用名称
                    //, backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: ''                             //poi 名称
                    //, poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.point.lat                           //经度
                    , lon: this.nowdata.point.lng                             //纬度
                    , dev: 1                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    , style: 2                       //导航方式：(=0：速度最快，=1：费用最少，=2：距离最短，=3：不走高速，=4：躲避拥堵，=5：不走高速且避免收费，=6：不走高速且躲避拥堵，=7：躲避收费和拥堵，=8：不走高速躲避收费和拥堵)
                }
            };
            //$(this).attr('href','iosamap://navi?sourceApplication=applicationName&backScheme=applicationScheme&poiname=fangheng&poiid=BGVIS&lat=36.547901&lon=104.258354&dev=1&style=2');


            var info = utils.browser.versions.ios?iosinfo:androidinfo;

            var href = info.root;
            var first = true;
            for(var k in info.ioskey){
                var v = info.ioskey[k];
                if(!first){
                    href+='&';
                }else{
                    first = false;
                }
                href+=k+'='+v;
            }
            //alert(href);
            console.log(href);

            alink.attr('href', href);
            setTimeout(function(){
                me.dom.daohangmenu.hide();
            },1e3);
        }
        ,c_daohang_my:function(){
            var me = this;
            setTimeout(function(){
                me.dom.daohangmenu.hide();
            },1e3);
            sysmanager.loadpage('views/', 'daohang', null, '导 航',function(v){
                v.obj.settarget(me.nowdata);
            });
        }
        ,c_setActiveRow:function(row, data, elemmove){
            this.dom.list.find('>*').removeClass('active');
            row.addClass('active');
            this.mapObj.setCenter(data.marker.getPosition());
            data.marker.setAnimation('AMAP_ANIMATION_DROP');
            if(!!elemmove){
                this.iscroll.scrollToElement(row[0]);
            }
        }
        ,c_activeRow:function(index){
            var row = this.dom.list.find('>*').eq(index);
            var data = this.datas[index];
            this.c_setActiveRow(row,data, true);
        }
        ,c_getrow:function(data, index){
            /**
             * address: "中山北路3300号"
             * lat: "31.232164"
             * lng: "121.476364"
             * marker: c
             * name: "环球港地下车库及5楼车库"
             * note: ""
             * parkstate: "2"
             * pid: "8"
             * prepay: "5"
             * rules: "5元/半小时，9元/小时，封顶72元，购物满200元可免费停车2小时"spacesum: "2200"
             * @type {*}
             */
            var me = this;
            var row = this.dom.row.clone();
            row.find('[name=title]').html(data.name);
            row.find('[name=distance]>span').html(data.distance);
            row.find('[name=rules]').html(data.rules);
            row.find('[name=address]').html(data.address);
            row.find('.mui-btn').click(function(){
               me.c_showinfo(data);
            });
            row.bind('touchstart', function(){
                //data.marker.setAnimation('AMAP_ANIMATION_DROP');
                //me.mapObj.panTo(data.point);
                me.c_setActiveRow(row, data);
            });
            row.bind('touchend', function(){
//               me.mapObj.gotoHome();
            });
            return row;
        }
        ,m_getdata:function(center, fn){
            var clng = center.lng;
            var clat = center.lat;
            window.myajax.userget('index','search',{lat:clat,lng:clng}, function(result){
                var data = result.data;
                for(var i=0;i<data.length;i++){
                    var d = data[i];
                    d.point = new AMap.LngLat(d.lng, d.lat);
                    d.distance = Math.abs(parseInt(d.point.distance(center)));
                }
                fn && fn(result.data);
            }, null, false);
        }
        ,m_getdata1:function(center, fn){
            var clng = center.lng;
            var clat = center.lat;
            var datas = [];
            for(var i=0;i<10;i++){
                var lng = clng+GetRandomNum(-0.004,0.004);
                var lng = clng+GetRandomNum(-0.004,0.004);
                var lat = clat+GetRandomNum(-0.0025,0.0025);
                var point = new AMap.LngLat(lng,lat);
                (function(point){
                    var data = {
                        point:point
                        ,name:'第{0}街，第{0}号'.replace('{0}',i).replace('{0}',i)
                        ,distance:Math.abs(parseInt(point.distance(center)))+'米'
                    }
                    datas.push(data);
                })(point);
            }
            datas.sort(function(a,b){
                return parseInt(a.distance) - parseInt(b.distance);
            });
            function GetRandomNum(Min,Max){
                    var Range = Max - Min;
                    var Rand = Math.random();
                    return(Min + Rand * Range);
            }
            fn && fn(datas);
        }
        ,m_startPay:function(pid, fn){
            window.myajax.userget('index','genorder',{pid:pid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,close:function(){

        }
    };
    return  ui;
}
