/**
 * Created by muhammadmuhaimin on 2016-01-03.
 */

var postmark = require("postmark");
var client = new postmark.Client("e62e0446-1f02-4299-8d54-d3b88dcaa296");

module.exports = {
  sendReadyStatusMail: function( email, ticket ){
    client.sendEmail({
      "From": "9mrm@queensu.ca",
      "To": email,
      "Subject": "Ticket "+ticket+" is ready",
      "TextBody": "Dear Customer, your ticket "+ticket+" is ready for pickup."
    }, function(error, success){
      if(error) {
        console.error("Unable to send via postmark: " + error.message);
        return;
      }
    });
  }
};