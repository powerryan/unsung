const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        maxLength: 30,
        lowercase: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 40
    },
    password: {
        type: String,
        minLength: 4,
    },
    zipcode: {
        type: String,
        maxLength: 5,
        minLength: 5,
        default: "00000"
    },
    profilePhoto: {
        type: String,
        default: "",
    },
    channels: {
        type: [String],
    },
    subscriptions: {
        type: [String],
    }
},
{timestamps: true}
);

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
