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

  it("Should not give customer status upon giving an invalid ticket number", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .get('api/v1/customers/abc')
      .send()
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

  it("Should not give customer status upon giving an non existing ticket number", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .get('api/v1/customers/3')
      .send()
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

  it("Should get a customer status upon giving his ticket number", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .get('api/v1/customers/1')
      .send()
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(200);
        res.body.status.should.be.equal('NOT READY');
        done();
      });
  });

});
