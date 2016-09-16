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

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

function ensureAdministrator(req, res, next){
  if(req.isAuthenticated()){
    if (req.user.admin === true){
      return next();
    } else {
      req.flash('error_msg', 'You are not allowed to see that bro');
      res.redirect('/');
    }
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}





var Painting = require('../models/Painting');

router.get('/',function(req, res){
  ensureAdministrator(req, res, function(){
    var memes = Painting.getPaintings(function(paintings){
      res.locals.paintings = paintings;
      res.render('paintingindex');
    });
  });
});


router.get('/upload',function(req, res){
  ensureAdministrator(req, res, function(){
    res.render('uploadpainting');
  });
});



router.post('/delete', function(req, res){
  ensureAdministrator(req, res, function(){
    if (req.body.delete === "true") {
      console.log("tried to delete");
      Painting.deletePainting(req.body.id, function(){
          res.redirect('/paintings');
      });
    }
  });
});

router.get('/:id', function(req, res){
  ensureAdministrator(req, res, function(){
    var painting = Painting.getPainting(req.params.id, function(image){
      res.locals.painting = image[0];
      console.log(image);
      res.render('editpainting');
    });

  });
});

router.post('/edit', upload.any(), function(req, res){
  ensureAdministrator(req, res, function(){

    var title = req.body.title;
    var price = req.body.price;
    var stocked = req.body.stocked;
    var description = req.body.description;
    var file = req.body.upload;
    var id = req.body.id;
    var errors = req.validationErrors();
    if(errors){
          res.redirect('/upload');
      } else {
          paintingParams = {title: title, price: price, description: description};

          Painting.updatePainting(id, paintingParams, function(err, painting){
            if (err) throw err;
            // console.log(painting);
          });
          req.flash('success_msg', 'You successfully edited the image');
          res.redirect('/paintings/' + id);
    }

  });
});

router.post('/upload', upload.any(), function(req, res){
  ensureAdministrator(req, res, function(){
    var title = req.body.title;
    var price = req.body.price;
    var stocked = req.body.stocked;
    var description = req.body.description;
    var file = req.body.upload;
    var errors = req.validationErrors();

    if(errors){
          res.redirect('/upload');
      } else {
          var newPainting = new Painting ({
            imagepath: req.files[0].path.replace(/public/g,''),
            title: title,
            description: description,
            price: price
          });

          Painting.createPainting(newPainting, function(err, user){
            if (err) throw err;
            console.log(user);
          });

          req.flash('success_msg', 'Your image uploaded successfully');
          res.redirect('/paintings').send(req.files);
    }

    res.send("ayy" + req.files);
  });
});




module.exports = router;
