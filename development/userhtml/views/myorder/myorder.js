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
            ,row2:'.template [name=row2]'
            ,list:'[name=list]'
            ,scrollpanel:'[name=scrollpanel]'
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
                me.c_fill(data);
            });
        }
        ,c_fill:function(data){
            var me = this;
            this.dom.list.empty();
            for(var i=0;i<data.length;i++){
                var d = data[i];
                var row = null;
                if(3 == d.state){
                    row = this.c_getrow2(d);
                }else{
                    row = this.c_getrow(d);
                }

                this.dom.list.append(row);
            }

            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            })

        }
        ,c_getrow:function(data){           //未结算的行
            /**
             * address: "金沙江路102号"oid: "52"parkname: "金沙江路停车场（测试）"startTime: "1970-01-01 08:00:00"__proto__: Object1: Objectaddress: "金沙江路102号"oid: "53"parkname: "金沙江路停车场（测试）"startTime: "1970-01-01 08:00:00"__proto__: Objectlength: 2__proto__: Array[0]__proto__: Object
             * @type {*}
             */
                var me = this;
            var row = this.dom.row.clone();
            row.find('[name=title]').html(data.parkname);
            row.find('[name=time]').html(data.startTime);
            row.find('[name=address]').html(data.address);
            var ms = new Date() - data.startTimeStamp*1000;
//            alert([new Date()-0, new Date(data.startTime)-0,ms]);
            var timestring = utils.tools.t2s(ms);
            row.find('[name=info]').html(timestring);
            row.find('[name=btpay]').aclick(function(){
                me.c_paydetail(data.oid);
            });
            return row;
        }
        ,c_getrow2:function(data){          //已经结算的行
            var row = this.dom.row2.clone();
            row.find('[name=title]').html(data.parkname);
            row.find('[name=time]').html(data.startTime);
            var ms = new Date() - data.startTimeStamp*1000;
            var timestring = utils.tools.t2s(ms);
            row.find('[name=info]').html(timestring);
            row.find('[name=btpay]').aclick(function(){
                me.c_paydetail(data.oid);
            });
            return row;
        }
        ,c_paydetail:function(oid){
            sysmanager.loadpage('views/', 'myorderdetail', null, '订单结算',function(v){
                v.obj.initoid(oid);
            });
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.dom.scrollpanel[0], {desktopCompatibility:true});
        }
        ,m_getorder:function(fn){         //获取没有结算的订单

            //duduche.me/driver.php/home/index/getOrder
            window.myajax.userget('index','getOrder',{last:0}, function(result){
                var data = result.data;
                data.sort(function(a,b){
                    return a.state - b.state;
                });
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
