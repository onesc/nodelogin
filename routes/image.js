var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
        var imagetype = file.mimetype.replace(/[/]/g,".");
        cb(null, file.fieldname + '-' + Date.now() + imagetype);
  }
});
var upload = multer({ storage: storage });
var Image = require('../models/Image');

// Routes
router.get('/', function(req, res){
  res.render('image');
});



router.post('/uploadimage', upload.any(), function(req, res){
  // var name = req.body.name;
  // var email = req.body.email;
  // var username = req.body.username;
  // var password = req.body.password;
  // var password2 = req.body.password2;
  // var file = req.body.upload;
  console.log(req.files);
  console.log("FILES BITCH");

  //validation
  // req.checkBody('name', 'Name is required').notEmpty();
  // req.checkBody('email', 'Email is required').notEmpty();
  // req.checkBody('email', 'Email is not valid').isEmail();
  // req.checkBody('username', 'Username is required').notEmpty();
  // req.checkBody('password', 'Password is required').notEmpty();
  // req.checykBody('password2', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  if(errors){
      res.render('register', {
        errors: errors
      });
  } else {
      var newImage = new Image ({
        path: req.files[0].path,
        imagetype: req.files[0].mimetype
      });

      Image.createImage(newImage, function(err, user){
        if (err) throw err;
        console.log(user);
      });
      console.log(req.files);
      // res.send(req.files);
      req.flash('success_msg', 'Your image uploaded successfully');
      res.redirect('/image').send(req.files);
  }
});




module.exports = router;
