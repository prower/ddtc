/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 14-9-10
 * Time: 下午11:59
 * To change this template use File | Settings | File Templates.
 */
define(['jquery', 'utils', 'ajax'],function($, utils, ajax){
    return function(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            list:'[name=list]'
            ,row:'.template [name=row]'
            ,bt_jiaoyi:'[name=bt_jiaoyi]'
            ,info:{
                panel:'[name=infopanel]'
                ,make:'[name=make]'
            }
            ,btaction:'[name=btaction]'
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
            this.m_getdata(function(datas){
               me.c_fill(datas);
            });
        }
        ,c_showInfo:function(){
            this.dom.info.panel.show();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});

            this.dom.btaction.aclick(function(){
                me.c_showInfo();
            });
            this.dom.info.make.aclick(function(){
               me.dom.info.panel.hide();
            });

            this.dom.bt_jiaoyi.aclick(function(){
                utils.sys.loadpage('views/', 'jiaoyi', null, '交易清单',function(v){});
            });
        }
        ,c_fill:function(datas){
            var me = this;
            this.dom.list.empty();
            for(var i=0;i<10;i++){
                var row = this.c_getrow();
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            });
        }
        ,c_getrow:function(data){
            var row = this.dom.row.clone();
            return row;
        }
        ,m_getdata:function(fn){
            fn && fn([]);
        }
        ,close:function(){

        }
    };

        return ui;
    }
});