const express = require("express");
const app = express();
const db = require("./db.js");

// very simple server
app.use(express.static("public"));

// cities ONLY for DEMO purpose
// let cities = [
//     {
//         name: "Berlin",
//         country: "Deutschland",
//     },
//     {
//         name: "Kopenhagen",
//         country: "Danmark",
//     },
//     {
//         name: "Oslo",
//         country: "Norway",
//     },
// ];

// this is how get -> render works here!
app.get("/images", (req, res) => {
    db.getImageAndTitle()
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

app.listen(8080, () => console.log("IB server is listening"));
