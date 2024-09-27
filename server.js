var express = require('express');

var User = require('./routes/user');
var cors = require('cors');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var app = express();
app.use(cors());

// body parser mw
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb",extended: false, parameterLimit:52428800}));

app.use(function(_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');

   /*  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); */
    next();
});

app.use('/', User);

app.listen(port, function(){
    console.log('Server started on port '+port);
})