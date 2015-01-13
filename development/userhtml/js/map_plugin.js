/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */
window.mapPluginInit = function(){
    var home = AMap.myHomeControl = function(){

    };
    home.prototype={
       addTo: function(map, dom){
          dom.appendChild(this._getHtmlDom(map));
       },
       _getHtmlDom:function(map){
           var me = this;
         this.map=map;
         // 创建一个能承载控件的<div>容器
         var controlUI=$('.template [name=map_control_home]').clone();

         // 设置控件响应点击onclick事件
         controlUI.click(function(){
            map.panTo(me.position);
         });
         return controlUI[0];
       }
        ,setPosition:function(position, map){
            this.position = position;
            if(this.marker){
                map.removeControl(this.marker);
            }
            this.marker = new AMap.Circle({
                map:map
                ,center:position
                ,radius:50          //半径 米
                ,strokeColor:'#007aff'
                ,strokeWeight:2
                ,fillColor:'#007aff'
                ,fillOpacity:.3

            });
            this.marker2 = new AMap.Circle({
                map:map
                ,center:position
                ,radius:1          //半径 米
                ,strokeColor:'#007aff'
                ,strokeOpacity:1
                ,strokeWeight:10
                ,fillColor:'#007aff'
                ,fillOpacity:1

            });
        }
    }
    AMap.myUtils = {
        /**
         * todo:这里以后要添加没有获取定位授权的代码
         * @param fn
         */
        getLocal:function(fn){
            navigator.geolocation.getCurrentPosition(function(position){
                var currentLat = position.coords.latitude;
                var currentLon = position.coords.longitude;
                var local=new AMap.LngLat(currentLon, currentLat);
                fn && fn(local)
            });
        }
    }
}