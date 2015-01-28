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
            ,panel:{
                order_no:'[name=order_no]'
                ,order_pay:'[name=order_pay]'
                ,order_wait:'[name=order_wait]'
            }
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
        }
        ,c_initinfo:function(){
            var me = this;
            this.m_getordedertail(function(data){
                me.c_fill(data);
            });
        }
        ,c_init:function(){
            var me = this;
            this.c_initinfo();
        }
        ,c_fill:function(data){


            this.dom.panel.order_no.hide();
            this.dom.panel.order_pay.hide();
            this.dom.panel.order_wait.hide();

            if(!data){
                this.c_fill_order_no();
            }else{
                this.c_fill_pay(data);
            }


        }
        ,c_fill_order_no:function(){
            this.dom.panel.order_no.show();
        }
        ,c_fill_pay:function(data){
            this.dom.panel.order_pay.show();
            /**
             * address: "金沙江路102号"carid: "沪A888888"id: "53"lat: "31.231529"lng: "121.471352"remainFee: 15remaintime: -17044startTime: "2015-01-23 14:00:00"state: "1"totalFee: 20
             */
            this.dom.title.html(data.address);
            this.dom.starttime.html(data.startTime);
            this.dom.totalFee.html(data.totalFee);
            this.dom.preFee.html(data.totalFee - data.remainFee);
            this.dom.remainFee.html(data.remainFee);

        }
        ,c_fill_wait:function(){
            this.dom.panel.order_wait.show();
        }
        ,m_getordedertail:function(fn){         //获取没有结算的订单
            //duduche.me/driver.php/home/index/getOrder
            window.myajax.userget('index','getOrder',{last:1}, function(result){
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
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btpay.aclick(function(){
                me.c_checkout_start();
            });
        }
        ,c_checkout_start:function(){
            var me = this;
            this.m_checkout_start(function(data){
                return [alert('跳过支付直接成功［测试］'), me.c_startPayok()];
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
