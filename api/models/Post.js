const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    channel: {
        type: String,
    },
    subchannel: {
        type: String,
    },
    userid: {
        type: String,
    },
    zipcode: {
        type: String,
    },
    votes: {
        type: Number,
        default: 0,
    },
    liked: {
        type: [String],
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);
