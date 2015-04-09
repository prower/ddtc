/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:46
 * To change this template use File | Settings | File Templates.
 */


var viewManager = (function(){
    var root = 'views/';


    var view = function(wininfo){
        this.dom = wininfo.dom;
        this.obj = wininfo.obj;
    }
    var iscache = false;
    view.prototype.renderer = function(contaion, arg){
        this.dom.appendTo(contaion);
        var me = this;
        setTimeout(function(){
            me.obj.init(me.dom, arg);
        });

    }
    var obj = {
        viewroot:function(_root){
            root = _root;
        }
        ,loadview:function(viewname, callback){
            var wininfo = {
                dom:null
                ,obj:null
            };
            var me = this;
            var htmlurl = root + viewname +'/'+viewname+'.html?'+(iscache?'':new Date);
            var jsname = 'ui_'+viewname;

            sysmanager.loading.show();

            $.get(htmlurl , function(html){
                wininfo.dom = $(html);
                wininfo.obj = window[jsname]();
                var myview = new view(wininfo);
                callback(myview);
                setTimeout(function(){
                    sysmanager.loading.hide();
                });
            });
            window.TongjiObj.clickLink(viewname);
        }
    }
    return obj;
})();
