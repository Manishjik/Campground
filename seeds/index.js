const mongoose = require("mongoose")
const cities = require("./cities")
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers")


// MONGODB CONNECTION
const db = mongoose.connect('mongodb+srv://manish:manish@cluster3.p3okkmq.mongodb.net/CampGround')
    .then(() => {
        console.log("Connected Database")
    })
    .catch((err) => {
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];
const seeds = async () => {

    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random = Math.floor(Math.random() * 200)
        const c = new Campground({
            author: "6644c4b1c342e9feeb064b37",
            location: `${cities[random].city} , ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            images: [


                {
                    url: 'https://res.cloudinary.com/drqpxweep/image/upload/v1715451443/YelpCamp/f41gn7rf6t0ushxscqiv.avif',
                    filename: 'YelpCamp/f41gn7rf6t0ushxscqiv',

                },
                {
                    url: 'https://res.cloudinary.com/drqpxweep/image/upload/v1715451443/YelpCamp/ec3qjnpy94yjzazk7udv.avif',
                    filename: 'YelpCamp/ec3qjnpy94yjzazk7udv',

                },

            ],



            description: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi earum, consequatur expedita quis odio perspiciatis voluptates esse fuga consequuntur voluptatem cumque voluptate corporis quidem? Esse nihil quia nam perspiciatis iusto?"



        })
        await c.save()



    }

}
seeds().then(() => {
    mongoose.connection.close()
})


