const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const order = db.order;
const provider = db.provider;
const invoice = db.invoice;
const user = db.user;
const category = db.category;
const subCategory = db.subCategory
const orderImages = db.orderImages

const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const orderCategory =db.orderCategory;
const orderSubcategory =db.orderSubcategory;
order.belongsTo(provider, {
	foreignKey: 'providerId'
});
order.belongsTo(user, {
	foreignKey: 'userId'
});


provider.belongsTo(category, {
	foreignKey: 'categoryId'
});
order.hasMany(orderCategory, {
	foreignKey: 'orderId'
 });
 
orderCategory.belongsTo(category, {
	foreignKey: 'categoryId'
  });

orderSubcategory.belongsTo(subCategory, {
	foreignKey: 'subcategoryId'
  });

module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var orders = await order.findAll({
					attributes:['id','providerId','userId','description','location','date','status','jobType','type'],
					where: {
						[Op.and]: [
							{
								status:
								{
									[Op.ne]: 4
								}
							}

						]
					},
					include: [{
						model: provider,
						attributes: ['id', 'name', 'email', 'phone', 'image', 'price'],
						required: false,

					},
					{
						model: user,
						attributes: ['id','name', 'email', 'image', 'location'],
						required: false
					},
				
					],
					order: [
						['id', 'desc'],
					]
				});
				if (orders) {
					orders = orders.map(value => {
						return value.toJSON();
					});
				}

				console.log(orders, "hello msg");
				res.render("order/index", { msg: req.flash('msg'), response: orders, title: 'order', session: req.session });
			} catch (error) {
				throw (error);

			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},


	complete_order: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var orders = await order.findAll({
					attributes:['id','providerId','userId','description','location','date','status','jobType','type'],
					where: {
						status: 4
					},
					include: [{
						model: provider,
						attributes: ['id', 'name','firstName','lastName', 'email', 'phone', 'image','price'],
						required: false,

					},
					
					{
						model: user,
						attributes: ['id', 'name','firstName','lastName', 'email', 'image', 'location'],
						required: false
					}
					],
					order: [
						['id', 'desc'],
					]
				});
				if (orders) {
					orders = orders.map(value => {
						return value.toJSON();
					});
				}

				//console.log(orders,"hello msg");return;
				res.render("order/complete_order", { msg: req.flash('msg'), response: orders, title: 'complete-order', session: req.session });
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

				res.render("order/add", { msg: req.flash('msg'), title: 'order' });

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

				order_data = await order.findOne({
					where: {
						id: id
					}
				});

				if (order_data) {
					res.render("order/edit", { msg: req.flash('msg'), response: order_data, title: 'order', session: req.session });
				} else {
					req.flash('msg', 'order Not Found.')
					res.redirect('/admin/orders');
				}

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	order_edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;
				var orders = await order.findOne({
					where: {
						id: requestdata.id
					}
				});

				let imageName = '';
				if (req.files && req.files.image) {
					//alert('hii');
					let image = req.files.image;
					image.mv(process.cwd() + '/public/upload/' + image.name, function (err) {
						if (err)
							return res.status(500).send(err);
					});
					imageName = req.files.image.name;
				} else {
					imageName = orders.dataValues.image;
				}
				var order_update = await order.update(
					{
						name: requestdata.name,
						email: requestdata.email,
						image: imageName,
						location: requestdata.location,
						latitude: requestdata.latitude,
						longitude: requestdata.longitude
					},
					{
						where:
						{
							id: requestdata.id
						}
					}
				)
				req.flash('msg', 'order updated successfully')

				res.redirect('/admin/orders')

			} catch (error) {
				throw (error)
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}

	},

	add_order: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;
				const confirm_password = crypto.createHash('sha1').update(requestdata.password).digest('hex');
				let imageName = '';
				if (req.files && req.files.image) {
					let image = req.files.image;
					image.mv(process.cwd() + '/public/upload/' + image.name, function (err) {
						if (err)
							return res.status(500).send(err);
					});
				}
				imageName = req.files.image.name;
				var order_insert = await order.create({
					name: requestdata.name,
					email: requestdata.email,
					password: confirm_password,
					image: imageName,
					status: 1,
					socialType: 0,
					location: requestdata.location,
					latitude: requestdata.latitude,
					longitude: requestdata.longitude
				});

				if (order_insert) {
					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
							order: 'test978056@gmail.com',
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
					req.flash('msg', 'order Add Successfully.');
					res.redirect('/admin/orders');
				} else {
					req.flash('msg', 'order Not Added.')
					res.redirect('/admin/orders');
				}


			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	order_delete: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				const dlt = await order.destroy({
					where: {
						id: req.body.id
					}
				});

				delete_invoice= await invoice.destroy({
					where:{
						orderId: req.body.id
					}
				})

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
		// if (req.session && req.session.auth == true) {
			try {

				var id = req.query.id;

				var final_data = await order.findOne({
					attributes:['id','providerId','userId','description','location','date','status','jobType','type'],

					where: {
						id: id
					}, include: [{
						model: provider,
						attributes: ['id', 'name','firstName','lastName', 'email', 'phone', 'image'],
						required: false,
					},
					{
						model: user,
						attributes: ['id', 'name','firstName','lastName', 'email', 'image', 'location'],
						required: false
					},{
						model: orderCategory,
						attributes:['id','categoryId'],
						required: false,
						include:[{
						  model:category,
						  attributes:['id','name','image'],
						  required:false
						}]
					  },
					  {
						model: orderImages,
						required: false
					  },
					]
				});


				if (final_data) { 
					final_data = final_data.toJSON();
					for( var i in final_data.orderCategories){
						var get_subcategory = await orderSubcategory.findAll({
						  attributes:['id','categoryId','orderId'],
						  where:{
							categoryId:final_data.orderCategories[i].categoryId,
							orderId:final_data.id
						  },
						  include:[{
							model:subCategory,
							attributes:['id','name','image'],
							required:false
						  }],
						 
						});
			  
						final_data.orderCategories[i].subCategory = get_subcategory;
			  
					  }

					   console.log(JSON.stringify(final_data),"=================final_data");


					res.render('order/view', { msg: req.flash('msg'), response: final_data, title: 'order', session: req.session });
				} else {
					req.flash('msg', 'Please login first')
					res.redirect('/login');
				}

			} catch (error) {

				throw (error);
			}
		// } else {
		// 	req.flash('msg', 'Please login first')
		// 	res.redirect('/login');
		// }

	},



	complete_order_view: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {

			var id = req.query.id;

			var final_data = await order.findOne({
				attributes:['id','providerId','userId','description','location','date','status','jobType','type'],
				where: {
					id: id
				}, include: [{
					model: provider,
					attributes: ['id', 'name','firstName','lastName', 'email', 'phone', 'image', 'tip','price'],
					required: false,

				},
				{
					model: user,
					attributes: ['id', 'name','firstName','lastName', 'email', 'image', 'location'],
					required: false
				},
				{
					model: orderCategory,
					attributes:['id','categoryId'],
					required: false,
					include:[{
					  model:category,
					  attributes:['id','name','image'],
					  required:false
					}]
				  },
				  {
					model: orderImages,
					required: false
				  },
				]
			});

			// console.log(final_data.toJSON());

			if (final_data) {
				final_data = final_data.toJSON();
				for( var i in final_data.orderCategories){
					var get_subcategory = await orderSubcategory.findAll({
					  attributes:['id','categoryId','orderId'],
					  where:{
						categoryId:final_data.orderCategories[i].categoryId,
						orderId:final_data.id
					  },
					  include:[{
						model:subCategory,
						attributes:['id','name','image'],
						required:false
					  }],
					 
					});
		  
					final_data.orderCategories[i].subCategory = get_subcategory;
		  
				  }

				res.render('order/complete_order_view', { msg: req.flash('msg'), response: final_data, title: 'complete-order', session: req.session });
			} else {
				req.flash('msg', 'Please login first')
				res.redirect('/login');
			}

		} catch (error) {

			throw (error);
		}
	}else{
		req.flash('msg', 'Please login first')
			res.redirect('/login');
	}

	},


	update_status: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {

			var id = req.body.id;

			var orderss = await order.findOne({
				where: {
					id: id
				}
			});

			/*console.log(orderss.dataValues.status);*/
			var st = '';
			if (orderss.dataValues.status == 1) {
				st = 0;
			} else {
				st = 1;
			}
			// update query ---------------------
			var order_update = await order.update(
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
	}else{
		req.flash('msg', 'Please login first')
			res.redirect('/login');
	}
	}
}
