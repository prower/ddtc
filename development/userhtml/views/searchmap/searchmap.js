/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_searchmap(){

    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            btetst:'[name=test]'
            ,form1:'[name=form1]'
            ,input:'[name=searchinpit]'
            ,list:'.innerlist'
            ,row:'.template [name=row]'
        }
        ,iscroll:null
        ,mapObj:null
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
        ,c_search:function(){
            var me = this;
            var keywords = this.dom.input.val();
            var auto;
            //加载输入提示插件
            AMap.service(["AMap.Autocomplete"], function() {
                var autoOptions = {
                    city: "" //城市，默认全国
                };
                auto = new AMap.Autocomplete(autoOptions);
                //查询成功时返回查询结果
                if ( keywords.length > 0) {
                    AMap.event.addListener(auto,"complete",function(data){
                        me.c_search_callback(data);
                    });
                    auto.search(keywords);
                }
                else {
                }
            });

//            AMap.service(["AMap.CitySearch"], function() {
//                //实例化城市查询类
//                var citysearch = new AMap.CitySearch();
//                //自动获取用户IP，返回当前城市
//                citysearch.getLocalCity(function(status, result){
//                    //当结果状态为“complete”且状态信息为“OK”时，解析服务返回结果
//                    if(status === 'complete' && result.info === 'OK'){
//                        if(result && result.city && result.bounds) {
//                            console.log('搜索城市1:',result);
//                        }
//                    }
//                    //当结果状态为“complete”且状态信息为其他时，解析服务提示信息
//                    else{
//                        console.log('搜索城市2:',result.info);
//                    }
//                });
//            });
        }
        ,c_search_PlaceSearch:function(){
            var me = this;
            var keywords = this.dom.input.val();
            if(keywords.length>0){
                var MSearch;
                AMap.service(["AMap.PlaceSearch"], function() {
                    MSearch = new AMap.PlaceSearch({ //构造地点查询类
                        pageSize:10,
                        pageIndex:1,
                        city:"021" //城市
                    });
                    //关键字查询
                    MSearch.search(keywords, function(status, result){
                        if(status === 'complete' && result.info === 'OK'){
                            me.c_search_PlaceSearch_callback(result);
                        }
                    });
                });
            }
        }
        ,c_search_PlaceSearch_callback:function(data){
            console.log('c_search_PlaceSearch_callback',data);
            var me = this;
            this.dom.list.empty();
            if(!data.poiList.pois || data.poiList.pois.length<=0){
                var row = this.c_getrow_nodata();
                this.dom.list.append(row);
            }else{
                for(var i=0;i<data.poiList.pois.length;i++){
                    var row = this.c_getrow_PlaceSearch(data.poiList.pois[i]);
                    this.dom.list.append(row);
                }
            }
        }
        ,c_search_geocoder:function(){
            var me = this;
            var keywords = this.dom.input.val();
            AMap.service(["AMap.Geocoder"], function() {     //加载地理编码插件
                var MGeocoder = new AMap.Geocoder();
                //返回地理编码结果
                AMap.event.addListener(MGeocoder, "complete", function(data){
                    me.c_search_geocoder_callback(data);
                });
                MGeocoder.getLocation(keywords);  //地理编码
            });
        }
        ,c_search_callback:function(data){
            console.log('search',data);
            var me = this;
            this.dom.list.empty();
            if(!data.tips || data.tips.length<=0){
                var row = this.c_getrow_nodata();
                this.dom.list.append(row);
            }else{
                for(var i=0;i<data.tips.length;i++){
                    var row = this.c_getrow(data.tips[i]);
                    this.dom.list.append(row);
                }
            }
        }
        ,c_search_geocoder_callback:function(data){
            console.log('search',data);
            /**
             * geocodes: Array[10]
             *      adcode: "411103"
             *      addressComponent: Object
             *      formattedAddress: "河南省漯河市郾城区西康路"
             *      level: "道路"
             *      location: cB: 33.647901lat: 33.647901lng: 114.038094r: 114.038094
             * info: "OK"
             * resultNum: "10"
             * type: "complete"
             */
            var me = this;
            this.dom.list.empty();
            if(!data.geocodes || data.geocodes.length<=0){
                var row = this.c_getrow_nodata();
                this.dom.list.append(row);
            }else{
                for(var i=0;i<data.geocodes.length;i++){
                    var row = this.c_getrow_geocode(data.geocodes[i]);
                    this.dom.list.append(row);
                }
            }
        }
        ,c_getrow_PlaceSearch:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.html(data.name);
            row.click(function(){
                me.c_select(data.location);
            });
            return row;
        }
        ,c_getrow:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.html(data.name);
            row.click(function(){
                me.c_select(data);
            });
            return row;
        }
        ,c_getrow_geocode:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.html(data.formattedAddress);
            row.click(function(){
                me.c_select(data.location);
            });
            return row;
        }
        ,c_getrow_nodata:function(){
            var row = this.dom.row.clone();
            row.html('<span style="color: red">没有查询到相关位置信息</span>');
            return row;
        }
        ,r_init:function(){
            var me = this;
            //this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btetst.aclick(function(){
                var c = me.context.parent().parent();
                me.close(null);
                sysmanager.pagecontainerManager.hide(c);

            });
            this.r_init_input();
        }
        ,c_select:function(position){
            var me = this;
            var c = me.context.parent().parent();
            sysmanager.pagecontainerManager.hide(c);
            me.close(position);
        }
        ,r_init_input:function(){
            var me = this;
            this.dom.input.bind('keyup', function(event){
                //var key = (event || window.event).keyCode;
                //var result = document.getElementById("result1");
                //var cur = result.curSelect;
                //me.c_search();
                //me.c_search_geocoder();
                me.c_search_PlaceSearch();

            });
            this.dom.form1.bind('submit', function(){
                console.log('不提交');
               return false;
            });
        }
        ,close:function(data){
            this.onclose && this.onclose(data);
        }
    };
    return  ui;
}
