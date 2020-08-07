const db = require('../models');
const sequelize = require('sequelize');
const subcategory = db.subCategory;
const category = db.category;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
subcategory.belongsTo(category, {foreignKey: 'categoryId'})

module.exports = {
	index: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var subcategorys = await subcategory.findAll({
				  attributes:['id','name','categoryId','image','description',[sequelize.literal('(SELECT name FROM category WHERE id = subCategory.category_id)'), 'categoryname']],
					order: [
						['id', 'desc'],
					]
				});
				if (subcategorys) {
					subcategorys = subcategorys.map(value => {
						return value.toJSON();
					});
				}
				/*console.log(msg,"hello msg");*/
				res.render("subcategory/index", { msg: req.flash('msg'), response: subcategorys, title: 'subategory', session: req.session });
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
				let get_scat = await category.findAll({
    			  attributes:['id','name','description','image']			
				});

				res.render("subcategory/add", { msg: req.flash('msg'),response:get_scat, title: 'subategory', session: req.session });

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},
	add_subcategory: async function (req, res) {
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
				var subcategory_insert = await subcategory.create({
					name: requestdata.name,
					description: requestdata.description,
					categoryId: requestdata.txtid,
					image: imageName,

				});

				if (subcategory_insert) {
					req.flash('msg', 'SubCategory Add Successfully.');
					res.redirect('/admin/subcategory');
				} else {
					req.flash('msg', 'Subcategory Not Added.')
					res.redirect('/admin/subcategory');
				}


			} catch (error) {
				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},
	subcategory_delete: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				const dlte = await subcategory.destroy({
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
	edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {
				var id = req.query.id;

				subcategory_data = await subcategory.findOne({
					attributes:['id','name','image','description','categoryId',[sequelize.literal('(SELECT name FROM category WHERE id = subCategory.category_id)'), 'categoryname']],
					include:[{
						model:category,
						required:false,
						attributes:['id','name']
					 }],
					where: {
						id: id
					}
				});
				let allsubcat=await category.findAll({
					attributes:['id','name'],


				});

				if (subcategory_data) {
					res.render("subcategory/edit", { msg: req.flash('msg'), response: subcategory_data,allsubcat, title: 'subategory', session: req.session });
				} else {
					req.flash('msg', 'category Not Found.')
					res.redirect('/admin/subcategory');
				}

			} catch (error) {

				throw (error);
			}
		} else {
			req.flash('msg', 'Please login first')
			res.redirect('/login');
		}
	},
	subcategory_edit: async function (req, res) {
		if (req.session && req.session.auth == true) {
			try {

				var requestdata = req.body;
				var categorys = await subcategory.findOne({
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
				var subcategory_update = await subcategory.update(
					{
						name: requestdata.name,
						description: requestdata.description,
						categoryId: requestdata.txtid,
						image: imageName

					},
					{
						where:
						{
							id: requestdata.id
						}
					}
				)
				req.flash('msg', 'SubCategory updated successfully')

				res.redirect('/admin/subcategory')

			} catch (error) {
				throw (error)
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

				var final_data = await subcategory.findOne({
					attributes:['id','name','image','description','categoryId',[sequelize.literal('(SELECT name FROM category WHERE id = subCategory.category_id)'), 'categoryname']],
					where: {
						id: id
					}
				});

				if (final_data) {

					res.render('subcategory/view', { msg: req.flash('msg'), response: final_data, title: 'subategory', session: req.session });
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