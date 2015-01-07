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
            kucun:{
                panel:'[name=kucunpanel]'

            }
            ,jifen:{
                panel:'[name=jifenpanel]'
                ,btaction:'[name=jifenpanel] [name=btaction]'
            }
            ,tixian:{
                panel:'[name=tixianpanel]'
                ,btaction:'[name=tixianpanel] [name=btaction]'
            }
            ,buttons:{
                bt_secenin:'[name=bt_secenin]'
                ,bt_secenout:'[name=bt_secenout]'
                ,bt_secenat:'[name=bt_secenat]'
                ,bt_jiaoyi:'[name=bt_jiaoyi]'
            }
        }
        ,iscroll:null
        ,init:function(context){
            if (!this.isInit) {
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            this.c_init();
        }
        ,c_init:function(){
            var me = this;
            this.c_setKucun(3);
        }
        ,c_setKucun:function(type){     //设置库存
            this.dom.kucun.panel.find('>*').removeClass('mui-active');
            this.dom.kucun.panel.find('[type={0}]'.replace('{0}',type)).addClass('mui-active');
        }
        ,c_willSetkuncun:function(type){
            var info = {
                '1':'设置：停车位已满?'
                ,'2':'设置：有少量停车位?'
                ,'3':'设置：有大量停车位?'
            }
            if(window.confirm(info[type])){
                this.c_setKucun(type);
            }
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});

            this.dom.kucun.panel.find('>*').aclick(function(){
                var that = $(this);
                me.c_willSetkuncun(that.attr('type'));
            });

            this.dom.jifen.btaction.aclick(function(){
                utils.sys.loadpage('views/', 'jifen', null, '积分兑换',function(v){});
            });
            this.dom.tixian.btaction.aclick(function(){
                utils.sys.loadpage('views/', 'tixian', null, '资金统计',function(v){});
            });

            this.dom.buttons.bt_secenin.aclick(function(){
                utils.sys.loadpage('views/', 'secen_in', null, '入场管理',function(v){});
            });
            this.dom.buttons.bt_secenout.aclick(function(){
                utils.sys.loadpage('views/', 'secen_out', null, '离场管理',function(v){});
            });
            this.dom.buttons.bt_jiaoyi.aclick(function(){
                utils.sys.loadpage('views/', 'jiaoyi', null, '交易清单',function(v){});
            });
        }
        ,close:function(){

        }
    };

        return ui;
    }
});