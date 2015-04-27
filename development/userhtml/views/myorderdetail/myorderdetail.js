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
            ,dqpanel:{
                panel:'[name=dqpanel]'
                ,active:'[name=dqpanel]>a'
                ,list:'[name=dqpanel] [name=list]'
                ,'qurow-1':'[name=dqpanel] .template [name=row-1]'
                ,'qurow0':'[name=dqpanel] .template [name=row0]'
                ,'qurownone':'[name=dqpanel] .template [name=rownone]'
                ,'couponinfo':'[name=dqpanel] [name=couponinfo]'
            }
            ,waittimedom:'[name=waittime]'
        }
        ,iscroll:null
        ,oid:null
        ,handler:null
        ,data:null              //当前的订单数据
        ,dqselectdata:null             //抵扣券的使用数据
        ,waittimes:0

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
         ,initWait:function(times){     //设置加载等待时间
            this.waittimes = times || 0;
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
            this.dom.panel.order_no.hide();
            this.dom.panel.order_pay.hide();
            this.dom.panel.order_wait.hide();
            if(this.waittimes>0){
                setTimeout(function(){
                    me.c_initinfo();
                },this.waittimes);
            }else{
                this.dom.waittimedom.hide();
                me.c_initinfo();
            }
        }
        ,c_fill:function(data){
            this.dom.waittimedom.hide();
            this.dom.panel.order_no.hide();
            this.dom.panel.order_pay.hide();
            this.dom.panel.order_wait.hide();

            if(!data){
                this.c_fill_order_no(); //没有最后的缴费清单
            }else{
                this.data = data;
                this.oid = data.oid;
                if(data.remaintime>0){
                    this.c_fill_wait(data);         //等待
                    //*     不需要再缴费的状态：E1
                    window.TongjiObj.E('E1');
                }else{
                    this.c_fill_pay(data);
                    //需要缴费结清的状态：E2
                    window.TongjiObj.E('E2');
                }
            }
        }
        ,c_fill_coupon:function(coupon, refreshscroll){            //填充卡券列表
            console.log(coupon);
            this.dqselectdata = null;
            this.dom.dqpanel.list.empty();
            if(coupon || coupon.length){
                var list = [];
                for(k in coupon){
                    var data = coupon[k];
                    data.id = k;
                    list.push(data);
                }
                list.sort(function(a,b){
                    return a.t - b.t;
                });
                for(var i=0;i<list.length;i++){
                    var data = list[i];
                    var row = this.c_getcoupon_row(data);
                    this.dom.dqpanel.list.append(row);
                }
                this.dom.dqpanel.couponinfo.html('可用抵用券<span>{0}</span>张'.replace('{0}',list.length));
            }else{
                this.dom.dqpanel.list.append(this.dom.dqpanel.qurownone.clone());
                this.dom.dqpanel.couponinfo.html('当前无可用抵用券');
            }
            if(!!refreshscroll){
                this.c_refshScroll();
            }

        }
        ,c_getcoupon_row:function(data){
            var me = this;
            var row = null;
            switch (data.t+''){
                case '-1':              //1元券
                    row = this.dom.dqpanel['qurow-1'].clone();
                    break;
                case '0':               //抵消券
                    row = this.dom.dqpanel['qurow0'].clone();
                    row.find('[name=money]').html(data.m);
                    break;
            }
            row.click(function(){
                me.c_couponrow_active(data, $(this));
            });
            return row;
        }
        ,c_couponrow_active:function(data,row){
            var clsname = 'mui-active'
            if(this.dqselectdata && this.dqselectdata.id == data.id){           //选择后在选择：取消选择
                this.dqselectdata = null;
                row.removeClass(clsname);

            }else{      //选择
                this.dom.dqpanel.list.find('>*').removeClass(clsname);
                row.addClass(clsname);
                this.dqselectdata = data;
            }
            this.c_refreshPaymoney();
        }
        ,c_refreshPaymoney:function(){          //刷新需要支付的钱
            console.log(this.dqselectdata);
            var data = this.data;
            if(!this.dqselectdata){
                this.dom.remainFee.html(Math.round(data.remainFee*100)/100);
                var list = [];
                for(k in this.data.coupon){
                    var data = this.data.coupon[k];
                    data.id = k;
                    list.push(data);
                }
                this.dom.dqpanel.couponinfo.html('可用抵用券<span>{0}</span>张'.replace('{0}',list.length));
            }else{
                var m = Math.round(data.remainFee*100)/100;
                if('1' == this.dqselectdata.t+''){
                    m = 1;
                    this.dom.dqpanel.couponinfo.html('只付1元');
                }else{
                    m = m - this.dqselectdata.m;
                    this.dom.dqpanel.couponinfo.html('减免{0}元'.replace('{0}',this.dqselectdata.m));
                }
                m =  Math.round(m*100)/100;
                if(m<0){
                    m = 0.1;
                }
                this.dom.remainFee.html(m);
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
            row.find('[name=name]').html(data.nickname);
            if(data.phone){
                row.find('[name=btlianxi]').attr('href','tel:'+data.phone).aclick(function(){
                    //拨打管理员电话：E3
                    window.TongjiObj.E('E3');
                });
            }else{
                row.find('[name=btlianxi]').hide();
            }
            if(!isfirst){
                row.addClass('other');
            }else{
                row.find('[name=btmore]').aclick(function(){
                    me.dom.lianxipanel.list.addClass('all');
                    me.c_refshScroll();
                    return false;
                });
                row.find('[name=btmore_none]').aclick(function(){
                    me.dom.lianxipanel.list.removeClass('all');
                    me.c_refshScroll();
                    return false;
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

            this.c_fill_coupon(data.coupon);

            this.c_refshScroll();

            //每分钟刷新页面先注释掉
//            this.handler = setInterval(function(){
//                me.c_initinfo();
//            },1e3*60);
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
            var data = {oid:oid};
            if(this.dqselectdata){
                data.cid = this.dqselectdata.id;
            }else{

            }
            window.myajax.userget('index','checkOut', data, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_checkout_start_app:function(oid, fn){         //获取没有结算的订单(app支付)
            //duduche.me/driver.php/home/index/checkOut /oid/1/
            var data = {oid:oid};
            if(this.dqselectdata){
                data.cid = this.dqselectdata.id;
            }else{

            }
            window.myajax.userget('index','checkOutApp', data, function(result){
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
                if(sysmanager.isapp){
                    me.c_checkout_start_app();
                }else{
                    me.c_checkout_start();
                }

            });
            this.dom.waitpanel.btleave.aclick(function(){
                me.c_leave();
            });
            this.dom.dqpanel.active.click(function(){
                me.dom.dqpanel.panel.toggleClass('mui-active');
                me.c_refshScroll();
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
        ,c_checkout_start_app:function(){
            var me = this;
            this.m_checkout_start_app(this.oid, function(data){

                //me.nowoid = data.oid;
                console.log(data);
                /**
                 * oid:
                 * paydata:* Object
                 *  appid:
                 *  noncestr:
                 *  partnerid:
                 *  prepayid:
                 *  timestamp:
                 *  Object
                 */
                var paydata = data;


                //绑定窗口事件（只一次）
                window.removeEventListener("message", me.innerpay_app_onmessage);
                window.addEventListener("message", me.innerpay_app_onmessage, false );
                //发送支付信息给父窗口
                me.innerpay_app_postmessage(JSON.stringify(paydata));
            });
        }
        ,innerpay_app_postmessage:function(data){   //发送支付信息
            window.parent.postMessage(data,'*');
        }
        ,innerpay_app_onmessage:function(event){         //接受支付信息返回
            var me = ui;
            var success = JSON.parse(event.data);
            if(0 == success.code){
                  me.c_startPayok();
              }else{
                  sysmanager.alert({'-1':'支付失败','-2':'支付参数错误'}[success.code+'']);
                  me.c_startPayfalid();
              }
        }
        ,c_startPayok:function(){
           // alert('支付成功');
            this.c_initinfo();
        }
        ,c_startPayfalid:function(){
            //alert('支付失败');
        }
        ,close:function(){
            this.c_clearHandler();
        }
    };
    return  ui;
}
