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
                ,btleave:'[name=order_wait] [name=btleave]'
            }
            ,lianxipanel:{
                list:'[name=lianxipanel]'
                ,lianxipanel_row:'.template [name=lianxipanel_row]'
            }
            ,scrolldom:'.myorderdetail_html_contaion'
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
        ,c_fill_lianxi:function(datas){      //填充联系
            if(datas && datas.length>0){
                this.dom.lianxipanel.list.empty();
                this.dom.lianxipanel.list.parent().show();
                for(var i=0;i<datas.length;i++){
                    var data = datas[i];
                    var row = this.c_getLianxirow(data, 0==i);
                    this.dom.lianxipanel.list.append(row);
                }

            }else{
                this.dom.lianxipanel.list.parent().hide();
            }
        }
        ,c_refshScroll:function(){
            var me = this;
            setTimeout(function(){
               me.iscroll.refresh();
            });
        }
        ,c_getLianxirow:function(data, isfirst){
            var me = this;
            var row = this.dom.lianxipanel.lianxipanel_row.clone();
            row.find('[name=name]').html(data.name);
            row.find('[name=btlianxi]').attr('href','tel:'+data.phone);
            if(!isfirst){
                row.addClass('other');
            }else{
                row.find('[name=btmore]').aclick(function(){
                    me.dom.lianxipanel.list.addClass('all');
                    me.c_refshScroll();
                });
                row.find('[name=btmore_none]').aclick(function(){
                    me.dom.lianxipanel.list.removeClass('all');
                    me.c_refshScroll();
                });
            }
            return row;
        }
        ,c_fill_pay:function(data){
            var me = this;

            this.dom.panel.order_pay.show();
            /**
             * address: "金沙江路102号"carid: "沪A888888"id: "53"lat: "31.231529"lng: "121.471352"remainFee: 15remaintime: -17044startTime: "2015-01-23 14:00:00"state: "1"totalFee: 20
             */

            this.dom.title.html(data.name);
            this.dom.starttime.html(data.startTime);
            //var rendtime  = Math.abs(new Date -  new Date(data.startTime));
            var stoptime = utils.tools.t2s(new Date - data.startTimeStamp*1000);
            this.dom.stoptime.html(stoptime);
            this.dom.totalFee.html(data.totalFee);
            this.dom.preFee.html(parseInt((data.totalFee*100 - data.remainFee*100))/100);
            this.dom.remainFee.html( Math.round(data.remainFee*100)/100);

            this.c_fill_lianxi(data.admin);

            this.c_refshScroll();

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

            this.c_fill_lianxi(data.admin);

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
        ,c_leave:function(){
            var me = this;
            sysmanager.confirm(window.cfg.leaveinfo, function(){
                me.m_leave(me.oid, function(){
                    location.reload();
                });
            });
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
        ,m_leave:function(oid, fn){          //发出结算请求
            window.myajax.userget('index','setLeave',{oid:oid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btpay.aclick(function(){
                me.c_checkout_start();
            });
            this.dom.waitpanel.btleave.aclick(function(){
                me.c_leave();
            });
        }
        ,c_checkout_start:function(){
            var me = this;
            //alert(this.oid);
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
