const db = require('../models');
const my_function = require('../function/fun.js');
const socket_function = require('../function/socket_function.js'); 
// console.log(my_function);
const sequelize = require('sequelize');
const tips = db.tip;
const crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const helper = require('../config/helper');
const jsonData = require('../config/jsonData');
const database = require('../db/db');
const contant = require('../constant');
var path = require('path');
var uuid = require('uuid');

module.exports = {

  provider_signup: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        // country_code: req.body.country_code,
       // phone: req.body.phone,
        // category_id: req.body.category_id,
        // sub_category_id: req.body.sub_category_id,
       
        // state: req.body.state,
        // city: req.body.city,
        // selected_data:req.body.selected_data,
        // price: req.body.price,
        //social_security_no: req.body.social_security_no
      };
      const non_required = {
        address: req.body.address,
        selected_data:req.body.selected_data,
        social_security_no: req.body.social_security_no,
        phone: req.body.phone,


        password: req.body.password,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        description: req.body.description,
        social_id: req.body.social_id,
        social_type:req.body.social_type,
        paypal_id:req.body.paypal_id,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        appartment: req.body.appartment,
        zipCode: req.body.zipCode,
        age: req.body.age,
        dob: req.body.dob,



      };

    let requestdata = await helper.vaildObject(required, non_required, res);
     // console.log(requestdata,"category darar");return;
     if(requestdata.selected_data){
     requestdata.selected_data = JSON.parse(requestdata.selected_data);
     }
     var password_details='';
     if(requestdata.password){
       password_details = await my_function.convert_password_to_sha1(requestdata);
     }

      /* console.log(password_details,"password_details") */

      get_auth_key = await my_function.generate_auth_key(req, res);
      /*  console.log(get_auth_key, "get_auth_key") */

      file_data = ''
      if (req.files && req.files.driver_license) {
        driver_license = req.files.driver_license
        file_data = await my_function.file_upload(driver_license)
      };
      file_dataa = '';
      if (req.files && req.files.image) {
        image = req.files.image
        file_dataa = await my_function.file_upload(image)
      }
      let signup_data = await my_function.signup_provider(requestdata, file_data, get_auth_key, password_details, file_dataa, req, res);

      if (signup_data == false) {
        return false;
      }
      else {
        var user_type =1;
        let forgot_user_password = await my_function.verify_email(requestdata, req, res, user_type)
        let msg = 'Sign Up Successfully';
        jsonData.true_status(res, signup_data, msg)
      }
    } catch (error) {
      throw error
    }
  },
  provider_login: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,
        password: req.body.password

      };
      const non_required = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        social_id: req.body.social_id,
      };

      let requestdata = await helper.vaildObject(required, non_required, res);

      let get_auth_key = await my_function.generate_auth_key(req, res);

      convert_password = await my_function.convert_password_to_sha1(requestdata)

      let getdata = await my_function.provider_login(requestdata, convert_password, get_auth_key, req, res);

      if (getdata) {
        let msg = 'Log In Successfully';
        jsonData.true_status(res, getdata, msg)
      } else {
        let msg = 'Incorrect Email Or Password';
        jsonData.wrong_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_my_jobs: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {
        page: req.query.page,
        limit: req.query.limit,
        status:req.query.status  //order status
      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {
        let get_home_data = await my_function.get_my_jobs(requestdata, check_auth)
        let msg = 'Order Listing ';
        jsonData.true_status(res, get_home_data, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  online_offline: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        type:req.body.type  
        // 0=offline,1=online
      };
      const non_required = {
      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      var obj =['0','1'];
      var chek = obj.includes(requestdata.type);
      if(chek == false){
        let msg = 'Invalid Type';
        jsonData.invalid_status(res, msg);
        return false;
      }

      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {
        var get_home_data = await my_function.online_offline(requestdata, check_auth);
        if(get_home_data == 1){
          var res_msg = (requestdata.type==0) ? 'Offline Successfully' : 'Online Successfully';
          let msg = res_msg;
          jsonData.true_status(res, get_home_data, msg)
        }
      } else { 
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  job_details: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        post_id: req.headers.post_id
      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)
      if (check_auth) {

        let get_provider_job_details = await my_function.get_provider_job_details(requestdata, check_auth);

        if (get_provider_job_details) {

          let msg = 'Job Details';
          jsonData.true_status(res, get_provider_job_details, msg)

        } else {
          let msg = 'Details Not Available';
          get_provider_job_details = {};
          jsonData.true_status(res, get_provider_job_details, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  place_bid: async function (req, res) {
    try {

      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        post_id: req.body.post_id,
        price: req.body.price
      };
      const non_required = {
        description: req.body.description

      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {
        let place_bid_provider = await my_function.place_bid_provider(requestdata, check_auth, req, res);

        if (place_bid_provider != undefined) {
          var push_data ={}
           message = check_auth.dataValues.firstName + " Bid On Your Order ";
            // push notification user --------------------
            var get_user_data = await my_function.get_user_details_for_push(requestdata);
            push_data.token = get_user_data.deviceToken;
            push_data.title = message
            push_data.code = 6
            push_data.body = requestdata;
            if(get_user_data.deviceType ==1){
              var send_push = await my_function.AndroidPushNotification(push_data);
            }else{
              var send_push = await my_function.IosPushNotification(push_data);
            }
  // insert notification
            var notification_data ={}
            notification_data.userId =check_auth.dataValues.id
            notification_data.user2Id =get_user_data.id
            notification_data.type =push_data.code 
            notification_data.message = push_data.title
            notification_data.orderId = requestdata.post_id
            notification_data.userType = 2
            notification_data.createdAt = await my_function.create_time_stamp()
            notification_data.updatedAt = await my_function.create_time_stamp()
            var create_notification = await my_function.create_notification(notification_data);
          }
         
          place_bid_provider = {};
          let msg = 'Bid Added Successfully';
          place_bid_provider.post_id = requestdata.post_id
          place_bid_provider.price = requestdata.price
          jsonData.true_status(res, place_bid_provider, msg)
        }
      else {
        var msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },

  update_bid: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        post_id: req.body.post_id,
        price: req.body.price
      };
      const non_required = {
        description: req.body.description
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {
        let place_bid_provider = await my_function.update_bid_provider(requestdata, check_auth, req, res);
        if (place_bid_provider == 1) {
          place_bid_provider = {};
          let msg = 'Bid updated Successfully';
          place_bid_provider.post_id = requestdata.post_id
          place_bid_provider.price = requestdata.price
          jsonData.true_status(res, place_bid_provider, msg)
        }
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_profile: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        provider_id: req.headers.provider_id
      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)
      if (check_auth) {
        let get_provider_profile = await my_function.get_provider_profile(requestdata, check_auth)
        if (get_provider_profile) {
          let msg = 'Profile get successfully';
          jsonData.true_status(res, get_provider_profile, msg)
        } else {
          let msg = 'Profile Not Available';
          get_provider_profile = {};
          jsonData.true_status(res, get_provider_profile, msg)
        }
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  logout: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        provider_id: req.headers.provider_id
      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)
      if (check_auth) {

        let logout_provider = await my_function.logout_provider(requestdata, check_auth)

        let msg = 'Logout Successfully';
        logout_provider = {};
        jsonData.true_status(res, logout_provider, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  all_content: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        // auth_key: req.headers.auth_key,
        type: req.headers.type,
        // 1=term ,2=privacy,3=aboutus

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      var type =['1', '2', '3'];
      var check = type.includes(requestdata.type);
      if(check==false || check ==''){
        let msg = 'Invalide type';
        jsonData.invalid_status(res, msg);
        return false
      }

    var  get_content_data = await my_function.all_content(requestdata)

      if (get_content_data) {
        let msg = 'Content';
        jsonData.true_status(res, get_content_data, msg)
      } else {
        let msg = 'Data Not Available';
        get_content_data = {};
        jsonData.true_status(res, get_content_data, msg)
      }
    } catch (error) {
      throw error
    }
  },
  change_password: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        old_password: req.body.old_password,
        new_password: req.body.new_password,

      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {

        let password_change = await my_function.change_password_provider(requestdata, req, res, check_auth);
        /* console.log(password_change,"password_change"); */
        if (password_change != undefined) {

          let msg = 'Password Changes Successfully';
          Password_data = {};
          jsonData.true_status(res, Password_data, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  social_login: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        social_id: req.body.social_id,
        social_type: req.body.social_type,

      };
      const non_required = {

        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        image: req.body.image,

      };

      let requestdata = await helper.vaildObject(required, non_required, res);

      let get_social_data = await my_function.provider_social_login(requestdata)
     // console.log(get_social_data,"get_social_data");return;
      if (get_social_data != false) {
        get_social_data.status = 1
      } else {
        get_social_data = {}
        get_social_data.status = 0
      }

      let msg = 'Log in successfully';
      jsonData.true_status(res, get_social_data, msg)

    } catch (error) {
      throw error
    }
  },
  edit_profile: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        dob: req.body.dob,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        selected_data: req.body.selected_data, // for temporary basis
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        appartment: req.body.appartment,
        zipCode: req.body.zipCode,
        // dob: req.body.dob,
        paypal_id: req.body.paypal_id,
      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata)

      if (check_auth) {
        file_data = check_auth.dataValues.image
        if (req.files && req.files.image) {
          image = req.files.image
          file_data = await my_function.file_upload(image)
        }

        file_businessLicence = check_auth.dataValues.businessLicence
        if (req.files && req.files.businessLicence) {
          business_licence = req.files.businessLicence
          file_businessLicence = await my_function.file_upload(business_licence)
          /*  console.log(file_businessLicence,"file_businessLicence") */
        }
        file_insurance = check_auth.dataValues.insurance
        if (req.files && req.files.insurance) {
          insurance = req.files.insurance
          file_insurance = await my_function.file_upload(insurance)
          /*  console.log(file_insurance,"file_insurance") */
        }
        file_resume = check_auth.dataValues.resume
        if (req.files && req.files.resume) {
          resume = req.files.resume
          file_resume = await my_function.file_upload(resume)
          /* console.log(file_resume,"file_resume") */
        }
        file_licence = check_auth.dataValues.driverLicence
        if (req.files && req.files.driverLicence) {
          driver_license = req.files.driverLicence
          file_licence = await my_function.file_upload(driver_license)
          /* console.log(file_resume,"file_resume") */
        }
        let edit_provider_profile = await my_function.edit_provider_profile(req, res, requestdata, check_auth, file_data, file_businessLicence, file_insurance, file_resume, file_licence)
        requestdata.provider_id = check_auth.dataValues.id
         let msg = 'Profile Updated  successfully';
        // let get_provider_profile = await my_function.get_provider_profile(requestdata, check_auth)

        // edit_provider_profile = {};
        jsonData.true_status(res, edit_provider_profile, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  my_reviews: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {

        let get_my_reviews = await my_function.get_my_reviews(check_auth)

        if (get_my_reviews.length > 0) {
          let msg = 'My Reviews';
          jsonData.true_status(res, get_my_reviews, msg)
        } else {
          let msg = 'Data Not Available';
          get_my_reviews = [];
          jsonData.true_status(res, get_my_reviews, msg)
        }


      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  my_notifications: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);

      if (check_auth) {

        let get_my_notifications = await my_function.get_notifications_data(requestdata, check_auth)

        let msg = 'My Notifications';
        jsonData.true_status(res, get_my_notifications, msg)


      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  job_history: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
       
      };
      const non_required = {
        page: req.query.page,
        limit:req.query.limit

      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {

        let get_provider_job_history = await my_function.get_provider_job_history(requestdata, check_auth)

        let msg = 'Job History';
        jsonData.true_status(res, get_provider_job_history, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  getCategories: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        // auth_key: req.headers.auth_key

      };
      const non_required = {
        type: req.headers.type

      };

      let requestdata = await helper.vaildObject(required, non_required, res);

      let get_category_data = await my_function.get_categories_provider(requestdata.type);

      if (get_category_data.length > 0) {

        let msg = 'Categories List';
        jsonData.true_status(res, get_category_data, msg)

      } else {
        let msg = 'Categories Not Available';
        get_category_data = [];
        jsonData.true_status(res, get_category_data, msg)
      }

    } catch (error) {
      throw error
    }
  },

  verify_email: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,

      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let user_type = 1;
      let forgot_user_password = await my_function.verify_email(requestdata, req, res, user_type)
      if (forgot_user_password != undefined) {
        let msg = 'Email sent successfully'
        email_send = {};
        jsonData.true_status(res, email_send, msg)
      }

    } catch (error) {
      throw error
    }
  },

  verify_email_otp: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,
        otp: req.body.otp
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let forgot_user_password = await my_function.verify_email_otp(requestdata, req, res)
      if (forgot_user_password==true) {
        let msg = 'Email verified successfully'
        email_send = {};
        jsonData.true_status(res, email_send, msg)
      }else{
        let msg = 'Invalide Otp'
        jsonData.false_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },

  check_email: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        email: req.body.email
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let forgot_user_password = await my_function.check_email(requestdata, req, res)
      if (forgot_user_password==null) {
        let msg = 'Email verified successfully'
        email_send = {};
        jsonData.true_status(res, email_send, msg)
      }else{
        let msg = 'Email Already Exist'
        jsonData.wrong_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },



  forgot_password: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let user_type = 1;
      let forgot_user_password = await my_function.send_email(requestdata, req, res, user_type)

      /*  console.log(forgot_user_password,"forgot_user_password") */
      if (forgot_user_password != undefined) {
        let msg = 'Email sent successfully'
        email_send = {};
        jsonData.true_status(res, email_send, msg)
      }

    } catch (error) {
      throw error
    }
  },
  url_id: async function (req, res) {
    try {

      let url_id_provider_data = await my_function.url_id_provider_data(req, res)

    } catch (error) {
      throw error
    }
  },
  reset_password: async function (req, res) {
    try {
      var new_data = req.body

      // console.log(new_data, "new_data")
      let update_password = await my_function.convert_password_to_sha1(new_data);

      let reset_user_password = await my_function.reset_password_provider_data(req, res, new_data, update_password);
      /*  console.log(reset_user_password) */
    } catch (error) {
      throw error
    }
  },
  get_notification_count: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {

        let get_note_count = await my_function.get_note_count(requestdata, check_auth)
        get_note_count_data_value = {}
        get_note_count_data_value.count = get_note_count
        let msg = 'Notifications Count'
        jsonData.true_status(res, get_note_count_data_value, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  provider_rating: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        userTo: req.body.userTo,
        ratings: req.body.ratings,
        description: req.body.description

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let rating_provider = await my_function.rating_provider(requestdata, check_auth)
        if (rating_provider) {
          let msg = 'Rating Submit Successfully';
          jsonData.true_status(res, rating_provider, msg)
        } else {
          let msg = 'Some problm Available';
          jsonData.true_status(res, rating_provider, msg)
        }
      }
      else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }
    }
    catch (error) {
      throw error
    }
  },
  job_history_details: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        job_id: req.body.job_id

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);

      if (check_auth) {

        let get_history_details = await my_function.get_history_details(requestdata, check_auth)
        let msg = 'get_history_details';
        jsonData.true_status(res, get_history_details, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  start_job: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        job_id: req.body.job_id,
        status: req.body.status

      };
      const non_required = {
        start_job_date: req.body.start_job_date,
        end_job_date: req.body.end_job_date

      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let startjob_provider = await my_function.startjob_provider(requestdata, check_auth)
        if (requestdata.status == 4 || requestdata.status == 3) {
          var push_data ={}
          if (requestdata.status == 3) {
            message = check_auth.dataValues.firstName + " Start Your order"
            push_data.code = 4;
          }
          if (requestdata.status == 4) {
            message = check_auth.dataValues.firstName + " complete Your order"
            push_data.code = 5;
          }

          // push notification user --------------------
        
          requestdata.post_id =requestdata.job_id;
          var get_user_data = await my_function.get_user_details_for_push(requestdata);
          push_data.token = get_user_data.deviceToken;
          push_data.title = message
          push_data.body = startjob_provider;
          if(get_user_data.deviceType ==1){
            var send_push = await my_function.AndroidPushNotification(push_data);
          }else{
            var send_push = await my_function.IosPushNotification(push_data);
          }
// insert notification
          var notification_data ={}
          notification_data.userId =check_auth.dataValues.id
          notification_data.user2Id =get_user_data.id
          notification_data.type =push_data.code 
          notification_data.message = push_data.title
          notification_data.orderId = requestdata.job_id
          notification_data.userType = 2
          notification_data.createdAt = await my_function.create_time_stamp()
          notification_data.updatedAt = await my_function.create_time_stamp()
          var create_notification = await my_function.create_notification(notification_data);
        }
        let msg = 'Job Started';
        jsonData.true_status(res, startjob_provider, msg)
      }
      else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }
    }
    catch (error) {
      throw error
    }
  },
  get_chat: async function (req, res) {
    try {

      const required = {
        security_key: req.headers.security_key,
        //  auth_key: req.headers.auth_key,
        userId: req.body.userId,
        user2Id: req.body.user2Id

      };
      const non_required = {
        //start_job_date: req.body.start_job_date
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let get_chat_data = await socket_function.GetChat(requestdata)

      let msg = 'Get Chat';
      // startjob_provider = {};
      jsonData.true_status(res, get_chat_data, msg)

    } catch (error) {
      throw error
    }
  },
  get_chat_list: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        //  auth_key: req.headers.auth_key,
        userId: req.body.userId,
        type: req.body.type //type(0=sender is user,1=business)

      };
      const non_required = {
        //start_job_date: req.body.start_job_date
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      //let requestdata = await helper.vaildObject(required, non_required, res);
      let get_chat_list_data = await socket_function.get_chat_list(requestdata)

      let msg = 'Chat List';
      jsonData.true_status(res, get_chat_list_data, msg)

    } catch (error) {
      throw error
    }
  },
  add_paypal:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        paypal_id:req.body.paypal_id

      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){

        let add_paypal_provider= await add_paypal_provider.add_paypal_provider(requestdata,check_auth)


      let msg = 'Paypal Id Added';
      add_paypal_provider={}
      jsonData.true_status(res, add_paypal_provider, msg)

      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  add_portfolio:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        title:req.body.title,
        description:req.body.description
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
        if (req.files && req.files.image) {
          image = req.files.image
          requestdata.image = await my_function.file_upload(image)
        }
      var add_portfolio= await my_function.add_portfolio_provider(requestdata)
      var msg = 'Portfolio Added Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  edit_portfolio:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        portfolio_id:req.body.portfolio_id,
       
      };
      const non_required = {
        title:req.body.title,
        description:req.body.description
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
        if (req.files && req.files.image) {
          image = req.files.image
          requestdata.image = await my_function.file_upload(image)
        }
      var add_portfolio= await my_function.edit_portfolio_provider(requestdata)
      var msg = 'Portfolio Edit Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
   delete_portfolio:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        portfolio_id:req.body.portfolio_id,
       
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_portfolio= await my_function.delete_portfolio_provider(requestdata)
      var msg = 'Portfolio Delete Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  get_portfolio: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let get_note_count = await my_function.get_provider_PCTL(check_auth.dataValues.id,type=0)
        let msg = 'Success'
        jsonData.true_status(res, get_note_count, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  add_language:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        name:req.body.name,
      };
      const non_required = {
        type:req.body.type
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_lang= await my_function.add_lang_provider(res,requestdata)
      var msg = 'Language Added Successfully';
      add_lang={}
      jsonData.true_status(res, add_lang, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  edit_language:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        lang_id:req.body.lang_id
      };
      const non_required = {
        name:req.body.name,
        type:req.body.type
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
      var add_lang= await my_function.edit_lang_provider(res,requestdata)
      var msg = 'Language Edit Successfully';
      add_lang={}
      jsonData.true_status(res, add_lang, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },

  delete_language:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        lang_id:req.body.lang_id,
       
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_portfolio= await my_function.delete_lang_provider(requestdata)
      var msg = 'Language Delete Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  get_language: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res,[]);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let get_note_count = await my_function.get_provider_PCTL(check_auth.dataValues.id,type=1)
        let msg = 'Success'
        jsonData.true_status(res, get_note_count, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg,[])
      }

    } catch (error) {
      throw error
    }
  },
  add_business_hours:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        data:req.body.data,
        type:req.body.type
      };
      const non_required = {
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_hours= await my_function.add_provider_availability(res,requestdata)
      var msg = 'Success';
      add_hours={}
      jsonData.true_status(res, add_hours, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  get_business_hours: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let get_note_count = await my_function.get_provider_PCTL(check_auth.dataValues.id,type=3)
        let msg = 'Success'
        jsonData.true_status(res, get_note_count, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },

  add_certificate:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        title:req.body.title,
        description:req.body.description
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
        if (req.files && req.files.image) {
          image = req.files.image
          requestdata.image = await my_function.file_upload(image)
        }
      var add_portfolio= await my_function.add_certificate_provider(requestdata)
      var msg = 'Certificate Added Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
  edit_certificate:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        certificate_id:req.body.certificate_id,
       
      };
      const non_required = {
        title:req.body.title,
        description:req.body.description
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
        if (req.files && req.files.image) {
          image = req.files.image
          requestdata.image = await my_function.file_upload(image)
        }
      var add_portfolio= await my_function.edit_certificate_provider(requestdata)
      var msg = 'Certificate Edit Successfully';
      add_portfolio={}
      jsonData.true_status(res, add_portfolio, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },
   delete_certificate:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        certificate_id:req.body.certificate_id,
       
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_certificate= await my_function.delete_certificate_provider(requestdata)
      var msg = 'Certificate Delete Successfully';
      add_certificate={}
      jsonData.true_status(res, add_certificate, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    }catch(error){
      throw error
    }
  },

  get_certificate: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
        let get_note_count = await my_function.get_provider_PCTL(check_auth.dataValues.id,type=2)
        let msg = 'Success'
        jsonData.true_status(res, get_note_count, msg)
      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  map_list: async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {
        search:req.query.search,
        limit:req.query.limit,
        page:req.query.page

      };
      let requestdata = await helper.vaildObject(required, non_required, res,[]);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
          var get_map_data =  await my_function.map_list(requestdata,check_auth);
          var msg = 'Project Get Successfully';
          jsonData.true_status(res, get_map_data, msg)
      }else{
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg,[])
      }

    }catch(error){
      throw error;
    }

  },
  read_notification: async function (req, res) {
    try {
      let required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key
      }
      const non_required = {
        type: req.headers.type,  // 0=all,1=single
        notification_id:req.headers.notification_id, 
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      var ds =['0','1'];
      var check = ds.includes(requestdata.type);
      if(check==false){
        let msg = 'Invalid Type';
        jsonData.invalid_status(res, msg)  ;
        return false;   
      }

      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
          requestdata.user_id =check_auth.dataValues.id;
          var search_data = await my_function.read_notification(requestdata);
          let msg = 'Read Successfully';
          jsonData.true_status(res, {}, msg)     
       }
    }
    catch (error) {
      throw error
    }
  },

  filter_search: async function (req, res) {
    try {
      let required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key
      }
      const non_required = {
        category_id: req.headers.category_id,  // coma sepret
        distance:req.headers.distance, // miles
        state:req.headers.state, // string

      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      if (check_auth) {
          requestdata.user_id =check_auth.dataValues.id;
          requestdata.latitude =check_auth.dataValues.latitude;
          requestdata.longitude =check_auth.dataValues.longitude;
          var search_data = await my_function.filter_search_provider(requestdata);
          let msg = 'Get Successfully';
          jsonData.true_status(res, search_data, msg)     
       }
    }
    catch (error) {
      throw error
    }
  },
  add_to_fav_list: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        job_id: req.body.job_id,
        status: req.body.status,

      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);
      var type =['1', '2'];
      var check = type.includes(requestdata.status);
      if(check==false || check ==''){
        let msg = 'Invalide status';
        jsonData.invalid_status(res, msg);
        return false
      }

      if (check_auth) {

        let add_to_fav = await my_function.add_to_favourite_user(requestdata, check_auth)
        if (requestdata.status == 1) {
          let msg = 'Job added to favourite list';
          add_to_fav = {};
          jsonData.true_status(res, add_to_fav, msg)

        } else {
          let msg = 'Job remove your favourite list';
          add_to_fav = {};
          jsonData.true_status(res, add_to_fav, msg)
        }

      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_favourite_list: async function (req, res) {
    try {

      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_provider_auth_key(requestdata);

      if (check_auth) {

        let get_fav_list = await my_function.get_fav_list_order(requestdata, check_auth)
        if (get_fav_list.length > 0) {
          let msg = 'Favourite List';
          jsonData.true_status(res, get_fav_list, msg)
        } else {
          let msg = 'List Not Available';
          get_fav_list = [];
          jsonData.true_status(res, get_fav_list, msg)
        }

      } else {
        let msg = 'Invalid authorization key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },

// identity

add_identity:async function(req,res){
  try{
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key
    };
    const non_required = {};
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
      if (req.files && req.files.image) {
        image = req.files.image
        requestdata.image = await my_function.file_upload(image)
      }
      if (req.files && req.files.backImage) {
        image = req.files.backImage
        requestdata.backImage = await my_function.file_upload(image)
      }
    var add_portfolio= await my_function.add_identity_provider(requestdata)
    var msg = 'Identity Added Successfully';
    add_portfolio={}
    jsonData.true_status(res, add_portfolio, msg)
    }else{
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  }catch(error){
    throw error
  }
},
edit_identity:async function(req,res){
  try{
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      identity_id:req.body.identity_id,
     
    };
    const non_required = {
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
      if (req.files && req.files.image) {
        image = req.files.image
        requestdata.image = await my_function.file_upload(image)
      }
      if (req.files && req.files.backImage) {
        image = req.files.backImage
        requestdata.backImage = await my_function.file_upload(image)
      }
    var add_portfolio= await my_function.edit_identity_provider(requestdata)
    var msg = 'Identity Edit Successfully';
    add_portfolio={}
    jsonData.true_status(res, add_portfolio, msg)
    }else{
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  }catch(error){
    throw error
  }
},
 delete_identity:async function(req,res){
  try{
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      identity_id:req.body.identity_id 
     
    };
    const non_required = {};
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
    var add_portfolio= await my_function.delete_identity_provider(requestdata)
    var msg = 'Identity Delete Successfully';
    add_portfolio={}
    jsonData.true_status(res, add_portfolio, msg)
    }else{
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  }catch(error){
    throw error
  }
},
get_identity: async function (req, res) {
  try {
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
    };
    const non_required = {};
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if (check_auth) {
      let get_note_count = await my_function.get_identity_provider(check_auth.dataValues.id)
      let msg = 'Success'
      jsonData.true_status(res, get_note_count, msg)
    } else {
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  } catch (error) {
    throw error
  }
},

account_setting: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key
    }
    const non_required = {
      type: req.headers.type,  // 0=deactive,1=delete
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
    var ds =['0','1'];
    var check = ds.includes(requestdata.type);
    if(check==false){
      let msg = 'Invalid Type';
      jsonData.invalid_status(res, msg)  ;
      return false;   
    }

    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if (check_auth) {
        requestdata.id =check_auth.dataValues.id;
        var get_type = await my_function.account_active_deactive_provider(requestdata);
        let msg = (requestdata.type==0) ? 'Account Deactivate Successfully' : 'Account Delete Successfully';
        jsonData.true_status(res, {}, msg)     
     }else{
      let msg = 'Your Account has been Deactivate';
      jsonData.invalid_status(res, msg)  ;
      return false;   
     }
  }
  catch (error) {
    throw error
  }
},
all_language: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
    }
    const non_required = {
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
        var get_type = await my_function.get_all_language();
        let msg ='Language Get Successfully'
        jsonData.true_status(res, get_type, msg)     
     }

  catch (error) {
    throw error
  }
},

