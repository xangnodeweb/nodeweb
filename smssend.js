const app = require("express").Router();
const axios = require("axios");

const { bodyaddpackage, bodymodiefieldhours, bodyinquery } = require("./modelbody");
const fetch = require("node-fetch");
const { parseString } = require("xml2js")

const fs = require("fs/promises");
const path = require("path");
const { chownSync } = require("fs");
const { response } = require("express");
const { JavascriptModulesPlugin } = require("webpack");


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

                        if (responsesuccess.IsSuccess[0] == 'true') {

                            if (countersuccess.length > 0) {
                                console.log(countersuccess)
                                for (var ii = 0; ii < countersuccess.length; ii++) {

                                    const data = { Msisdn: countersuccess[ii].Msisdn[0], ProductNumber: countersuccess[ii].ProductNumber[0], CounterName: countersuccess[ii].CounterName[0], StartTime: countersuccess[ii].StartTime[0], ExpiryTime: countersuccess[ii].ExpiryTime[0], status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0], statussms: false };
                                    modelInfo.push(data)
                                }
                                const sendsmss = await sendsmsaddpackage(body[i])
                                console.log(sendsmss)
                            }

                        } else {
                            const data = { Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0], statussms: false };
                            modelInfo.push(data)
                        }
                    });

                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            const data = { Msisdn: body[0].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", status: false, code: 2, message: "cannot add package ConnectTimeoutError", statussms: false };
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


app.post("/getpackagelistphone", async (req, res) => {

    try {

        const body = req.body;

        console.log(body);

        if (body.length > 0) {

            let model = []
            let modelbody = [];
            let modelresponse = [];  // item response
            for (let item of body) {

                console.log(item)
                const bodyqueryphone = await bodyinquery(item.toString());
                console.log(body)

                const header = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }



                await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                    method: "POST",
                    headers: header,
                    body: bodyqueryphone
                }).then(response => {
                    return response.text();

                }).then(responsetext => {


                    const modeldata = responsetext


                    parseString(modeldata, function (err, result) {


                        let data = JSON.stringify(result);
                        const datas = JSON.parse(data);

                        const model = datas["soap:Envelope"]["soap:Body"][0]["inquiryCounterResponse"][0]["inquiryCounterResult"][0]["CounterArray"][0]["CounterInfo"]

                        for (var i = 0; i < model.length; i++) {
                            console.log()


                            modelresponse.push({ phone: model[i].Msisdn[0], productnumber: model[i].ProductNumber[0], countername: model[i].CounterName[0], starttime: model[i].StartTime[0], expirytime: model[i].ExpiryTime[0], refillstoptime: model[i].RefillStopTime[0]["$"]["xsi:nil"] })

                        }

                        console.log(model)
                    })




                }).catch(err => {

                    console.log(err)
                })
            }
            return res.json({ status: true, code: 0, message: "get_package_listphone", result: modelresponse })
        }

        return res.json({ status: false, code: 0, message: "get_package_failed", result: [] })


    } catch (error) {
        console.log(error);
    }

})


app.post("/modifypackagehours", async (req, res) => {
    try {

        const body = req.body;

        if (body.length > 0) {
            let modelresponse = [];  // item response

            for (let item of body) {

                console.log(item.phone, item.productnumber, item.starttime, item.expiretime)

                const bodymodifield = bodymodiefieldhours(item.phone, item.productnumber, item.starttime, item.expiretime);

                const header = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }



                await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                    method: "POST",
                    headers: header,
                    body: bodymodifield
                }).then(response => {
                    return response.text();

                }).then(responsetext => {

                    const modelres = responsetext;

                    parseString(modelres, function (err, result) {

                        console.log(result)

                        const models = JSON.stringify(result);
                        const modelresdata = JSON.parse(models);
                        console.log(modelresdata);

                        console.log(modelresdata["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0])


                        const modeldata = modelresdata["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0]

                        if (modeldata.IsSuccess[0] == "true") {
                            modelresponse.push({ phone: item.phone, productnumber: item.productnumber, countername: item.countername, starttime: item.starttime, expiretime: item.expiretime, status: true, description: modeldata.Description[0], transactionID: modeldata.TransactionID[0], code: modeldata.Code[0] });
                        } else {
                            modelresponse.push({ phone: item.phone, productnumber: item.productnumber, countername: item.countername, starttime: item.starttime, expiretime: item.expiretime, status: false, description: modeldata.Description[0], transactionID: modeldata.TransactionID[0], code: modeldata.Code[0] });
                        }

                    })

                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            modelresponse.push({ phone: item.phone, productnumber: item.productnumber, countername: item.countername, starttime: item.starttime, expiretime: item.expiretime, status: false, description: "not found data", transactionID: "not found data", code: 2 });
                        }
                    }
                    console.log(err)
                });
                const index = modelresponse.findIndex(x => x.status == false && x.code == 2);
                if (index != -1) {
                    break;
                }
            }

            const responseindex = modelresponse.filter(x => x.status == false && x.code == 2);
            if (responseindex.length == 0) {

                return res.status(200).json({ status: true, code: 0, message: "modify_package_hours_success", result: modelresponse });

            } else {

                if (responseindex.length > 0) {

                    return res.status(400).json({ status: false, code: 2, message: "modify_package_ConnectionTimeOutError", result: modelresponse });
                } else {
                    return res.status(400).json({ status: false, code: 0, message: "cannot_modify_package_hours", result: modelresponse });

                }
            }
        }
        return res.status(400).json({ status: false, code: 0, message: "cannot_modify_package_hours", result: [] });


    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot_modify_package_hours", result: [] });

    }

})




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
        console.log(data.data.toString())
        if (data.status == 200) {

            if (data.data.resultCode.toString() == "20000") {
                console.log(data.data)
                console.log("send add package : " + true);
                return true;

            }
        }
        console.log("send add package : " + false);
        return false;
    } catch (error) {
        console.log(error);
        console.log("send add package failed : " + false);
        return false;
    }
}

module.exports = app;