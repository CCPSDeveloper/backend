const db= require('../models');
const sequelize=require('sequelize');
const provider =db.provider;
const category =db.category;
const crypto=require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');

const my_function = require('../function/fun.js');


provider.belongsTo(category , {
	foreignKey:'categoryId'
});
module.exports={
index: async function(req,res){
		try{
			var providers = await provider.findAll({
				where:{
					isApprove:0
				},
				include:[{
					model: category,
		            attributes: ['id','name'],
		            required: false
				}],
				order:[
					        ['id','desc'],
				      ]
			});
			if (providers) {
                providers = providers.map(value => {
                  return value.toJSON();
                 });
                }
                /*console.log(msg,"hello msg");*/
			res.render("provider_request/index",{msg:req.flash('msg'),response:providers,title:'request',session:req.session});
		}catch(error){
			throw(error);

		}
},


add: async function(req,res){
	try{

		var data = await category.findAll({
              where:{
              	status:1
              }
		});

		if(data){
			 data = data.map(value => {
                  return value.toJSON();
                 });
		}

	res.render("provider/add",{msg:req.flash('msg'),title:'provider',response:data});	

	}catch(error){

		throw(error);
	}
},

edit: async function(req,res){
	try{
		var id= req.query.id;

		provider_data = await provider.findOne({
			where:{
               id:id
 			},
 			include:[{
					model: category,
		            attributes: ['id','name'],
		            required: false
				}],
		});

		var data = await category.findAll({
              where:{
              	status:1
              }
		});

		if(data){
			 data = data.map(value => {
                  return value.toJSON();
                 });
		}

		if(provider_data){
			res.render("provider/edit",{msg:req.flash('msg'),response:provider_data, cate: data,title:'provider',session:req.session});	
		}else{
			req.flash('msg', 'Provider Not Found.')
			res.redirect('/admin/provider');
		}

	}catch(error){

		throw(error);
	}
},

provider_edit:async function(req,res){
	try{

 var requestdata = req.body;

 var providers = await provider.findOne({
     where : {
       id:requestdata.id
     }
    });


   var image =providers.dataValues.image;
		if(req.files && req.files.image){
		  image = my_function.single_image_upload(req.files.image,'upload');
		}

		var business_licence =providers.dataValues.businessLicence;
		if(req.files && req.files.business_licence){
		  business_licence = my_function.single_image_upload(req.files.business_licence,'upload');
		}

		var insurance =providers.dataValues.insurance;
		if(req.files && req.files.insurance){
		  insurance = my_function.single_image_upload(req.files.insurance,'upload');
		}

		var resume =providers.dataValues.resume;
		if(req.files && req.files.resume){
		  resume = my_function.single_image_upload(req.files.resume,'upload');
		}


  var provider_update = await provider.update(
  { 
        name:requestdata.name,
     	email:requestdata.email,
     	phone:requestdata.phone,
     	categoryId:requestdata.category_id,
     	image:image,
     	businessLicence:business_licence,
     	insurance:insurance,
     	resume:resume
   },
    { 
      where: 
      { 
        id: requestdata.id 
      } 
    }
)
 req.flash('msg', 'Provider updated successfully')

 res.redirect('/admin/provider')

	}catch(error){
		throw(error)
	}

},

add_provider:async function (req,res){
	try{

		var requestdata =req.body;
	    const confirm_password = crypto.createHash('sha1').update(requestdata.password).digest('hex');
	    
		var image ='';
		if(req.files && req.files.image){
		  image = my_function.single_image_upload(req.files.image,'upload');
		}

		var business_licence ='';
		if(req.files && req.files.business_licence){
		  business_licence = my_function.single_image_upload(req.files.business_licence,'upload');
		}

		var insurance ='';
		if(req.files && req.files.insurance){
		  insurance = my_function.single_image_upload(req.files.insurance,'upload');
		}

		var resume ='';
		if(req.files && req.files.resume){
		  resume = my_function.single_image_upload(req.files.resume,'upload');
		}


    var provider_insert = await provider.create({
     	name:requestdata.name,
     	email:requestdata.email,
     	password:confirm_password,
     	phone:requestdata.phone,
     	categoryId:requestdata.category_id,
     	image:image,
     	businessLicence:business_licence,
     	insurance:insurance,
     	resume:resume,
     	status:1,
     	isApprove:1
     });

    if(provider_insert){
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    provider: 'test978056@gmail.com',
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
      req.flash('msg', 'Provider Add Successfully.');
       res.redirect('/admin/provider');
   }else{
    req.flash('msg', 'Provider Not Added.')
      res.redirect('/admin/provider');
   }


	}catch(error){
		throw(error);
	}
},

provider_request_delete: async function(req,res){
	try{


 var data = await provider.findOne({
	    	where:{
	    		id:req.body.id
	    	}
	    });
		const dlt = await provider.destroy({
              where: {
                id: req.body.id
              }
            });
 
   

   if(data){

		var transporter = nodemailer.createTransport({
		service: 'gmail',
			auth: {
			user: 'test978056@gmail.com',
			pass: 'cqlsys123'
			}
		});

		var mailOptions = {
			from: 'test978056@gmail.com',
			to: data.dataValues.email,
			subject: 'Account Details',
			html: '<h3>Your Omniserve Account is Rejected was  some issue in Your Account. Please Try Again . </h3>'
		};

		transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
		});

}
res.json(1);

	}catch(error){
		throw(error);
	}
},


view:async function(req,res){
	try{

		var id=req.query.id;

		var final_data = await provider.findOne({
			where:{
				id:id
			},
			include:[{
					model: category,
		            attributes: ['id','name'],
		            required: false
				}],
		});

		  if (final_data) {
                
  res.render('provider_request/view',{msg:req.flash('msg'),response:final_data,title:'request',session:req.session});
}else{
  req.flash('msg','Please login first')
  res.redirect('/login');
}

	}catch(error){

		throw(error);
	}

},


approve:async function(req,res){

	try{

	    var id=req.body.id;

	    var data = await provider.findOne({
	    	where:{
	    		id:id
	    	}
	    });

	// update query ---------------------
	  var provider_update = await provider.update(
	      { 
	        isApprove:1,
	        status:1
	       },
	  { 
	  where: 
	      { 
	      id: id 
	      } 
	    }
	);
if(data){

		var transporter = nodemailer.createTransport({
		service: 'gmail',
			auth: {
			user: 'test978056@gmail.com',
			pass: 'cqlsys123'
			}
		});

		var mailOptions = {
			from: 'test978056@gmail.com',
			to: data.dataValues.email,
			subject: 'Account Details',
			html: '<h3>Your Omniserve Account Approved Successfuly. Please Login </h3>'
		};

		transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
		});

}



	var st =1

	  res.json(st);

		}catch(error){
			throw(error);
		}
	},


update_status:async function(req,res){

	try{

	    var id=req.body.id;

	    var providerss = await provider.findOne({
	      where : {
	       id:id
	     }
	    });
	  
	  /*console.log(providerss.dataValues.status);*/
	 var st ='';
	  if(providerss.dataValues.status==1){
	    st =0;
	  }else{
	     st =1;
	  }
	// update query ---------------------
	  var provider_update = await provider.update(
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
	}

	

}
