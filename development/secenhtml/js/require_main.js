/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 14-9-11
 * Time: 上午12:03
 * To change this template use File | Settings | File Templates.
 */
require.config({
    paths: {
        jquery:'../../golba_rs/js/jquery-1.9.1.min'
        ,view:'viewloc'
    }
    ,waitSeconds:30
    ,urlArgs : "version="       //    + new Date()
});
requirejs([],function(jQuery){
    //requirejs(['rs/bootstrap/js/bootstrap.min.js']);



    requirejs(['jquery','cfg','view', 'sys', 'utils', 'ajax'], function($,cfg, viewmanager, sys, utils, ajax){
        utils.cfg = cfg;

        utils.sys = sys.init();


        var init = window.myinit;

        if(typeof init == 'function'){
           init($, utils, ajax, viewmanager);
        }
        /**
        console.log(viewmanager);
        window.viewmanager = viewmanager;
        viewmanager.viewroot('views/');
        var view = viewmanager.loadview('admincreate',function(v){
            //v.renderer($('.main'));
        });
         */

    });

});