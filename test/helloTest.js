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

  it("Should give 200 status when entered hello url.", function(done){
    //Calling rest api with email as a part of req body
    request(url)
      .get('api/v1/hello/')
      // end handles the response
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Check response
        res.status.should.be.equal(400);
        done();
      });
  });
});
