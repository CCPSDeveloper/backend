const db = require('../models');
const database = require('../db/db');

const sequelize = require('sequelize');
const Op =sequelize.Op;
const provider = db.provider;
const category = db.category;
const provider_category = db.providerCategory;
const provider_subcategory = db.providerSubCategories;
const providerSubCategories = db.providerSubCategories;

const subCategory = db.subCategory;
const providerCategory = db.providerCategory;

const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');

const my_function = require('../function/fun.js');


provider.belongsTo(category, {
	foreignKey: 'categoryId'
});
provider.hasMany(provider_category, {
	foreignKey: 'providerId'
});
provider_category.belongsTo(category, {
	foreignKey: 'categoryId'
})
provider.hasMany(provider_subcategory, {
	foreignKey: 'providerId'
});

providerCategory.belongsTo(category, {
	foreignKey: 'categoryId'
  });

  providerSubCategories.belongsTo(subCategory, {
	foreignKey: 'subCategoryId'
  });
  



module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				//console.log("innnnnnnnnn");return;
				var providers = await provider.findAll({
					// where: {
					// 	isApprove: 1
					// },

					order: [
						['id', 'desc'],
					]
				});
				if (providers) {
					providers = providers.map(value => {
						return value.toJSON();
					});
				}
				/*console.log(msg,"hello msg");*/
				res.render("provider/index", { msg: req.flash('msg'), response: providers, title: 'provider', session: req.session });
			} catch (error) {
				throw (error);

			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	request: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var providers = await provider.findAll({
					where: {
						isApprove: 0
					},
					include: [{
						model: category,
						attributes: ['id', 'name'],
						required: false
					}],
					order: [
						['id', 'desc'],
					]
				});
				if (providers) {
					providers = providers.map(value => {
						return value.toJSON();
					});
				}
				/*console.log(msg,"hello msg");*/
				res.render("provider/request", { msg: req.flash('msg'), response: providers, title: 'request', session: req.session });
			} catch (error) {
				throw (error);

			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},


	add: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var data = await category.findAll({
						attributes:['id','name','description','image'],

					where: {
						status: 1
					}
				});

				if (data) {
					data = data.map(value => {
						return value.toJSON();
					});
				}

				res.render("provider/add", { msg: req.flash('msg'), title: 'provider', response: data, session: req.session });

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var id = req.query.id;

				provider_data = await provider.findOne({
					where: {
						id: id
					}
				});

				// var data = await category.findAll({
				//             where:{
				//             	status:1
				//             }
				// });

				// if(data){
				// 	 data = data.map(value => {
				//                 return value.toJSON();
				//                });
				// }

				if (provider_data) {
					res.render("provider/edit", { msg: req.flash('msg'), response: provider_data, title: 'provider', session: req.session });
				} else {
					req.flash('msg', 'Provider Not Found.')
					res.redirect('/admin/provider');
				}

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	provider_edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;

				var providers = await provider.findOne({
					where: {
						id: requestdata.id
					}
				});


				var image = providers.dataValues.image;
				if (req.files && req.files.image) {
					image = my_function.single_image_upload(req.files.image, 'upload');
				}

				var business_licence = providers.dataValues.businessLicence;
				if (req.files && req.files.business_licence) {
					business_licence = my_function.single_image_upload(req.files.business_licence, 'upload');
				}

				var insurance = providers.dataValues.insurance;
				if (req.files && req.files.insurance) {
					insurance = my_function.single_image_upload(req.files.insurance, 'upload');
				}

				var resume = providers.dataValues.resume;
				if (req.files && req.files.resume) {
					resume = my_function.single_image_upload(req.files.resume, 'upload');
				}


				var provider_update = await provider.update(
					{
						firstName:requestdata.firstName,
						lastName:requestdata.lastName,
						name: requestdata.firstName + ' ' + requestdata.lastName ,
						email: requestdata.email,
						phone: requestdata.phone,
						// price:requestdata.price,
						// categoryId:requestdata.category_id,
						image: image,
						businessLicence: business_licence,
						insurance: insurance,
						resume: resume
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

			} catch (error) {
				throw (error)
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}

	},

	add_provider: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;
				var check_email = await provider.findOne({
					where:{
						email:requestdata.email
					},
					raw:true
				});
				if(check_email !=null){
					 req.flash('msg', 'Email Already Exist');
					 res.redirect('/admin/provider');
					 return false;
				}
				//console.log(requestdata);
				// return false;

				var categoryIds = requestdata['category_ids[]'];
				//console.log(categoryIds);return false;
				var prices = requestdata['prices[]'];
				const confirm_password = crypto.createHash('sha1').update(requestdata.password).digest('hex');

				var image = '';
				if (req.files && req.files.image) {
					image = my_function.single_image_upload(req.files.image, 'upload');
				}

				var business_licence = '';
				if (req.files && req.files.business_licence) {
					business_licence = my_function.single_image_upload(req.files.business_licence, 'upload');
				}

				var insurance = '';
				if (req.files && req.files.insurance) {
					insurance = my_function.single_image_upload(req.files.insurance, 'upload');
				}

				var resume = '';
				if (req.files && req.files.resume) {
					resume = my_function.single_image_upload(req.files.resume, 'upload');
				}


				var provider_insert = await provider.create({
					firstName:requestdata.firstName,
					lastName:requestdata.lastName,
					name: requestdata.firstName + ' ' + requestdata.lastName ,
					email: requestdata.email,
					password: confirm_password,
					phone: requestdata.phone,
					price: requestdata.price,
					categoryId: requestdata.category_id,
					image: image,
					businessLicence: business_licence,
					insurance: insurance,
					resume: resume,
					status: 1,
					isApprove: 1,
					isRead: 0,
				});

				if (provider_insert) {
					//console.log(provider_insert.toJSON(),"==========================provider_insert");
					provider_insert = provider_insert.toJSON();
					var provider_id = provider_insert.id;

					// let emptyArray = [];
					// for (let i in categoryIds) {
					// 	final = {
					// 		'providerId': provider_id,
					// 		'categoryId': categoryIds[i],
					// 		'price': prices[i]
					// 	}
					// 	//console.log(final,"===========final");
					// 	emptyArray.push(final);
					// }

					// //console.log(emptyArray,"dfvdeddd");
					// provider_categorys = await provider_category.bulkCreate(emptyArray);

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
						html: '<h3> login details</h3><p>email :' + requestdata.email + ' </p><br><p> password:' + req.body.password + '</p>'
					};

					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});
					req.flash('msg', 'Provider Add Successfully.');
					res.redirect('/admin/provider');
				} else {
					req.flash('msg', 'Provider Not Added.')
					res.redirect('/admin/provider');
				}


			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	provider_delete: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				const dlt = await provider.destroy({
					where: {
						id: req.body.id
					}
				});

				res.json(1);

			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},


	view: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var id = req.query.id;

				var final_data = await provider.findOne({
					where: {
						id: id
					},
					include: [{
						model: provider_category,
						attributes: ['id', 'category_id', 'provider_id', 'price'],
						required: false,
						include: [{
							model: category,
							attributes: ['id', 'name'],
							required: false,
						}],
					
					}],
				});
				final_data = final_data.toJSON();
				// console.log(final_data,"================");return false;

                 				 
				if (final_data) {
					for(var i in final_data.providerCategories){
						var subCategory12 = await provider_subcategory.findAll({
							attributes:['id','categoryId','providerId','subCategoryId','price'],
							where:{
								categoryId: final_data.providerCategories[i].category_id,
								providerId:final_data.providerCategories[i].provider_id
							},
							include:[{
								model:subCategory,
								attributes:['id','name'],
								on:{
									col1:sequelize.where(sequelize.col('subCategory.id'), '=' , sequelize.col('providerSubCategories.sub_category_id'))
								},
								required:false
							},]
						});
						if(subCategory12){
							subCategory12 = subCategory12.map(value=>{
								return value.toJSON();
							});
						}
						final_data.providerCategories[i].subCategory =subCategory12;
						
					}
				 console.log(JSON.stringify(final_data),"===============================final_data");

					res.render('provider/view', { msg: req.flash('msg'), response: final_data, title: 'provider', session: req.session });
				} else {
					req.flash('msg', 'Please login first')
					res.redirect('/login');
				}

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	view_profile: async function (req, res) {
			try {
				var get_tag_id = req.query.id;
				if(get_tag_id){
                 var get_data = await provider.findOne({
					 where:{
						 tagId:get_tag_id
					 },raw:true
				 });
				 if(get_data !=null) {
					var get_provider_data = await database.query("SELECT id ,first_name,last_name,name,country_code,tag_id,phone,image,description,address,email,state,city,zip_code, (select round(ifnull(avg(ratings),0),1) from rating where userTo='" + get_data.id + "' and type=1) as average_rating,(select count(id) from rating where userTo='" + get_data.id + "' and type=1) as total_ratings ,(select count(id) from `order` where provider_id=14 and status=4) as totalprovidedservices FROM `provider` where id='" + get_data.id + "' group by  id limit 1", {
						model: provider,
						mapToModel: true,
						type: database.QueryTypes.SELECT
					  });
					  
					  get_provider_data = get_provider_data.map(value => {
						return value.toJSON();
					  });
					  var final={};
					  if(get_provider_data){
						final = get_provider_data[0];
						var get_category = await providerCategory.findAll(
						  {
						  attributes:['id','categoryId','providerId'],
						  where:
							{
							  providerId:get_data.id
							},
						  include:[{
							model:category,
							attributes:['id','name','image'],
							required:false
						  }],
						  raw:true,
						  nest:true
						});
				
						if(get_category){
						  for(var i in get_category){
							  var get_sub_categories_data = await providerSubCategories.findAll({
								attributes:['id','categoryId','providerId','price'],
								where:{
								  categoryId:get_category[i].categoryId,
								  providerId:get_data.id
								},
								include:[{
								  model:subCategory,
								  attributes:['id','name','image'],
								  required:false
								}],
								raw:true,
								nest:true
							  });
							  get_category[i].subCategories=get_sub_categories_data;
						  }
				
						}
			
						final.providerCategories=get_category
				
					  }
					  
					//   console.log(final,"================get_provider_data")
					res.render('get_provider_profile', { msg: req.flash('msg'), response: final, title: 'provider', session: req.session });
					}else{
						res.render("success_page", { msg: "Provider Not Found" });
					}
				}else{
					res.render("success_page", { msg: "Provider Not Found" });
				}
				
			} catch (error) {

				throw (error);
			}
	},


	update_status: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var id = req.body.id;

				var providerss = await provider.findOne({
					where: {
						id: id
					}
				});

				/*console.log(providerss.dataValues.status);*/
				var st = '';
				if (providerss.dataValues.status == 1) {
					st = 0;
				} else {
					st = 1;
				}
				// update query ---------------------
				var provider_update = await provider.update(
					{
						status: st
					},
					{
						where:
						{
							id: id
						}
					}
				);
                  
				res.json(st);

			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	}




}