Faq: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key
    }
    const non_required = {
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if (check_auth) {
        requestdata.id =check_auth.dataValues.id;
        var faq = await my_function.get_faqs();
        let msg = 'FAQs Get Successfully';
        jsonData.true_status(res, faq, msg)     
     }else{
      let msg = 'Invalid Auth Key';
      jsonData.invalid_status(res, msg) ;
      return false;   
     }
  }
  catch (error) {
    throw error
  }
},

admin_setting_Data: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
    }
    const non_required = {
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
  
        var Admin = await my_function.get_setting();
        var final ={}
        final.supportEmail =Admin.supportEmail;
        let msg = 'Setting Get Successfully';
        jsonData.true_status(res, final, msg)     
  }
  catch (error) {
    throw error
  }
},

education_add_edit: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      type:req.body.type  // 0=add,1=edit

    }
    const non_required = {
      school:req.body.school,
      degree:req.body.degree, 
      studyType:req.body.studyType, 
      startDate:req.body.startDate, 
      endDate:req.body.endDate, 
      grade:req.body.grade, 
      activity:req.body.activity, 
      description:req.body.description,
      id:req.body.id
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId =check_auth.dataValues.id
        if(requestdata.type==0){
        var insert = await my_function.add_education_provider(requestdata);
        }else{
        var update = await my_function.edit_education_provider(requestdata);
        }
        var final ={}
        let msg =  (requestdata.type==0) ? 'Education Added Successfully' : 'Education Updated Successfully';
        jsonData.true_status(res, final, msg)  
      }else{
        let msg = 'Invalid Auth Key';
        jsonData.invalid_status(res, msg) ;
        return false;   
      }   
  }
  catch (error) {
    throw error
  }
},

