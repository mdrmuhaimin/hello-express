/**
 * Created by muhammadmuhaimin on 2016-01-03.
 */
/**
 * Created by muhammadmuhaimin on 2016-01-03.
 */

var should = require('chai').should();
var assert = require('assert');
var request = require('supertest');

describe('Testing customer status retrieval API', function(){
  var url = "http://localhost:8080/";
  before(function(done){
    //Anything that needed to be done before executing;
    done();
  });
  var status = {status : 'invalid'};
  it("Should not update customer status upon giving an invalid ticket number", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .put('api/v1/customers/abc')
      .send(status)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        res.body.message.should.be.equal('Ticket should be an integer.');
        done();
      });
  });

  it("Should not update customer status upon giving an non existing ticket number", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .put('api/v1/customers/3')
      .send(status)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(404);
        res.body.message.should.be.equal('Ticket not found');
        done();
      });
  });

  it("Should not update a customer status upon giving an invalid status", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .put('api/v1/customers/1')
      .send(status)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        res.body.message.should.be.equal('Invalid Customer Status');
        done();
      });
  });

  it("Should update a customer status upon giving a valid status", function(done){
    //Calling rest api with email as a part of req body
    status = {status : "ready"}
    request(url)
      .put('api/v1/customers/10')
      .send(status)
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(204);
        done();
      });
  });

});
