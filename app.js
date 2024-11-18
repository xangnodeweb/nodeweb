const express = require("express");

const path = require("path");
const app = express();

const cors = require("cors");
// const https = require("https");
// const fs = require("fs");

const apirouter = require("./controllerapi");
const apichangerouter = require("./controllerchangeapi");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const PORTS = process.env.PORT_APP || 3001;

app.use(express.static("dist"));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname + "/dist/index.html"))
});
app.use("/api", apirouter);
app.use("/apichangemain", apichangerouter);
// app.use("/image" , express.static(path.join(__dirname , "image")))

app.listen(PORT, () => {
    console.log("running app is port on : " + PORT)
})

// const options = {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.cert")
// }

// https.createServer(options, app).listen(PORTS, () => {
//     console.log("running is port : " + PORTS);
// });