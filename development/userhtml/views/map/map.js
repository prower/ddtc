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
            ,nonerow:'.template [name=nonerow]'
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
                ,noteline:'[name=infopanel] [name=noteline]'
                ,rules:'[name=infopanel] [name=rules]'
                ,numberstatus:'[name=infopanel] [name=numberstatus]'
                ,numbermax:'[name=infopanel] [name=numbermax]'
            }
        }
        ,iscroll:null
        ,mapObj:null
        ,datas:null
        ,nowdata:null
        ,nowoid:null
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
            sysmanager.loadMapscript.load(function(){
                me.c_searchPosition(function(placedata){
                    me.c_initMap(function(center){
                        me.m_getdata(center,function(datas){
                            me.c_addpoint(me.mapObj,datas);
                            me.c_fill(datas);
                        });
                    }, placedata);
                });
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

                var homecontrol = new AMap.myHomeControl({
                    offset:new AMap.Pixel(10,100)
                });
            var maptool = null;

                mapObj.plugin(["AMap.ToolBar","AMap.Scale","AMap.myHomeControl"],function(){

                     //加载工具条
                    maptool = window.maptool = new AMap.ToolBar({
                       direction:false,//隐藏方向导航
                       ruler:false,//隐藏视野级别控制尺
                       autoPosition:false//自动定位
//                       ,locationMarker1:new AMap.Marker({
//                           map:mapObj
//                           ,content:"<div style='width: 50px;height: 50px;border-radius: 25px;background-color: rgba(0,0,0,.2)'><div style='position: absolute;left: 50%;top:50%;width: 6px;height: 6px;border-radius: 3px;margin-left: -3px;margin-top: -3px;background-color:red'></div></div>"
                            ,offset:new AMap.Pixel(10,80)
//                       })
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
                        homecontrol.setPosition(placedata,mapObj, true);
                        fn && fn(placedata);
                    });

                }else{
                    AMap.event.addListener(maptool,'location',function callback(e){
                        var locposition = e.lnglat;
                        homecontrol.setPosition(locposition, mapObj);
                        fn && fn(locposition);
                    });
                    maptool.doLocation();

                    /**
                    var callbacking = false;
                    mapObj.plugin('AMap.Geolocation', function () {
                        var geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: true,        //显示定位按钮，默认：true
                            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        });
                        mapObj.addControl(geolocation);
                        AMap.event.addListener(geolocation, 'complete', function(arg){
                            console.log('定位成功', arg);
                            homecontrol.setPosition(arg.position,mapObj);
                            if(!callbacking){
                                fn && fn(arg.position);
                            }else{
                                callbacking = true;
                            }
                        });//返回定位信息
                        AMap.event.addListener(geolocation, 'error', function(){
                            alert('当前捐精不支持获取定位');
                        });      //返回定位出错信息
                    });
                     */
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
                //me.c_daohang();
                me.c_daohang_my();
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
                me.nowoid = data.oid;
                //alert(data.oid);
                //return [alert('跳过支付直接成功![测试s]'), me.c_startPayok()];

                WeixinJSBridge.invoke('getBrandWCPayRequest', data.paydata,function(res){
                    //WeixinJSBridge.log(res.err_msg);
                    //alert(res.err_code+'\n'+res.err_desc+'\n'+res.err_msg);
                     if('get_brand_wcpay_request:ok' == res.err_msg){
                         me.c_startPayok();
                     }else{
//                         alert(res.err_msg);
                         me.c_startPayfalid();
                     }
                 });
            });
        }
        ,c_startPayok:function(){           //预付款成功
            var me = this;
            sysmanager.loadpage('views/', 'orderpay', null, '当前停车订单',function(view){
                view.obj.c_initinfo(me.nowdata, me.nowoid);
                view.obj.onclose = function(){

                }
            });


        }
        ,c_startPayfalid:function(){        //预付款失败
            //alert('预付款失败');
            //this.c_startPayok();
        }
        ,c_fill:function(datas){
            var me = this;
            this.datas = datas;
            this.dom.list.empty();
            if(datas){
                for(var i=0;i<datas.length;i++){
                    var row = this.c_getrow(datas[i]);
                    this.dom.list.append(row);
                }
            }
            if(!datas || datas.length == 0){
                var row = this.c_getnonerow();
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
            content = content.replace('{0}', '¥'+data.prepay).replace('{1}',data.parkstate);
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
            this.dom.infopanel.numberstatus.html(window.cfg.parkstatestring[data.parkstate]);
            if(data.note){
                this.dom.infopanel.note.html(data.note);
                this.dom.infopanel.noteline.show();
            }else{
                this.dom.infopanel.noteline.hide();
            }
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
            data.marker.setTop(true);
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
             *
             * parkstate 0-已满，1-较少，2-较多
             */
            var me = this;
            var row = this.dom.row.clone();
            row.find('[name=title]').html(data.name);
            row.find('[name=distance]>span').html(data.distance);
            row.find('[name=rules]').html(data.rules);
            row.find('[name=address]').html(data.address);

            row.bind('touchstart', function(){
                //data.marker.setAnimation('AMAP_ANIMATION_DROP');
                //me.mapObj.panTo(data.point);
                me.c_setActiveRow(row, data);
            });
            row.bind('touchend', function(){
//               me.mapObj.gotoHome();
            });
            var parkstatestring = window.cfg.parkstatestring[parseInt(data.parkstate)];

            switch(data.parkstate+''){
                case '0':
                    row.find('.mui-btn').css({
                        border: 'none'
                        ,color: '#999'
                        ,'background-color':'#eee'
                    }).html(parkstatestring);
                    break;
                case '1':
                case '2':
                    row.find('.mui-btn').click(function(){
                       me.c_showinfo(data);
                    });
                    break;
            }

            return row;
        }
        ,c_getnonerow:function(){
            var nonerow = this.dom.nonerow.clone();
            return nonerow;
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
                    d.prepay = parseInt(d.prepay);
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
