const db = require('../models');
const sequelize = require('sequelize');
const admins = db.admin
const user = db.user
const provider = db.provider
const category = db.category
const subcategory = db.subCategory
const order = db.order
const contant = require('../constant');
const withdrawal = db.withdrawal;
const invoice = db.invoice
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

var crypto = require('crypto');
/*var flash = require('express-flash');*/
const flash = require('connect-flash');

module.exports = {
  login: function (req, res) {
    res.render('login', { msg: req.flash('msg') });
  },

  admin_login: async function (req, res) {

    const confirm_password = crypto.createHash('sha1').update(req.body.password).digest('hex');
    const users = await admins.findOne({
      where: {
        email: req.body.email,
        password: confirm_password
      }
    });
    if (users) {
      res.session = req.session;
      req.session.email = users.dataValues.email;
      req.session.name = users.dataValues.name;
      req.session.image = users.dataValues.image;
      req.session.logo = users.dataValues.logo;
      req.session.id = users.dataValues.id;
      /* console.log(req.session.admin_id,"hshuysg");*/
      res.session.auth = true;
				/*console.log(res.session.auth,"hgva");
				*/ req.flash('msg', 'Login Successfully.')
      res.redirect('/admin/dashboard');
    } else {
      req.flash('msg', 'Invalid login details.')
      res.redirect('/login')
    }

  },


  index: async function (req, res) {
    if (req.session && req.session.auth == true) {

      var admin = await admins.findAll({
        order: [
          ['id', 'desc'],
        ]
      });
      if (admin) {
        admin = admin.map(value => {
          return value.toJSON();
        });
      }

      res.render('admin/index',
        {
          msg: req.flash('msg'),
          response: admin,
          title: 'dashboard',
          session: req.session
        });
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
  },


  admin_dashboard: async function (req, res) {

    if (req.session && req.session.auth == true) {

      var user_count = await user.count();
      var provider_count = await provider.count({
        // where: {
        //   //isApprove: 1
        // }
      });
      var category_count = await category.count();
      var order_count = await order.count();

      var provider_Rcount = await withdrawal.count({

      });
      get_subcatcpunt= await subcategory.count({

      })
      var pending_Ocount = await order.count({
        where: {
          status: 0
        }
      });

      var accept_Ocount = await order.count({
        where: {
          status: 1
        }
      });

      var progress_Ocount = await order.count({
        where: {
          status: 3
        }
      });

      var complete_Ocount = await order.count({
        where: {
          status: 4
        }
      });
      var total_count_Ocount = await invoice.count({
      
      });

      var total_invoice_Ocount = await invoice.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
      });

      var total_admin_Ocount = await invoice.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('admin_fees')), 'total']],
      });

      if (total_admin_Ocount) {
        total_admin_Ocount = total_admin_Ocount.map(value => {
          return value.toJSON();
        });
      }

      if (total_invoice_Ocount) {
        total_invoice_Ocount = total_invoice_Ocount.map(value => {
          return value.toJSON();
        });
      }

      var admin_fees = total_admin_Ocount[0].total;
      var total_amount = total_invoice_Ocount[0].total;


      var final_data = {}
      final_data = {
        'user': user_count,
        'provider': provider_count,
        'category': category_count,
        'request': provider_Rcount,
        'order': order_count,
        'pending_order': pending_Ocount,
        'accept_count': accept_Ocount,
        'processing_count': progress_Ocount,
        'complete_count': complete_Ocount,
        'total_amount': total_amount,
        'admin_fees': admin_fees,
        'get_subcatcpunt':get_subcatcpunt,
        'total_count_Ocount':total_count_Ocount
      }
     // total_count_Ocount

      // console.log(final_data.total_amount);
      res.render('dashboard/index', { msg: req.flash('msg'), response: final_data, title: 'dashboard', session: req.session })
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }

  },



  get_count: async function (req, res) {
    if (req.session && req.session.auth == true) {
      var user_count = await user.count();
      var provider_count = await provider.count({
        where: {
         // isApprove: 1
        }
      });
      var category_count = await category.count();
      var order_count = await order.count();

      var provider_Rcount = await provider.count({
        where: {
         // isApprove: 0
        }
      });

      var pending_Ocount = await order.count({
        where: {
          status: 0
        }
      });

      var accept_Ocount = await order.count({
        where: {
          status: 1
        }
      });

      var progress_Ocount = await order.count({
        where: {
          status: 3
        }
      });

      var complete_Ocount = await order.count({
        where: {
          status: 4
        }
      });

      var total_invoice_Ocount = await invoice.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
      });

      var total_admin_Ocount = await invoice.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('admin_fees')), 'total']],
      });



      var final_data = {}
      final_data = {
        'user': user_count,
        'provider': provider_count,
        'category': category_count,
        'request': provider_Rcount,
        'order': order_count,
        'pending_order': pending_Ocount,
        'accept_count': accept_Ocount,
        'processing_count': progress_Ocount,
        'complete_count': complete_Ocount,
        'total_amount': total_invoice_Ocount,
        'admin_fees': total_admin_Ocount
      }

      res.json(final_data);
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');

    }
  },

  count_request: async function (req, res) {
    if (req.session && req.session.auth == true) {
      try {
        var ck = await provider.count({
          where: {
            isApprove: 0,
            isRead: 0
          }
        });

        var dk = await provider.findAll({
          where: {
            isApprove: 0
          }
        });

        var _final = {
          'count': ck,
          '_data': dk
        }



        res.json(_final);


      } catch (error) {
        throw (error);
      }
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
  },



  clear_badge: async function (req, res) {
    if (req.session && req.session.auth == true) {
      try {
        var ck = await provider.update({
          isRead: 1,
        }, {
            where: {
              isApprove: 0
            }
          }
        );

        var _final = 0;

        res.json(_final);


      } catch (error) {
        throw (error);
      }
    } else {
      req.flash('msg', 'Please login first')
      res.redirect('/login');
    }
  },

  logout: async function (req, res) {

    if (req.session && req.session.auth == true) {
		    /*console.log("yhasduydg");
		*/    req.session.id = "";
      req.session.email = "";
      req.session.auth = false;

      req.flash('msg', 'Logout Successfully.')
      res.redirect('/login');

    } else {
      res.redirect('/login');
    }

  },

  edit: async function (req, res) {
    try {
      if (req.session && req.session.auth == true) {
        //console.log(req.body);return false;
        const users = await admins.findOne({
          where: {
            id: req.query.id
          }
        });

        // console.log(users);
        res.render('admin/edit', { msg: req.flash('msg'), response: users, title: 'dashboard', session: req.session })
      } else {
        req.flash('msg', 'Please login first')
        res.redirect('/login');
      }
    } catch (error) {
      throw (error);
    }


  },

  edit_profile: async function (req, res) {
    if (req.session && req.session.auth == true) {
      let requestdata = req.body;
      //console.log(requestdata);return false;
      const users = await admins.findOne({
        where: {
          id: requestdata.id
        }
      });
      // edit query

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

        imageName = users.dataValues.image;
      }

      let imagelogo = '';
      if (req.files && req.files.logo) {
        //alert('hii');
        let image = req.files.logo;
        image.mv(process.cwd() + '/public/upload/' + image.name, function (err) {
          if (err)
            return res.status(500).send(err);
        });
        imagelogo = req.files.logo.name;
      } else {

        imagelogo = users.dataValues.logo;
      }


      req.session.image = imageName;
      req.session.logo = imagelogo;
      req.session.name = requestdata.name;

      var user_update = await admins.update(
        {
          name: requestdata.name,
          email: requestdata.email,
          image: imageName,
          logo: imagelogo

        },
        {
          where:
          {
            id: requestdata.id
          }
        }
      );
      req.flash('msg', 'Admin updated successfully')
      res.redirect('/admin/profile')

    } else {
      req.flash('msg', 'Please login first');
      res.redirect('/login');
    }
  },
  get_dashboard_count: async function (req, res) {

    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth() + 1;
    var Sequelize = new sequelize(config.database, config.username, config.password, config);

    var machineData = [];

    var userData = [];

    var Totalmonth = 12

    for (i = 1; i <= Totalmonth; i++) {
      if (i < 10) {
        var day = "0" + i;
      }
      else {
        day = i;
      }

      var fromDate = getYear + "-" + day + "-01";

      var endDate = getYear + "-" + day + "-30";


      var machinequery = "select COUNT(*) as total from user where created_at between '" + fromDate + "' and '" + endDate + "' and status=1 ";


      var userquery = "select COUNT(*) as total from provider where created_at between '" + fromDate + "' and '" + endDate + "' and status=1 ";


      var [getMachineCount] = await Sequelize.query(machinequery);

      var [getUserCount] = await Sequelize.query(userquery);

      machineData.push(getMachineCount[0].total);

      userData.push(getUserCount[0].total);


    }
    var responseData = { machineData: machineData, userData: userData };
    // console.log(responseData, "===============responseData1");
    res.json(responseData);
  },
  forgot_password: async function (req, res) {
    try {

      res.render('forgot_password', { msg: req.flash('msg') })
    } catch (errr) {
      throw errr
    }
  },
  admin_password_change: async function (req, res) {
    try {

      let data = await admins.findOne({
        where: {

          email: req.body.email,

        }

      });

      if (data) {
        var otp = crypto.randomBytes(20).toString('hex');
        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'test978056@gmail.com',
            pass: 'cqlsys123'
          }
        });

        var mailOptions = {
          from: 'test978056@gmail.com',
          to: req.body.email,
          subject: 'Vale You Forgot password',
          text: 'Click here for change password <a href="' +
            contant.url_path +
            "/api/url_id/" +
            otp +
            '"> Click</a>'
        };
        console.log(mailOptions,"mailOptions")

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info);
            console.log('Email sent: ' + info.messageId);
          }
        });
        const save = await admins.update({
          forgot_password: otp,
        },
          {
            where: {

              email: req.body.email
            }
          }
        );
        req.flash('msg', 'Email Sent successfully');
        res.redirect('/forgot_password');

      } else {
        req.flash('msg', 'Email does not exist');
        res.redirect('/forgot_password');
      }

    } catch (errr) {
      throw errr
    }
  },
  url_id: async function (req, res) {
    try {
      var admin_data = await admins.findOne({
        where: {

          forgot_password: req.params.id,

        }
      });
         //  console.log(admin_data,"admin_data");return;
      if (admin_data) {

        res.render("reset_password", {
          title: "Vale You",
          response: admin_data.dataValues.forgot_password,
          flash: "",
          hash: req.params.id
        });
      } else {
        res.status(403).send("Link has been expired!");
      }

    } catch (errr) {
      throw errr
    }
  },
  reset_password: async function (req, res) {
    try {
      const hashm = crypto.createHash('sha1').update(req.body.confirm_password).digest('hex');
      const save = await admins.update({
        password: hashm,
      },
        {
          where: {

            forgot_password: req.body.hash
          }
        }
      );
      if (save) {
        req.flash('msg', 'Password Changed successfully');
        res.redirect('/login');

      } else {

        res.render("success_page", { msg: "Invalid user" });

      }

    } catch (errr) {
      throw errr
    }
  },
  change_password: async function (req, res) {
    try {

      res.render('change_password', { msg: req.flash('msg'), title: 'dashboard', session: req.session })
    } catch (errr) {
      throw errr
    }
  },
  password_change: async function (req, res) {
    try {
      if (req.session && req.session.auth == true) {
        var admin = await admins.findAll({
          where: {

            id: 1
          },
        });
        if (admin) {
          admin = admin.map(value => {
            return value.toJSON();
          });
        }

        const admin_password = crypto.createHash('sha1').update(req.body.oldpassword).digest('hex');

        if (admin[0].password == admin_password) {

          var update_password = crypto.createHash('sha1').update(req.body.confirmpassword).digest('hex');
          console.log(update_password, "sfduisdio");
          let save = await admins.update({

            password: update_password
          },
            {
              where: {
                id: 1
              }
            })
          console.log(save);
          req.flash('msg', 'Password updated successfully');
          res.redirect('/change_password')

        } else {
          req.flash('msg', 'Current password does not matched');
          res.redirect('/change_password')
        } profile_update
      } else {
        req.flash('msg', 'Please login first');
        res.redirect('/login')
      }

    } catch (errr) {
      throw errr
    }
  }
}