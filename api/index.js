const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const channelsRoute = require("./routes/channels");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images")));
app.use(cors());
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to db"));

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({storage:storage});

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Uploaded");
});

app.use("/api/auth", authRoute);

app.use("/api/users", usersRoute);

app.use("/api/posts", postsRoute);

app.use("/api/channels", channelsRoute);

app.listen("5000", () => {
    console.log("Server started");
})
