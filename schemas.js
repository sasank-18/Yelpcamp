const Joi= require('joi')


const CampgroundSchema= Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        // image:Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required(),
    }).required(),
    deleteImage:Joi.array()
})

const reviewSchema= Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})

module.exports={CampgroundSchema, reviewSchema}

