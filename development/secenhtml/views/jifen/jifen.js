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
            ,score:'[name=score]'
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
            this.dom.score.html(data.score);
            this.dom.list.empty();
            var datas = data.giftList;
            for(var i=0;i<datas.length;i++){
                var row = this.c_getrow(datas[i]);
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            });
        }
        ,c_getrow:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.find('[name=name]').html(data.name).end().find('[name=s]').html(data.score);
            row.find('img').attr('src', requirejs('cfg').giftimgroot+data.image);
            row.click(function(){
                me.c_active(data);

            });
            return  row;
        }
        ,c_active:function(data){
            if(parseInt(this.data.score)<parseInt(data.score)){
                utils.sys.alert('当前剩余积分不足');
                return;
            }
            var me = this;
            utils.sys.loadpage('views/', 'jifenop', null, '积分兑换礼品',function(v){
                v.obj.setGift(data);
                v.obj.onclose = function(){
                    me.c_init();
                }
           });
        }
        ,m_getdata:function(fn){
            ajax.userget('index','getGiftBase',null, function(result){
                /**
                 * score:400,
                 	  giftList: [gid:1，name:‘10元电话卡’，score：10,image：dh.jpg]
                 */
                var data = result.data;
                fn && fn(data);
            });
        }
        ,m_getdata1:function(fn){
            fn && fn([
                {name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
                ,{name:'手机话费',jifen:100}
            ]);
        }
        ,close:function(){

        }
    };

        return ui;
    }
});