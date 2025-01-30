const app = require("express").Router();
const axios = require("axios");

const { bodyaddpackage } = require("./modelbody");
const fetch = require("node-fetch");
const { parseString } = require("xml2js")

const fs = require("fs/promises");
const path = require("path");
const { chownSync } = require("fs");


app.post("/sendsms", async (req, res) => {
    try {

        const body = req.body
        const phoneto = body.to;
        const phonecharge = body.charge;
        const contentmsg = body.content;
        const header = req.body.header;
        if (!phoneto) {
            return res.status(400).json({ status: false, code: 1, message: "please enter phone send to sms." })
        }
        if (!contentmsg) {
            return res.status(400).json({ status: false, code: 2, message: "please enter content message send to sms." })
        }

        const reqsms = {
            "CMD": "SENDMSG",
            "FROM": header,
            // "FROM": "Lao%2DTelecom",
            "TO": phoneto,
            "REPORT": "Y",
            "CHARGE": "8562052199062",
            "CODE": "45140377001",
            "CTYPE": "UTF-8",
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
});

app.post("/addpackagesms", async (req, res) => {  // add package send sms model
    try {

        const body = req.body;
        const reqaddpackage = bodyaddpackage(); // body request add package

        let model = [];
        let modelInfo = [];
        if (body.length > 0) {
            console.log(body);

            for (var i = 0; i < body.length; i++) {



                console.log(body[i])
                body[i].packagename = "Package Promotion 3GB 24hrs"
                const bodyaddpackages = await bodyaddpackage(body[i].phone, body[i].packagename, body[i].starttime, body[i].expiretime, body[i].refillstoptime); // body request add package

                console.log(bodyaddpackages)


                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }


                await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                    method: "POST",
                    headers: headers,
                    body: bodyaddpackages
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    const modeldata = responseText;
                    // console.log(modeldata)

                    parseString(modeldata, async function (err, result) {
                        let data = JSON.stringify(result);
                        const datas = JSON.parse(data);

                        model.push(datas['soap:Envelope']['soap:Body'])
                        const responsesuccess = datas['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0]; // operation status
                        const countersuccess = datas['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo']; // counterinfo data
                        console.log(responsesuccess)
                        if (responsesuccess.IsSuccess[0] == 'true') {
                            let data = {};
                            if (countersuccess.length > 0) {
                                for (var ii = 0; ii < countersuccess.length; ii++) {
                                    data = { Msisdn: countersuccess[ii].Msisdn[0], ProductNumber: countersuccess[ii].ProductNumber[0], CounterName: countersuccess[ii].CounterName[0], StartTime: countersuccess[ii].StartTime[0], ExpiryTime: countersuccess[ii].ExpiryTime[0], status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0], statussms: false };

                                }
                            }

                            const sendsmss = await sendsmsaddpackage(body[i])
                            if (sendsmss == true) {
                                data.statussms = true
                                console.log("status : ")
                                console.log(data)
                                modelInfo.push(data)
                            } else {
                                modelInfo.push(data)
                            }
                            console.log(sendsmss)
                            console.log(modelInfo)
                        } else {
                            const data = { Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0] , statussms :false };
                            modelInfo.push(data)
                        }
                    });

                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            const data = { Msisdn: body[0].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", status: false, code: 2, message: "cannot add package ConnectTimeoutError" , statussms : false};
                            modelInfo.push(data);
                        }
                    }
                });
                const index = modelInfo.findIndex(x => x.status == false && x.code == 2);
                if (index != -1) { // break for then timeout 
                    break;
                }
            }
            const indexresponse = modelInfo.filter(x => x.status == false && x.code == 2);
            if (indexresponse.length == 0) { // check response have timeout
                return res.status(200).json({ status: true, code: 0, message: "add package success", result: modelInfo })
            } else {
                const status = indexresponse.length == 0 ? 1 : 2;
                const message = indexresponse.length > 0 ? "cannot add package data ConnectionTimeOutError" : "cannot add package data";
                return res.status(400).json({ status: false, code: status, message: message, result: modelInfo });
            }
        }

        return res.status(400).json({ status: true, code: 0, message: 'cannot add package', result: null });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot add package", result: null })
    }
});




app.post("/getpackagename", async (req, res) => {

    try {

        const bosdy = req.body;

        const paths = path.join(__dirname, "./filedatatxt/packagename.txt");

        const filedata = await fs.readFile(paths, "utf8");
        let model = [];

        if (filedata.length < 15) {


            return;
        }

        const datafile = filedata.split(/\r?\n/);

        console.log(datafile);


        return res.status(200).json({ status: true, code: 0, message: "", result: datafile });

    } catch (error) {
        console.log(error);
    }
})



const sendsmsaddpackage = async (datas) => {
    try {

        console.log(datas)

        const reqsms = {
            "CMD": "SENDMSG",
            "FROM": datas.headermsg,
            // "FROM": "Lao%2DTelecom",
            "TO": datas.phone,
            "REPORT": "Y",
            "CHARGE": "8562052199062",
            "CODE": "45140377001",
            "CTYPE": "UTF-8",
            "CONTENT": datas.content
        }
        console.log("request sms : ")
        console.log(reqsms);

        // return reqsms;
        const data = await axios.post("http://10.30.6.26:10080", reqsms);
        console.log(data.data)
        if (data.status == 200) {

                if (data.data.resultCode == "20000") {
                    console.log(data.data)
                    return true;
             
            }
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = app;