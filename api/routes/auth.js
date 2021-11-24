const router = require("express").Router();
const User = require("../models/User");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const redis = require("redis");
const bodyParser = require("body-parser");
const token = require("../middleware/authTokens");
const app = express();
require('dotenv').config()
const redisClient = redis.createClient();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hash,
        });
        //const user = await User.register(newUser, req.body.password);
        const user = await newUser.save();
        const {password, ...allelse} = user._doc;
        res.status(200).json(allelse);
    } catch(err) {
        res.status(500).json(err);
    };

});

//let refreshTokens = []
router.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({username: req.body.username});

        if (!user) {
            res.status(400).json();
        } else {
            const validated = await bcrypt.compare(req.body.password, user.password);

            if (!validated) {
                res.status(400).json();
            } else {
                const accessToken = token.generateAccessToken(user);
                const refreshToken = token.generateRefreshToken(user);
                // add refreshtoken to db
                redisClient.set(refreshToken, 1);
                //refreshTokens.push(refreshToken);
                console.log("created redis pair");
                console.log(redisClient.get(refreshToken));
                const {password, ...allelse} = user._doc;
                allelse.accessToken = accessToken;
                allelse.refreshToken = refreshToken;
                res.status(200).json(
                allelse);
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.post("/refresh", (req, res)=>{
    const refreshToken = req.body.token;
    console.log(refreshToken);
    if (!refreshToken) {
        res.status(401).json("Not Authorized");
    }
    //need db because on server restart, list is emptied
    redisClient.get(refreshToken, function(err, response){
        console.log(response);
        if (!response) {
            res.status(403).json("Forbidden");
        }
    });
    // if (!refreshTokens.includes(refreshToken)) {
    //     return res.status(403).json("Forbidden");
    // }
    // var x = 0;
    // try{
    //     x = redisClient.get(refreshToken)
    //     }
    // } catch(err){
    //     return res.status(403).json("Forbidden");
    // }
    // if (!x){
    //     return res.status(403).json("Forbidden");
    // }
    jwt.verify(refreshToken, process.env.R_SECRET_KEY, (err, user) => {
        err && console.log(err);
        // delete from db
        redisClient.del(refreshToken);
        //refreshTokens = refreshTokens.filter((e) => e !== refreshToken);
        const newAccessToken = token.generateAccessToken(user);
        const newRefreshToken = token.generateRefreshToken(user);
        // add newrefreshtoken to db
        redisClient.set(newRefreshToken, 1);
        console.log("redis pair after deletion");
        console.log(redisClient.get(newRefreshToken));
        //refreshTokens.push(newRefreshToken);
        console.log("user",user);
        console.log("New access:", newAccessToken);
        console.log("New refresh:",newRefreshToken);
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
})

router.post("/logout", token.verify, (req, res)=> {
    //console.log(refreshTokens);
    const refreshToken = req.body.refreshToken;
    // delete refreshtoken from db



    redisClient.get(refreshToken, function(err, response){
        err && console.log(err);
    });
    redisClient.del(refreshToken, function(err, response) {
        err && console.log(err);
    });

    //refreshTokens = refreshTokens.filter((e)=> e !== refreshToken);
    res.status(200).json("Signed Off");
})

router.delete("/delete/:userId", token.verify,(req,res) =>{
    if (req.user.id === req.params.userId){
        res.status(200).json("User deleted");
    }
    else {
        res.status(403).json("User cannot be deleted");
    }
})

module.exports = router;
