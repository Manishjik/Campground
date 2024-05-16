

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//ALL IMPORTS
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require("./models/reviews");
const Joi = require('joi');
const session = require("express-session")

const flash = require("connect-flash")
const helmet = require("helmet")
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');





const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');



// MONGODB CONNECTION
const db = mongoose.connect('mongodb+srv://manish:manish@cluster3.p3okkmq.mongodb.net/CampGround')
    .then(() => {
        console.log("Connected Database")
    })
    .catch((err) => {
        console.log(err);
    })




// EXPRESS CONNECT
const app = express();



// ALL SET USES
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
// EJS MATE SET
app.engine("ejs", ejsMate);
app.use(express.static('public'))
app.use(helmet({ contentSecurityPolicy: false }))


const sessionConfig = {
    secret: "thisshouldbeabettersecreat",
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true
        ,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)
app.use('/', userRoutes);






// HOME ROUTE
app.get("/", (req, res) => {
    res.render("home")

})







app.get("/fakeuser", async (req, res) => {
    const user = new User({ email: "maniasssadfh@gmail.com", username: "masssadddfnlk" })
    const newUser = await User.register(user, "manish")
    res.send(newUser)
})


// ERROR HANDLER
app.all("*", (req, res, next) => {
    next(new ExpressError("404", "Page not found"))
})

// ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render("error", { err });

});


app.listen(3000, (req, res) => {
    console.log("Started on port 3000");
})