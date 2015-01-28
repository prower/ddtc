/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_myorderdetail(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            title:'[name=title]'
            ,starttime:'[name=starttime]'
            ,totalFee:'[name=totalFee]'
            ,preFee:'[name=preFee]'
            ,remainFee:'[name=remainFee]'
            ,btpay:'[name=btpay]'
        }
        ,iscroll:null
        ,oid:null
        ,init:function(context){
            if (!this.isInit){
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            this.c_init();
        }
        ,initoid:function(oid){
            this.oid = oid;
            this.c_initinfo();

        }
        ,c_initinfo:function(){
            var me = this;
            this.m_getordedertail(this.oid, function(data){
                me.c_fill(data);
            });
        }
        ,c_init:function(){
            var me = this;

        }
        ,c_fill:function(data){
            /**
             * address: "金沙江路102号"carid: "沪A888888"
             * remainFee: 20            //还要付多少钱
             * totalFee: 20             //总共要付多少钱
             * startTime: "2015-01-23 14:00:00"
             */
            this.dom.title.html(data.address);
            this.dom.starttime.html(data.startTime);
            this.dom.totalFee.html(data.totalFee);
            this.dom.preFee.html(data.totalFee - data.remainFee);
            this.dom.remainFee.html(data.remainFee);

        }
        ,m_getordedertail:function(oid, fn){         //获取没有结算的订单
            //duduche.me/driver.php/home/index/getOrder
            window.myajax.userget('index','detailOrder',{oid:oid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_checkout_start:function(oid, fn){         //获取没有结算的订单
            //duduche.me/driver.php/home/index/checkOut /oid/1/
            window.myajax.userget('index','checkOut',{oid:oid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,r_init:function(){
            var me = this;
            //this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btpay.aclick(function(){
                me.c_checkout_start();
            });
        }
        ,c_checkout_start:function(){
            var me = this;
            this.m_checkout_start(this.oid, function(data){
                WeixinJSBridge.invoke('getBrandWCPayRequest', data,function(res){
                    //WeixinJSBridge.log(res.err_msg);
                    //alert(res.err_code+'\n'+res.err_desc+'\n'+res.err_msg);
                     if('get_brand_wcpay_request:ok' == res.err_msg){
                         me.c_startPayok();
                     }else{
                         me.c_startPayfalid();
                     }
                 });
            });
        }
        ,c_startPayok:function(){
            alert('支付成功');
        }
        ,c_startPayfalid:function(){
            alert('支付失败');
        }
        ,close:function(){

        }
    };
    return  ui;
}
