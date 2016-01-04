/**
 * Created by muhammadmuhaimin on 2016-01-01.
 */

// Packages
var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var mongoose   = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


// Configuration
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
var connection = mongoose.connect('mongodb://nodeapp:password@ds037195.mongolab.com:37195/heroku_ll6jsgr2'); // connect to our database
autoIncrement.initialize(connection);

var Customer = require('./app/models/customer')(autoIncrement);
var EmailService = require('./app/services/email')

//==== Router ====//
var router = express.Router();

router.use(function(req, res, next) {

  // log each request to the console
  //console.log(req);

  //Ideally this API should be a secure one and authentication could be done here
  //todo: Authenticate the user for using API
  next();
});


router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/customers')

  // create a customer
  .post(function(req, res) {
    var customer = new Customer();
    customer.email = req.body.email;
    customer.save(function(err, customer) {
      if (err){
        console.log(err);
        res.status(400);
        if(err.code === 11000){
          return res.send({ message: 'Email already exist in database.'});
        }
        if(err.name === "ValidationError"){
          return res.send({ message: 'Invalid email address'});
        }
        return res.send({ message: err });
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
      if (err)
        return res.send(err);
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
      console.log(customer);
      if (err)
        return res.send(err);
      if( customer === null ){
        res.status(404);
        return res.send({ message: "Ticket not found" });
      }
      if( (req.body.status).toUpperCase() === "READY"){
        customer.isReady = true;
        customer.save(function(err) {
          if (err) {
            return res.send(err);
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
  });

//Prefix our routes with api and then version
app.use('/api/v1', router);

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server started at http://%s:%s', host, port);
});