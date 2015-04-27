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
            row1:'.template [name=row1]'
            ,row2:'.template [name=row2]'
            ,row3:'.template [name=row3]'
            ,rownone:'.template [name=rownone]'
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
            this.m_getdata(function(data){
                me.c_fill(data);
            });
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
        }
        ,c_fill:function(data){
            var me = this;
            this.data = data;
            this.dom.list.empty();
            if(data && data.length>0){
                var datas = data;
                for(var i=0;i<datas.length;i++){
                    var d = datas[i];
                    switch(d.visitype+''){
                        case '1':
                            var row = this.c_getrow1(datas[i]);
                            break;
                        case '2':
                            var row = this.c_getrow2(datas[i]);
                            break;
                        case '3':
                            var row = this.c_getrow3(datas[i]);
                            break;
                    }
                    this.dom.list.append(row);

                }
            }else{
                var row = this.c_getrownone();
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            });
        }
        ,c_getrow1:function(data){
            var me = this;
            var row = this.dom.row1.clone();
            row.find('[name=giftname]').html(data.giftname).end().find('[name=score]').html(data.score)
                .end().find('[name=createtime]').html(data.createtime).end().find('[name=state]').html({'0':'申请中','1':'已兑换'}[data.state]);
            if('0' == data.state+''){
                row.find('[name=state]').addClass('mui-badge-warning')
            }
            return  row;
        }
        ,c_getrow2:function(data){
            var me = this;
            var row = this.dom.row2.clone();
            row.find('[name=giftname]').html(data.giftname).end().find('[name=score]').html(data.score)
                    .end().find('[name=createtime]').html(data.createtime).end().find('[name=state]').html({'0':'申请中','1':'已兑换'}[data.state]);
            if('0' == data.state+''){
                row.find('[name=state]').addClass('mui-badge-warning')
            }
            return  row;
        }
        ,c_getrow3:function(data){
            var me = this;
            var row = this.dom.row3.clone();
            row.find('[name=giftname]').html(data.giftname).end().find('[name=score]').html(data.score)
                .end().find('[name=createtime]').html(data.createtime).end().find('[name=state]').html({'0':'申请中','1':'已兑换'}[data.state]);
            if('0' == data.state+''){
                row.find('[name=state]').addClass('mui-badge-warning')
            }
            return  row;
        }
        ,c_getrownone:function(){
            var row = this.dom.rownone.clone();
            return row;
        }
        ,m_getdata:function(fn){
            ajax.userget('index','getExList',null, function(result){
                var data = result.data;
                fn && fn(data);
            });
        },close:function(){

        }
    };

        return ui;
    }
});