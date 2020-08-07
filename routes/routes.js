var apiToken = require('../security/apiToken');
var admin = require('../controller/AdminControl.js');
var user = require('../controller/UserControl.js');
var category = require('../controller/CategoryControl.js');
var provider = require('../controller/ProviderControl.js');
var provider_request = require('../controller/ProviderRequestControl.js');
var order = require('../controller/OrderControl.js');
var content = require('../controller/ContentControl.js');
var notification = require('../controller/NotificationControl.js');
var setting_admin = require('../controller/SettingAdminControl.js');
var invoice = require('../controller/InvoiceControl.js');
var withdrawal = require('../controller/WithdrawalControl.js');
var tips = require('../controller/tips_controller.js');
var userApis = require('../controller/userApisController.js');
var providerApis = require('../controller/providerApisController.js');
var subcategory = require('../controller/subCategoryControl.js');
var faqs = require('../controller/faqs_controller.js');


module.exports =function(app){
	// ================    login ===================
	app.route('/login').get(admin.login);

    app.route('/admin/login').post(admin.admin_login);
    
    app.route('/admin/dashboard').get(admin.admin_dashboard);

    app.route('/admin/get_count').get(admin.get_count);

    app.route('/logout').get(admin.logout);

    app.route('/admin/profile').get(admin.index);

    app.route('/admin/edit').get(admin.edit);

    app.route('/admin/edit-profile').post(admin.edit_profile);

    app.route('/admin/request-count').get(admin.count_request);

     app.route('/admin/clear-badge').post(admin.clear_badge);

     app.route('/forgot_password').get(admin.forgot_password);

     app.route('/forgot/Password').post(admin.admin_password_change);

     app.route('/api/url_id/:id').get(admin.url_id)
     
     app.route('/admin/reset_password').post(admin.reset_password)

     app.route('/change_password').get(admin.change_password)

     app.route('/change/password').post(admin.password_change)

    ////////for map
    
    app.route('/get_dashboard_count').get(admin.get_dashboard_count);
   
    


    //  ===================   user ==================

    app.route('/admin/users').get(user.index);

    app.route('/admin/add-user').get(user.add);

    app.route('/admin/add_user').post(user.add_user);

    app.route('/admin/delete_user').delete(user.user_delete);

    app.route('/admin/user_update_status').post(user.update_status);

    app.route('/admin/user_view').get(user.view);

    app.route('/admin/user-edit').get(user.edit);

    app.route('/admin/user_edit').post(user.user_edit);


    // ====================   category ====================

    app.route('/admin/category').get(category.index);

    app.route('/admin/add-category').get(category.add);

    app.route('/admin/add_category').post(category.add_category);

    app.route('/admin/delete_category').delete(category.category_delete);

    app.route('/admin/category_update_status').post(category.update_status);

    app.route('/admin/category_view').get(category.view);

    app.route('/admin/category-edit').get(category.edit);

    app.route('/admin/get-category').get(category.list);

    app.route('/admin/category_edit').post(category.category_edit);

    // ====================   subcategory ====================

    app.route('/admin/subcategory').get(subcategory.index);

    app.route('/admin/add-subcategory').get(subcategory.add);
    app.route('/admin/add_subcategory').post(subcategory.add_subcategory);
    app.route('/admin/delete_subcategory').delete(subcategory.subcategory_delete);
    app.route('/admin/subcategory-edit').get(subcategory.edit);
    app.route('/admin/subcategory_edit').post(subcategory.subcategory_edit);
    app.route('/admin/subcategory_view').get(subcategory.view);





    //  ===================   provider ============================



    app.route('/admin/provider').get(provider.index);

    app.route('/admin/add-provider').get(provider.add);

    app.route('/admin/add_provider').post(provider.add_provider);

    app.route('/admin/delete_provider').delete(provider.provider_delete);

    app.route('/admin/provider_update_status').post(provider.update_status);

    app.route('/admin/provider_view').get(provider.view);

    app.route('/admin/provider-edit').get(provider.edit);

    app.route('/admin/provider_edit').post(provider.provider_edit);

    app.route('/provider/profile/').get(provider.view_profile);


    


    //  ===================   provider request ============================

    app.route('/admin/provider-request').get(provider_request.index);
    app.route('/admin/provider-request_view').get(provider_request.view);
    app.route('/admin/provide-approve').post(provider_request.approve);
    app.route('/admin/delete_request').delete(provider_request.provider_request_delete);

    // ===================    orders ==========================

    app.route('/admin/orders').get(order.index);

    app.route('/admin/delete_order').delete(order.order_delete);

    app.route('/admin/order_view').get(order.view);

    app.route('/admin/complete-orders').get(order.complete_order);

    app.route('/admin/complete-order-view').get(order.complete_order_view);


    //  =======================   content ======================

    app.route('/admin/content').get(content.edit);

    app.route('/admin/content-edit').post(content.user_edit);

     //  ================= notification  ==================

    app.route('/admin/notification').get(notification.send_notification);

    app.route('/get_users').post(notification.allUser);

    app.route('/get_business').post(notification.get_business);

    app.route('/save_notiifcation').post(notification.save_notiifcation);

 //  =======================   Setting ======================

     app.route('/admin/setup').get(setting_admin.index);

     app.route('/admin/setting-edit').post(setting_admin.user_edit);


      //  =======================   Invoice ======================

    app.route('/admin/invoice').get(invoice.index);

    app.route('/admin/invoice-view').get(invoice.view);

    app.route('/admin/delete_invoice').delete(invoice.invoice_delete);

//  =========================  withdrawal ==============================
    app.route('/admin/withdrawal').get(withdrawal.index);

    app.route('/admin/reject').post(withdrawal.reject);
    app.route('/admin/pay_amount').post(withdrawal.pay_amount);
    app.route('/admin/payment_view').get(withdrawal.payment_view);

	
    ///////////////////// tip controlerr ////////////////////////   

     app.route('/admin/tip').get(tips.tips);
     app.route('/admin/add-tip').get(tips.add_tip);
     app.route('/admin/tip_add').post(tips.tip_add);
     app.route('/admin/tip_edit').get(tips.tip_edit);
     app.route('/admin/edit_tip').post(tips.edit_tip);
     app.route('/admin/delete_tip').delete(tips.delete_tip);

    /*****************  FAQs *************************/  

      app.route('/admin/faqs').get(faqs.faqs);
      app.route('/admin/add-faq').get(faqs.add_faq);
      app.route('/admin/faq_add').post(faqs.faq_add);
      app.route('/admin/faq_edit').get(faqs.faq_edit);
      app.route('/admin/edit_faq').post(faqs.edit_faq);
      app.route('/admin/delete_faq').delete(faqs.delete_faq);

     // user Apis Controller ///////////////////////////

     app.route('/apis/user_signup').post(userApis.userSignup);
     app.route('/apis/user_login').post(userApis.userLogin);
     app.route('/apis/user_social_login').post(userApis.social_login)
     app.route('/apis/user_get_profile').get(userApis.get_profile);
     app.route('/apis/user_logout').put(userApis.logout);
     app.route('/apis/user_change_password').put(userApis.change_password);
     app.route('/apis/user_forgot_password').post(userApis.forgot_password)
     app.route('/apis/url_id/:id').get(userApis.url_id)
     app.route('/user_data/api/reset_password').post(userApis.reset_password)
     app.route('/apis/user_edit_profile').put(userApis.edit_profile);
     app.route('/apis/user_get_categories').get(userApis.getCategories);
     app.route('/apis/user_get_sub_categories').get(userApis.get_sub_categories);
     app.route('/apis/all_content').get(userApis.all_content);
     app.route('/apis/user_get_favourite_list').get(userApis.get_favourite_list)
     app.route('/apis/user_add_to_fav_list').post(userApis.add_to_fav_list);
     app.route('/apis/user_provider_nearme').get(userApis.near_me_provider);
     app.route('/apis/user_get_provider_detail').get(userApis.get_provider_details);
     app.route('/apis/user_add_post').post(userApis.add_post);
     app.route('/apis/user_post_details').get(userApis.job_details);
     app.route('/apis/user_job_list').get(userApis.my_job_list);
     app.route('/apis/user_add_card').post(userApis.add_card);
     app.route('/apis/user_get_card').get(userApis.get_card);
     app.route('/apis/user_get_notifications').get(userApis.get_notifications)
     app.route('/apis/user_rate_provider').post(userApis.user_rating)
     app.route('/apis/user_accept_reject_bid').post(userApis.accept_reject);
     app.route('/apis/user_upload_post_images').post(userApis.upload_post_images)
     app.route('/apis/user_faqs').get(userApis.faqs);
     app.route('/apis/user_account_setting').post(userApis.account_setting);
     app.route('/apis/user_dispute').post(userApis.dispute);






/********************** is ready ************************/ 
     app.route('/apis/user_get_invoice').get(userApis.get_invoice)
     app.route('/apis/user_filter_search').get(userApis.filter_search);
     app.route('/apis/user_read_notification').get(userApis.read_notification);
     app.route('/apis/user_add_edit_identity').post(userApis.add_identity);
     app.route('/apis/user_delete_identity').delete(userApis.delete_identity);











     app.route('/apis/add_additional_work').post(userApis.add_additional_work)
     app.route('/apis/get_tips').get(userApis.get_tips)
     app.route('/apis/get_invoice').post(userApis.get_invoice)
      app.route('/apis/payment').post(userApis.payment)
    //  app.route('/apis/get_notifications').get(userApis.get_notifications)
    
      app.route('/apis/not_started_jobs').post(userApis.not_started_jobs);
      app.route('/apis/get_notification_count').get(userApis.get_notification_count);
   
      app.route('/apis/user_ordertip').post(userApis.user_ordertip)
      app.route('/apis/stripe_check').post(userApis.stripe_check)


    // ****************   provider Apis Controller ********************** 

     app.route('/apis/provider_signup').post(providerApis.provider_signup)
     app.route('/apis/provider_login').post(providerApis.provider_login)
     app.route('/apis/provider_logout').put(providerApis.logout);
     app.route('/apis/provider_change_password').put(providerApis.change_password);
     app.route('/apis/provider_forgot_password').post(providerApis.forgot_password)
     app.route('/apis/url_idd/:id').get(providerApis.url_id)
     app.route('/provider_data/api/reset_password').post(providerApis.reset_password);
     app.route('/apis/provider_social_login').post(providerApis.social_login);
     app.route('/apis/provider_my_jobs').get(providerApis.get_my_jobs);
     app.route('/apis/provider_availibility').put(providerApis.online_offline);
     app.route('/apis/provider_job_details').get(providerApis.job_details);
     app.route('/apis/provider_get_profile').get(providerApis.get_profile)
     app.route('/apis/provider_edit_profile').put(providerApis.edit_profile)
     app.route('/apis/provider_all_content').get(providerApis.all_content);
     app.route('/apis/provider_place_bid').post(providerApis.place_bid)
     app.route('/apis/provider_update_bid').put(providerApis.update_bid)
     app.route('/apis/provider_my_reviews').get(providerApis.my_reviews);
     app.route('/apis/provider_rate_user').post(providerApis.provider_rating);
     app.route('/apis/provider_get_categories').get(providerApis.getCategories);
     app.route('/apis/provider_job_history').get(providerApis.job_history);
     app.route('/apis/provider_notifications').get(providerApis.my_notifications);
     app.route('/apis/provider_start_job').post(providerApis.start_job);
     // portfolio
     app.route('/apis/provider_add_portfolio').post(providerApis.add_portfolio);
     app.route('/apis/provider_edit_portfolio').put(providerApis.edit_portfolio);
     app.route('/apis/provider_delete_portfolio').delete(providerApis.delete_portfolio);
     app.route('/apis/provider_get_portfolio').get(providerApis.get_portfolio);

      // Identity
      app.route('/apis/provider_add_identity').post(providerApis.add_identity);
      app.route('/apis/provider_edit_identity').put(providerApis.edit_identity);
      app.route('/apis/provider_delete_identity').delete(providerApis.delete_identity);
      app.route('/apis/provider_get_identity').get(providerApis.get_identity);

    //  language
    app.route('/apis/provider_add_language').post(providerApis.add_language);
    app.route('/apis/provider_edit_language').put(providerApis.edit_language);
    app.route('/apis/provider_delete_language').delete(providerApis.delete_language);
    app.route('/apis/provider_get_language').get(providerApis.get_language);

    // business hours
    app.route('/apis/provider_add_business_hours').post(providerApis.add_business_hours);
    app.route('/apis/provider_get_business_hours').get(providerApis.get_business_hours);

      // certificates
      app.route('/apis/provider_add_certificate').post(providerApis.add_certificate);
      app.route('/apis/provider_edit_certificate').put(providerApis.edit_certificate);
      app.route('/apis/provider_delete_certificate').delete(providerApis.delete_certificate);
      app.route('/apis/provider_get_certificate').get(providerApis.get_certificate);

      app.route('/apis/provider_map_list').get(providerApis.map_list);
      app.route('/apis/provider_read_notification').get(providerApis.read_notification);

    // filter search 
      app.route('/apis/provider_filter_search').get(providerApis.filter_search);

      // fav
      app.route('/apis/provider_get_favourite_list').get(providerApis.get_favourite_list)
      app.route('/apis/provider_add_to_fav_list').post(providerApis.add_to_fav_list);

      app.route('/apis/provider_account_setting').post(providerApis.account_setting);
      app.route('/apis/all_language').get(providerApis.all_language);
      app.route('/apis/provider_faqs').get(providerApis.Faq);
      app.route('/apis/send_verify_email').post(providerApis.verify_email);
      app.route('/apis/check_verify_email_otp').post(providerApis.verify_email_otp);
      app.route('/apis/check_email').post(providerApis.check_email); 
      app.route('/apis/support_setting').get(providerApis.admin_setting_Data); 
      app.route('/apis/education_add_edit').post(providerApis.education_add_edit); 
      app.route('/apis/experience_add_edit').post(providerApis.experience_add_edit); 
      app.route('/apis/delete_experience').delete(providerApis.delete_experience); 
      app.route('/apis/delete_education').delete(providerApis.delete_education); 































 
     app.route('/apis/get_notification_count').get(providerApis.get_notification_count)
     app.route('/apis/job_history_details').post(providerApis.job_history_details);
     app.route('/apis/get_chat').post(providerApis.get_chat);
     app.route('/apis/get_chat_list').post(providerApis.get_chat_list);
     app.route('/apis/add_paypal').post(providerApis.add_paypal);
}
