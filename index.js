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
            // console.log(
            //     "SOMETHING IS HAPPENING INSIDE getImageAndTitle",
            //     result
            // );
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

//////// get Image for Modal ////////
app.get("/image/:image_id", (req, res) => {
    // console.log("INSIDE /image/:modal");
    // console.log("req.params.image_id :", req.params.image_id);
    db.getImageById(req.params.image_id)
        .then((result) => {
            // console.log("getImageById result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("ERR in getImageById", err);
        });
});

//////// add comment via Modal ////////
app.post("/comment", (req, res) => {
    const comment = req.body.comment;
    const username = req.body.username;
    const id = req.body.id;

    db.addComment(comment, username, id)
        .then((data) => {
            console.log("result in addComment", data);
            res.json(data.rows[0]);
        })
        .catch((err) => {
            console.log("err in adding comment", err);
        });
});

app.get("/comment/:image_id", (req, res) => {
    console.log("inside GET comment");
    db.getCommentById(req.params.image_id).then((result) => {
        console.log("result: ", result.rows);
        res.json(result.rows);
    });
});

//////////// get MORE images to load route ////////////
app.get("/moreImages/:highest_id", (req, res) => {
    console.log(" Hello FROM GET /images/:highest_id: ", req.params.highest_id);
    db.getMoreImages(req.params.highest_id)
        .then((result) => {
            console.log(
                "SOMETHING IS HAPPENING INSIDE getMoreImages: ",
                result.rows
            );
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("This something inside getMoreImages didn't work", err);
        });
});

//////////// DELETE IMAGE ////////////

app.post("/delete/:image_id", (req, res) => {
    // console.log("INSIDE delete SERVER", req.params.image_id, res);

    db.deleteAllComments(req.params.image_id)
        .then(
            db
                .deleteImageId(req.params.image_id)
                .then((result) => {
                    console.log(
                        "inside THEN of deleteImageId, result.rows: ",
                        result.rows
                    );
                    res.json();
                })
                .catch((err) => {
                    console.log("Inside catch err of deleteImageId", err);
                })
        )
        .catch((err) => {
            console.log("Inside catch err of deleteAllComments", err);
        });
});

//////////// DELETE COMMENTS ////////////

app.post("/deleteComments/:image_id", (req, res) => {
    // console.log("INSIDE delete SERVER", req.params.image_id, res);

    db.deleteAllComments(req.params.image_id)
        .then((result) => {
            console.log("INSIDE deleteAllComments result.rows: ", result);
            res.json();
        })
        .catch((err) => {
            console.log("Inside catch err of deleteAllComments", err);
        });
});

app.listen(8080, () => console.log("IB server is listening"));
