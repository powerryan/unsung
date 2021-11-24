const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const token = require("../middleware/authTokens");

//verify
router.get("/:id", token.verify, async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const {password, ...allelse} = user._doc;
            res.status(200).json(allelse);
        } catch(err) {
            res.status(500).json(err);
        }

});
// verify
router.put("/:id", token.verify, async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new:true});
            res.status(200).json(updatedUser);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("cannot update");
    }

});
// verify, have same route in auth
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        // if (req.body.password) {
        //     const salt = await bcrypt.genSalt(10);
        //     req.body.password = await bcrypt.hash(req.body.password, salt)
        // }
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted");
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("cannot delete");
    }

});

module.exports = router;
