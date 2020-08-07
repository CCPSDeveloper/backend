const db = require('../models');
const sequelize = require('sequelize');
const tips = db.tip;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
var path = require('path');
var uuid = require('uuid');

module.exports = {
    tips: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            const get_tip = await tips.findAll({
                attributes: ['id', 'price', 'createdAt'],
                order: [
                    ['id', 'desc']
                ]
            });
            res.render("tip/index", { msg: req.flash('msg'), response: get_tip, title: 'tips', session: req.session });

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    add_tip: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            res.render("tip/add", { msg: req.flash('msg'), title: 'tips', session: req.session });

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    tip_add: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {

            create_tip = await tips.create({
                price: req.body.price

            });
            req.flash('msg', 'Tip Added Successfully.');

            res.redirect('/admin/tip');


        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    tip_edit: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {

            const edit_tip = await tips.findOne({

                attributes: ['id', 'price', 'createdAt'],

                where:{
                    id:req.query.id
                }

            });
            // console.log(edit_tip);return;

            res.render("tip/edit", { msg: req.flash('msg'), response: edit_tip, title: 'tips', session: req.session });
        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
        res.redirect('/login');
    }
    },
    edit_tip: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            var tips_update = await tips.update(
                {
                    price: req.body.price
                },
                {
                    where:
                    {
                        id: req.body.id
                    }
                }
            );
            res.redirect('/admin/tip');

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
        res.redirect('/login');
    }
    },
    delete_tip:async function(req,res){
        if (req.session && req.session.auth == true) {
        try{

            delete_data= await tips.destroy({
                where:{
                    id:req.body.id
                }
            });
            res.json(1);

        }catch(errr){
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
        res.redirect('/login');
    }
    }
}