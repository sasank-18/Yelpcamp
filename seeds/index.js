
const mongoose= require('mongoose')
const cities= require('./cities')
const {places, descriptors} = require('./seedHelpers')
// mongoose model 
const Campground= require('../models/campground')
//mongoose
main()
    .catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log('mongo connection open')
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    } 
    catch (e) {
        console.log(e)
        console.log("mongo errr  OH no Error !!!!")
    }
}

const sample =(array)=>{
return  array[Math.floor(Math.random()*array.length)]
}

const seedDB= async ()=>{
  await Campground.deleteMany({});
  for(let i=0;i<50; i++){
    const price=Math.floor(Math.random() * 20)+10;
    const random1000=Math.floor(Math.random()*1000);
    const camp= new Campground({
        author:'6469f81cd99a841474f932f9',
        location:`${cities[random1000].city} , ${cities[random1000].state }`,
        title:`${sample(descriptors)}  ${sample(places)} `,
        description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis eligendi ducimus voluptatum quis et dolore voluptas quidem rem laboriosam similique dolores officia molestiae, repellat quae fuga aperiam illo saepe maxime?',
        price,
        image:  [
            {
              url: 'https://res.cloudinary.com/dlffx3hjz/image/upload/v1690211949/Yelpcamp/yyek7xgtzccqypy7h6hs.jpg',
              filename: 'Yelpcamp/yyek7xgtzccqypy7h6hs',
            },
            {
              url: 'https://res.cloudinary.com/dlffx3hjz/image/upload/v1690211949/Yelpcamp/wyontpoeaymahqyngv0c.jpg',
              filename: 'Yelpcamp/wyontpoeaymahqyngv0c',
            }
          ]
    })
    await camp.save();
  }
}
seedDB();
