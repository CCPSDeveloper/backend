const db = require('../models');
const my_function = require('../function/fun.js'); 
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
const setting = db.setting
const stripe = require('stripe')('sk_test_QkBePuEKoauE4u5CKmQ2CXJv');
const paypal = require('paypal-rest-sdk');
const fun = require('../function/fun.js');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWMITMtNPtnXW4yNZMyi_pvFH2bzC5qwZZagOg2zk1-YlIzLqOWqJyT1_u80mKMS4hVR6W5q649hG0S7',
  'client_secret': 'EE9_VwxO8DaZ1hASXM4Dap-_CZVY-tu379AjfwMCRIVNmEAlp_kt0LgAX5f3GgcmHMeSoGjB2YEVdyQJ'
});

module.exports = {
 
  userSignup: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        country_code: req.body.country_code,
        ngo:req.body.ngo //0=no,1=yes

      };
      const non_required = {
        /* gender: req.body.gender,
        age: req.body.age, */
        address: req.body.address,
        latitude: req.body.latitude,
        password: req.body.password,
        longitude: req.body.longitude,
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        description: req.body.description,
        social_id: req.body.social_id,
        social_type: req.body.social_type,


      };

      let requestdata = await helper.vaildObject(required, non_required, res);
    var password_details ='';
      if(requestdata.password){
       password_details = await my_function.convert_password_to_sha1(requestdata);
      }

      let signup_data = await my_function.signup_user(requestdata, password_details, req, res);

      if (signup_data == false) {
        return false;
      }
      else {
        let msg = 'Sign Up Successfully';
        jsonData.true_status(res, signup_data, msg)
      }

    } catch (error) {
      throw error;

    }
  },
  userLogin: async function (req, res) {
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

      // console.log(requestdata,"===============data");

      let convert_password = await my_function.convert_password_to_sha1(requestdata)

      let getdata = await my_function.user_login(requestdata, convert_password, req, res);

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
  getCategories: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key

      };
      const non_required = {
        type: req.headers.type, // 0=remote,1=localjobs
        search: req.query.search

      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)
      if (check_auth) {

        let get_category_data = await my_function.get_categories(requestdata);

        if (get_category_data.length > 0) {

          let msg = 'Categories List';

          jsonData.true_status(res, get_category_data, msg)

        } else {
          let msg = 'Categories Not Available';
          get_category_data = [];
          jsonData.true_status(res, get_category_data, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },

  faqs: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      // let check_auth = await my_function.check_auth_key(requestdata)
      // if (check_auth) {

        var get_faq = await my_function.get_faqs();

        if (get_faq.length > 0) {

          let msg = 'Faqs List';

          jsonData.true_status(res, get_faq, msg)

        } else {
          let msg = 'Faqs Not Available';
          get_faq = [];
          jsonData.true_status(res, get_faq, msg)
        }

      // } else {
      //   let msg = 'Invalid Authorization Key';
      //   jsonData.invalid_status(res, msg)
      // }

    } catch (error) {
      throw error
    }
  },
  get_card: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)
      if (check_auth) {

        let get_card = await my_function.get_card(check_auth);

        if (get_card.length > 0) {

          let msg = 'Cards List';
          jsonData.true_status(res, get_card, msg)

        } else {
          let msg = 'Cards Not Available';
          get_category_data = [];
          jsonData.true_status(res, get_card, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_sub_categories: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        category_id: req.headers.category_id

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)

      if (check_auth) {

        let get_sub_categories_data = await my_function.get_sub_categories_data(requestdata);

        if (get_sub_categories_data.length > 0) {
          let msg = 'SubCategories List';
          jsonData.true_status(res, get_sub_categories_data, msg)

        } else {
          let msg = 'SubCategories Not Available';
          get_sub_categories_data = [];
          jsonData.true_status(res, get_sub_categories_data, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },

  near_me_provider: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        latitude: req.headers.latitude,
        longitude: req.headers.longitude,
      };
      const non_required = {
        limit: req.query.limit,
        page: req.query.page,
        search: req.query.search
      };

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)

      if (check_auth) {
        requestdata.user_id = check_auth.dataValues.id;
        var get_provider_nearme = await my_function.near_me_provider(requestdata);
          let msg = 'Get Successfully';
          jsonData.true_status(res, get_provider_nearme, msg)

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
        user_id: req.headers.user_id

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)

      if (check_auth) {
        get_user_profile = await my_function.get_user_profile(requestdata);
        if (get_user_profile) {
          let msg = 'Profile Get Successfully';
          jsonData.true_status(res, get_user_profile, msg)

        } else {
          let msg = 'Profile Not Available';
          jsonData.wrong_status(res, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_provider_details: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        provider_id: req.headers.provider_id

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata)

      if (check_auth) {
        get_provider_profile = await my_function.get_provider_details(requestdata,check_auth);
        if (get_provider_profile) {
          let msg = 'Profile Get Successfully';
          jsonData.true_status(res, get_provider_profile, msg)

        } else {
          let msg = 'Profile Not Available';
          jsonData.wrong_status(res, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  edit_profile: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        email: req.body.email
        /*  user_id: req.body.user_id, */
      

      };
      const non_required = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        description: req.body.description,
        age: req.body.age,
        dob: req.body.dob,

        city: req.body.city,
        state: req.body.state,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        countryCode: req.body.countryCode,
        phone: req.body.phone,


      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      file_data = check_auth.dataValues.image
      if (req.files && req.files.image) {
        file_data = await my_function.file_upload(req.files.image)
      }

      if (check_auth) {

        let edit_user_profile = await my_function.edit_user_profile(requestdata, check_auth, file_data, req, res)

        if (edit_user_profile) {
        requestdata.user_id = check_auth.dataValues.id
         var  get_user_profile = await my_function.get_user_profile(requestdata);

          let msg = 'Profile Updated Successfully';
          jsonData.true_status(res, get_user_profile, msg)
        } else {
          let msg = 'Profile Not Available';
          edit_user_profile = {};
          jsonData.true_status(res, edit_user_profile, msg)
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
        user_id: req.headers.user_id,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {

        let logout_user = await my_function.logout_user(requestdata, check_auth);

        let msg = 'Logout Successfully';
        logout_user = {};
        jsonData.true_status(res, logout_user, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
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
      let check_auth = await my_function.check_auth_key(requestdata)

      if (check_auth) {

        let password_change = await my_function.change_password(requestdata, req, res, check_auth);
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
  all_content: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        type: req.headers.type,
        // 1=term,2=privacy,3=abouts

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
      get_content_data = await my_function.all_content(requestdata)

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
  upload_post_images: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      file_data = ''
      if (req.files && req.files.images) {
        let image = req.files.images
        file_data = await my_function.file_upload(image)
      }
        let msg = 'upload successfully';
        jsonData.true_status(res, file_data, msg)

    } catch (error) {
      throw error
    }
  },
  add_post: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        title: req.body.title,
        jobType: req.body.jobType,

        description: req.body.description,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        date: req.body.date,
        time: req.body.time,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        startPrice:req.body.startPrice,
        endPrice:req.body.endPrice,
        state:req.body.state,
        zipCode:req.body.zipCode,
        city:req.body.city,
        // street:req.body.street,
        // number:req.body.number,

        // category_id: req.body.category_id,
        // sub_category_id: req.body.sub_category_id,
        selected_data:req.body.selected_data,
        type: req.body.type,  //1=>now,2=>today,3=>future

      };
      const non_required = {
        is_api:0,
        appartment:req.body.appartment,


      };

      let requestdata = await helper.vaildObject(required, non_required, res);

      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {

        file_data = ''
        if (req.files && req.files.image) {
          /* console.log("innn file") */
          let image = req.files.image
          // console.log(image,"image")
          file_data = await my_function.file_upload(image)
        }

        let add_job_description = await my_function.add_job_description(requestdata, check_auth, file_data)

        let msg = 'Job Added Successfully';
        /*  add_job_description = {}; */
        jsonData.true_status(res, add_job_description, msg)

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
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
        post_id: req.headers.post_id,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);

      let check_auth = await my_function.check_auth_key(requestdata);


      if (check_auth) {

        let get_job_details = await my_function.get_job_details(requestdata, check_auth);

        if (get_job_details) {
          let msg = 'Post Details';
          jsonData.true_status(res, get_job_details, msg)
        } else {
          let msg = 'Data Not Available';
          get_job_details = {};
          jsonData.true_status(res, get_job_details, msg)
        }

      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  my_job_list: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {
        type: req.query.type, //4=complete,3=ongoing,2 canceled,1= upcoming 0=all

        limit: req.query.limit,
        page: req.query.page
      };

      let requestdata = await helper.vaildObject(required, non_required, res);

      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {


        let my_job_details = await my_function.my_job_details(requestdata, check_auth);

        let msg = 'My post listing';
        jsonData.true_status(res, my_job_details, msg)


      } else {
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  add_to_fav_list: async function (req, res) {
    try {

      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        provider_id: req.body.provider_id,
        status: req.body.status,

      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      var type =['1', '2'];
      var check = type.includes(requestdata.status);
      if(check==false || check ==''){
        let msg = 'Invalide status';
        jsonData.invalid_status(res, msg);
        return false
      }

      if (check_auth) {

        let add_to_fav = await my_function.add_to_favourite_provider(requestdata, check_auth)
        if(add_to_fav ==null){
          return false;
        }
        if (requestdata.status == 1) {
          // push notification provider --------------------
          var push_data ={}
            var get_provider_data = await fun.get_provider_details_for_push(requestdata);
            push_data.token = get_provider_data.deviceToken;
            push_data.title = check_auth.dataValues.firstName + ' '+ check_auth.dataValues.lastName +  " added you favorit list";
            push_data.code = 0;
            push_data.body = check_auth.dataValues;;
            if(get_provider_data.deviceType ==1){
              var send_push = await fun.AndroidPushNotification(push_data);
            }else{
              var send_push = await fun.IosPushNotification(push_data);
            }

          let msg = 'Provider added to favourite list';
          add_to_fav = {};
          jsonData.true_status(res, add_to_fav, msg)

        } else {
          let msg = 'Provider remove your favourite list';
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
      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {

        let get_fav_list = await my_function.get_fav_list(requestdata, check_auth)
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
  add_additional_work: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        title: req.body.title,
        price: req.body.price,
        order_id: req.body.order_id,
        provider_id: req.body.provider_id,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {
        file_data = '';
        if (req.files && req.files.image) {
          let image = req.files.image
          file_data = await my_function.file_upload(image)
        }
        let add_additional_work = await my_function.add_additional_work(requestdata, check_auth, file_data, req, res)
        // console.log(add_additional_work,"add_additional_work");return;
        if (add_additional_work != undefined) {
          let msg = 'Additional Work Added successfully';
          add_additional_work = {}
          jsonData.true_status(res, add_additional_work, msg)
        }


      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  get_tips: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {

        let get_all_tips = await my_function.get_all_tips(requestdata)

        if (get_all_tips.length > 0) {
          let msg = 'Tips';
          jsonData.true_status(res, get_all_tips, msg)

        } else {
          let msg = 'Data Not Available';
          get_all_tips = []
          jsonData.true_status(res, get_all_tips, msg)
        }
      } else {
        let msg = 'Invalid authorization key';
        jsonData.invalid_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_notifications: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {

        let get_notifications_data = await my_function.get_notification_list_user(requestdata, check_auth)

        let msg = 'My Notifications List';
        jsonData.true_status(res, get_notifications_data, msg)

      } else {
        let msg = 'Invalid authorization key';
        jsonData.invalid_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  accept_reject: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        type: req.body.type, // 1=> accept 2=> reject
        order_id: req.body.post_id,
        provider_id: req.body.provider_id
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);

      if (check_auth) {
        let user_accept_reject_request = await my_function.user_accept_reject_request(requestdata, check_auth)
        user_accept_reject_request = {};
        user_accept_reject_request.status = parseInt(requestdata.type)
        if (requestdata.type == 1) {
// push notification provider --------------------
           var push_data ={}
           var get_provider_data = await my_function.get_provider_details_for_push(requestdata);
           push_data.token = get_provider_data.deviceToken;
           push_data.title = check_auth.dataValues.firstName + ' '+ check_auth.dataValues.lastName +  " Accept your Bid";
           push_data.code = 1;
           push_data.body = requestdata;
           if(get_provider_data.deviceType ==1){
             var send_push = await my_function.AndroidPushNotification(push_data);
           }else{
             var send_push = await my_function.IosPushNotification(push_data);
           }
// insert notification
           var notification_data ={}
           notification_data.userId =check_auth.dataValues.id
           notification_data.user2Id =get_provider_data.id
           notification_data.type =push_data.code 
           notification_data.type =push_data.code 
           notification_data.message = push_data.title
           notification_data.orderId = requestdata.order_id
           notification_data.userType = 1
           notification_data.createdAt = await my_function.create_time_stamp()
           notification_data.updatedAt = await my_function.create_time_stamp()
           var create_notification = await my_function.create_notification(notification_data);

          let msg = 'Request Accepted';
          jsonData.true_status(res, user_accept_reject_request, msg)
        } else {
          let get_provider_details = await my_function.get_provider_details_for_push(requestdata)
          let msg = 'Request Rejected';
          jsonData.true_status(res, user_accept_reject_request, msg)
        }


      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  get_invoice: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        order_id: req.headers.order_id,
        provider_id: req.headers.provider_id
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {

        let user_invoice = await my_function.user_invoice(requestdata, check_auth)

        if (user_invoice) {
          let msg = 'Invoice Details';
          jsonData.true_status(res, user_invoice, msg)
        } else {
          let msg = 'Invoice Not Available';
          user_invoice = {}
          jsonData.true_status(res, user_invoice, msg)
        }

      } else {
        let msg = 'Invalid authorization key';
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
        social_type: req.body.social_type,
        social_id: req.body.social_id
      };
      const non_required = {
        device_token: req.body.device_token,
        device_type: req.body.device_type,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        image: req.body.image,
      };
      let requestdata = await helper.vaildObject(required, non_required, res);

      let get_social_login = await my_function.social_login(requestdata)
      // console.log(get_social_login,"get_social_login");return;
      // get_social_login={}
      if (get_social_login != null) {
        //get_social_login={}
        get_social_login.dataValues.status = 1
      } else {
        get_social_login = {}
        get_social_login.status = 0
      }
      let msg = 'Logged In Successfully';
      jsonData.true_status(res, get_social_login, msg)

    } catch (error) {
      throw error
    }
  },
  payment: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        order_id: req.body.order_id,
        provider_id: req.body.provider_id
      };
      const non_required = {
        type: req.body.type,
        title: req.body.title,
        price: req.body.price,
        cardid: req.body.cardid,
        amount: req.body.amount,
        transaction_id: req.body.transaction_id,
        tip: req.body.tip,
        adminfees: req.body.adminfees,

      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
        file_data = '';
        if (req.files && req.files.image) {
          let image = req.files.image
          file_data = await my_function.file_upload(image)
        }

        let user_payment = await my_function.user_payment(requestdata, check_auth, file_data, req, res)
        //console.log(user_payment,"get_provider_details");return;
        if (user_payment != undefined) {
          get_provider_details = await my_function.get_provider_details_for_push(requestdata)

          if (requestdata.tip == '' || requestdata.tip == 0) {
            req.body.tip = 0
          }

          let get_all_tax = await setting.findOne({
            attributes: ['id', 'comission', 'tax']
          })
          let total_deduct = Number(req.body.adminfees) + Number(get_all_tax.dataValues.tax)
          //console.log(total_deduct,"total_deduct")
          let total = Number(req.body.amount) + Number(req.body.tip) - Number(total_deduct)
          //console.log(total);
          if (get_provider_details.dataValues.paypalId == '') {
            get_provider_details.dataValues.paypalId = 'cqlsys73@gmail.com'
          }
          let sender_batch_id = Math.random().toString(36).substring(9);
          //console.log(total,"total");return;
          var create_payout_json = {
            "sender_batch_header": {
              "sender_batch_id": sender_batch_id,
              "email_subject": "You have a payment"
            },
            "items": [
              {
                "recipient_type": "EMAIL",
                "amount": {
                  "value": total,
                  "currency": "USD"
                },
                "receiver": get_provider_details.dataValues.paypalId,
                "note": "Thank you.",
                "sender_item_id": "item_1"
              },

            ]
          }
          await paypal.payout.create(create_payout_json, async function (error, payout) {
            // console.log(payout, '===========>payout');
            if (error) {
              console.log(error.response);
              throw error;
            } else {
              console.log(payout, '===========>payout');
            }
          });
          if (requestdata.type == 1 || requestdata.type == 3 || requestdata.type == 2) {

            // console.log(get_provider_details.dataValues.deviceToken);return;
            device_token = get_provider_details.dataValues.deviceToken
            device_type = get_provider_details.dataValues.deviceType
            type = 0,
              order_id = requestdata.order_id
            if (requestdata.type == 1) {
              message = check_auth.dataValues.firstName + " accepted your bid ",
                push_type = 4 // for accept bid 
            } else if (requestdata.type == 3) {
              if (requestdata.tip == 0 || requestdata.tip == '') {

                message = check_auth.dataValues.firstName + " gives you a tip "
              } else {
                message = check_auth.dataValues.firstName + " Complete Your Order "
              }
              push_type = 5 // for tip bid
            }
            else if (requestdata.type == 2) {
              // console.log("innnnnnnn")
              message = check_auth.dataValues.firstName + " Added a additional work "
              push_type = 6
            }
            let send_push_notification = await my_function.send_push_notification_normal(message, device_token, device_type, type, order_id, push_type)
          }

          let msg = 'Payment Done Successfully';
          user_payment = {};
          jsonData.true_status(res, user_payment, msg)
        }
      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }

    } catch (error) {
      throw error
    }
  },
  // get_notifications:async function(req,res){
  //   try{
  //     const required = {

  //       security_key: req.headers.security_key,
  //       auth_key: req.headers.auth_key,

  //     };
  //     const non_required = {};
  //     let requestdata = await helper.vaildObject(required, non_required, res);
  //     let check_auth = await my_function.check_auth_key(requestdata);
  //     if(check_auth){

  //       let get_user_notification= await my_function.get_notification_list_user(requestdata,check_auth)
  //         let msg = 'My Notifications';
  //         jsonData.true_status(res, get_user_notification, msg)


  //     }else{
  //       let msg = 'Invalid authorization key';
  //       jsonData.unauth_status(res, msg)
  //     }


  //   }catch(error){
  //     throw error
  //   }
  // },
  forgot_password: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        email: req.body.email,
      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);
      let user_type = 2
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

    let url_id_data = await my_function.url_id_data(req, res)

  },
  reset_password: async function (req, res) {
    try {

      var new_data = req.body

      let update_password = await my_function.convert_password_to_sha1(new_data);
      let reset_user_password = await my_function.reset_password_data(req, res, new_data, update_password);

    } catch (error) {
      throw error
    }
  },
  not_started_jobs: async function (req, res) {
    try {
      const required = {

        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        job_id: req.body.job_id,

      };
      const non_required = {};

      let requestdata = await helper.vaildObject(required, non_required, res);

      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {

        let get_not_started_jobs = await my_function.get_not_started_jobs(requestdata, check_auth)
        let msg = 'list'
        jsonData.true_status(res, get_not_started_jobs, msg)

      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }


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

      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {

        let note_provider_count = await my_function.note_user_count(requestdata, check_auth)
        get_note_count_data_value = {}
        get_note_count_data_value.count = note_provider_count
        let msg = 'Notifications Count'
        jsonData.true_status(res, get_note_count_data_value, msg)

      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }


    } catch (error) {
      throw error
    }
  },

  add_card: async function (req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        name: req.body.name,
        card_number: req.body.card_number,
        expiry_year: req.body.expiry_year,
        expiry_month: req.body.expiry_month
      };
      const non_required = {};
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
        let add_user_card = await my_function.add_user_card(requestdata, check_auth)
        let msg = 'Card Added Successfully';
        add_user_card = {};
        jsonData.true_status(res, add_user_card, msg);
      } else {
        let msg = 'Invalid authorization key';
        jsonData.unauth_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },

  user_rating: async function (req, res) {
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
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
        let rating_user = await my_function.rating_user(requestdata, check_auth, req, res)
        // console.log(rating_user,"rating_user");return;
        if (rating_user != undefined) {

          // push notification provider --------------------
          var push_data ={}
          requestdata.provider_id= requestdata.userTo;
          var get_provider_data = await fun.get_provider_details_for_push(requestdata);
          push_data.token = get_provider_data.deviceToken;
          push_data.title = check_auth.dataValues.firstName + ' '+ check_auth.dataValues.lastName +  " Rate your work";
          push_data.code = 2;
          push_data.body = requestdata;
          if(get_provider_data.deviceType ==1){
            var send_push = await fun.AndroidPushNotification(push_data);
          }else{
            var send_push = await fun.IosPushNotification(push_data);
          }
// insert notification
          var notification_data ={}
          notification_data.userId =check_auth.dataValues.id
          notification_data.user2Id =get_provider_data.id
          notification_data.type =push_data.code 
          notification_data.message = push_data.title
          notification_data.orderId = 0
          notification_data.userType = 1
          notification_data.createdAt = await fun.create_time_stamp()
          notification_data.updatedAt = await fun.create_time_stamp()
          var create_notification = await fun.create_notification(notification_data);

          let msg = 'Thanks for rating';
          jsonData.true_status(res, rating_user, msg)
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
  user_ordertip: async function (req, res) {
    try {
      let required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        order_id: req.body.order_id
      }
      const non_required = {
        tip: req.body.tip
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
        let opdertip_user = await my_function.opdertip_user(requestdata, check_auth)



      }
    }
    catch (error) {
      throw error
    }
  },
  stripe_check: async function (req, res) {
    try {
      let required = {
        //security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        //order_id: req.body.order_id
      }
      const non_required = {
        type: req.body.type,
        title: req.body.title,
        price: req.body.price,
        cardid: req.body.cardid,
        // type: req.body.type,
        amount: req.body.amount,
        tip: req.body.tip,
        adminfees: req.body.adminfees,
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);

      let sender_batch_id = Math.random().toString(36).substring(9);
      console.log(sender_batch_id, "sender_batch_id")

      var create_payout_json = {
        "sender_batch_header": {
          "sender_batch_id": sender_batch_id,
          "email_subject": "You have a payment"
        },
        "items": [
          {
            "recipient_type": "EMAIL",
            "amount": {
              "value": 2,
              "currency": "USD"
            },
            "receiver": "cqlsys73@gmail.com",
            "note": "Thank you.",
            "sender_item_id": "item_1"
          },


        ]
      }


      await paypal.payout.create(create_payout_json, async function (error, payout) {
        // console.log(payout, '===========>payout');
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(payout, '===========>payout');
        }
      });

      //   console.log(customer.id,"afsd");return;

    } catch (error) {
      throw error
    }
  },

/********************   filter apis **************************/ 

  filter_search: async function (req, res) {
    try {
      let required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key
      }
      const non_required = {
        category_id: req.headers.category_id,  // coma sepret
        rating:req.headers.rating, // number
        distance:req.headers.distance, // miles
        state:req.headers.state, // string
        total_jobs:req.headers.total_jobs, // number
        search:req.headers.search // string

      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
          requestdata.user_id =check_auth.dataValues.id;
          requestdata.latitude =check_auth.dataValues.latitude;
          requestdata.longitude =check_auth.dataValues.longitude;
          var search_data = await my_function.filter_search(requestdata);
          let msg = 'Get Successfully';
          jsonData.true_status(res, search_data, msg)     
       }else{
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
       }
    }
    catch (error) {
      throw error
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

      let check_auth = await my_function.check_auth_key(requestdata);
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

      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
          requestdata.user_id =check_auth.dataValues.id;
          var get_type = await my_function.account_active_deactive(requestdata);
          let msg = (get_type.type==0) ? 'Account Deactivate Successfully' : 'Account Delete Successfully';
          jsonData.true_status(res, {}, msg)     
       }
    }
    catch (error) {
      throw error
    }
  },
  dispute: async function (req, res) {
    try {
      let required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        orderId: req.body.orderId,
        title: req.body.title,
        description: req.body.description
      }
      const non_required = {
       
      };
      let requestdata = await helper.vaildObject(required, non_required, res);

      let check_auth = await my_function.check_auth_key(requestdata);
      if (check_auth) {
        if (req.files && req.files.image) {
          file_data = await my_function.file_upload(req.files.image)
        }
          requestdata.userId =check_auth.dataValues.id;
          requestdata.image =file_data;
          var get_type = await my_function.user_dispute(requestdata);
          let msg ='Dispute Send  Successfully';
          jsonData.true_status(res, {}, msg)     
       }else{
        let msg = 'Invalid Authorization Key';
        jsonData.invalid_status(res, msg)
       }
    }
    catch (error) {
      throw error
    }
  },

  add_identity:async function(req,res){
    try{
      const required = {
        security_key: req.headers.security_key,
        auth_key: req.headers.auth_key,
        type: req.body.type,  // 0=cpf,1=licence
        api_type: req.body.api_type  // 0=add,1=edit
      };
      const non_required = {
        identity_id: req.body.identity_id
      };
      let requestdata = await helper.vaildObject(required, non_required, res);
      let check_auth = await my_function.check_auth_key(requestdata);
      if(check_auth){
        requestdata.userId = check_auth.dataValues.id
        if (req.files && req.files.frontImage) {
         var frontImage = req.files.frontImage
          requestdata.frontImage = await my_function.file_upload(frontImage)
        }
        if (req.files && req.files.backImage) {
         var image = req.files.backImage
          requestdata.backImage = await my_function.file_upload(image)
        }
        if(requestdata.api_type==0){
          var add_portfolio= await my_function.add_identity_user(requestdata)
        }else{
          var add_portfolio= await my_function.edit_identity_user(requestdata)
        }
      var msg = (requestdata.api_type==0) ? 'Identity Added Successfully' : 'Identity Edit Successfully';
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
      let check_auth = await my_function.check_auth_key(requestdata);
      if(check_auth){
        requestdata.providerId = check_auth.dataValues.id
      var add_portfolio= await my_function.delete_identity_user(requestdata)
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


}