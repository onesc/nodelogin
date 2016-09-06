
var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
        var imagetype = file.mimetype.replace(/[/]/g,".");
        cb(null, file.fieldname + '-' + Date.now() + imagetype);
        console.log("memes");
        console.log(file);
        console.log("memes");
  }
});
var upload = multer({ storage: storage });



//
//
// var upload = multer({dest: 'public/uploads/'});

var Image = require('../models/Image');



router.get('/', function(req, res){
  res.render('image');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}


router.post('/uploadimage', upload.any(), function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var file = req.body.upload;

  //validation
  // req.checkBody('name', 'Name is required').notEmpty();
  // req.checkBody('email', 'Email is required').notEmpty();
  // req.checkBody('email', 'Email is not valid').isEmail();
  // req.checkBody('username', 'Username is required').notEmpty();
  // req.checkBody('password', 'Password is required').notEmpty();
  // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  if(errors){
      res.render('register', {
        errors: errors
      });
  } else {
      var newUser = new Image ({
        path: req.files[0].path,
        imagetype: req.files[0].mimetype
      });

      Image.createImage(newUser, function(err, user){
        if (err) throw err;
        console.log(user);
      });
      console.log(req.files);
      // res.send(req.files);
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/users/login').send(req.files);
  }
});




module.exports = router;
