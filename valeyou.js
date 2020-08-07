var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
/*var models=require('./models');*/
var fileUpload=require('express-fileupload');
var flash = require('connect-flash');
var app = express();
var nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var crypto=require('crypto');
 const sequelize=require('sequelize');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//session
var session = require('express-session');
app.use(session({secret: 'hellonodejs'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
var flash = require('connect-flash');
app.use(flash());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./routes/routes')(app);
require('./socket')(io);

app.set('views',path.join(__dirname,'view'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//module.exports = app;
// app.listen(4200, () => console.log('app listening on port 4200!'));
http.listen(4999, () => console.log('app listening on port 4999!'));



