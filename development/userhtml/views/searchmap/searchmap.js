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

            AMap.service(["AMap.CitySearch"], function() {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result){
                    //当结果状态为“complete”且状态信息为“OK”时，解析服务返回结果
                    if(status === 'complete' && result.info === 'OK'){
                        if(result && result.city && result.bounds) {
                            console.log('搜索城市1:',result);
                        }
                    }
                    //当结果状态为“complete”且状态信息为其他时，解析服务提示信息
                    else{
                        console.log('搜索城市2:',result.info);
                    }
                });
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
        ,c_getrow:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.html(data.name);
            row.click(function(){
                me.c_select(data);
            });
            return row;
        }
        ,c_getrow_nodata:function(){
            var row = this.dom.row.clone();
            row.html('没有查询到相关位置信息');
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
        ,c_select:function(data){
            var me = this;
            var c = me.context.parent().parent();
            sysmanager.pagecontainerManager.hide(c);
            me.close(data);
        }
        ,r_init_input:function(){
            var me = this;
            this.dom.input.bind('keyup', function(event){
                var key = (event || window.event).keyCode;
                //var result = document.getElementById("result1");
                //var cur = result.curSelect;
                me.c_search();
            });
        }
        ,close:function(data){
            this.onclose && this.onclose(data);
        }
    };
    return  ui;
}
