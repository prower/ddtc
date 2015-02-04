/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_reg(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            userpanel_phone:'[name=userpanel_phone]'
            ,userpanel_chepai:'[name=userpanel_chepai]'
            ,btreg:'[name=btreg]'
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
            //this.c_checkLogin();

        }
        ,c_checkLogin:function(){
            sysmanager.checkLogin(function(islogin){
                if(islogin){
                    sysmanager.alert('已经登陆');
                }else{
                    sysmanager.alert('没有登陆');
                }
            });
        }
        ,c_reg:function(){
            var me = this;
            var phone = this.dom.userpanel_phone.val();
            var chepai = this.dom.userpanel_chepai.val();
            this.dom.userpanel_phone.blur();
            this.dom.userpanel_chepai.blur();
            if('' == phone){
                alert('手机号不能为空!');
            }else{
                sysmanager.login(phone,chepai,function(){
                    me.c_quit();
                });
            }
        }
        ,c_quit:function(){
            var me = this;
            var c = me.context.parent().parent();
            sysmanager.pagecontainerManager.hide(c);
            me.close();
        }
        ,c_showInfo:function(){
            this.dom.info.panel.show();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btreg.aclick(function(){
                me.c_reg();
            });
        }
        ,close:function(){
            this.onclose && this.onclose();
        }
    };
    return  ui;
}
