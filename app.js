/**
 * Created by muhammadmuhaimin on 2016-01-01.
 */

// Packages
var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");

// Configuration
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();

router.use(function(req, res, next) {

  // log each request to the console
  console.log(req.method, req.url);

  //Ideally this API should be a secure one and authentication could be done here

  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);


//app.get('/', function (req, res) {
//  res.send('Hello World!');
//});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server started at http://%s:%s', host, port);
});