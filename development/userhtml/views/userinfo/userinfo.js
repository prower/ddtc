/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_userinfo(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            telphone:'[name=telphone]'
            ,pailist:'[name=pailist]'
            ,row:'.template [name=row]'
            ,rownone:'.template [name=rownone]'
            ,addpanel:{
                input_add:'[name=input_add]'
                ,btadd:'[name=btadd]'
            }
            ,btreg:'[name=btreg]'
            ,btquit:'[name=btquit]'
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
            this.m_getuserinfo(function(data){
                me.info = data;
                me.info.carids = me.info.carids || [];
                me.c_fill(me.info);
            });
        }
        ,c_showquit:function(isshow){
            this.showquit = !!isshow;
        }
        ,c_fill:function(info){
            var me = this;
            this.dom.telphone.html(info.telephone);
            this.c_fillcarid(info.carids);
        }
        ,c_fillcarid:function(carids){
            var me = this;
            //carid
            this.dom.pailist.empty();
            if(carids.length>0){
                for(var i=0;i<carids.length;i++){
                    var d = carids[i];
                    var row = this.c_getcaridrow(d);
                    this.dom.pailist.append(row);
                }
            }else{
                this.dom.pailist.append(this.dom.rownone.clone());
            }

            setTimeout(function(){
               me.iscroll && me.iscroll.refresh();
            });
        }
        ,c_getcaridrow:function(data){
            var me=  this;
            var row = this.dom.row.clone();
            row.find('b').html(data.carid);
            if('1' == data.status+''){
                row.addClass('mui-active');
            }else{
                row.click(function(){
                    me. c_rowactive(row, data);
                });
            }
            row.find('a').click(function(){
                me.c_rowcaridedit(row, data);
                return false;
            });
            row.find('.table [name=btcancel]').click(function(){
                row.find('.table input').blur();
                row.removeClass('edit');
                return false;
            });
            row.find('.table [name=btsave]').click(function(){
                me.c_rowcraideitsave(row, data);
                return false;
            });
            return row;
        }
        ,c_rowcraideitsave:function(row, data){

            var carid = row.find('.table input').val();
            carid = this.c_valideCarid(carid);
            if(carid){
                var me = this;
                this.m_modifycadid(data.id, carid, function(data){
                    me.info = data;
                    me.c_fill(me.info);
                })
            }
        }
        ,c_rowcaridedit:function(row, data){
            this.dom.pailist.find('>').removeClass('edit');
            row.addClass('edit');
            row.find('.table input').val(data.carid).focus();
        }
        ,c_rowactive:function(row, data){
            var me = this;
            if(!row.hasClass('edit')){
                sysmanager.confirm('设置<span style="color:#16a7de">{0}</span>为当前使用的默认车牌?'.replace('{0}',data.carid),function(){
                   me.m_setdefaultcarid(data.id,function(){
                       var info = me.info;
                          for(var i=0;i<info.carids.length;i++){
                              var d  = info.carids[i];
                              if(d.id == data.id){
                                  d.status = 1;
                              }else{
                                  d.status = 0;
                              }
                          }
                          me.c_fillcarid(me.info.carids);
                   });

               });
            }
        }
        ,c_addCarid:function(){
            var carid = this.dom.addpanel.input_add.val();
            this.dom.addpanel.input_add.blur();

            carid = this.c_valideCarid(carid);
            if(carid){
                var me = this;
                this.m_addcadid(carid, function(data){
                    me.info = data;
                    me.c_fill(me.info);
                    me.dom.addpanel.input_add.val('');
                })
            }
        }
        ,c_valideCarid:function(carid){
            carid = carid.replace(/[ ]/g,"");
            carid = carid.toUpperCase();

            if(!carid){
                sysmanager.alert('请输入正确的车牌号!');
                return false;
            }
            var msg = [];
            //验证重复
            for(var i = 0;i<this.info.carids.length;i++){
                var d = this.info.carids[i];
                if(d.carid == carid){
                    msg.push('车牌号<span style="color: #16a7de">{0}</span>已经存在'.replace('{0}', carid));
                }
            }
            if(msg.length){
                sysmanager.alert(msg.join('<br>'));
                return false;
            }else{
                return carid;
            }
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
            this.dom.addpanel.btadd.click(function(){
                me.c_addCarid();
            });
            this.dom.btreg.click(function(){
//                sysmanager.loadpage('views/', 'reg', null,'账户登录', function(view){
//                    view.obj.isHead(true);
//                    view.obj.onclose = function(){
//                        me.c_init();
//                    }
//                });
                sysmanager.loginUI(function(){
                    me.c_init();
                },'请输入要切换的手机号',true);
            });
            this.dom.btquit.click(function(){
                $('#topheardpagecontainer [name=btupclose]').click();
            });
        }
        ,close:function(){
            this.onclose && this.onclose(this.info);
        }
        ,m_getuserinfo:function(fn){
            window.myajax.userget('index','getDriverInfo',null, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_addcadid:function(carid, fn){
            window.myajax.userget('index','addCarid',{carid:carid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_modifycadid:function(id, carid, fn){
            window.myajax.userget('index','modifyCarid',{id:id,newCarid:carid}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,m_setdefaultcarid:function(id,fn){
            window.myajax.userget('index','setDefaultCar',{id:id}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
    };
    return  ui;
}
