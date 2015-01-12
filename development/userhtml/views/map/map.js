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
            ,btback:'[name=btback]'
            ,btdaohang:'[name=btdaohang]'
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
            this.c_initMap(function(center){
                me.m_getdata(center,function(datas){
                    me.c_addpoint(me.mapObj,datas);
                    me.c_fill(datas);
                });
            });
        }
        ,c_initMap:function(fn, locposition){//fn 加载后的回调， locposition 预定义的地图中心点 没有提供则获取当前地理坐标

              var mapObj = this.mapObj = window.mapobj = new AMap.Map("map_html_mapid",{
              view: new AMap.View2D({//创建地图二维视口
              //center:position,//创建中心点坐标
              zoom:17, //设置地图缩放级别
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
                if(locposition){
                    homecontrol.setPosition(locposition);
                    fn && fn(locposition);
                }else{
                    AMap.event.addListener(maptool,'location',function callback(e){
                        locposition = e.lnglat;
                        homecontrol.setPosition(locposition);
                        fn && fn(locposition);
                    });
                    maptool.doLocation();
                }
            });

        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.dom.list[0], {desktopCompatibility:true});

            this.dom.btback.aclick(function(){
                me.c_back();
            });
            this.dom.btdaohang.aclick(function(){
                me.c_daohang();
            });
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
                var marker = new AMap.Marker({                 
                  map:map,                 
                  position:data.point,                 
                  icon:"http://webapi.amap.com/images/0.png",                 
                  offset:new AMap.Pixel(-10,-35)               
               }); 
            }
        }
        ,c_showinfo:function(data){
            this.nowdata = data;
            this.dom.listcontaion.addClass('next');
        }
        ,c_back:function(){
            this.dom.listcontaion.removeClass('next');
        }
        ,c_daohang:function(){
            var me = this;
            sysmanager.loadpage('views/', 'daohang', null, '导 航',function(v){
                v.obj.settarget(me.nowdata);
            });
        }
        ,c_getrow:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.find('.mui-btn').click(function(){
               me.c_showinfo(data);
            });
            return row;
        }
        ,m_getdata:function(center, fn){
            var clng = center.lng;
            var clat = center.lat;
            var datas = [];
            for(var i=0;i<50;i++){
                var lng = clng+GetRandomNum(-0.014,0.014);
                var lat = clat+GetRandomNum(-0.0125,0.0125);
                var point = new AMap.LngLat(lng,lat);
                (function(point){
                    var data = {
                        point:point
                        ,name:'XXX街道xxx号'
                    }
                    datas.push(data);
                })(point);
            }
            function GetRandomNum(Min,Max){

                    var Range = Max - Min;

                    var Rand = Math.random();

                    return(Min + Rand * Range);

            }
            fn && fn(datas);
        }
        ,close:function(){

        }
    };
    return  ui;
}
