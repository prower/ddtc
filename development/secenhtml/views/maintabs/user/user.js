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
            ,bttestrefresh:'[name=bttestrefresh]'
            ,fullname:'[name=fullname]'
            ,info:{
                manager_in:'[name=manager_in]'
                ,manager_out:'[name=manager_out]'
                ,manager_at:'[name=manager_at]'
                ,manager_deals:'[name=manager_deals]'
                ,remainSum:'[name=remainSum]'
                ,score:'[name=score]'
                ,todaysum:'[name=todaysum]'
            }
            ,permissionDom:'[p]'
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
            //给自己一个全局变量引用,给予外部操作当前ui的机会，（todo:以后考虑使用事件机制）
            window.UserManager = this;

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
        ,c_login:function(isquit){
            var me = this;
            utils.sys.nologin(function(view){
                if(!!isquit){
                    view.obj.clearInfo();
                }
                view.obj.onclose = function(){
                   me.c_initinfo();
                   var userinfo = ajax.userinfo();
                   me.dom.fullname.html(userinfo.fullname);
                    me.c_setPermission();
               }
            });
        }
        ,c_initinfo:function(fn){
            var me = this;
            setTimeout(function(){
                me.m_baseinfo(function(data){
                    /**
                     * at: 5deals: 1in: 0name: "张三"out: 1parkstate: "1"remainsum: 50score: 400todaysum: 0
                     */

                    //alert(JSON.stringify(data));

                    me.dom.kucun.panel.find('>*').removeClass('mui-active');
                    me.dom.kucun.panel.find('[type={0}]'.replace('{0}',data.parkstate)).addClass('mui-active');

                    me.dom.info.manager_at.html(data.at);
                    me.dom.info.manager_in.html(data.in);
                    me.dom.info.manager_out.html(data.out);
                    me.dom.info.manager_deals.html(data.deals);

                    me.dom.info.remainSum.html(data.remainsum);
                    me.dom.info.score.html(data.score);
                    me.dom.info.todaysum.html(data.todaysum);

                    me.dom.btquit.html('管理员:{0}<span style="display: inline-block;padding-left: 40px">退出</span>'.replace('{0}', data.name));

                    fn && fn(data);

                });
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
                '0':'请确认停车位已满?<br><span>系统将不再接受停车订单</span>'
                ,'1':'请确认有(1-10)个空车位?'
                ,'2':'请确认有空车位大于10个'
            }
            var me = this;

            utils.sys.confirm(info[type], function(){
                me.c_setKucun(type);
            });
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true,onScrollMove:function(m){
                    //console.log('iscroll move',m);
                }
                }
            );

            this.dom.kucun.panel.find('>*').aclick(function(){
                var that = $(this);
                if(!that.hasClass('mui-active')){
                    me.c_willSetkuncun(that.attr('type'));
                }
            });

            this.dom.jifen.btaction.click(function(){
                utils.sys.loadpage('views/', 'jifen', null, '积分兑换',function(v){});
            });
            this.dom.tixian.btaction.click(function(){
                utils.sys.loadpage('views/', 'tixian', null, '资金统计',function(v){});
            });

            this.dom.buttons.bt_secenin.click(function(){
                me.c_secen_in_Manager();
            });
            this.dom.buttons.bt_secenout.click(function(){
                me.c_secen_out_Manager();
            });
            this.dom.buttons.bt_secenat.click(function(){
                utils.sys.loadpage('views/', 'secen_at', null, '在场管理',function(v){
                    v.obj.onclose = function(){
                        me.c_refreshInfo();
                    }
                });
            });
            this.dom.buttons.bt_jiaoyi.click(function(){
                utils.sys.loadpage('views/', 'jiaoyi', null, '交易清单',function(v){
                    v.obj.onclose = function(){
                        me.c_refreshInfo();
                    }
                });
            });
            this.dom.btquit.click(function(){
                me.c_quit();
            });
            this.dom.bttestpushid.click(function(){
                me.c_bttestpushid();
            });
            this.dom.bttestrefresh.click(function(){
                me.c_initinfo(function(data){
                    alert(JSON.stringify(data));
                });
            });
            $('#sence_in_pagecontaion>header>[name=btclose_sence_in]').aclick(function(){
                $('#sence_in_pagecontaion').hide();
                if(me.View.secen_in){
                    var v = me.View.secen_in;
                    me.View.secen_in = null;
                    v.obj.close();
                }
            });
            $('#sence_out_pagecontaion>header>[name=btclose_sence_out]').aclick(function(){
                $('#sence_out_pagecontaion').hide();
                if(me.View.secen_out){
                    var v = me.View.secen_out;
                    me.View.secen_out = null;
                    v.obj.close();
                }
            });
        }
        ,View:{
            secen_in:null
            ,secen_out:null
        }
        ,c_secen_in_Manager:function(wait){
            var permission = parseInt(ajax.userinfo().permission);
            if(permission & 1){
                var me = this;
                if(me.View.secen_in){
                    me.View.secen_in.obj.ForcedRefrdsh();
                    setTimeout(function(){
                        if(me.View.secen_out){
                            me.View.secen_in.obj.context.parent().parent().css('z-index','200');
                            me.View.secen_out.obj.context.parent().parent().css('z-index','199');
                        }
                    });
                }else{
                    var viewmanager = requirejs('view');
                    viewmanager.viewroot('views/');
                    var viewname = 'secen_in';
                    var context = $('#sence_in_pagecontaion');
                    var view = viewmanager.loadview(viewname,function(v){
                        var page = context.find('>.page');
                        page.empty();
                        v.renderer(page);
                        me.View.secen_in = v;
                        context.show();
                        v.obj.onclose = function(){
                            me.View.secen_in = null;
                            me.c_initinfo();
                        }
                        setTimeout(function(){
                            if(me.View.secen_out){
                                me.View.secen_in.obj.context.parent().parent().css('z-index','199');
                                me.View.secen_out.obj.context.parent().parent().css('z-index','200');
                            }
                        });
                    });
                }
            }
        }
        ,c_secen_out_Manager:function(wait){
            var permission = parseInt(ajax.userinfo().permission);
            if(permission & 2){
                var me = this;
                if(me.View.secen_out){
                    me.View.secen_out.obj.ForcedRefrdsh();
                    setTimeout(function(){
                        if(me.View.secen_in){
                            me.View.secen_in.obj.context.parent().parent().css('z-index','199');
                            me.View.secen_out.obj.context.parent().parent().css('z-index','200');
                        }
                    });
                }else{
                    var viewmanager = requirejs('view');
                    viewmanager.viewroot('views/');
                    var viewname = 'secen_out';
                    var context = $('#sence_out_pagecontaion');
                    var view = viewmanager.loadview(viewname,function(v){
                        var page = context.find('>.page');
                        page.empty();
                        v.renderer(page);
                        me.View.secen_out = v;
                        context.show();
                        v.obj.onclose = function(){
                            me.View.secen_out = null;
                            me.c_initinfo();
                        }
                        setTimeout(function(){
                            if(me.View.secen_in){
                                me.View.secen_in.obj.context.parent().parent().css('z-index','199');
                                me.View.secen_out.obj.context.parent().parent().css('z-index','200');
                            }
                        });
                    });
                }
            }

        }
        ,c_setPermission:function(){        //设置权限显示
            this.dom.permissionDom.hide();
            var permission = parseInt(ajax.userinfo().permission);
            this.dom.permissionDom.each(function(){
               var pstring = $(this).attr('p') || '';
                var ps = pstring.split(',');
                for(var i=0;i<ps.length;i++){
                    var p = parseInt(ps[i]);
                    if(permission & p){
                        $(this).show();
                        break;
                    }
                }
            });

        }
        ,c_refreshInfo:function(){
            this.c_initinfo();
        }
        ,c_bttestpushid:function(fn){
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
            var me = this;
            utils.sys.confirm('确认退出当前账户?', function(){
                utils.sys.quitlogin(function(){
                   me.c_login(true);
                });
            });

//            if(window.confirm('确认退出当前账户?')){
//
//                utils.sys.quitlogin(function(){
//                   me.c_login(true);
//                });
//            }
        }
        ,close:function(){

        }
    };

        return ui;
    }
});