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
            maxmoney:'[name=maxmoney]'
            ,scrollspace:'[name=scrollspace]'
            ,mycard:{
                mycardlist1:{
                    panel:'[name=mycard] [name=mycardlist1]'
                    ,t0:'[name=mycard] [name=mycardlist1] [name=t0]'
                    ,t1_1:'[name=mycard] [name=mycardlist1] [name=t1_1]'
                }
                ,mycardlist2_1:{
                    panel:'[name=mycard] [name=mycardlist2_1]'
                    ,btback:'[name=mycard] [name=mycardlist2_1] [name=btback]'
                    ,btaction:'[name=mycard] [name=mycardlist2_1] [name=btaction]'
                    ,money:'[name=mycard] [name=mycardlist2_1] [name=money]'
                    ,name:'[name=mycard] [name=mycardlist2_1] [name=name]'
                    ,phone:'[name=mycard] [name=mycardlist2_1] [name=phone]'

                }
                ,mycardlist2_2:{
                    panel:'[name=mycard] [name=mycardlist2_2]'
                    ,btback:'[name=mycard] [name=mycardlist2_2] [name=btback]'
                    ,btaction:'[name=mycard] [name=mycardlist2_2] [name=btaction]'
                    ,accountname:'[name=mycard] [name=mycardlist2_2] [name=accountname]'
                    ,bankname:'[name=mycard] [name=mycardlist2_2] [name=bankname]'
                    ,account:'[name=mycard] [name=mycardlist2_2] [name=account]'
                    ,money:'[name=mycard] [name=mycardlist2_2] [name=money]'
                    ,name:'[name=mycard] [name=mycardlist2_2] [name=name]'
                    ,phone:'[name=mycard] [name=mycardlist2_2] [name=phone]'
                }

            }
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
        ,c_showcard:function(card){
            card.removeClass('none');
            var me= this;
            this.dom.scrollspace.show();
            setTimeout(function(){
                me.iscroll.refresh();
            });

        }
        ,c_hidecard:function(card){
            card.addClass('none');
            this.dom.scrollspace.hide();
            var me= this;
            setTimeout(function(){
                me.iscroll.refresh();
            });
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.mycard.mycardlist1.t0.click(function(){
                me.c_showcard(me.dom.mycard.mycardlist2_1.panel);
            });
            this.dom.mycard.mycardlist1.t1_1.click(function(){
                me.c_showcard(me.dom.mycard.mycardlist2_2.panel);
            });
            this.dom.mycard.mycardlist2_1.btback.click(function(){
               me.c_hidecard(me.dom.mycard.mycardlist2_1.panel);
            });
            this.dom.mycard.mycardlist2_2.btback.click(function(){
               me.c_hidecard(me.dom.mycard.mycardlist2_2.panel);
            });
            this.dom.mycard.mycardlist2_1.btaction.click(function(){
               me.c_submit_1();
            });
            this.dom.mycard.mycardlist2_2.btaction.click(function(){
               me.c_submit_2();
            });
        }
        ,c_submit_1:function(){
            /**
             * 账户名	accountname
              开户行	bankname
              账号	account
              金额	money
              姓名	name
              联系方式	telephone
             */
            var accountname = '';
            var bankname = '';
            var account = '';
            var money = parseInt(this.dom.mycard.mycardlist2_1.money.val());
            var name = this.dom.mycard.mycardlist2_1.name.val();
            var telephone = this.dom.mycard.mycardlist2_1.phone.val();


            //检查金额
            if(isNaN(money) || money<0 || money>this.maxMoney){
                utils.sys.alert('请输入正确的提现金额！<br>(不能小于0)<br>(不能超过最大提金额)')
                return;
            }
            var me = this;
            this.m_submit(1,accountname,bankname,account,money,name,telephone, function(){

                utils.sys.alert('提现清单提交成功','系统：');
                var c = me.context.parent().parent();
                utils.sys.pagecontainerManager.hide(c);
                me.close();
            });
        }
        ,c_submit_2:function(){
            /**
             * 账户名	accountname
              开户行	bankname
              账号	account
              金额	money
              姓名	name
              联系方式	telephone
             */
            var accountname = this.dom.mycard.mycardlist2_2.accountname.val();
            var bankname = this.dom.mycard.mycardlist2_2.bankname.val();
            var account = this.dom.mycard.mycardlist2_2.account.val();
            var money = parseInt(this.dom.mycard.mycardlist2_2.money.val());
            var name = this.dom.mycard.mycardlist2_2.name.val();
            var telephone = this.dom.mycard.mycardlist2_2.phone.val();

            //检查金额
            if(isNaN(money) || money<0 || money>this.maxMoney){
                utils.sys.alert('请输入正确的提现金额！<br>(不能小于0)<br>(不能超过最大提金额)')
                return;
            }
            var me = this;
            this.m_submit(0,accountname,bankname,account,money,name,telephone, function(){
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
        ,m_submit:function(visitype,accountname,bankname,account,money,name,telephone, fn){           //提交提现请求的数据
            /**
             * 请求提现接口
             *
             * park.duduche.me/park.php/Home/index/drawMoney/
             参数
             visitype（必须），money（必须）， name（必须），telephone（必须），bankname可选），accountname可选），account可选），

             线下送上门：visitype = 1的时候，visitype（必须），money（必须）， name（必须），telephone（必须）
             线上转账：  visitype = 0的时候，visitype（必须），money（必须）， name（必须），telephone（必须），bankname可选），accountname可选），account可选）

             */
            var data = {
                accountname:accountname
                ,bankname:bankname
                ,account:account
                ,money:money
                ,name:name
                ,telephone:telephone
                ,visitype:visitype
            }
            console.log(data);
            //检查输入内容是否空
            if(visitype == 1){
                if("" == name || "" == telephone){
                    utils.sys.alert('请输入所有相关内容');
                    return;
                }
            }else{
                if("" == accountname || "" == bankname || "" == account || "" == name || "" == telephone){
                    utils.sys.alert('请输入所有相关内容');
                    return;
                }
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