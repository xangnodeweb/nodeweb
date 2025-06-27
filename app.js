const express = require("express");

const path = require("path");
const app = express();

const cors = require("cors");

const apirouter = require("./controllerapi");
const apichangerouter = require("./controllerchangeapi");
const apisms = require("./smssend");
const apiuser = require("./user/controlleruser");
const apisubscriber = require("./subscriber")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


app.use(express.static("dist"));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname + "/dist/index.html"))
});
app.use("/api", apirouter);
app.use("/apichangemain", apichangerouter);
app.use("/apisms", apisms);
app.use("/user", apiuser);
app.use("/subscriber" , apisubscriber);
// app.use("/image" , express.static(path.join(__dirname , "image")))

app.listen(PORT, () => {
    console.log("running app is port on : " + PORT)
})

