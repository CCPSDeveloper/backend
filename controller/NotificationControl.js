const db= require('../models');
const sequelize=require('sequelize');
const admins=db.admin
const user=db.user
const provider=db.provider
const notification=db.notification
var crypto=require('crypto');
/*var flash = require('express-flash');*/
const flash = require('connect-flash');

module.exports= {

    send_notification:async function(req,res){
        if (req.session && req.session.auth == true) {
    try{
        if(req.session && req.session.auth==true){
            res.render('notification/add_notification',{msg:req.flash('msg'),response:'',title:'notification',session:req.session});
            
        }else{
            req.flash('msg','Please login first')
            res.redirect('/login');
        }
            
        }catch(err){
            throw err;
        }
    }else{
        req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
    },
    allUser:async function(req,res){
        if (req.session && req.session.auth == true) {
        try{
        if(req.session && req.session.auth == true){
            var users = await user.findAll({
                where:{
                    status:1
                },
               
                order: [
                   ['id','ASC'],
                ]
               });
             if (users) {
                           list = users.map(value => {
                             return value.toJSON();
                            });
                           }
          res.send(list);
        }else{
            req.flash('msg','Please login first')
            res.redirect('/login');
        }
        }catch(err){
            throw err;
        }
    }else{
        req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
    },
    get_business:async function(req,res){
        try{
            if(req.session && req.session.auth == true){
                var business_list = await provider.findAll({
                     where : {
                       status : 1
                     },
                    order: [
                       ['id','desc']
                    ]
                   });
                 if (business_list) {
                               buss_list = business_list.map(value => {
                                 return value.toJSON();
                                });
                               }
                res.send(buss_list);
            }else{
                req.flash('msg','Please login first')
                res.redirect('/login');
            }
        }catch(err){
            throw err;
        }
    },
    save_notiifcation:async function(req,res){
        try{
            if(req.session && req.session.auth == true){
                var type= req.body.type;
                var message= req.body.description;
                var GivenInput=req.body.users_type
                // console.log(GivenInput);return false;
            //////////
            var final_data = '';
            var AllIlness = GivenInput.length;
            var totalIllness = (GivenInput.length - 1);
            var first = true;
            for (let i in GivenInput) {
                if (!first) {
                    final_data += " ,";
                }
                else {
                    first = false;
                }
                final_data += " '" + GivenInput[i] + "'";
            }
           
            //////////
            var InsertingData = `(${type},${message},${final_data})`;
           

           
            let addNotification = [];
            if (final_data.length > 0) {
                for (let i in GivenInput) {
                    let tempObj = {
                        userType: type,
                        usertypeId: parseInt(GivenInput[i]),
                        message: message,
                    }
                    
                    addNotification.push(tempObj);
                }
            }
             //let result = await  notification.bulkCreate(addNotification);
             
            if(result){
                req.flash('msg', 'Notification Sent successfully')
                res.redirect('/admin/notification')
            }
  
            }else{
                req.flash('msg','Please login first')
                res.redirect('/login');   
            }   
        }catch(err){
            throw err;
        }
    }

	
	}

