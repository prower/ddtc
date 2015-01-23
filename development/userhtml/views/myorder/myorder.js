/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_myorder(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            row:'.template [name=row]'
            ,list:'[name=list]'
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
            this.m_getorder(function(data){
                me.c_fillL(data);
            });
        }
        ,c_fillL:function(data){
            this.dom.list.empty();
            for(var i=0;i<data.length;i++){
                var d = data[i];
                var row = this.c_getrow(d);
                this.dom.list.append(row);
            }

        }
        ,c_getrow:function(data){
            /**
             * address: "金沙江路102号"oid: "52"parkname: "金沙江路停车场（测试）"startTime: "1970-01-01 08:00:00"__proto__: Object1: Objectaddress: "金沙江路102号"oid: "53"parkname: "金沙江路停车场（测试）"startTime: "1970-01-01 08:00:00"__proto__: Objectlength: 2__proto__: Array[0]__proto__: Object
             * @type {*}
             */
                var me = this;
            var row = this.dom.row.clone();
            row.find('[name=time]').html(data.startTime);
            row.find('[name=title]').html(data.parkname);
            var ms = new Date() - new Date(data.startTime);
            var timestring = t2s(ms)
            row.find('[name=info]>span').html(timestring);
            row.find('[name=btpay]').aclick(function(){
                me.c_paydetail(data.oid);
            });

            function t2s(ms) {//将毫秒数换算成x天x时x分x秒x毫秒
               var ss = 1000;
               var mi = ss * 60;
               var hh = mi * 60;
               var dd = hh * 24;
               var day = parseInt(ms / dd);
               var hour = parseInt((ms - day * dd) / hh);
               var minute = parseInt((ms - day * dd - hour * hh) / mi);
               var second = parseInt((ms - day * dd - hour * hh - minute * mi) / ss);
               var milliSecond = parseInt(ms - day * dd - hour * hh - minute * mi - second * ss);
               /**
               var strDay = day < 10 ? "0" + day : "" + day;
               var strHour = hour < 10 ? "0" + hour : "" + hour;
               var strMinute = minute < 10 ? "0" + minute : "" + minute;
               var strSecond = second < 10 ? "0" + second : "" + second;
               var strMilliSecond = milliSecond < 10 ? "0" + milliSecond : "" + milliSecond;

               strMilliSecond = milliSecond < 100 ? "0" + strMilliSecond : "" + strMilliSecond;
                */
               //return strDay + " " + strHour + ":" + strMinute + ":" + strSecond + " " + strMilliSecond;
                var tstring = "";
                if(day>0){
                    tstring+=day+'天';
                }
                if(hour>0){
                    tstring+=hour+'小时';
                }
                if(minute>0){
                    tstring+=minute+'分钟';
                }
                if(second>0){
                    tstring+=second+'秒';
                }

                return tstring;

            }
            return row;
        }
        ,c_paydetail:function(oid){
            sysmanager.loadpage('views/', 'myorderdetail', null, '订单结算',function(v){
                v.obj.initoid(oid);
            });
        }
        ,r_init:function(){
            var me = this;
            //this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
        }
        ,m_getorder:function(fn){         //获取没有结算的订单

            //duduche.me/driver.php/home/index/getOrder
            window.myajax.userget('index','getOrder',{last:1}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_startJs:function(oid, fn){          //发出结算请求
            window.myajax.userget('index','genorder',{pid:pid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,close:function(){

        }
    };
    return  ui;
}
