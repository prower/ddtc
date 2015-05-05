/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define((function(){


    var cfg = {
        start:null
        ,version:.9
        ,ajaxroot:'http://t.duduche.me/park.php/Home/'
        ,giftimgroot:"http://uploads.duduche.me/images/" //礼品根目录
    }
    /**
    var href = window.location.href;
    if(href.indexOf('localhost')>0 || href.indexOf('192.')>0 ){
        cfg.ajaxroot = 'http://192.168.1.112/kksvn/gamesg/manhua/project/thinkphp_3.2.2_full/user.php/Home/';
    }else{
        cfg.ajaxroot = 'http://112.124.39.219:8999/thinkphp_3.2.2_full/user.php/Home/';
    }*/
    return cfg;
})());