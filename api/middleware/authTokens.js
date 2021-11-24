const jwt = require("jsonwebtoken");
require('dotenv').config()
const express = require("express");
const verify = (req, res, next) => {
    //console.log(refreshTokens);
    console.log("verifying")

    const authHeader = req.headers.authorization;
    console.log("authheader: ",authHeader);

    if(authHeader){
        const token = authHeader.split(" ")[1];
        console.log("token: ",token);
        jwt.verify(token, process.env.SECRET_KEY, (err,user)=>{
            if(err){
                console.log("error: ",err)
                res.status(403).json("Forbidden");
            }
            req.user=user;
            next();
        })
    }
    else {
        res.status(401).json("Not Authorized");
    }
}

const generateAccessToken = (user)=>{
    return jwt.sign({id: user.id}, process.env.SECRET_KEY,
    { expiresIn: "30m"})
}
const generateRefreshToken = (user)=>{
    return jwt.sign({id: user.id}, process.env.R_SECRET_KEY)
}

exports.verify = verify;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