experience_add_edit: async function (req, res) {
  try {
    let required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      type:req.body.type  // 0=add,1=edit

    }
    const non_required = {
      title:req.body.title,
      experienceType:req.body.experienceType, 
      company:req.body.company, 
      location:req.body.location, 
      currentlyWorking:req.body.currentlyWorking, 
      startDate:req.body.startDate, 
      endDate:req.body.endDate, 
      description:req.body.description,
      id:req.body.id
    };
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId =check_auth.dataValues.id
        if(requestdata.type==0){
        var insert = await my_function.add_experience_provider(requestdata);
        }else{
        var update = await my_function.edit_experience_provider(requestdata);
        }
        var final ={}
        let msg =  (requestdata.type==0) ? 'Experience Added Successfully' : 'Experience Updated Successfully';
        jsonData.true_status(res, final, msg)  
      }else{
        let msg = 'Invalid Auth Key';
        jsonData.invalid_status(res, msg) ;
        return false;   
      }   
  }
  catch (error) {
    throw error
  }
},

delete_education:async function(req,res){
  try{
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      id:req.body.id 
    };
    const non_required = {};
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
    var add_portfolio= await my_function.delete_education_provider(requestdata)
    var msg = 'Education Delete Successfully';
    add_portfolio={}
    jsonData.true_status(res, add_portfolio, msg)
    }else{
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  }catch(error){
    throw error
  }
},
delete_experience:async function(req,res){
  try{
    const required = {
      security_key: req.headers.security_key,
      auth_key: req.headers.auth_key,
      id:req.body.id 
    };
    const non_required = {};
    let requestdata = await helper.vaildObject(required, non_required, res);
    let check_auth = await my_function.check_provider_auth_key(requestdata);
    if(check_auth){
      requestdata.providerId = check_auth.dataValues.id
    var add_portfolio= await my_function.delete_experience_provider(requestdata)
    var msg = 'Experience Delete Successfully';
    add_portfolio={}
    jsonData.true_status(res, add_portfolio, msg)
    }else{
      let msg = 'Invalid Authorization Key';
      jsonData.unauth_status(res, msg)
    }

  }catch(error){
    throw error
  }
},





}
