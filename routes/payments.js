var express = require('express');
var router = express.Router();
var stripe = require("stripe")("");

// Get the credit card details submitted by the form


router.post('/', function(req, res){
  var token = req.body.stripeToken; // Using Express

  // Create a charge: this will charge the user's card
  var charge = stripe.charges.create({
    amount: 1000, // Amount in cents
    currency: "aud",
    source: token,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
    }
  });

  console.log(req);
});


module.exports = router;
