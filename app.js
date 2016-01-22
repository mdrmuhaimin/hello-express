/**
 * Created by muhammadmuhaimin on 2016-01-01.
 */

// Packages
var express =  require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');

// Configuration
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
//database credential shared here just for demonstration in an ideally only env variable should be used
var dbUrl = process.env.MONGOLAB_URI || 'mongodb://nodeapp:password@ds037195.mongolab.com:37195/heroku_ll6jsgr2';
var connection = mongoose.connect(dbUrl);
autoIncrement.initialize(connection);

var Customer = require('./app/models/customer')(autoIncrement);
var EmailService = require('./app/services/email')

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
    return res.send({ status: "Active" });
  });

router.route('/customers')

  // create a customer
  .post(function(req, res) {
    var customer = new Customer();
    customer.email = req.body.email;
    customer.save(function(err, customer) {
      if (err){
        res.err = err;
        res.status(400);
        if(err.code === 11000){
          return res.send({ message: 'Email already exist in database.'});
        }
        if(err.name === "ValidationError"){
          return res.send({ message: 'Invalid email address'});
        }
        res.status(500);
        return res.send({ message: "Sorry! An unexpected error occured while creating ticket." });
      }
      res.status(201);
      return res.send({ ticket: customer.ticketNum });
    });
  });

router.route('/customers/:customer_ticket')

  .get(function(req, res) {
    req.params.customer_ticket = parseInt(req.params.customer_ticket, 10);
    if(!Number.isInteger(req.params.customer_ticket)){
      res.status(400);
      return res.send({ message: "Ticket should be an integer." });
    }
    Customer.findOne({ticketNum: req.params.customer_ticket}, function(err, customer) {
      if (err){
        res.err = err;
        res.status(500);
        return res.send({ message: "Sorry! An unexpected error occured while looking for ticket with number "+ticketNum });
      }
      if( customer === null ){
        res.status(404);
        return res.send({ message: "Ticket not found" });
      }
      if(customer.isReady){
        return res.json({ status: "READY" });
      }
      return res.json({ status: "NOT READY" });
    });
  })

  .put(function(req, res) {
    req.params.customer_ticket = parseInt(req.params.customer_ticket, 10);
    if(!Number.isInteger(req.params.customer_ticket)){
      res.status(400);
      return res.send({ message: "Ticket should be an integer." });
    }
    Customer.findOne({ticketNum: req.params.customer_ticket}, function(err, customer) {
      if (err){
        res.err = err;
        res.status(500);
        return res.send({ message: "Sorry! An unexpected error occured while looking for ticket with number "+ticketNum });
      }
      if( customer === null ){
        res.status(404);
        return res.send({ message: "Ticket not found" });
      }
      if( (req.body.status).toUpperCase() === "READY"){
        customer.isReady = true;
        customer.save(function(err) {
          if (err){
            res.err = err;
            res.status(500);
            return res.send({ message: "Sorry! An unexpected error occured while updating ticket with number "+ticketNum });
          }
          res.status(204);
          res.send();
        });
        EmailService.sendReadyStatusMail(customer.email, customer.ticketNum );
      }
      else{
        res.status(400);
        res.send({message: "Invalid Customer Status"});
      }
    });
  })
  .delete(function(req, res) {
    req.params.customer_ticket = parseInt(req.params.customer_ticket, 10);
    if(!Number.isInteger(req.params.customer_ticket)){
      res.err = "Non integer ticket";
      res.status(400);
      return res.send({ message: "Ticket should be an integer." });
    }
    Customer.findOneAndRemove({
      ticketNum: req.params.customer_ticket
    }, function(err, customer) {
      if (err){
        res.err = err;
        res.status(500);
        return res.send({ message: "Sorry! An unexpected error occured while updating ticket with number "+ticketNum });
      }
      res.status(204);
      res.send();
    });
  });

//Prefix our routes with api and then version
app.use('/api/v1', router);

var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Server started at port '+port);
});