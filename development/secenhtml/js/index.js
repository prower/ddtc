/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function sendInfoToAnotherDomain(info){
    var iframe=window.frames[0];
    iframe.postMessage(info,'http://duduche.me');           //限制域名
}
window.addEventListener("message",function(ev){

    var info = ev.data;

   if(info == 'appquit'){
       //alert('app quit');
       navigator.app.exitApp();
   }
});

var stateisLine = null;     //当前在线状态
var param = new Date;
var offlineProcess = window.offlineProcess = function(isLine){    //在线处理  isLine 是否在线
    if(isLine == stateisLine){
        return;
    }
    var offlinePage = document.getElementById('offlinePage');
    var appiframe = document.getElementById('appiframe');
    if(isLine){
        offlinePage.style.display = 'none';
        var src = 'http://static.duduche.me/redirect/secen/indexhtml.php?'+ param;
        appiframe.style.display = 'block';
        appiframe.src = src ;
    }else{
        appiframe.style.display = 'none';
        offlinePage.style.display = 'block';
    }
    stateisLine = isLine;
}

var mycheckConnection = window.mycheckConnection = function() {
    if(navigator.connection.type == Connection.NONE){
        offlineProcess(false);
    }else{
        offlineProcess(true);
    }
}

var app = {
    // Application Constructor
    initialize: function() {
        setTimeout(function(){
            offlineProcess(true);
        });
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var me = this;
        document.addEventListener('deviceready', function(){
            me.onDeviceReady();
        }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //初始化device
        device.onPushID = app.onPushID;
        device.onMsgData = app.onMsgData;

        this.onMyEVENT();
        //app.receivedEvent('deviceready');
    }
    ,onMyEVENT:function(){
        document.addEventListener("backbutton", function(e){
            setTimeout(function(){
                sendInfoToAnotherDomain('{"quit":"1"}');
            });
            //navigator.app.exitApp();
            //navigator.app.backHistory()
        }, false);

        //网络检测

        document.addEventListener("offline", function(){
            offlineProcess(false);
        }, false);
        document.addEventListener("online", function(){
            offlineProcess(true);
        }, false);

        setTimeout(function(){

            mycheckConnection();
        });
    }
    ,
    // Update DOM on a Received Event
    /**
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        receivedElement.innerHTML = 'Received Event: ' + id;

        console.log('Received Event: ' + id);
    },*/
    onPushID: function(data) {
        /**
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        receivedElement.innerHTML = 'PushID: ' + data;

        console.log('PushID: ' + data);
         */
        //setTimeout(function(){window.PushManager.PUSH_ID(data);});
        var obj = {
            pushid:data
        }
        setTimeout(function(){
            sendInfoToAnotherDomain(JSON.stringify(obj));
        });
    },
    onMsgData: function(data) {
        /**
    var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    receivedElement.innerHTML = 'MsgData: ' + data;

    console.log('MsgData: ' + data);
         */
        //setTimeout(function(){window.PushManager.PUSH_MSG(data);});
        setTimeout(function(){
            sendInfoToAnotherDomain(data);
        });
    }
};

app.initialize();