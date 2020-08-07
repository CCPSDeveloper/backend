192.168.1.61:3079
1: event name :- connect_user
   lisner : - user_online
   parm:- type(0=user,1=provider)
        - id


 2:  event name :- send_message
        lisner : - body

        parm: 
        {
          "userId":67,
          "user2Id":122,
          "message":"hii",
          "user_name":"user",
          "user_image":"user.png",
          "user2_name":"provider",
          "user2_image":"provider.png",
          "msgType":0,
          "createdAt":1522078598,
          "type":0(0=sender is user,1=provider)
        }


        response: 

        {
          "id": 141,
          "userId": 67,
          "constantId": 1,
          "type": 0,
          "msgType": 0,
          "message": "hii",
          "user2Id": 122,
          "createdAt": 1522078598,
          "updatedAt": 0,
          "user_name": "user",
          "user_image": "user.png",
          "user2_name": "provider",
          "user2_image": "provider.png"
        }
        // parm:- type(0=sender is user,1=business)
        //     - userId
        //     - user2Id
        //     - message
        //     - user_name
        //     - user_image
        //     - user2_name
        //     - user2_image
        //     - msgType  // 0 for default msg and 1 for media msg,
        //     extension,
        //     createdAt
               

 3)  event name :- get_chat
    lisner : my_chat
    parm:            
    {
      "userId":67,
      "user2Id":122,
      "page":1,
      "limit":20
    }


            response: [
              {
                "id": 1,
                "userId": 67,
                "user2Id": 122,
                "message": "hii",
                "constantId": 2,
                "msg_type": 0,
                "type": 0,
                "createdAt": 1522078598,
                "user2_name": "Nisha",
                "user2_image": "user.png",
                "user_name": "chandan",
                "user_image": "860943ae-1f19-470b-8da6-3ee74f3da0b9.png"
              },
              {
                "id": 2,
                "userId": 122,
                "user2Id": 67,
                "message": "hii",
                "constantId": 2,
                "msg_type": 0,
                "type": 1,
                "createdAt": 1522078598,
                "user2_name": "chandan thakur",
                "user2_image": "860943ae-1f19-470b-8da6-3ee74f3da0b9.png",
                "user_name": "Nisha",
                "user_image": "user.png"
              }
            ]
 
 
 4)  event name:- get_chat_list
 lisner : get_list
   parm: 
   {
    "userId":67,
    "type":0(0=sender is user,1=provider)
    "page":1,
    "limit":20
  }


  response: 
  [
    {
      "id": 2,
      "lastMsgId": 2,
      "chat": {
        "id": 2,
        "userId": 122,
        "user2Id": 67,
        "message": "hii",
        "createdAt": 1522078598,
        "user": {
          "id": 122,
          "name": "Nisha Rani",
          "image": "user.png"
        }
      }
    }
  ]





5) 
method: create_post
listener: create_post_user

parm: 

{
       "userId":67,
       "description":"hiii",
       "location":"mohali",
       "latitude":"30.265987",
       "longitude":"70.326598",
       "date":"1522089752",
       "time":"1522078956",
       "selected_data":[{"category_id" : "18","subcategory" : [{"id": "1","price":"20"},{"id": "2","price":"30"}]}],
       "type":0,
       "provider_id":120,(if direct hire provider else 0)
       "startTime":2,
       "endTime":2,

       "startPrice":100,
       "endPrice":100,

       "state":"punjab",
       "zipCode":146001,
       "city":"mohali",
       "street":"street",
       "number":"number",
       "appartment":"appartment",
       "images":[
              "e285c3a4-9994-45b7-9f81-e594a793a74f.png",
              "19256bd2-218e-40bf-9bfb-62aa48475185.jpg",
              "326bf0e2-1a05-4cd7-8d2c-080d1f29eee6.jpg"
              ]
       
}
==================================================  response ================================

     response:{
       "message": "order created successfully",
       "data":{
       "id": 148,
       "date": "1522089752",
       "providerId": 120,
       "userId": 67,
       "description": "hiii",
       "location": "mohali",
       "status": 0,
       "time": "1522078956",
       "type": 0,
       "orderCategories": [
         {
           "id": 24,
           "categoryId": 18,
           "category": {
             "id": 18,
             "name": "Saloon",
             "image": "saloon.png"
           },
           "subCategory": [
             {
               "id": 1,
               "categoryId": 18,
               "subCategory": {
                 "id": 1,
                 "name": "Hair Cutting",
                 "image": "Short-Fade-Haircut.jpg"
               }
             },
             {
               "id": 2,
               "categoryId": 18,
               "subCategory": {
                 "id": 2,
                 "name": "Bathroom Cleaning",
                 "image": "bathroom.jpg"
               }
             },
             {
               "id": 49,
               "categoryId": 18,
               "subCategory": {
                 "id": 1,
                 "name": "Hair Cutting",
                 "image": "Short-Fade-Haircut.jpg"
               }
             },
             {
               "id": 50,
               "categoryId": 18,
               "subCategory": {
                 "id": 2,
                 "name": "Bathroom Cleaning",
                 "image": "bathroom.jpg"
               }
             }
           ]
         }
       ],
       "orderImages": [
         {
           "id": 47,
           "orderId": 148,
           "images": "e285c3a4-9994-45b7-9f81-e594a793a74f.png",
           "createdAt": "2020-05-31T13:31:57.000Z",
           "updatedAt": "2020-05-31T13:31:57.000Z"
         },
         {
           "id": 48,
           "orderId": 148,
           "images": "19256bd2-218e-40bf-9bfb-62aa48475185.jpg",
           "createdAt": "2020-05-31T13:31:57.000Z",
           "updatedAt": "2020-05-31T13:31:57.000Z"
         },
         {
           "id": 49,
           "orderId": 148,
           "images": "326bf0e2-1a05-4cd7-8d2c-080d1f29eee6.jpg",
           "createdAt": "2020-05-31T13:31:57.000Z",
           "updatedAt": "2020-05-31T13:31:57.000Z"
         }
       ],
       "bids": []
     }
}


------====-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-==    accept reject  =-=-=-=-=-=-=-=-=-=-=-===-==-=-==-===-=-=-==-=-==

Method : accept_reject_post
Listener: accept_reject

Parm: {
       "userId":67,
       "provider_id":"122",
       "order_id":"115",
       "type":1
     }


 Response: {
       "message": "Accept Successfully",
       "data": {
         "userId": 67,
         "provider_id": "122",
         "order_id": "115",
         "type": 1
       }
     }    
