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
            ,stoptime:'[name=stoptime]'
            ,totalFee:'[name=totalFee]'
            ,preFee:'[name=preFee]'
            ,remainFee:'[name=remainFee]'
            ,btpay:'[name=btpay]'
            ,panel:{
                order_no:'[name=order_no]'
                ,order_pay:'[name=order_pay]'
                ,order_wait:'[name=order_wait]'
            }
            ,waitpanel:{
                rtime:'[name=order_wait] [name=rtime]'
                ,partname:'[name=order_wait] [name=partname]'
            }
        }
        ,iscroll:null
        ,oid:null
        ,handler:null
        ,data:null
        ,init:function(context){
            if (!this.isInit){
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            this.c_init();
        }
        ,c_clearHandler:function(){
            if(this.handler){
                clearInterval(this.handler);
            }
            this.handler = null;
        }
        ,initoid:function(oid){
            this.oid = oid;
        }
        ,c_initinfo:function(){
            var me = this;
            this.c_clearHandler();
            if(this.oid){
                this.m_getordedertailFromoid(this.oid, function(data){
                    me.c_fill(data);
                });
            }else{
                this.m_getordedertail(function(data){
                    me.c_fill(data);
                });
            }

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
                this.data = data;
                this.oid = data.oid;
                if(data.remaintime>0){
                    this.c_fill_wait(data);
                }else{
                    this.c_fill_pay(data);
                }
            }
        }
        ,c_fill_order_no:function(){
            this.dom.panel.order_no.show();
        }
        ,c_fill_pay:function(data){
            var me = this;

            this.dom.panel.order_pay.show();
            /**
             * address: "金沙江路102号"carid: "沪A888888"id: "53"lat: "31.231529"lng: "121.471352"remainFee: 15remaintime: -17044startTime: "2015-01-23 14:00:00"state: "1"totalFee: 20
             */
            var stoptime = utils.tools.t2s(new Date - new Date(data.startTime));
            this.dom.title.html(data.name);
            this.dom.starttime.html(data.startTime);
            var rendtime  = Math.abs(new Date -  new Date(data.startTime));
            this.dom.stoptime.html(utils.tools.t2s(rendtime));
            this.dom.totalFee.html(data.totalFee);
            this.dom.preFee.html((data.totalFee*100 - data.remainFee*100)/100);
            this.dom.remainFee.html(data.remainFee);

            this.handler = setInterval(function(){
                me.c_initinfo();
            },1e3*60);
        }
        ,c_fill_wait:function(data){
            var me = this;
            this.dom.panel.order_wait.show();
            //this.dom.waitpanel.rtime.html(data.remaintime);
            this.dom.waitpanel.partname.html(data.name);
            data.rendtime  = new Date((new Date-0) + data.remaintime*1000);
            this.c_clearHandler();
            this.handler = setInterval(function(){
                //console.log(me.data.rendtime);
                var sp = (me.data.rendtime - (new Date - 0));
                if(sp>0){
                    me.dom.waitpanel.rtime.html(utils.tools.t2s(sp));
                }else{
                    me.c_initinfo();
                }
            },1e3);
        }
        ,m_getordedertail:function(fn){         //获取没有结算的订单
            //duduche.me/driver.php/home/index/getOrder
            window.myajax.userget('index','getOrder',{last:1}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_getordedertailFromoid:function(oid, fn){         //获取没有结算的订单
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
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btpay.aclick(function(){
                me.c_checkout_start();
            });
        }
        ,c_checkout_start:function(){
            var me = this;
            alert(this.oid);
            this.m_checkout_start(this.oid, function(data){
                //return [alert('跳过支付直接成功［测试］'), me.c_startPayok()];
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
            this.c_initinfo();
        }
        ,c_startPayfalid:function(){
            alert('支付失败');
        }
        ,close:function(){
            this.c_clearHandler();
        }
    };
    return  ui;
}
