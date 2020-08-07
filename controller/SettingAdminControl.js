const db = require('../models');
const sequelize = require('sequelize');
//var datetime = require('node-datetime');
var moment = require('moment');
const user = db.setting
var crypto = require('crypto');
/*var flash = require('express-flash');*/
const flash = require('connect-flash');
const nodemailer = require('nodemailer');

//   =================  end ===================
module.exports = {

  index: async function (req, res) {
    if (req.session && req.session.auth == true) {
      var users = await user.findOne({
        where: {
          id: 1
        },

        order: [
          ['id', 'desc'],
        ]
      });

      console.log(users);
      // return false;

      if (users) {
        res.render('setting/index', { msg: req.flash('msg'), response: users, title: 'setting', session: req.session });
      } else {
        req.flash('msg', 'Please login first')
        res.redirect('/login');
      }

      // }else{
      //   req.flash('msg','Please login first')
      //   res.redirect('/login');

      // }
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
          comission: requestdata.comission,
          tax: requestdata.tax,
          paypalEmail: requestdata.paypal_email,
          password: requestdata.password,
          accountNumber: requestdata.account_number,
          bankName: requestdata.bank_name,
          searchDistance: requestdata.search_distance

        },
        {
          where:
          {
            id: 1
          }
        }
      )
      req.flash('msg', 'Setting updated successfully')
      res.redirect('/admin/setup')
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
  },

}
