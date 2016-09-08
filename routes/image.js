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

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png') {
         return cb(null, false, new Error('I don\'t have a clue!'));
       }
       cb(null, true);
     }
});

var Image = require('../models/Image');

router.get('/',function(req, res){
  var memes = Image.getUsersImages(res.locals.user._id, function(paths){
    res.locals.paths = paths;
    res.render('myimages');
  });
});


router.post('/uploadimage', upload.any(), function(req, res){
  // // var name = req.body.name;
  // // var email = req.body.email;
  // // var username = req.body.username;
  // // var password = req.body.password;
  // // var password2 = req.body.password2;
  // // var file = req.body.upload;
  // console.log(req.files);
  // console.log("FILES BITCH");
  //
  // //validation
  // // req.checkBody('name', 'Name is required').notEmpty();
  // // req.checkBody('email', 'Email is required').notEmpty();
  // // req.checkBody('email', 'Email is not valid').isEmail();
  // // req.checkBody('username', 'Username is required').notEmpty();
  // // req.checkBody('password', 'Password is required').notEmpty();
  // // req.checykBody('password2', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();
  var fileinvalid = false;
  console.log("meme");
  console.log("meme");
  console.log(req.files[0]);
  //
  // if((req.files[0].mimetype === "image/png") || (req.files[0].mimetype === "image/jpeg" || (req.files[0].mimetype === "image/gif"))) {
  //   console.log("validated the file");
  //   console.log("validated the file");
  //   fileinvalid = false;
  // }

  if(errors || !req.files[0]){
      res.redirect('/image');
  } else {
      var newImage = new Image ({
        path: req.files[0].path.replace(/public/g,''),
        imagetype: req.files[0].mimetype,
        artistid: res.locals.user._id
      });

      Image.createImage(newImage, function(err, user){
        if (err) throw err;
        console.log(user);
      });

      req.flash('success_msg', 'Your image uploaded successfully');
      res.redirect('/image').send(req.files);
  }
});




module.exports = router;
