const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use("/image", express.static(path.join(__dirname, "image")));

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