const db = require('../models');
const sequelize = require('sequelize');
const withdrawal = db.withdrawal;
const provider = db.provider;
const category = db.category;
const order = db.order;
const user = db.user;
const invoice = db.invoice;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const my_function = require('../function/fun.js');

withdrawal.belongsTo(order, {
	foreignKey: 'orderId'
});
withdrawal.belongsTo(provider, {
	foreignKey: 'providerId'
});
order.belongsTo(category, {
	foreignKey: 'categoryId'
});
invoice.belongsTo(order, {
	foreignKey: 'orderId'
});
order.hasOne(invoice, {
	foreignKey: 'orderId'
});
withdrawal.belongsTo(user, {
	foreignKey: 'userId'
});

module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {
			var _withdrawal = await withdrawal.findAll({
				// where:{
				// 	isPaid:0
				// },
				include: [{
					model: order,
					attributes: ['id', 'date', 'time'],
					required: false,
					include: [{
						model: invoice,
						attributes: ['id', 'amount', 'adminFees'],
						required: false
					}],
					include: [{
						model: category,
						attributes: ['id', 'name'],
						required: false
					}]
				}, {
					model: provider,
					attributes: ['id', 'name', 'phone'],
					required: false,
				},
				{
					model: user,
					attributes: ['id', 'name'],
					required: false,
				}

				],
				order: [
					['id', 'desc'],
				]
			});
			if (_withdrawal) {
				_withdrawal = _withdrawal.map(value => {
					return value.toJSON();
				});
			}
			// console.log(_withdrawal);return;
			/*console.log(msg,"hello msg");*/
			res.render("withdrawal/index", { msg: req.flash('msg'), response: _withdrawal, title: 'withdrawal', session: req.session });
		} catch (error) {
			throw (error);

		}
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
	},




	reject: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {


			var data = await withdrawal.findOne({
				where: {
					id: req.body.id
				}, include: [{
					model: provider,
					attributes: ['id', 'name', 'email'],
					required: false,
				}]
			});

			//  console.log(data,"hiii"); return false ;
			// console.log(data.dataValues.provider.dataValues.email)
			//return false;


			if (data) {



				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'test978056@gmail.com',
						pass: 'cqlsys123'
					}
				});

				var mailOptions = {
					from: 'test978056@gmail.com',
					to: data.dataValues.provider.dataValues.email,
					subject: 'withdrawal Request',
					html: '<h3>Your withdrawal Request is Rejected .</h3><p>Reasion: ' + req.body.reasion + '</p>'
				};

				// console.log(mailOptions);
				// return false;

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

				const dlt = await withdrawal.destroy({
					where: {
						id: req.body.id
					}
				});


				req.flash('msg', 'withdrawal Request  Rejected Successfully.')
				res.redirect('/admin/withdrawal');


			}

		} catch (error) {
			throw (error);
		}
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
	},

	pay_amount: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {
			var data = await withdrawal.findOne({
				where: {
					id: req.body.id
				}, include: [{
					model: provider,
					attributes: ['id', 'name', 'email'],
					required: false,
				}]
			});

			if (data) {
				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'test978056@gmail.com',
						pass: 'cqlsys123'
					}
				});

				var mailOptions = {
					from: 'test978056@gmail.com',
					to: data.dataValues.provider.dataValues.email,
					subject: 'Withdrawal Request',
					html: '<h3>Your withdrawal Request is Successfully submited . please check your account</h3>'
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

				var user_update = await withdrawal.update(
					{
						isPaid: 1,
					},
					{
						where:
						{
							id: req.body.id
						}
					}
				);

				var st = 1;
				res.json(st);

			}
		} catch (error) {
			throw (error);
		}
	}else{
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
					model: category,
					attributes: ['id', 'name'],
					required: false
				}],
			});

			if (final_data) {

				res.render('provider_request/view', { msg: req.flash('msg'), response: final_data, title: 'request', session: req.session });
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


	approve: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {

			var id = req.body.id;

			var data = await provider.findOne({
				where: {
					id: id
				}
			});

			// update query ---------------------
			var provider_update = await provider.update(
				{
					isApprove: 1,
					status: 1
				},
				{
					where:
					{
						id: id
					}
				}
			);
			if (data) {

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

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

			}



			var st = 1

			res.json(st);

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
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
	},
	payment_view: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {
			var _withdrawal = await withdrawal.findAll({
				
				 where:{
			 	id:req.query.id
			 },
				include: [{
					model: order,
					attributes: ['id', 'date', 'time'],
					required: false,
					include: [{
						model: invoice,
						attributes: ['id', 'amount', 'adminFees'],
						required: false
					}],
					include: [{
						model: category,
						attributes: ['id', 'name'],
						required: false
					}]
				}, {
					model: provider,
					attributes: ['id', 'name', 'phone'],
					required: false,
				},
				{
					model: user,
					attributes: ['id', 'name'],
					required: false,
				}

				],
				order: [
					['id', 'desc'],
				]
			});
			if (_withdrawal) {
				_withdrawal = _withdrawal.map(value => {
					return value.toJSON();
				});
			}
			res.render('withdrawal/view', { msg: req.flash('msg'), response: _withdrawal, title: 'request', session: req.session });


		} catch (errr) {
			throw errr
		}
	}else{
		req.flash('msg', 'Please login first')
		res.redirect('/login');
	}
	}
}
