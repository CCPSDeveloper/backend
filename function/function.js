const db= require('../models');
var dateFormat = require('dateformat');
const sequelize=require('sequelize');
const nodemailer = require('nodemailer');
const Op = sequelize.Op;
var moment = require('moment');
var crypto = require('crypto');
var uuid = require('uuid');
var path = require('path');
const fcm = require('fcm-node');
var url = require('url');
const user =db.user;
const setting =db.setting;
const business =db.provider;
const product =db.product;
const post =db.post;

//const business_server_key ='AAAAA_TkRTU:APA91bEERJTO5g0oIfkl8grGEWaGN7IZzzJ1tO2l-AdERhxh1YausU0PODG9zWHyGOBcmDNu_oYm9LQ2sjYFPolBZGdPxUptj8C1WG3YHQxOUijS1Qjhj4oiQZdjFturaGaUdNFKez_F';
const user_server_key='AAAA5lpUS6A:APA91bFnipEwOgMGE9WdbPmjH6UdOC_sOAVfOT5DGu82jJBhcPv1yqfn4XACsvYRJCFEzOy4sYsoArBTepvRRZgIXqj0vySzZgKC-3lPJabYEa16G3oV9SFH2cmich4E7KT1GZAf9zcD';

module.exports= {
 getAge:function(DOB) {
 	//alert('hii');
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
},
fullurl:function(req){
    return url.format({
       // protocol: req.protocol,
        host: req.get('host'),
      //  pathname: req.originalUrl
      });
},
 
ConvertTime: async function(data){
	var tm =new Date(data);
	var tim =  Math.round(tm.getTime() / 1000);
	//console.log(tim);
	return  tim;
},
single_image_upload:function(res,data,folder) {
    let image = data;
    var extension = path.extname(image.name);
    var filename = uuid() + extension;
    image.mv(process.cwd()+'/public/'+folder+'/'+filename, function(err) {    
    // if (err) {     
    //     return res.status(500).send(err);   
    // }
    });
    // return image.name;
    return filename;         
},

get_date: function(){
  var now = new Date();
  var date =dateFormat(now, "yyyy-mm-dd H:MM:ss");
  return date;

},
// ----------------- validation function ----------------------

required_data : function(data){
  var  _final =[];
  for(var i in data){
      _final.push(data[i].msg);
  }
  var msg =_final.toString();
  var final ={},
  final={
       'message' : msg,
       'code':'400'
   } 
   return final;

},


true_status:  function(res,body,msg)
  {
      res.status(200).json({
          'success':1,
          'code':200,
          'message':msg,
          'body':body,
      });
      return false;
  },

  false_status: function(res, msg)
  {
      res.status(400).json({
          'success':0,
          'code':400,
          'message':msg,
          'body':{},
      });
      return false;
  },

  invalid_token: function(res, msg)
  {
      res.status(403).json({
          'success':0,
          'code':403,
          'message':msg,
          'body':{},
      });
      return false;
  },

    invalid_status: function(res, msg)
    {
        res.status(401).json({
            'success':0,
            'code':401,
            'message':msg,
            'body':{},
        });
        return false;
    },
    //  login -----------
    LoginUser: async function(res,data){
    const password = crypto.createHash('sha1').update(data.password).digest('hex');
    var _user_data ={};
    let table = data.modal;
        let tables = {
            'business': business,
            'user':  user
        };
        if(tables.hasOwnProperty(table)) {
            table = tables[table];
        };

    _user_data = await table.findOne({
        where:{
            email:data.email,
            password: password
        }
    });
    if(_user_data){
        _user_data =_user_data.toJSON();
        if(_user_data.status == 0){
        let msg = 'Due to some reason, your account has been suspended by admin. Please contact the admin to resolve this issue.';
        return  this.false_status(res, msg);
        return false;
        }
        //_user_data.createdAt = _user_data.createdAt.toString();
        delete _user_data.password;
    }
    return _user_data;

    },

GetUser: async function(id,modal){
    var _user_data ={};
    let tables = {
        'business': business,
        'user':  user,
        'product':product,
        'post':post
    };

    if(tables.hasOwnProperty(modal)) {
        modal = tables[modal];
    };
	 _user_data = await modal.findOne({
		where:{
			id:id,
		}
	});
	if(_user_data){
		_user_data =_user_data.toJSON();
		//_user_data.createdAt = _user_data.createdAt.toString();
		delete _user_data.password;
		
	}
	return _user_data;

},

GetEmailData: async function(email,modal){
    var _user_data ={};
    let tables = {
        'business': business,
        'user':  user,
        'product':product,
        'post':post
    };

    if(tables.hasOwnProperty(modal)) {
        modal = tables[modal];
    };
		var check =await modal.findOne({
			where:{
				email:email
			}
		});
		if(check){
			return check.toJSON();
		}else{
			return false;	
		}
	
	},
UpdateDevice: async function(data){
    var auth_key = crypto.randomBytes(10).toString('hex');
    let modal = data.modal;
    let tables = {
        'business': business,
        'user':  user
    };

    if(tables.hasOwnProperty(modal)) {
        modal = tables[modal];
    };

	var update =await modal.update({
		deviceToken:data.device_token,
		deviceType:data.device_type,
		authorization:auth_key
	},
		{
			where:{
				id:data.id
			}
		}
	);
	if(update){
			return true;
		}else{
			return false;
		}
	
},

InsertData: async function(data){
    if(data.hasOwnProperty("password")){
    const password = crypto.createHash('sha1').update(data.password).digest('hex');
    data.password = password;
    }
    let table = data.modal;
      let tables = {
          'business': business,
          'user':  user
      };
      if(tables.hasOwnProperty(table)) {
          table = tables[table];
      };
    
     data.authorization =crypto.randomBytes(10).toString('hex');
      data.status = 1;
     //console.log(data,"=================");
     var insert_data = await table.create(data);
     if(insert_data){
		insert_data =insert_data.toJSON();
		delete insert_data.password;
	}
	return insert_data;
  
  },
  

  CheckEmailExist: async function(res,email,modal){
    let table = modal;
      let tables = {
          'business': business,
          'user':  user
      };
      if(tables.hasOwnProperty(table)) {
          table = tables[table];
      };
        var check =await table.findOne({
            where:{
                email:email
            }
        });
        if(check){
            let msg = 'Email already Exist';
            return  this.false_status(res, msg);
            return false;
            
        }else{
            return true;	
        }
    
    },

    UpdateData: async function(data){
        let modal = data.modal;
        let tables = {
            'business': business,
            'user':  user
        };
    
        if(tables.hasOwnProperty(modal)) {
            modal = tables[modal];
        };
        var id =data.id;
        delete data.id;
        // console.log(data,'====================data');
        // console.log(id,'====================id'); return;


        var update =await modal.update(data,
            {
                where:{
                    id:id
                }
            }
        );
        if(update){
            var da = this.GetUser(id,modal);
                return  da;
            }else{
                return false;
            }
        
    },

    CheckAuthKey: async function(data,res){
        let modal = data.modal;
        let tables = {
            'business': business,
            'user':  user
        };
        if(tables.hasOwnProperty(modal)) {
            modal = tables[modal];
        };
        var auth = await modal.findOne({
            where:{
                authorization:data.authorization
            }
        });
        if(auth){
            auth =auth.toJSON();
            //delete auth.password;
            return auth;
        }else{
            let msg = 'Invalid authorization';
            return  this.false_status(res, msg);
            return false;
        }
    },

    PushNotification: async function(data){
        var FCM = new fcm(user_server_key);
        var token = data.token;
        var message = {
            to : token,
            collapse_key: 'BadBoy',
            content_available: true,
            data: {    //This is only optional, you can send any data
                soundname: "default"  ,
                notification_code : data.code,
                body:{
                    data:data.body,
                    title:'Society',
                    message:data.title
                }
            }
        };
        console.log(JSON.stringify(message),"=======================");
        FCM.send(message, function(err, response) {
            if(err){
                console.log('error found', err);
            }else {
                console.log('response here', response);
            }
        })
    },

    PushNotificationMultiple: async function(data){
        
        var FCM = new fcm(user_server_key);
        var token = data.token;
        var message = {
            registration_ids : token,
            collapse_key: 'BadBoy',
            content_available: true,
            data: {    //This is only optional, you can send any data
                soundname: "default"  ,
                notification_code : data.code,
                body:{
                    data:data.body,
                    title:'Society',
                    message:data.title
                }
            }
        };
    //	console.log(JSON.stringify(message));
        FCM.send(message, function(err, response) {
            if(err){
                console.log('error found', err);
            }else {
                console.log('response here', response);
            }
        })
    },

    getSetting: async function(){
        var get_data = await setting.findOne();
        if(get_data){
            get_data =get_data.toJSON();
        }
        return get_data;
        },

    get_rank: async function(point){
         var data = await this.getSetting();
       
        var rank2 =data.rank *2;
       // console.log(rank2,"==========rank2");
         var rank =0;
         if(data.rank <= point && rank2 >= point){
             rank =1;
         }else if(point >= data.rank && point <= Number(data.rank) *2){
            rank =2; 
         }else if(point >=Number(data.rank) *2 && point <= Number(data.rank) *3){
            rank =3; 
         }
         return rank;
    },


    SendMail: function(object){
    // console.log("a gya ma");
        // var transporter = nodemailer.createTransport('SMTP',this.mail_auth);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'test978056@gmail.com',
              pass: 'cqlsys123'
            }
          });
        var mailOptions = object;
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(info,error);
        } else {
           /*  console.log(info); */
            console.log('Email sent: ' + info.messageId);
        }
        });
    },

}