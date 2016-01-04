/**
 * Created by muhammadmuhaimin on 2016-01-03.
 */
/**
 * Created by muhammadmuhaimin on 2016-01-03.
 */

var should = require('chai').should();
var assert = require('assert');
var request = require('supertest');

describe('Testing customer creation API', function(){
  var url = "http://localhost:8080/";
  before(function(done){
    //Anything that needed to be done before executing;
    done();
  });

  it("Should reject a customer with empty email address", function(done){
    var email = {'email':''};
    //Calling rest api with email as a part of req body
    request(url)
      .post('api/v1/customers/')
      .send(email)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid email address");
        done();
      });
  });

  it("Should reject a customer with an invalid email address", function(done){
    var email = {'email':'asj@s.c'};
    //Calling rest api with email as a part of req body
    request(url)
      .post('api/v1/customers/')
      .send(email)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid email address");
        done();
      });
  });

  //it("Should take a valid email", function(done){
  //  var email = {'email':'valid@email.com'};
  //  //Calling rest api with email as a part of req body
  //  request(url)
  //    .post('api/v1/customers/')
  //    .send(email)
  //    // end handles the response
  //    .end(function(err, res) {
  //      if (err) {
  //        throw err;
  //      }
  //      // Check response
  //      res.status.should.be.equal(201);
  //      done();
  //    });
  //});

  it("Should reject a customer who already registered", function(done){
    var email = {'email':'email@valid.com'};
    //Calling rest api with email as a part of req body
    request(url)
      .post('api/v1/customers/')
      .send(email)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Email already exist in database.");
        done();
      });
  });
});

