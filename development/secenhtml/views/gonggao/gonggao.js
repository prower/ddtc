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
            iframe:'iframe'
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
        ,actype:null
        ,acscore:null
        ,acendtime:null
        ,c_init:function(){
            var me = this;
            var url = 'http://static.duduche.me/redirect/secen/eventhtml.php?type='+this.actype+'&value='+this.acscore+'&end='+this.acendtime;
            me.dom.iframe.attr('src',url);
        }
        ,setarg:function(actype,acscore,acendtime){
            /**
             * acendtime: "2015-05-15"acscore: "500"actype: "1"
             */
            this.actype = actype;
            this.acscore = acscore;
            this.acendtime = acendtime;
        }
        ,r_init:function(){
            var me = this;
        }
        ,close:function(){

        }
    };

        return ui;
    }
});