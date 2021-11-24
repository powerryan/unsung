const router = require("express").Router();
const Channel = require("../models/Channel");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
    const newChannel = new Channel(req.body);
    try {
        const save = await newChannel.save();
        res.status(200).json(save);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id", async (req, res) => {
        try {
            const channel = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch(err) {
            res.status(500).json(err);
        }
});

router.get("/", async (req, res) => {
    try {
        const channels = await Channel.find();
        res.status(200).json(channels);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
