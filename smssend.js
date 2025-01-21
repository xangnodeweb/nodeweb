const app = require("express").Router();
const axios = require("axios");
app.post("/sendsms", async (req, res) => {
    try {


        const body = req.body
        const phoneto = body.to;
        const phonecharge = body.charge;
        const contentmsg = body.content;
        console.log(body);
        if (!phoneto) {
            return res.status(400).json({ status: false, code: 1, message: "please enter phone send to sms." })
        }
   
        if (!contentmsg) {
            return res.status(400).json({ status: false, code: 2, message: "please enter content message send to sms." })
        }

        const reqsms = {
            "CMD": "SENDMSG",
            "FROM": "TEST",
            "TO": phoneto,
            "REPORT": "Y",
            "CHARGE": "8562052199062",
            "CODE": "45140377001",
            "CTYPE": "UTF8",
            "CONTENT": contentmsg
        }

        const data = await axios.post("http://10.30.6.26:10080", reqsms);
        console.log(data.data)
        if (data.status == 200) {
            return res.status(200).json({ status: true, code: 0, message: "send_sms_success", result: [data.data] })
        }

        return res.status(400).json({ status: false, code: 0, message: "cannot_send_sms" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: error });

    }

})

module.exports = app;