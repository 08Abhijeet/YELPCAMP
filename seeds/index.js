const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors,places} = require("./seedcamps");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await Campground.deleteMany({});

        for (let i = 0; i < 50; i++) {
            const randomCityIndex = Math.floor(Math.random() * cities.length);
            const camp = new Campground({
                location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
                title: `${sample(descriptors)} ${sample(places)}`
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
