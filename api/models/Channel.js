const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Channel", ChannelSchema);
