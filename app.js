if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");

const helmet = require("helmet");
const flash = require("connect-flash");

const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const campgrounds = require("./routes/campgrounds.js");

const passport = require("passport");
const localPassport = require("passport-local");
const review = require("./routes/reviews.js");
const User = require("./models/user.js");
const userRoute = require("./routes/users.js");

const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(error => {
  console.error("Error connecting to the database:", error);
});


const db = mongoose.connection;
db.once("open", () => {
  console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  helmet()
);
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dtsmrrabz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret:  process.env.SECRET || 'yourSecretKey'
  }
});

const secret= process.env.SECRET || "yourSecretKey"
store.on("error", function(e){
console.log("SESSION STORE ERROR", e)
})
app.use(
  session({
    store,
    secret, // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }, // Set to true if using HTTPS
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoute);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", review);

app.get("/", (req, res) => {
  res.render("landingpage");
});
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not FOUND", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "OH NO, Something went WRONG!!";
  res.status(statusCode).render("error", { err });
});
app.listen(4000, () => {
  console.log("Listening to the port 4000");
});
