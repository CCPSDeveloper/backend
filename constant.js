let base_path = __dirname;
base_path = base_path.replace('config', '');

module.exports = {
  'database': {
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
  },
  'upload_path': base_path + 'public/',
   //'url_path': 'http://localhost:3050',
  'url_path': 'http://3.17.254.50:3050',
 /// 'image_url': 'http://localhost/honeydo/public/images/',
  'mail_auth' : {
    service: 'gmail',
    auth: {
      user: 'test978056@gmail.com',
      pass: 'cqlsys123'
    }
  }
}