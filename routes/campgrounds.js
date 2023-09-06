const express= require('express');
const router= express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}= require('../middleware');
const {storage}= require('../cloudinary');

// multer is nodejs middleware for handling multipart/form-DataTransfer, which is primaryly used for uplaoding File. 
const multer  = require('multer');
const upload = multer({storage });


// for controller 
const campgrounds= require('../controllers/campgrounds')


// all campground route 
// router.get('/',catchAsync(campgrounds.index))

//new route to create new place
// order matter, keep the new router above of show router 
router.get('/new',isLoggedIn,catchAsync(campgrounds.newForm))



// Joi schema validation going to validate our data before we even
// attempt to save it with mongoose
router.post('/',isLoggedIn , upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))



// shows for particular camp 
router.get('/:id',catchAsync(campgrounds.showCampground))

// edit
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.editForm))

router.put('/:id',isLoggedIn,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete("/:id",isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;










