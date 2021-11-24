const router = require("express").Router();
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const token = require("../middleware/authTokens");
const express = require("express");
//verify
router.post("/", token.verify,async (req, res) => {
    //console.log("/post body",req.body)
    //const user = await User.findById(req.body.userid);
    console.log("creating new post")
    const newPost = await new Post(req.body.post);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (err) {
        console.log(err)
        console.log("ERROR ABOVE")
        res.status(500).json(err);
    }
})

router.post("/:anon" ,async (req, res) => {
    //console.log("/post body",req.body)
    //const user = await User.findById(req.body.userid);

    const newPost = await new Post(req.body.post);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (err) {
        console.log(err)
        console.log("ERROR ABOVE")
        res.status(500).json(err);
    }
})
//will need verify, but might not allow editing
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.title = req.body.title;
    post.body = req.body.body;
    if (req.body.userid && req.body.like) {
        const postvote = await Post.findById(req.params.id);
        if (!postvote.liked.includes(req.body.userid)){
            postvote.votes += req.body.like;
            postvote.liked.push(req.body.userid);
            try {
                const p = await Post.findByIdAndUpdate(req.params.id, {
                    $set: postvote,
                }, {new:true})
                res.status(200).json("voted");
            }
            catch (err) {
                res.status(400).json(err);
            }
        } else {
            res.status(200).json("already voted.");
        }
    }

    else if (post.userid == req.body.userid && (post.title || post.body)){
        try {
            const p = await Post.findByIdAndUpdate(req.params.id, {
                $set: post,
            }, {new:true})
            res.status(200).json("updated");
        }
        catch (err) {
            res.status(400).json(err);
        }
    }
    else {

    res.status(500).json("error");
}
})

router.get("/:id", async (req, res) => {
    if (req.params.id === "anonymous"){
        try {
            const post = await Post.find({userid:req.params.id});
            console.log(post)
            res.status(200).json(post);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        try {
            const post = await Post.findById(req.params.id);
            console.log(post)
            res.status(200).json(post);
        } catch(err) {
            res.status(500).json(err);
        }
    }
});

router.get("/", async (req, res) => {
    const channel = req.query.channel;
    const subchannel = req.query.subchannel;
    const zipcode = req.query.zipcode;
    const subscription = req.query.subscription;
    try {
        let posts;
        if (channel && typeof(channel) === 'object') {
            posts = await Post.find({channel:{
                $in:channel
            }}).sort({votes: -1, createdAt: -1}).exec();
        } else if (channel) {
            posts = await Post.find({channel:{
                $in:[channel]
            }}).sort({votes: -1, createdAt: -1}).exec();
        } else if (subchannel) {
            posts = await Post.find({subchannel:{
                $in:[subchannel]
            }}).sort({votes: -1, createdAt: -1}).exec();
        } else if (zipcode) {
            posts = await Post.find({zipcode:{
                $in:[zipcode]
            }}).sort({votes: -1, createdAt: -1}).exec();
        } else if (subscription) {
            posts = await Post.find({userid:{
                $in:subscription
            }}).sort({votes: -1, createdAt: -1}).exec();
        } else {
            console.log("getting posts")
            posts = await Post.find().sort({votes: -1, createdAt: -1}).exec();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});
//will need verify, but might not allow deletion
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userid == req.body.userid){
            await post.delete();
            res.status(200).json("deleted");
        }
        else {
            res.status(401).json(err);
        }
        } catch(err) {
            res.status(500).json(err);
        }
});

module.exports = router;
