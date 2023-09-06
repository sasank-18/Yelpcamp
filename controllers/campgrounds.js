
const { cloudinary } = require('../cloudinary')
const campground = require('../models/campground')
const Campground= require('../models/campground')
const Review= require('../models/review')

// // campground function 
// module.exports.index= async(req, res)=>{
//     const campgrounds= await Campground.find({})
//     res.render('campgrounds/index', {campgrounds})
// }

// create new campground func 
module.exports.newForm=async(req, res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground=async(req,res)=>{ 
   console.log(req.files)
    const addCampground= new Campground(req.body.campground)
    addCampground.image=  req.files.map(p=> ({url:p.path,filename: p.filename}))
    addCampground.author= req.user._id;
    await addCampground.save();
    console.log(addCampground)
    req.flash('success', 'successfully made a new campground')
    res.redirect(`/campgrounds/${addCampground._id}`)
}


// Show page for particular campgorund func 
module.exports.showCampground=async(req, res)=>{
    const {id}= req.params;
     const campgrounds= await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
 console.log('campgrounds', campgrounds)
     if(!campgrounds){
         req.flash('error', 'Cannot find that campground!!');
       return  res.redirect('/campgrounds')
     }
     res.render('campgrounds/show' , {campgrounds})
 }


// Edit campground function 
module.exports.editForm=async(req, res)=>{
    const {id}= req.params;
    const campgrounds= await Campground.findById(id)
    if(!campgrounds){
        req.flash('error', 'Cannot find that campground!!');
      return  res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campgrounds})
}

module.exports.updateCampground= async(req, res, next)=>{
    console.log(req.body)
    const {id}= req.params;
    const Editcampground= await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true})
    const imgs=req.files.map(p=> ({url:p.path,filename: p.filename}));
    console.log("imgs", imgs)
    Editcampground.image.push(...imgs); //spread operator : make every array an object here
   await Editcampground.save()
     if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
        await cloudinary.uploader.destroy(filename);
        }

      await Editcampground.updateOne({$pull:{image:{filename:{$in: req.body.deleteImage}}}})
      console.log(Editcampground);
     }
    req.flash('success', 'Successfully updated campgrounds' )
    res.redirect(`/campgrounds/${Editcampground._id}`)
}

module.exports.deleteCampground=async(req, res)=>{
    const {id}= req.params; 
    const deletecampground= await Campground.findByIdAndDelete(id).populate('reviews')
    for(let review of deletecampground.reviews){
         await Review.findByIdAndDelete(review._id);
    }
    req.flash('success', 'Successfully deleted campgrounds' )

    res.redirect(`/campgrounds`)
}






