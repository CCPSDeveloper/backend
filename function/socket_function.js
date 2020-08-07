const db = require('../models/');
const sequelize=require('sequelize');
const Op = sequelize.Op;
const current_time = Math.floor(Date.now() / 1000);
var user =db.user;
const fs = require('fs');
const business =db.provider;
const chat =db.chat;
const constant =db.constant;
const onlineUser =db.onlineUser;
const onlineProvider =db.onlineProvider;
var path = require('path');
var tables = {
	'business': business,
	'user':  user,
	'onlineUser':onlineUser,
	'onlineProvider':onlineProvider,
	'chat':chat,
	'constant':constant
};
  
var moment = require('moment');
module.exports= {

Time: async function(){
	var time = Date.now();
	var n = time / 1000;
	return time = Math.floor(n);

},

convert_timestamp: async function(data){
	var time = Math.round(new Date(data).getTime() / 1000);
	return time;
},
 single_image_upload:function(data,folder) {
 	 let image = data;  
	            image.mv(process.cwd()+'/public/'+folder+'/'+image.name, function(err) {    
	              if (err) {     
                   return res.status(500).send(err);   
                 }
           
	        });
	    return image.name;
	           
},
image_base_64: async function (get_message, extension_data) {
    var image = get_message
    var data = image.replace(/^data:image\/\w+;base64,/, '');
    var extension = extension_data;
    var filename = Math.floor(Date.now() / 1000) + '.' + extension;
    var base64Str = data;
    upload_path = path.join(__dirname, '../public/upload/' + filename);
    if (extension) {
      fs.writeFile(upload_path, base64Str, {
        encoding: 'base64'
      }, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
    return filename;
  },
findOnLineUser: async function(data){
	let table = data.model;
//	console.log(data);
	if(tables.hasOwnProperty(table)) {
		 table = tables[table];
	}
	if(data.type ==1){
	var get_data =await table.findOne({
		where:{
			providerId:data.id
		}
	});
}else{

	var get_data =await table.findOne({
		where:{
			userId:data.id
		}
	});

}

	//console.log(get_data,"===============get_data");
	if(get_data){
		get_data =get_data.toJSON();
		delete data.id;
			var update_data = await table.update(data,{
					where:{
						id:get_data.id
					}
				}
			);

	}else{
		delete data.id;
		var create_data =await table.create(data);
	}
	let msg = "connected Successfully";
	return msg;
	
},

InsertData:async function(data){
	var insert_data ={};
	let table = data.model;
	let table2 = data.model2;
	if(tables.hasOwnProperty(table)) {
		 table = tables[table];
	}
	delete data.id;
	var insert_data = await table.create(data);
	if(insert_data){
			insert_data =insert_data.toJSON();
			if(tables.hasOwnProperty(table2)) {
				table2 = tables[table2];
			}

			// check constant ===================
		var check_data = await table2.findOne({
			where:{
				[Op.or]:[{userId:data.userId,user2Id:data.user2Id},{user2Id:data.userId,userId:data.user2Id}]
			}
		});

		//console.log(check_data,'====================')
		if(check_data){
			check_data =check_data.toJSON();
			var update_data = await table2.update({
				lastMsgId:insert_data.id
			},{
				where:{
					id:check_data.id
				}
			}
			);
			//  update chat table constant id
			//console.log(check_data,'================');
			var update_data = await table.update({
				constantId:check_data.id
			},{
				where:{
					id:insert_data.id
				}
			}
			);


		}else{
			data.lastMsgId =insert_data.id
			//  insert constant
			var insert_data_const = await table2.create(data);
			insert_data_const =insert_data_const.toJSON();
           // update chat constant
			var update_data = await table.update({
				constantId:insert_data_const.id
			},{
				where:{
					id:insert_data.id
				}
			}
			);
		}

	}
	data.id= insert_data.id;
	var abc = await this.GetData(data);
		return abc;


},

GetData:async function(data){
	let table = data.model;
	if(tables.hasOwnProperty(table)) {
		 table = tables[table];
	}

	//console.log(table,"======================")
	var get_data =await table.findOne({
		where:{
			id:data.id,
			// notificationStatus:0
		}
	});
	if(get_data){
		get_data =get_data.toJSON();
	}
	return get_data;
},



GetData1:async function(data){
	let table = data.model;
	if(tables.hasOwnProperty(table)) {
		 table = tables[table];
	}

 if(data.type ==0){
	 var col ='providerId';
 }else{
	var col ='userId';
 }
	var get_data =await table.findOne({
		where:{
			[col]:data.id
		}
	});
	if(get_data){
		get_data =get_data.toJSON();
	}
	return get_data;
},

updateData:async function(data){
	let table = data.model;
	if(tables.hasOwnProperty(table)) {
		 table = tables[table];
	}
	
	var get_data =await table.update({
		status:0
	},{
		where:{
			socketId:data.socketId
		}
	});
	
	return get_data;
},



GetChat : async function(msg){
	var page = 1;
	if(msg.page){
	  page =(msg.page > 0) ? msg.page : 1;
	}
	var limit = 20;
	if(msg.limit){
	  limit = Number(msg.limit);
	}


	var offset = (page-1) * Number(limit);

	var constant_check = await constant.findOne({
        where: {
          [Op.or]: [
            { userId: msg.userId, user2Id: msg.user2Id },
            { userId: msg.user2Id, user2Id: msg.userId }
          ]
        }
	  });
	  if(constant_check){
		//   read message
		var update_chat = await chat.update(
			{
				isRead:1
			},{
				where:{
					user2Id: msg.userId
				}
			}
		);
			constant_check =constant_check.toJSON();
			var get_message = await chat.findAll({
				attributes:['id','userId','user2Id','message','constantId','msg_type','type','isRead',[sequelize.literal('`created_at`'), 'createdAt'],[ sequelize.literal('CASE WHEN chat.type = 1 THEN (select (CONCAT(first_name, " ", last_name)) as name  from user where id=chat.user2id)  WHEN chat.type  = 0 THEN (select (CONCAT(first_name, " ", last_name)) as name  from provider where id=chat.user2id ) end '),"user2_name" ],
				[sequelize.literal('CASE WHEN chat.type = 1 THEN (select image from user where id=chat.user2id)  WHEN chat.type  = 0 THEN (select image from provider where id=chat.user2id ) end '),"user2_image" ],	
				[sequelize.literal('CASE WHEN chat.type = 1 THEN (select (CONCAT(first_name, " ", last_name)) as name  from provider where id=chat.user_id)  WHEN chat.type  = 0 THEN (select (CONCAT(first_name, " ", last_name)) as name  from user where id=chat.user_id ) end '),"user_name" ],
				[sequelize.literal('CASE WHEN chat.type = 1 THEN (select image from provider where id=chat.user_id)  WHEN chat.type  = 0 THEN (select image from user where id=chat.user_id ) end '),"user_image" ]
			
			],
				where:{
					constantId:constant_check.id
				},
				offset,limit
			});
			if(get_message){
				get_message =get_message.map(val=>{
					var data =val.toJSON();
					// data.user_name="";
					// data.user_image=""
					// var tm1 =new Date(data.created_at);
					// var tim1 =  Math.round(tm1.getTime() / 1000);
					// data.createdAt =tim1;
					return data;
				});
				return get_message;
			}
		}else{
			return []
		}
	   },

	get_chat_list : async function(msg){

		var page = 1;
		if(msg.page){
		  page =(msg.page > 0) ? msg.page : 1;
		}
		var limit = 20;
		if(msg.limit){
		  limit = Number(msg.limit);
		}
	
		var offset = (page-1) * Number(limit);

		var constant_check = await constant.findAll({
			attributes:['id','lastMsgId'],
			where: {
			  [Op.or]: [
				{ userId: msg.userId},
				{ user2Id: msg.userId }
			  ]
			},
			offset,limit
		  });
		  if(constant_check){
			constant_check =constant_check.map(val=>{return val.toJSON()});
			for(var i in constant_check){
				var get_message = await chat.findOne({
					attributes:['id','userId','user2Id','message','createdAt',[sequelize.literal('(select count(id) as total from chat where user2id='+msg.userId+' and is_read = 0)'), 'unread_message']],
					where:{
						id:constant_check[i].lastMsgId
					}
				});
				if(get_message){
					get_message =get_message.toJSON();
					if(get_message.userId ==msg.userId){
						if(msg.type ==0){
							// console.log("else innnnnnnnnnnnnnn");return;
						  var get_user = await business.findOne({
							attributes:['id',[sequelize.fn('concat', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'name'],'image'],
							  where:{
								  id:get_message.user2Id
							  }
						  });
						}else{
							// console.log("else innnnnnnnnnnnnnn");return;
							var get_user = await user.findOne({
								attributes:['id',[sequelize.fn('concat', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'name'],'image'],
								where:{
									id:get_message.user2Id
								}
							});
							// console.log(get_user,"get_user");return;
						}
					}else{
						if(msg.type ==0){
							 get_user = await business.findOne({
								attributes:['id',[sequelize.fn('concat', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'name'],'image'],
								where:{
									id:get_message.userId
								}
							});
						  }else{
							/*   console.log("else innnnnnnnnnnnnnnnnnnnnnnnnnn") */
							   get_user = await user.findOne({
								  attributes:['id',[sequelize.fn('concat', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'name'],'image'],
								  where:{
									  id:get_message.userId
								  }
							  });
							//   console.log(get_user,"get_user");return;
						  }
					}
					if(get_user) {
						get_user =get_user;
					} else {
						get_user={}
					}
					///get_user =get_user.toJSON();
					// get_message.createdAt =await this.convert_timestamp(get_message.createdAt);
					get_message.user =get_user;
					constant_check[i].chat =get_message;
				}else{
					constant_check[i].chat ={};	
				}
			}
			return constant_check;
	
			}else{
				return []
			}
		   }
	   

}