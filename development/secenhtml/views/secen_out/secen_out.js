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
            ,row_none:'.template [name=row_none]'
            ,list:'[name=list]'
            ,btrefresh:'[name=btrefresh]'
        }
        ,iscroll:null
        ,handler:null
        ,c_clearHandler:function(){
            if(this.handler){
                clearInterval(this.handler);
                this.handler = null;
            }
        }
        ,c_startHandler:function(){
            var me = this;
            this.handler = setInterval(function(){
                me.dom.list.find('>*').each(function(){
                    var td = $(this).find('[name=rtime]');
                    var rtime = td.attr('rtime');
                    var sp = parseInt((rtime - (new Date - 0)));
                    if(sp>0){
                        td.html(utils.tools.t2s(sp));
                    }else{
                        me.c_refresh();
                    }
                });
            },1e3);
        }
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
            this.c_clearHandler();
            this.m_getdata(function(datas){
                me.c_fill(datas);
            });
        }
        ,c_refresh:function(){
            this.c_init();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btrefresh.aclick(function(){
                me.c_refresh();
            });
        }
        ,c_fill:function(datas){
            var me = this;
            this.dom.list.empty();
            if(datas){
                for(var i=0;i<datas.length;i++){
                    var data = datas[i];
                    var row = this.c_getrow(data);
                    this.dom.list.append(row);
                }
            }
            if(datas && 0 == datas.length){
                this.dom.list.append(this.c_getrow_none());
            }else{
                setTimeout(function(){
                    me.c_startHandler();
                });
            }
            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            });

        }
        ,c_getrow:function(data){
            var row = this.dom.row.clone();
            var me = this;
            var rtime = new Date((new Date-0) + data.remaintime*1000) - 0;
            row.find('[name=pai]').html(data.carid).end().find('[name=endtime]').html(data.endtime)
                .end().find('[name=rtime]').attr('rtime',rtime)
                .end().find('[name=btaction]').aclick(function(){
                   me.c_setOut(data.oid, row);
                });

            return  row;
        }
        ,c_getrow_none:function(){
            var row = this.dom.row_none.clone();
            return row;
        }
        ,c_setOut:function(oid, row){
            var me = this;
            utils.sys.confirm("确认车辆［{0}］离场？".replace('{0}',row.find('.title').html()), function(){
                me.m_setout(oid, function(){
                    row.addClass('bounceOutLeft');
                    row.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        row.remove()
                    });
                });
            });
//            if(window.confirm("确认车辆［{0}］离场？".replace('{0}',row.find('.title').html()))){
//                this.m_setout(oid, function(){
//                    row.addClass('bounceOutLeft');
//                    row.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
//                        row.remove()
//                    });
//                });
//            }
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
            this.c_clearHandler();
            this.onclose && this.onclose();
        }
        ,ForcedRefrdsh:function(){        //强制刷新 外部调用
            this.c_refresh();
        }
    };

        return ui;
    }
});