const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedcamps");

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
                image: `https://picsum.photos/800/500`, // Random image URL from Unsplash
                description: "Hey this is the cool image",
                price
            });
            await camp.save();
        }
        console.log("Seeded database successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);s
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
