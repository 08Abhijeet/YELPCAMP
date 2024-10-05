const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedcamps");
const { coordinates } = require('@maptiler/client');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await Campground.deleteMany({});

        for (let i = 0; i < 50; i++) {
            const randomCityIndex = Math.floor(Math.random() * cities.length);
            const price = Math.floor(Math.random() * 50) + 10;
            const camp = new Campground({
                author: '66f6aa4ba614c15bc75d0d6a',
                location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: "Hey this is the cool image",
                price,
                geometry:{
                    type:"Point",
                    coordinates:[-113.1331,47.0202]
                },
                image: [
                    {
                        url: 'https://res.cloudinary.com/dtsmrrabz/image/upload/v1728129602/Yelpcamp/ca7fxhdb1oibj3sjkefe.jpg',
                        filename: 'Yelpcamp/ca7fxhdb1oibj3sjkefe',
                        
                      },
                      {
                        url: 'https://res.cloudinary.com/dtsmrrabz/image/upload/v1728070346/Yelpcamp/b71voueq46pcoo0tplzg.jpg',
                        filename: 'Yelpcamp/b71voueq46pcoo0tplzg',
                        
                      }
                  ]
            });
            await camp.save();
        }
        console.log("Seeded database successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
