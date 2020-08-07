module.exports= {

 single_image_upload:function(data,folder) {
 	 let image = data;  
	            image.mv(process.cwd()+'/public/'+folder+'/'+image.name, function(err) {    
	              if (err) {     
                   return res.status(500).send(err);   
                 }
           
	        });
	    return image.name;
	           
}

}