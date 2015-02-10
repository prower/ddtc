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
            accountname:'[name=accountname]'
            ,bankname:'[name=bankname]'
            ,account:'[name=account]'
            ,money:'[name=money]'
            ,maxmoney:'[name=maxmoney]'
            ,name:'[name=name]'
            ,phone:'[name=phone]'
            ,btsubmit:'[name=btsubmit]'

        }
        ,iscroll:null
        ,maxMoney:0         //当前最大可以提取金额
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
            this.dom.maxmoney.html(this.maxMoney);
            this.context.parent().parent().find('[name=btclose_tixianop]').unbind().aclick(function(){
                me.context.parent().parent().hide();
                me.close();
            });
        }
        ,setMaxmoney:function(maxmoney){
            this.maxMoney = maxmoney;
//            alert('maxmoney:'+this.maxMoney);
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btsubmit.aclick(function(){
                me.c_submit();
            });
        }
        ,c_submit:function(){
            /**
             * 账户名	accountname
              开户行	bankname
              账号	account
              金额	money
              姓名	name
              联系方式	telephone
             */
            var accountname = this.dom.accountname.val();
            var bankname = this.dom.bankname.val();
            var account = this.dom.account.val();
            var money = parseInt(this.dom.money.val());
            var name = this.dom.name.val();
            var telephone = this.dom.phone.val();

            //检查输入内容是否空
            if("" == accountname || "" == bankname || "" == account || "" == name || "" == telephone){
                utils.sys.alert('请输入所有相关内容<br>不能为空');
                return;
            }
            //检查金额
            if(isNaN(money) || money<0 || money>this.maxMoney){
                utils.sys.alert('请输入正确的提现金额！<br>(不能小于0)<br>(不能超过最大提金额)')
                return;
            }
            var me = this;
            this.m_submit(accountname,bankname,account,money,name,telephone, function(){

                utils.sys.alert('提现清单提交成功','系统：');
                var c = me.context.parent().parent();
                utils.sys.pagecontainerManager.hide(c);
                me.close();
            });
        }
        ,m_getdata:function(fn){
            ajax.userget('index','getStops',null, function(result){
                /**
                 * data:［{"oid":"1","carid":"11111","orderTime":"1970-01-01 08:00:00"}
                 */
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_submit:function(accountname,bankname,account,money,name,telephone, fn){           //提交提现请求的数据
            /**
             * 请求提现接口
             提交duduche.me/park.php/home/index/ drawMoney/
             POST：
             账户名	accountname
             开户行	bankname
             账号	account
             金额	money
             姓名	name
             联系方式	telephone
             */
            var data = {
                accountname:accountname
                ,bankname:bankname
                ,account:account
                ,money:money
                ,name:name
                ,telephone:telephone
            }
            ajax.userget('index','drawMoney',data, function(result){
                var data = result.data;
                fn && fn(data);
            });

        }
        ,close:function(){
            this.onclose && this.onclose();

        }
    };

        return ui;
    }
});