const db = require('./models');
const jsonData = require('./config/jsonData');
const my_function = require('./function/fun.js');

const sequelize=require('sequelize');
const Op = sequelize.Op;
var user =db.user;
var business =db.provider;
var chat =db.chat;
var constant =db.constant;
var online_user =db.onlineUser;
var online_provider =db.onlineProvider;
const fun =require('./function/socket_function');
const fun2 =require('./function/fun.js');
const functions =require('./function/function.js');
require('events').EventEmitter.prototype._maxListeners = 1000;
// const functions = require('./function/api_fun.js');
module.exports= function(io){
    io.on('connection', function (socket) {
        socket.on('connect_user',async function(data){
           // type =0 =user,1=provider
            data.socketId =socket.id;
            if(data.type ==0){
                data.model = online_user;
                data.id=data.id;
                data.userId=data.id;
                 
            }else{
                data.model = online_provider;
                data.id = data.id;
                data.providerId=data.id;
            }
            data.status =1;
            if(data.id !=''){
                var _data = await fun.findOnLineUser(data);
                console.log(_data,"_data")
                io.emit("user_online",_data);
            }
        });

      
        // socket.on('disconnect', async function(data){
        //     // type =0 =user,1=provider
        //      data.socketId =socket.id;
        //      console.log(data,"=======data");
        //      if(data.type ==0){
        //          data.model = 'onlineUser';  
        //      }else{
        //          data.model = 'onlineProvider';
        //      }
        //     var _data = await fun.updateData(data);
        //     var data ={};
        //     data.status = 0
        //     socket.broadcast.emit('disconnect_user', data);
        //     console.log('socket user disconnected');
             
        //  });


        

        //  create post user 
        socket.on('create_post',async function(data){
            try{
                if(data){
                    var check_auth={};
                    var file_data=[];
                    var requestdata ={};
                    data.is_api=1;// 0=api call,1=socket cll
                    check_auth = await my_function.get_user_by_id(data);
                    file_data =(data.images) ? data.images : [];
                    var add_job_description = await my_function.add_job_description(data, check_auth, file_data);
                    if(add_job_description){
                        requestdata.post_id = add_job_description.dataValues.id;
                        var get_job_details = await my_function.get_job_details(requestdata, check_auth);
                        if(get_job_details){
                            var provider_data={
                                message:"New Order Request",
                                data:get_job_details
                            }
                            var user_data = {
                                message:"Order Created Successfully",
                                data:get_job_details
                            }
                            socket.emit("create_post_user",user_data);
                            // multiple provider
                                if(get_job_details.providerId ==0){
                                    var get_provider_online =  await my_function.online_provider_get(get_job_details.id);
                                    if(get_provider_online){
                                        for(var i in get_provider_online){
                                            var mydata ={};
                                            mydata.model='onlineProvider';
                                            mydata.type=0;
                                            mydata.id =get_provider_online[i].id;
                                            var get_user2_online = await fun.GetData1(mydata);
                                            if(get_user2_online){
                                                io.to(get_user2_online.socketId).emit('create_post_user',provider_data);
                                            }
                                        }
                                    }
                                }else{
                                    // single provider
                                    var mydata ={};
                                    mydata.model='onlineProvider';
                                    mydata.type=0;
                                    mydata.id =get_job_details.providerId;
                                    var get_user2_online = await fun.GetData1(mydata);
                                    if(get_user2_online){
                                        io.to(get_user2_online.socketId).emit('create_post_user',provider_data);
                                    }

                                }
                        }
                    }
    
                }

            }catch(error){
                throw error
            }
        });


    socket.on('accept_reject_post',async function(data){
        try{
            if(data){
               var check_auth = await my_function.get_user_by_id(data);
               var user_accept_reject_request = await my_function.user_accept_reject_request(data, check_auth);
               var msg =(data.type ==1) ? "Accept Successfully" : "Reject Successfully" ;
               if(user_accept_reject_request){
                   var body={
                       message:msg,
                       data:data
                   }
                   io.emit('accept_reject',body);
                    var mydata ={};
                    mydata.model='onlineProvider';
                    mydata.type=0;
                    mydata.id =data.provider_id;
                    var get_user2_online = await fun.GetData1(mydata);
                    if(get_user2_online){
                        io.to(get_user2_online.socketId).emit('accept_reject',body);
                    }
               }
               
            }

        }catch(error){
            throw error;
        }
    });    

    socket.on('send_message', async function(data){
        if(data){
            // type=0 sender user then 1 =  provider

           // console.log(data,"===================var")
            var mydata ={};
            var user2data ={};
            var user1 ={};
            
            if(data.type ==1){
                mydata.model = online_user;
                user2data.model = user;
                user2data.type =0
                user1.model = business;
                user1.id =data.userId;
            }else{
                mydata.model = online_provider; 
                user2data.model = business;
                user2data.type =1
                user1.model = user;
                user1.id =data.userId;
            }
           // user1.model = user;
            data.model =chat;
            data.model2 =constant;
            if(data.msgType==1){

                extension_data = data.extension
                convert_image = await fun.image_base_64(data.message, extension_data);
                data.message = convert_image;

            }
           
            //data.type =data.message_type
            var insert_chat =await fun.InsertData(data);
                insert_chat.user_name = data.user_name;
                insert_chat.user_image = data.user_image;
                insert_chat.user2_name = data.user2_name;
                insert_chat.user2_image = data.user2_image;
            if(insert_chat){
                socket.emit('body',insert_chat);
            }
            mydata.id =data.user2Id;
            mydata.type = data.type;
            user2data.id =data.user2Id;
            // get sender data
            var get_userdata = await fun.GetData(user1);
          //  console.log(get_userdata,"==================get_userdata");
            //  get receiver data
            var get_user2data = await fun.GetData(user2data);
           
            if(get_user2data){
//-----------------------   send push ------------------------------------------- 
            var body=insert_chat;
            var _functions ={};
            _functions.type =user2data.type;
            _functions.model =user2data.model
            _functions.token =get_user2data.deviceToken;
            _functions.deviceType =get_user2data.deviceType;
            //_functions.notficationStatus =get_user2data.notficationStatus;
            _functions.title =get_userdata.name + " Send New Message";
            _functions.code =100;
            _functions.body =body;
           // console.log(get_user2data.notificationStatus,"====================notficationStatus========");
       
            var push_send = await fun2.send_push_notification(_functions);
           
            }  
// -----------------------   emit user2 -----------------------------------------
            var get_user2_online = await fun.GetData1(mydata);
            if(get_user2_online){
              //  get_user2_online=get_user2_online.toJSON();
                io.to(get_user2_online.socketId).emit('body',insert_chat);
            }
        }

    });  
    
        socket.on('get_chat',async function(data){
            if(data){
                var get_data_chat = await fun.GetChat(data);
                if(get_data_chat){
                    socket.emit('my_chat',get_data_chat);
                }
            }
            
        });

        socket.on('get_chat_list', async function(data){
            try {
                if(data){
                    var get_list =await fun.get_chat_list(data);
                    if(get_list){
                        socket.emit('get_list',get_list);
                    }
    
                }
            } catch (error) {
               console.log(error,"========error=========");
            }
            
        });

        console.log('socket connected');

    });
    





}