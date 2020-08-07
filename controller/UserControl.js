const db= require('../models');
const sequelize=require('sequelize');
const Op =sequelize.Op;
const user =db.user;
const crypto=require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
module.exports={
index: async function(req,res){
	if (req.session && req.session.auth == true) {
		try{
			var users = await user.findAll({
				order:[
					        ['id','desc'],
				      ]
			});
			if (users) {
                users = users.map(value => {
                  return value.toJSON();
                 });
                }
                /*console.log(msg,"hello msg");*/
			res.render("user/index",{msg:req.flash('msg'),response:users,title:'user',session:req.session});
		}catch(error){
			throw(error);

		}
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
},


add: async function(req,res){
	if (req.session && req.session.auth == true) {
	try{

	res.render("user/add",{msg:req.flash('msg'),title:'user',session:req.session});	

	}catch(error){

		throw(error);
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}
},

edit: async function(req,res){
	if (req.session && req.session.auth == true) {
	try{
		var id= req.query.id;

		user_data = await user.findOne({
			where:{
               id:id
 			}
		});

		if(user_data){
			res.render("user/edit",{msg:req.flash('msg'),response:user_data,title:'user',session:req.session});	
		}else{
			req.flash('msg', 'User Not Found.')
			res.redirect('/admin/users');
		}

	}catch(error){

		throw(error);
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}
},

user_edit:async function(req,res){
	if (req.session && req.session.auth == true) {
	try{

 var requestdata = req.body;
 var users = await user.findOne({
     where : {
       id:requestdata.id
     }
	});
	
	var check_email = await user.findOne({
		where:{
			email:requestdata.email,
			id:{
				[Op.ne]:requestdata.id
			}
		},
		raw:true
	});
	if(check_email !=null){
		 req.flash('msg', 'Email Already Exist');
		 res.redirect('/admin/users');
		 return false;
	}

  let imageName='';
          if(req.files && req.files.image){
            //alert('hii');
           let image = req.files.image;  
            image.mv(process.cwd()+'/public/upload/'+image.name, function(err) {    
             if (err)      
            return res.status(500).send(err);   
            });
            imageName = req.files.image.name; 
          }else{
            imageName = users.dataValues.image;
          }
  var user_update = await user.update(
  { 
	firstName: requestdata.firstName,
	lastName: requestdata.lastName,
    name:   requestdata.firstName + ' ' + requestdata.lastName,
    email:requestdata.email,
    image:imageName,
    location:requestdata.location,
    latitude:requestdata.latitude,
    longitude:requestdata.longitude
   },
    { 
      where: 
      { 
        id: requestdata.id 
      } 
    }
)
 req.flash('msg', 'user updated successfully')

 res.redirect('/admin/users')

	}catch(error){
		throw(error)
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}

},

add_user:async function (req,res){
	if (req.session && req.session.auth == true) {
	try{

		   var requestdata =req.body;

		   var check_email = await user.findOne({
			   where:{
				   email:requestdata.email
			   },
			   raw:true
		   });
		   if(check_email !=null){
				req.flash('msg', 'Email Already Exist');
				res.redirect('/admin/users');
				return false;
		   }
	       const confirm_password = crypto.createHash('sha1').update(requestdata.password).digest('hex');
	       let imageName='';
	          if(req.files && req.files.image){
	           let image = req.files.image;  
	            image.mv(process.cwd()+'/public/upload/'+image.name, function(err) {    
	             if (err)      
	            return res.status(500).send(err);   
	            });
	          }
	        imageName = req.files.image.name; 
    var user_insert = await user.create({
		firstName: requestdata.firstName,
		lastName: requestdata.lastName,
		name:   requestdata.firstName + ' ' + requestdata.lastName,
     	email:requestdata.email,
     	password:confirm_password,
     	image:imageName,
     	status:1,
     	socialType:0,
     	location:requestdata.location,
     	latitude:requestdata.latitude,
     	longitude:requestdata.longitude
     });

    if(user_insert){
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'test978056@gmail.com',
		    pass: 'cqlsys123'
		  }
		});

	var mailOptions = {
	  from: 'test978056@gmail.com',
	  to: requestdata.email,
	  subject: 'Login details',
	  html: '<h3> login details</h3><p>email :' + requestdata.email +' </p><br><p> password:' + req.body.password + '</p>'
	};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
      req.flash('msg', 'User Add Successfully.');
       res.redirect('/admin/users');
   }else{
    req.flash('msg', 'User Not Added.')
      res.redirect('/admin/users');
   }


	}catch(error){
		throw(error);
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}
},

user_delete: async function(req,res){
	if (req.session && req.session.auth == true) {
	try{

		const dlt = await user.destroy({
              where: {
                id: req.body.id
              }
            });
 
   res.json(1);

	}catch(error){
		throw(error);
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}
},


view:async function(req,res){
	if (req.session && req.session.auth == true) {
	try{

		var id=req.query.id;

		var final_data = await user.findOne({
			where:{
				id:id
			}
		});

		  if (final_data) {
                
  res.render('user/view',{msg:req.flash('msg'),response:final_data,title:'user',session:req.session});
}else{
  req.flash('msg','Please login first')
  res.redirect('/login');
}

	}catch(error){

		throw(error);
	}
}else{
	req.flash('msg', 'Please login first')
	res.redirect('/login');
}

},


update_status:async function(req,res){
	if (req.session && req.session.auth == true) {
	try{

	    var id=req.body.id;

	    var userss = await user.findOne({
	      where : {
	       id:id
	     }
	    });
	  
	  /*console.log(userss.dataValues.status);*/
	 var st ='';
	  if(userss.dataValues.status==1){
	    st =0;
	  }else{
	     st =1;
	  }
	// update query ---------------------
	  var user_update = await user.update(
	      { 
	        status:st
	       },
	  { 
	  where: 
	      { 
	      id: id 
	      } 
	    }
	);

	  res.json(st);

		}catch(error){
			throw(error);
		}
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
}
}
