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
            row.find('[name=pai]').html(data.pai).end().find('[name=time]').html(data.time)
                .end().find('[name=btaction]').aclick(function(){
                   row.remove();
                });

            return  row;
        }
        ,m_getdata:function(fn){
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