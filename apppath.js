const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");
const smsfile = require("./smsfilesend")
const PORT = process.env.PORT || 8080;

app.use(express.json({limit : '40mb'}));
app.use(express.urlencoded({ limit : '40mb' , extended: true  }))
app.use(cors());
app.use("/image", express.static(path.join(__dirname, "image")));

app.use("/smsfile" , smsfile); // send file


app.get("/", async (req, res) => {
    try {

        return res.status(200).json("status : OK")
    } catch (error) {
        console.log(error)
    }

})

app.listen(PORT, () => {

    console.log("running is port : " + PORT);

})