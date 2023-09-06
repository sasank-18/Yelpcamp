if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
process.env.NODE_ENV= 'dev'
console.log('process.env:', process.env)
console.log('process.env:', process.env.NODE_ENV)



const express = require('express')
const app = express();
const path= require('path');
const mongoose= require('mongoose')
const ejsMate= require('ejs-mate')
const ExpressError= require('./utils/ExpressError')
const catchAync= require('./utils/catchAsync')
const {CampgroundSchema, reviewSchema} = require('./schemas.js')
// mongoose model 
const Campground= require('./models/campground')
const Review= require('./models/review')
const User= require('./models/user')
// for submitting form 
const methodOverride= require('method-override');
const catchAsync = ('./utils/catchAsync');
app.use(methodOverride('_method'))
const campgroundsRoutes= require('./routes/campgrounds');
const reviewsRoutes= require('./routes/reviews');
const usersRoutes= require('./routes/users');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const session= require('express-session')

// Authentication 
const passport= require('passport');
const localStrategy= require('passport-local')

const flash=require('connect-flash');
const user = require('./models/user');
const { Template } = require('ejs');
app.use(flash());

const dbUrl= process.env.DB_URL
// const dbUrl='mongodb://127.0.0.1:27017/yelp-camp';


//session for production
const MongoStore = require('connect-mongo');
//mongoose
main()
    .catch(err => console.log(err));
async function main() {
    try {
        // 'mongodb://127.0.0.1:27017/yelp-camp'
        await mongoose.connect(dbUrl,
        );
        console.log('mongo connection open')
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    }
    catch (e) {
        console.log(e)
        console.log("mongo errr  OH no Error !!!!")
    }
}
// for post body req 
app.use(express.urlencoded({ extended: true }))

// for ejs 
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');


const store=  MongoStore.create({
    mongoUrl: dbUrl,
    secret:'thishouldbeabettersecret',
    touchAfter: 24 * 60* 60 

})

store.on('error', function (e){
    console.log('Session Store Error', e)
})


// express-session 
// httpOnly is for extra security 
const sessionConfig= {
    store,
    secret:'thishouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
 


// Authentication 
app.use(passport.initialize());
app.use(passport.session());
// if your application uses persistent login session, passport.session()
// middleware must also be used;
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// res.locals is excess on every Template 
app.use((req,res,next)=>{
    // now every template have access to currentUser success and errorr 
     res.locals.currentUser= req.user;
    res.locals.success= req.flash('success')
    res.locals.error= req.flash('error')
    next();
  })



  app.use('/campgrounds', campgroundsRoutes);
  app.use('/campgrounds/:id/reviews', reviewsRoutes);
  app.use('/', usersRoutes);
  app.use(express.static('public'));


//   campground route 

app.get('/', async(req, res) => {
    const campgrounds= await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

app.get('/fakeUser', async(req, res)=>{
    const user= new User({email: 'coltt@gmail.com', username:'coltt'});
    const newUser= await User.register(user, 'chicken');
    res.send(newUser);
})




/// app.all method use for mapping global logic for specific path 
app.all('*', (req, res, next)=>{
   next(new ExpressError('page not Found' , 404));
});

app.use((err, req, res, next)=>{
const {statusCode=500}= err;
if(!err.message) err.message= 'Oh No, Something Went Wrong';
res.status(statusCode).render('error',{err});
});

app.listen(3000, () => {
    console.log('server on port 3000')
})



// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

// Usage
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
//MULTER Storage cloudinary is engine for cloudinary and multer to store the file in cloudinary and when 
// we have url back from cloudinary it add in router call back 

