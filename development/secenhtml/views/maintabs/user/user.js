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
            ,btquit:'[name=btquit]'
            ,bttestpushid:'[name=bttestpushid]'
            ,fullname:'[name=fullname]'
            ,info:{
                manager_in:'[name=manager_in]'
                ,manager_out:'[name=manager_out]'
                ,manager_at:'[name=manager_at]'
                ,manager_deals:'[name=manager_deals]'
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
            //this.c_setKucun(3);
//            utils.sys.checkLogin(function(islogin){
//               if(islogin){
//                   //alert('有登录信息')
//                   var userinfo = ajax.userinfo();
//                  me.dom.fullname.html(userinfo.fullname);
//               }else{
//                   me.c_login();
//               }
//               $('#startpage').hide();
//           });
            me.c_login();
        }
        ,c_login:function(){
            var me = this;
            utils.sys.loadpage('views/', 'login', $('#login_pagecontaion'),null, function(view){
               view.obj.onclose = function(){
                   var userinfo = ajax.userinfo();
                   me.dom.fullname.html(userinfo.fullname);
                   me.c_initinfo();
               }
           });
        }
        ,c_initinfo:function(){
            var me = this;
            this.m_baseinfo(function(data){
                /**
                 * at: 4deals: 1in: 0out: 1parkstate: "0"
                 */
                me.dom.kucun.panel.find('>*').removeClass('mui-active');
                me.dom.kucun.panel.find('[type={0}]'.replace('{0}',data.parkstate)).addClass('mui-active');

                me.dom.info.manager_at.html(data.at);
                me.dom.info.manager_in.html(data.in);
                me.dom.info.manager_out.html(data.out);
                me.dom.info.manager_deals.html(data.deals);
            });
        }
        ,c_setKucun:function(type, nofalse){     //设置库存
            var me = this;
            this.m_setKucun(type, function(){
                me.dom.kucun.panel.find('>*').removeClass('mui-active');
                me.dom.kucun.panel.find('[type={0}]'.replace('{0}',type)).addClass('mui-active');
            });

        }
        ,c_willSetkuncun:function(type){
            var info = {
                '0':'设置：停车位已满?'
                ,'1':'设置：有少量停车位?'
                ,'2':'设置：有大量停车位?'
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

            this.dom.jifen.btaction.click(function(){
                utils.sys.loadpage('views/', 'jifen', null, '积分兑换',function(v){});
            });
            this.dom.tixian.btaction.click(function(){
                utils.sys.loadpage('views/', 'tixian', null, '资金统计',function(v){});
            });

            this.dom.buttons.bt_secenin.click(function(){
                utils.sys.loadpage('views/', 'secen_in', null, '入场管理',function(v){});
            });
            this.dom.buttons.bt_secenout.click(function(){
                utils.sys.loadpage('views/', 'secen_out', null, '离场管理',function(v){});
            });
            this.dom.buttons.bt_secenat.click(function(){
                utils.sys.loadpage('views/', 'secen_at', null, '在场管理',function(v){});
            });
            this.dom.buttons.bt_jiaoyi.click(function(){
                utils.sys.loadpage('views/', 'jiaoyi', null, '交易清单',function(v){});
            });
            this.dom.btquit.click(function(){
                me.c_quit();
            });
            this.dom.bttestpushid.click(function(){
                me.c_bttestpushid();
            });
        }
        ,c_bttestpushid:function(){
            var pushid = 'kk3k2005';
            ajax.userget('index','setPushId',{pushid:pushid}, function(result){
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_setKucun:function(type, fn){
            ajax.userget('index','setParkState',{state:type}, function(result){
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_baseinfo:function(fn){
            ajax.userget('index','getBaseInfo',null, function(result){
                var data = result.data;
                fn && fn(data);
            });
        }
        ,c_quit:function(){
            if(window.confirm('确认退出当前账户?')){
                var me = this;
                utils.sys.quitlogin(function(){
                   me.c_login();
                });
            }
        }
        ,close:function(){

        }
    };

        return ui;
    }
});