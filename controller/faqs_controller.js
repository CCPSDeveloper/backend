const db = require('../models');
const sequelize = require('sequelize');
const faqs = db.faqs;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
var path = require('path');
var uuid = require('uuid');

module.exports = {
    faqs: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            const get_faq = await faqs.findAll({
                attributes: ['id', 'question','answer', 'createdAt'],
                order: [
                    ['id', 'desc']
                ]
            });
            res.render("faq/index", { msg: req.flash('msg'), response: get_faq, title: 'faqs', session: req.session });

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    add_faq: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            res.render("faq/add", { msg: req.flash('msg'), title: 'faqs', session: req.session });

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    faq_add: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {

            create_faq = await faqs.create(req.body);
            req.flash('msg', 'Faq Added Successfully.');

            res.redirect('/admin/faqs');


        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
			res.redirect('/login');
    }
    },
    faq_edit: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {

            const edit_faq = await faqs.findOne({

                attributes: ['id', 'question','answer', 'createdAt'],

                where:{
                    id:req.query.id
                }

            });
            // console.log(edit_faq);return;

            res.render("faq/edit", { msg: req.flash('msg'), response: edit_faq, title: 'faqs', session: req.session });
        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
        res.redirect('/login');
    }
    },
    edit_faq: async function (req, res) {
        if (req.session && req.session.auth == true) {
        try {
            var faqs_update = await faqs.update(
                req.body,
                {
                    where:
                    {
                        id: req.body.id
                    }
                }
            );

            req.flash('msg', 'Faq Edit Successfully.');

            res.redirect('/admin/faqs');

        } catch (errr) {
            throw errr
        }
    }else{
        req.flash('msg', 'Please login first')
        res.redirect('/login');
    }
    },
    delete_faq:async function(req,res){
        if (req.session && req.session.auth == true) {
        try{

            delete_data= await faqs.destroy({
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