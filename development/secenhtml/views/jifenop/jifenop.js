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
            ,address:'[name=address]'
            ,phone:'[name=phone]'
            ,btsubmit:'[name=btsubmit]'
            ,img:'img'
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
            this.dom.name.html(this.data.name);
            this.dom.score.html(this.data.score);
            this.dom.img.attr('src',requirejs('cfg').giftimgroot+this.data.image);
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btsubmit.aclick(function(){
                me.c_submit();
            });
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
        ,m_submit:function(gid,name,address,phone,fn){
            var data = {
                gid:gid
                ,name:name
                ,address:address
                ,telephone:phone
            }
            ajax.userget('index','exchangeGift',data, function(result){
                /**
                 * score:400,
                 	  giftList: [gid:1，name:‘10元电话卡’，score：10,image：dh.jpg]
                 */
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