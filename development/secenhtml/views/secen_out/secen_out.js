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
            var row = this.dom.row.clone();
            var me = this;
            row.find('[name=pai]').html(data.carid).end().find('[name=time]').html(data.startTime)
                .end().find('[name=btaction]').aclick(function(){
                   me.c_setOut(data.oid, row);
                });

            return  row;
        }
        ,c_setOut:function(oid, row){
            this.m_setout(oid, function(){
                row.remove();
            });
        }
        ,m_getdata:function(fn){
            ajax.userget('index','getLeavings',null, function(result){
                /**
                 * data:［{"oid":"1","carid":"11111","orderTime":"1970-01-01 08:00:00"}
                 * carid: "浙D6s139"endTime: "1970-01-01 08:00:00"oid: "25"startTime: "1970-01-01 08:00:00"
                 */
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_setout:function(oid, fn){
            //duduche.me/park.php/home/index/ setLeave/oid/1/
            ajax.userget('index','setLeave',{oid:oid}, function(result){
                /**
                 * data:［{"oid":"1","carid":"11111","orderTime":"1970-01-01 08:00:00"}
                 * carid: "浙D6s139"endTime: "1970-01-01 08:00:00"oid: "25"startTime: "1970-01-01 08:00:00"
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

        }
    };

        return ui;
    }
});