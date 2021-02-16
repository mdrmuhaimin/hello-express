/**
 * Created by muhammadmuhaimin on 2016-01-01.
 */

// Packages
var express =  require('express');
var bodyParser = require('body-parser');

var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');

// Configuration
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || 8080;        // set our port

// Logging
var logDirectory = __dirname + '/logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/error-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
});

// setup the logger
morgan.token('err', function(req, res){
  var err = res.err;
  delete res.err;
  return err;
});
app.use(morgan(':date :method :url :status :err', {
  skip: function (req, res) { return res.statusCode < 400 },
  stream: accessLogStream
}));


//==== Router ====//
var router = express.Router();

router.use(function(req, res, next) {

  //Ideally this API should be a secure one and authentication could be done here
  //todo: Authenticate the user for using API
  next();
});

router.route('/tests')
  .get(function(req, res){
    res.status(200);
    return res.send({ status: "Green" });
  });

  router.route('/hello')
    .get(function(req, res){
      res.status(200);
      return res.send({ status: "canon" });
    });

//Prefix our routes with api and then version
app.use('/api/v1', router);

var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Server started at port '+port);
});
