const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

const s3 = require("./s3");
const config = require("./config");

app.use(express.static("public"));
app.use(express.json());

//////////// get route ////////////
app.get("/images", (req, res) => {
    db.getImage()
        .then((result) => {
            console.log(
                "SOMETHING IS HAPPENING INSIDE getImageAndTitle",
                result
            );
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(
                "This something inside getImageAndTitle didn't work",
                err
            );
        });
});

//////////// post route ////////////
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("file: ", req.file);
    // console.log("input: ", req.body);
    db.addImage(
        req.body.title,
        req.body.username,
        req.body.description,
        config.s3Url + req.file.filename
    )
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("there was an error in addImage", err);
            res.sendStatus(500);
        });
});
app.listen(8080, () => console.log("IB server is listening"));
