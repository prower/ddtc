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
                btlogin:'[name=btlogin]'
              ,btreg:'[name=btreg]'
              ,loginpanel:{
                  panel:'[name=loginpanel]'
                  ,email:'[name=loginpanel] [name=userpanel_email]'
                  ,pwd:'[name=loginpanel] [name=userpanel_password]'
                  ,btlogin:'[name=loginpanel] [name=btlogin]'
              }
            ,slider:'[name=slider]'
            ,logininfo:'[name=logininfo]'
            ,logininfopanel:{
                name:'[name=logininfo] [name=name]'
                ,type:'[name=logininfo] [name=type]'
                ,status:'[name=logininfo] [name=status]'
                ,PushID:'[name=logininfo] [name=PushID]'
                ,btquit:'[name=logininfo] [name=btquit]'
            }

        }
        ,tabs:null
        ,loginpanel:null
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
            var tabs = this.tabs = utils.jq.initTab(this.context.find('[name=sliderSegmentedControl]>div'),this.context.find('[name=cards]>div'),'  mui-active');
            tabs.activeHandle[0] = function(){

            }
            tabs.activeHandle[1] = function(){

            }
            this.loginpanel = {
                  start:function(){

                  }
                ,login:function(){
                      var email = me.dom.loginpanel.email.val();
                      var password = me.dom.loginpanel.pwd.val();
                      utils.sys.login(email, password, function(data){
                          me.dom.loginpanel.pwd.val('');
                          me.c_showUserinfo(data);
                      });
                  }
              }


            this.c_check();
        }
        ,c_check:function(){
            var me = this;

            utils.sys.checklogin(function(data){
                console.log(data);
                me.c_showUserinfo(data);
            });
        }
        ,c_showUserinfo:function(data){
            var me = this;
            this.dom.slider.hide();
            this.dom.logininfo.hide();
            if(!data){
                me.dom.slider.show();
            }else{
                me.dom.logininfo.show();
                me.dom.logininfopanel.name.html(data.name);
                me.dom.logininfopanel.type.html(['主管理员','管理员','推广员'][data.type]);
                me.dom.logininfopanel.status.html(['冻结','正常'][data.status]);
                me.dom.logininfopanel.PushID.html(utils.sys.PushID() || '没有收到PushID')
            }
        }
        ,r_init:function(){
            var me = this;
            this.dom.loginpanel.btlogin.aclick(function(){
                me.loginpanel.login();
            });
            this.dom.logininfopanel.btquit.aclick(function(){
                utils.sys.quitlogin(function(){
                    me.c_check();
                });
            });
        }
        ,close:function(){
            this.onclose && this.onclose();
        }
    };

        return ui;
    }
});