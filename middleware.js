const {CampgroundSchema} = require('./schemas.js')
const ExpressError= require('./utils/ExpressError')
const Campground= require('./models/campground.js')
const Review= require('./models/review')
const { reviewSchema} = require('./schemas.js')


module.exports.isLoggedIn= (req, res, next)=>{
    // req.isAuthenticated is method come in req body with passport builtin to whether user is signedin or not
    // When a user is successfully authenticated, Passport saves the user information, such as the user ID or user object, in the session or request context.  
    console.log('req user..', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        console.log(req.originalUrl)
        req.flash('error', 'You must be signed in');
       return res.redirect('/login');
    }
    next();
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCampground= (req, res, next)=>{
    console.log('validatecamp',req.body)
    const {error}= CampgroundSchema.validate(req.body)
    if(error){
        const msg= error.details.map((el)=>{
           return el.message;
        }).join(',')
       throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
  }


module.exports.isAuthor = async(req,res, next)=>{
    const {id}= req.params;
    const campground= await Campground.findById(id);
    if(!campground.author._id.equals(req.user._id)){
        req.flash('error', 'You do no have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }

 module.exports.isReviewAuthor = async(req,res, next)=>{
    const {id, reviewId}= req.params;
    const review= await Review.findById(reviewId);
    console.log(review)
    if(!req.user){
        req.flash('error', 'You do no have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }

 module.exports.validateReview= (req, res, next)=>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
       const msg= error.details.map((el)=>{
          return el.message;
       }).join(',')
      throw new ExpressError(msg, 400);
   }else{
       next();
   }
 }
















