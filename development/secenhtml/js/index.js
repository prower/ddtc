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

(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\bparent\b/ : /.*/;
    var Class = function(){};
    Class.extend = function(prop) {
            var parent = this.prototype;

            initializing = true;
            var prototype = new this();
            initializing = false;

            for( var name in prop ) {
                if(
                    typeof(prop[name]) == "function" &&
                        typeof(parent[name]) == "function" &&
                        fnTest.test(prop[name])
                    ) {
                    prototype[name] = (function(name, fn){
                        return function() {
                            var tmp = this.parent;
                            this.parent = parent[name];
                            var ret = fn.apply(this, arguments);
                            this.parent = tmp;
                            return ret;
                        };
                    })( name, prop[name] );
                }
                else {
                    prototype[name] = prop[name];
                }
            }
            var ig = {
                copy: function( object ) {
                    if(
                        !object || typeof(object) != 'object' ||
                            object instanceof HTMLElement ||
                            //object instanceof ig.Class
                            object instanceof Class
                        ) {
                        return object;
                    }
                    else if( object instanceof Array ) {
                        var c = [];
                        for( var i = 0, l = object.length; i < l; i++) {
                            c[i] = ig.copy(object[i]);
                        }
                        return c;
                    }
                    else {
                        var c = {};
                        for( var i in object ) {
                            c[i] = ig.copy(object[i]);
                        }
                        return c;
                    }
                }
            }

            function Class() {
                if( !initializing ) {

                    // If this class has a staticInstantiate method, invoke it
                    // and check if we got something back. If not, the normal
                    // constructor (init) is called.
                    if( this.staticInstantiate ) {
                        var obj = this.staticInstantiate.apply(this, arguments);
                        if( obj ) {
                            return obj;
                        }
                    }
                    for( var p in this ) {
                        if( typeof(this[p]) == 'object' ) {
                            this[p] = ig.copy(this[p]); // deep copy!
                        }
                    }
                    if( this.init ) {
                        this.init.apply(this, arguments);
                    }
                }
                return this;
            }

            Class.prototype = prototype;
            Class.constructor = Class;
            Class.extend = arguments.callee;
            Class.inject = function(prop) {
                var proto = this.prototype;
                var parent = {};
                for( var name in prop ) {
                    if(
                        typeof(prop[name]) == "function" &&
                            typeof(proto[name]) == "function" &&
                            fnTest.test(prop[name])
                        ) {
                        parent[name] = proto[name]; // save original function
                        proto[name] = (function(name, fn){
                            return function() {
                                var tmp = this.parent;
                                this.parent = parent[name];
                                var ret = fn.apply(this, arguments);
                                this.parent = tmp;
                                return ret;
                            };
                        })( name, prop[name] );
                    }
                    else {
                        proto[name] = prop[name];
                    }
                }
            };

            return Class;
        };
    var EventClass = Class.extend({
            events:{}
            /*
             缁戝畾浜嬩欢
             */
            ,bind:function(eventName,fireBack){
                if('string' == typeof eventName){
                    var e = this.events[eventName];
                    if(!e){
                        e = this.events[eventName] = [];
                    }
                    if('function' == typeof fireBack){
                        e.push(fireBack);
                    }
                }
                return this;
            }
            /*
             瑙ｉ櫎缁戝畾浜嬩欢
             eventName:瑕佸垹闄ょ殑浜嬩欢鍚嶇О 濡傛灉涓嶆彁渚� 鍒欏垹闄よ鎵€鏈夌殑浜嬩欢鐩戝惉
             ,fireBack:瑕佽Е鍙戠殑鏂规硶 濡傛灉娌℃湁璇ユ柟娉� 鍒欏垹闄よ浜嬩欢鎵€鏈夌殑缁戝畾
             */
            ,unBind:function(eventName, fireBack){
                var me = this;
                if(!eventName){
                    for(var ename in this.events){
                        this.events[ename] = null;
                    }
                }else{
                    if('function' != fireBack){
                        this.events[eventName] = null;
                    }else{
                        var e = this.events[eventName];
                        if(e){
                            for(var i = 0;i<e.length;i++){
                                if(fireBack == e[i]){
                                    e.splice(i,1);
                                }
                            }
                        }
                    }
                }
                return this;
            }
            /*
             瑙﹀彂鍒跺畾鐨勪簨浠�
             渚濈収缁戝畾鐨勬搴忚繘琛岃皟鐢�
             浜嬩欢鍚嶇О鍚庨潰鍙互娣诲姞涓嶅畾闀跨殑鍙傛暟
             */
            ,fire:function(eventName){
                var e = this.events[eventName];
                var returnValue = false;
                if(e){
                    var arg = null;
                    if(arguments.length>1){
                        arg = [];
                        for(var i=1;i<arguments.length;i++){
                            arg.push(arguments[i]);
                        }
                    }
                    for(var i=0;i<e.length;i++){
                        var cb = e[i];
                        if(arg?cb.apply(this,arg):cb.apply(this)){
                            returnValue = true;
                        }
                    }
                }
                return returnValue;
            }

        });

    var pushManager =  EventClass.extend({
        events:{}
       /*
        缁戝畾浜嬩欢
        */
       ,bind:function(eventName,fireBack){
           if('string' == typeof eventName){
               var e = this.events[eventName];
               if(!e){
                   e = this.events[eventName] = [];
               }
               if('function' == typeof fireBack){
                   e.push(fireBack);
               }
           }
           return this;
       }
       /*
        瑙ｉ櫎缁戝畾浜嬩欢
        eventName:瑕佸垹闄ょ殑浜嬩欢鍚嶇О 濡傛灉涓嶆彁渚� 鍒欏垹闄よ鎵€鏈夌殑浜嬩欢鐩戝惉
        ,fireBack:瑕佽Е鍙戠殑鏂规硶 濡傛灉娌℃湁璇ユ柟娉� 鍒欏垹闄よ浜嬩欢鎵€鏈夌殑缁戝畾
        */
       ,unBind:function(eventName, fireBack){
           var me = this;
           if(!eventName){
               for(var ename in this.events){
                   this.events[ename] = null;
               }
           }else{
               if('function' != fireBack){
                   this.events[eventName] = null;
               }else{
                   var e = this.events[eventName];
                   if(e){
                       for(var i = 0;i<e.length;i++){
                           if(fireBack == e[i]){
                               e.splice(i,1);
                           }
                       }
                   }
               }
           }
           return this;
       }
       /*
        瑙﹀彂鍒跺畾鐨勪簨浠�
        渚濈収缁戝畾鐨勬搴忚繘琛岃皟鐢�
        浜嬩欢鍚嶇О鍚庨潰鍙互娣诲姞涓嶅畾闀跨殑鍙傛暟
        */
       ,fire:function(eventName){
           var e = this.events[eventName];
           var returnValue = false;
           if(e){
               var arg = null;
               if(arguments.length>1){
                   arg = [];
                   for(var i=1;i<arguments.length;i++){
                       arg.push(arguments[i]);
                   }
               }
               for(var i=0;i<e.length;i++){
                   var cb = e[i];
                   if(arg?cb.apply(this,arg):cb.apply(this)){
                       returnValue = true;
                   }
               }
           }
           return returnValue;
       }
        ,pushid:null
        ,pushmsg:[]
        ,PUSH_ID:function(pushid){
            this.pushid = pushid;
//            alert('pushid\n' + pushid);
            this.fire('pushid');
        }
        ,PUSH_MSG:function(msg){
            this.pushmsg.push(msg);
//            alert('pushmsg\n' + msg);
            this.fire('pushmsg');
        }
        ,getPushid:function(){
            return this.pushid;
        }
        ,getPushmsg:function(){
            return this.pushmsg.shift();
        }
    });


    window.PushManager = new pushManager({

    });

})();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //初始化device
        device.onPushID = app.onPushID;
        device.onMsgData = app.onMsgData;
        
        //app.receivedEvent('deviceready');
    },
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