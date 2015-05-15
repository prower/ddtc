/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_orderpay(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            starttime:'[name=starttime]'
            ,name:'[name=name]'
            ,rules:'[name=rules]'
            ,address:'[name=address]'
            ,note:'[name=note]'
            ,prepay:'[name=prepay]'
            ,paytime:'[name=paytime]'
            ,btpay:'[name=btpay]'
        }
        ,iscroll:null
        ,nowdata:null
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
        ,c_init:function(){
            var me = this;
            this.c_fill(this.nowdata);
        }
        ,c_initinfo:function(data, oid){
            console.log(data);
            this.nowdata = data;
            this.oid = oid;

        }
        ,c_fill:function(data){
            this.dom.name.html(data.name);
            this.dom.rules.html(data.rules);
            this.dom.address.html(data.address);
            this.dom.note.html(data.note || '--');
            this.dom.prepay.html(data.prepay);
            this.dom.paytime.html((new Date()).Format('yyyy/MM/dd hh:mm:ss'));
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});

            this.dom.btpay.aclick(function(){
                me.c_topay();
            });
        }
        ,c_topay:function(){
            var me = this;
            sysmanager.loadpage('views/', 'myorderdetail', null, '订单明细',function(v){
                v.obj.initoid(me.oid);
            });
        }
        ,close:function(){

        }
    };
    return  ui;
}
