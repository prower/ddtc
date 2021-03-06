/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_coupon(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            quanpanel:{
                list:'[name=quanlist]'
                ,btget_test:'[name=btget_test]'
                ,'quanrow-1':'[name=quanrow-1]'
                ,'quanrow0':'[name=quanrow0]'
                ,'quanrownone':'[name=quanrownone]'
            }
        }
        ,iscroll:null
        ,info:null
        ,showquit:false
        ,init:function(context){
            if (!this.isInit){
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            if(this.showquit){
                this.dom.btquit.show();
            }
            this.c_init();
        }
        ,c_init:function(){
            var me = this;
            this.m_getcoupon(function(list){

                me.c_fill(list);
            });
        }
        ,c_fill:function(datas){
            var me = this;
            this.dom.quanpanel.list.empty();
            if(datas && datas.length){
                var now = new Date();
                var addemptyrow = false;
                for(var i=0;i<datas.length;i++){
                    var data = datas[i];
                    var row = this.c_getrow(data);
                    if(new Date(data.e)<now){
                        row.addClass('overtime');
                        if(!addemptyrow){
                            addemptyrow = true;
                            this.dom.quanpanel.list.append($('<li style="padding: 5px" class="mui-table-view-divider">'));
                        }
                    }
                    this.dom.quanpanel.list.append(row);

                }
            }else{
                this.dom.quanpanel.list.append(this.dom.quanpanel.quanrownone.clone());
            }
            setTimeout(function(){
                me.iscroll.refresh();
            });

        }
        ,c_getrow:function(data){
            var row = null;
            switch(data.t+''){
                case '-1':  //1元券
                    row = this.dom.quanpanel['quanrow-1'].clone();
                    row.find('[name=endtime]>span').html((data.e+'').split(' ')[0]);
                    break;
                case '0':   //抵扣券
                    row = this.dom.quanpanel['quanrow0'].clone();
                    row.find('[name=money]').html(data.m);
                    row.find('[name=endtime]>span').html((data.e+'').split(' ')[0]);
                    break;
            }
            if('1' == data.u+''){
                row.addClass('use');
            }

            return row;
        }
        ,c_btget_test:function(){
            var me = this;
            var debug = false;
            if(debug){
                var code = 'EBF79C09-B3D4-B9E6-0E41-6DD4FD7ECB6C';
                sysmanager.couponUI(code, '0', function(){
                    me.c_init();
                });
            }else{
                $.get('http://duduche.me/driver.php/home/public/testCreateGiftPack', function(data){
                    console.log(data);
                    var code = data;
                    sysmanager.couponUI(code, function(){
                        me.c_init();
                    });
                });
            }

        }
        ,c_showquit:function(isshow){
            this.showquit = !!isshow;
        }
        ,c_quit:function(){
            var me = this;
            var c = me.context.parent().parent();
            sysmanager.pagecontainerManager.hide(c);
            me.close();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.quanpanel.btget_test.aclick(function(){
                me.c_btget_test();
            });
        }
        ,close:function(){
            this.onclose && this.onclose(this.info);
        }
        ,m_getcoupon:function(fn){      //获取抵扣我的券列表
            window.myajax.userget('index','listMyCoupons',{all:1}, function(result){
                var data = result.data;
                console.log(data);
//                var list = [];
//                if(data.coupon){
//                    for(var k in data.coupon){
//                        var d = data.coupon[k];
//                        d.id = k;
//                        list.push(d);
//                    }
//                }
//                list.sort(function(a,b){
//                    if(a.t != b.t){
//                        return b.t - a.t;
//                    }else{
//                        if(a.m != b.m){
//                            return b.m- a.m
//                        }else{
//                            return a.e - b.e
//                        }
//                    }
//                });
                fn && fn(result.data.coupon);
            }, null, false);
        }
    };
    return  ui;
}
