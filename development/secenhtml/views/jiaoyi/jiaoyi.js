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
            row:'.template [name=row]'
            ,list:'[name=list]'
        }
        ,iscroll:null
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
            this.m_getdata(function(datas){
                me.c_fill(datas);
            });
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
        }
        ,c_fill:function(datas){
            var me = this;
            this.dom.list.empty();
            for(var i=0;i<datas.length;i++){
                var data = datas[i];
                var row = this.c_getrow(data);
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            });
        }
        ,c_getrow:function(data){
            /**
             * admin: "堵彬"carid: "浙D6s139"endtime: "1970-01-01 08:00:00"money: 0startime: "1970-01-01 08:00:00"
             * @type {*}
             */
            var row = this.dom.row.clone();
            row.find('[name=pai]').html(data.carid).end().find('[name=start]').html(data.startime)
                .end().find('[name=end]').html(data.endtime)
                .end().find('[name=admin]').html(data.admin)
                .end().find('[name=money]').html(data.money)
                .find('[name=btaction]').aclick(function(){

                });

            return  row;
        }
        ,m_getdata:function(fn){
            ajax.userget('index','getDeals',null, function(result){
                /**
                 * data:［{"oid":"1","carid":"11111","orderTime":"1970-01-01 08:00:00"}
                 */
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_getdata1:function(fn){
            fn && fn([
                {pai:'沪a1231',time:'10:45'}
                ,{pai:'沪asaasda',time:'11:45'}
                ,{pai:'沪a12a0a',time:'13:45'}
                ,{pai:'沪aczxczc',time:'14:45'}
                ,{pai:'沪azxczxc',time:'14:55'}
                ,{pai:'沪asfdsdfsd',time:'15:01'}
            ]);
        }
        ,close:function(){
            this.onclose && this.onclose();
        }
    };

        return ui;
    }
});