const db = require('../models');
const sequelize = require('sequelize');
//var datetime = require('node-datetime');
var moment = require('moment');
const user = db.content
var crypto = require('crypto');
/*var flash = require('express-flash');*/
const flash = require('connect-flash');
const nodemailer = require('nodemailer');


//   =================  end ===================
module.exports = {



  edit: async function (req, res) {
    if (req.session && req.session.auth == true) {
      var users = await user.findOne({
        where: {
          id: 1
        },

        order: [
          ['id', 'desc'],
        ]
      });


      if (users) {
        res.render('content/index', { msg: req.flash('msg'), response: users, title: 'content', session: req.session });
      } else {
        req.flash('msg', 'Please login first')
        res.redirect('/login');
      }

    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');

    }
  },

  user_edit: async function (req, res) {
    //console.log(req.body);return false;
    if (req.session && req.session.auth == true) {
      var requestdata = req.body;
      var users = await user.findOne({
        where: {
          id: 1
        }
      });
      var user_update = await user.update(
        {
          privacy: requestdata.privacy,
          term: requestdata.term

        },
        {
          where:
          {
            id: 1
          }
        }
      )
      req.flash('msg', 'Content updated successfully')
      res.redirect('/admin/content')

    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
  }

}
