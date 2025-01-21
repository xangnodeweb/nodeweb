const app = require("express").Router();
const axios = require("axios");
app.post("/sendsms", async (req, res) => {
    try {


        const body = req.body;
        const phoneto = req.body.to;
        const phonecharge = req.body.charge;
        const contentmsg = req.body.content;
        if (!phoneto) {
            return res.status(400).json({ status: false, code: 1, message: "please enter phone send to sms." })
        }
        if (!phonecharge) {
            return res.status(400).json({ status: false, code: 2, message: "please enter phone charge send to sms." })
        }
        if (!contentmsg) {
            return res.status(400).json({ status: false, code: 3, message: "please enter content message send to sms." })
        }

        const reqsms = {
            "CMD": "SENDMSG",
            "FROM": "Lao%2DTelecom",
            "TO": phoneto,
            "REPORT": "Y",
            "CHARGE": phonecharge,
            "CODE": "45140377001",
            "CTYPE": "TEXT",
            "CONTENT": contentmsg
        }

        const data = await axios.post("http://10:30.6.26:10080", reqsms);

        if(data.status == 200){

        }

        return res.status(400).json({status : false , code : 0 , message : "cannot_send_sms"});

    } catch (error) {
        console.log(error);
        return res.status(400).json({status : false , code : 0 , message : error});

    }

})

module.exports = app;