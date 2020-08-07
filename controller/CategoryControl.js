const db = require('../models');
const sequelize = require('sequelize');
const category = db.category;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var categorys = await category.findAll({
                  attributes:['id','name','image','description','image','status'],
					order: [
						['id', 'desc'],
					]
				});
				if (categorys) {
					categorys = categorys.map(value => {
						return value.toJSON();
					});
				}
				/*console.log(msg,"hello msg");*/
				res.render("category/index", { msg: req.flash('msg'), response: categorys, title: 'category', session: req.session });
			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	list: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var categorys = await category.findAll({
					attributes: ['id', 'name'],
					order: [
						['id', 'desc'],
					]

				});
				if (categorys) {
					categorys = categorys.map(value => {
						return value.toJSON();
					});
				}
				res.json(categorys);
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

				res.render("category/add", { msg: req.flash('msg'), title: 'category', session: req.session });

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

				category_data = await category.findOne({
					attributes:['id','name','image','description','type','image'],
					where: {
						id: id
					}
				});

				if (category_data) {
					res.render("category/edit", { msg: req.flash('msg'), response: category_data, title: 'category', session: req.session });
				} else {
					req.flash('msg', 'category Not Found.')
					res.redirect('/admin/category');
				}

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	category_edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;
				var categorys = await category.findOne({
					attributes:['id','name','image','description','image'],
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
					imageName = categorys.dataValues.image;
				}
				var category_update = await category.update(
					{
						name: requestdata.name,
						description: requestdata.description,
						image: imageName,
						type:requestdata.type

					},
					{
						where:
						{
							id: requestdata.id
						}
					}
				)
				req.flash('msg', 'Category updated successfully')

				res.redirect('/admin/category')

			} catch (error) {
				throw (error)
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}

	},

	add_category: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;

				let imageName = '';
				if (req.files && req.files.image) {
					let image = req.files.image;
					image.mv(process.cwd() + '/public/upload/' + image.name, function (err) {
						if (err)
							return res.status(500).send(err);
					});
				}
				imageName = req.files.image.name;
				var category_insert = await category.create({
					name: requestdata.name,
					description: requestdata.description,
					image: imageName,
					status: 1,
					type:requestdata.type

				});

				if (category_insert) {
					req.flash('msg', 'Category Add Successfully.');
					res.redirect('/admin/category');
				} else {
					req.flash('msg', 'category Not Added.')
					res.redirect('/admin/category');
				}


			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},

	category_delete: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				const dlt = await category.destroy({
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

				var final_data = await category.findOne({
					attributes:['id','name','image','description','type','status'],
					where: {
						id: id
					}
				});

				if (final_data) {

					res.render('category/view', { msg: req.flash('msg'), response: final_data, title: 'category', session: req.session });
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


	update_status: async function (req, res) {
		if (req.session && req.session.auth == true) {
		try {

			var id = req.body.id;

			var categoryss = await category.findOne({
				attributes:['id','name','image','description','image','status'],
				where: {
					id: id
				}
			});

		//console.log(categoryss.dataValues.status);return;
			var st = '';
			if (categoryss.dataValues.status == 1) {
				st = 0;
			} else {
				st = 1;
			}
			// update query ---------------------
			var category_update = await category.update(
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
			//console.log(st,"st")
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
