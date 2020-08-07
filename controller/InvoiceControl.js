const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const invoice = db.invoice;
const order = db.order;
const provider = db.provider;
const user = db.user;
const cards = db.user_cards;
const category = db.category;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
invoice.belongsTo(provider, {
	foreignKey: 'providerId'
});

invoice.belongsTo(order, {
	foreignKey: 'orderId'
});
invoice.belongsTo(user, {
	foreignKey: 'userId'
});

order.belongsTo(category, {
	foreignKey: 'categoryId'
});
provider.belongsTo(category, {
	foreignKey: 'categoryId'
});
module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var data = await invoice.findAll({
					include: [{
						model: provider,
						attributes: ['id', 'name','firstName','lastName', 'email', 'phone', 'image', 'price'],
						required: false,

					},
					{
						model: user,
						attributes: ['id', 'name','firstName','lastName', 'email', 'image', 'location'],
						required: false
					},
					{
						model: order,
						attributes: ['id','description', 'date', 'time', 'status'],
						required: false,
						
					}

					],
					order: [
						['id', 'desc'],
					]
				});
				if (data) {
					data = data.map(value => {
						return value.toJSON();
					});
				}

			//	console.log(data,"hello msg");return;
				res.render("invoice/index", { msg: req.flash('msg'), response: data, title: 'invoice', session: req.session });
			} catch (error) {
				throw (error);

			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},




	invoice_delete: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				const dlt = await invoice.destroy({
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

				var final_data = await invoice.findOne({
					where: {
						id: id
					}, include: [{
						model: provider,
						attributes: ['id', 'name','firstName','lastName', 'email', 'phone', 'image', 'price'],
						required: false,
						
					},
					{
						model: user,
						attributes: ['id', 'name','firstName','lastName', 'email', 'image', 'location'],
						required: false
					},
					{
						model: order,
						attributes: ['id','description', 'date','location', 'time', 'status'],
						required: false
					}

					],
				});

				//console.log(final_data);

				if (final_data) {

					res.render('invoice/view', { msg: req.flash('msg'), response: final_data, title: 'invoice', session: req.session });
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



}
