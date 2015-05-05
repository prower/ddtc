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
            name:'[name=name]'
            ,score:'[name=score]'
            ,getname:'[name=getname]'
            ,img:'img'
            ,mycard:{
                mycardlist1:{
                    panel:'[name=mycard] [name=mycardlist1]'
                    ,t0:'[name=mycard] [name=mycardlist1] [name=t0]'
                    ,t1_1:'[name=mycard] [name=mycardlist1] [name=t1_1]'
                    ,t1_2:'[name=mycard] [name=mycardlist1] [name=t1_2]'
                    ,btback:'[name=mycard] [name=mycardlist1] [name=btback]'
                }
                ,mycardlist2_1:{
                    panel:'[name=mycard] [name=mycardlist2_1]'
                    ,btback:'[name=mycard] [name=mycardlist2_1] [name=btback]'
                    ,btaction:'[name=mycard] [name=mycardlist2_1] [name=btaction]'

                }
                ,mycardlist2_2:{
                    panel:'[name=mycard] [name=mycardlist2_2]'
                    ,btback:'[name=mycard] [name=mycardlist2_2] [name=btback]'
                    ,btaction:'[name=mycard] [name=mycardlist2_2] [name=btaction]'
                    ,bankname:'[name=mycard] [name=mycardlist2_2] [name=bankname]'
                    ,accout:'[name=mycard] [name=mycardlist2_2] [name=accout]'
                    ,name:'[name=mycard] [name=mycardlist2_2] [name=name]'
                }
                ,mycardlist2_3:{
                    panel:'[name=mycard] [name=mycardlist2_3]'
                    ,btback:'[name=mycard] [name=mycardlist2_3] [name=btback]'
                    ,btaction:'[name=mycard] [name=mycardlist2_3] [name=btaction]'
                    ,name:'[name=mycard] [name=mycardlist2_3] [name=name]'
                    ,address:'[name=mycard] [name=mycardlist2_3] [name=address]'
                    ,telephone:'[name=mycard] [name=mycardlist2_3] [name=telephone]'
                }

            }
        }
        ,iscroll:null
        ,data:null          //当前的礼品信息
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
            var data = this.data;
            this.dom.name.html(this.data.name);
            this.dom.score.html(this.data.score);
            this.dom.img.attr('src',requirejs('cfg').giftimgroot+this.data.image);

            /**
             * visitype = 1的时候，只要gid  (上门)
             visitype = 0的时候，type = 0的时候提供name，address，telephone （快递）
                               type = 1的时候提高name，bankname，accout   （转账）
             * @type {Object}
             */
            console.log(this.data);
            if('0' == data.type+''){
                this.dom.mycard.mycardlist1.t1_1.hide();
            }
            if('1' == data.type+''){
                this.dom.mycard.mycardlist1.t1_2.hide();
            }

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
            this.dom.mycard.mycardlist1.t1_2.click(function(){
                me.c_showcard(me.dom.mycard.mycardlist2_3.panel);
            });
            this.dom.mycard.mycardlist2_1.btback.click(function(){
               me.c_hidecard(me.dom.mycard.mycardlist2_1.panel);
            });
            this.dom.mycard.mycardlist2_2.btback.click(function(){
               me.c_hidecard(me.dom.mycard.mycardlist2_2.panel);
            });
            this.dom.mycard.mycardlist2_3.btback.click(function(){
               me.c_hidecard(me.dom.mycard.mycardlist2_3.panel);
            });
            this.dom.mycard.mycardlist2_1.btaction.click(function(){
               me.c_submit_1();
            });
            this.dom.mycard.mycardlist2_2.btaction.click(function(){
               me.c_submit_2();
            });
            this.dom.mycard.mycardlist2_3.btaction.click(function(){
               me.c_submit_3();
            });
        }
        ,c_submit_1:function(){         //上门　
            console.log('上门');
            var me=  this;
            //visitype,gid, name, address, telephone, bankname, account
            this.m_submit(1,this.data.gid,null,null,null,null,null,function(){
                utils.sys.alert('申请兑换成功.','系统提示');
                 me.c_quit();
            });
        }
        ,c_submit_2:function(){         //转账
            console.log('转账');
            var me = this;
            //visitype,gid, name, address, telephone, bankname, account
            this.m_submit(0,this.data.gid,this.dom.mycard.mycardlist2_2.name.val(),null,null,this.dom.mycard.mycardlist2_2.bankname.val(),this.dom.mycard.mycardlist2_2.accout.val(),function(){
                utils.sys.alert('申请兑换成功.','系统提示');
                 me.c_quit();
            });
        }
        ,c_submit_3:function(){         //快递
            console.log('快递');
            var me=  this;
            //visitype,gid, name, address, telephone, bankname, account
            this.m_submit(0,this.data.gid,this.dom.mycard.mycardlist2_3.name.val(),this.dom.mycard.mycardlist2_3.address.val(),this.dom.mycard.mycardlist2_3.telephone.val(),null,null,function(){
                utils.sys.alert('申请兑换成功.','系统提示');
                 me.c_quit();
            });
        }
        ,c_showcard:function(card){
            card.removeClass('none');
        }
        ,c_hidecard:function(card){
            card.addClass('none');
        }
        ,c_submit:function(){
            var me = this;
            var getname = this.dom.getname.val();
            var address = this.dom.address.val();
            var phone = this.dom.phone.val();
            if(""==getname || ""==address || ""==phone){
                utils.sys.alert('收货人,送货地址,联系电话<br>不能为空!');
                return;
            }
            this.m_submit(this.data.gid,getname, address, phone, function(){
                utils.sys.alert('提现兑换请求成功','系统：');
                var c = me.context.parent().parent();
                utils.sys.pagecontainerManager.hide(c);
                me.close();
            });
        }
        ,setGift:function(_data){
            this.data = _data;
        }
        ,m_submit:function(visitype,gid, name, address, telephone, bankname, account,fn){      //提交申请
            /**
             * visitype = 1的时候，只要gid  (上门)
             visitype = 0的时候，type = 0的时候提供name，address，telephone （快递）
             				   type = 1的时候提高name，bankname，accout   （转账）
             * @type {Object}
             */
            var data = {
                visitype:visitype
                ,gid:gid
                ,name:name
                ,address:address
                ,telephone:telephone
                ,bankname:bankname
                ,account:account
            }
            console.log(data);
            if(1 != visitype){
                if('0' == this.data.type+''){       //快递
                    var msg = [];
                    if(!name){
                        msg.push('请填写"收货人姓名"');
                    }
                    if(!address){
                        msg.push('请填写"收货人地址"');
                    }
                    if(!telephone){
                        msg.push('请填写"联系电话"');
                    }
                    if(msg.length){
                        utils.sys.alert(msg.join('<br>'));
                        return;
                    }
                }
                if('1' == this.data.type+''){           //转账
                    var msg = [];
                    if(!name){
                        msg.push('请填写"银行账户姓名"');
                    }
                    if(!bankname){
                        msg.push('请填写"转账银行"');
                    }
                    if(!account){
                        msg.push('请填写"银行账户"');
                    }
                    if(msg.length){
                        utils.sys.alert(msg.join('<br>'));
                        return;
                    }
                }
            }
            ajax.userget('index','exchangeGift',data, function(result){
                var data = result.data;
                fn && fn(data);
            });
        }
        ,c_quit:function(){
            var me = this;
            var c = me.context.parent().parent();
            utils.sys.pagecontainerManager.hide(c);
            me.close();
        }
        ,close:function(){
            this.onclose && this.onclose();
        }
    };

        return ui;
    }
});