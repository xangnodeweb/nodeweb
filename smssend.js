const app = require("express").Router();
const axios = require("axios");

const { bodyaddpackage, bodymodiefieldhours, bodyinquery, bodymodiefield } = require("./modelbody");
const fetch = require("node-fetch");
const { parseString } = require("xml2js")

const fs = require("fs/promises");
const path = require("path");
const auth = require("./user/auth");

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

app.post("/addpackagesms", [auth], async (req, res) => {  // add package send sms model
    try {

        const body = req.body;
        const reqaddpackage = bodyaddpackage(); // body request add package

        let model = [];
        let modelInfo = [];
        let userid = req.user.userid
        if (body.length > 0) {
            console.log(body);


            for (var i = 0; i < body.length; i++) {

                // console.log(body[i])

                // body[i].packagename = "Package Promotion 3GB 24hrs"
                const bodyaddpackages = await bodyaddpackage(body[i].Msisdn, body[i].CounterName, body[i].StartTime, body[i].ExpiryTime, body[i].refillstoptime); // body request add package

                const phone = body[i].Msisdn.toString();
                // console.log(bodyaddpackages)

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

                                // console.log(countersuccess)
                                modelInfo.push({ Msisdn: countersuccess[0].Msisdn[0], ProductNumber: countersuccess[0].ProductNumber[0], CounterName: countersuccess[0].CounterName[0], StartTime: countersuccess[0].StartTime[0], ExpiryTime: countersuccess[0].ExpiryTime[0], status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0], statussms: false, contentmsg: body[i].contentmsg, headermsg: body[i].headermsg, refillstoptime: countersuccess[0].RefillStopTime[0]["$"]["xsi:nil"] })

                                let packagename = countersuccess[0].CounterName[0].toString().slice(0, 13).toLowerCase();
                                console.log(packagename)
                                console.log(packagename.length);
                                if (packagename != "prepaid_staff") {

                                    let sendsmss = await sendsmsaddpackage(body[i], userid);
                                    console.log("send sms : " + sendsmss)

                                    if (sendsmss.status == true) {
                                        let index = modelInfo.findIndex(x => x.Msisdn.toString() == phone);
                                        console.log("index model find phone : " + index)
                                        if (index != -1) {
                                            modelInfo[index].statussms = true;
                                        }
                                    }
                                    console.log(modelInfo)
                                }
                            }

                        } else {
                            console.log(responsesuccess);
                            console.log(responsesuccess.Description[0]);
                            modelInfo.push({ Msisdn: body[i].Msisdn, ProductNumber: body[i].ProductNumber, CounterName: body[i].CounterName, StartTime: body[i].StartTime, ExpiryTime: body[i].ExpiryTime, status: responsesuccess.IsSuccess[0], code: responsesuccess.Code[0], message: responsesuccess.Description[0], statussms: false, contentmsg: body[i].contentmsg, headermsg: body[i].headermsg, refillstoptime: false })
                        }
                    });

                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    console.log(err)
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {

                            modelInfo.push({ Msisdn: body[i].Msisdn, ProductNumber: body[i].ProductNumber, CounterName: body[i].CounterName, StartTime: body[i].StartTime, ExpiryTime: body[i].ExpiryTime, status: false, code: 2, message: "cannot add package ConnectTimeoutError", statussms: false, contentmsg: body[i].contentmsg, headermsg: body[i].headermsg, refillstoptime: null });
                        }
                    }
                });

                const index = modelInfo.findIndex(x => Boolean(x.status) == false && x.code == 2);
                if (index != -1) { // break for then timeout 
                    break;
                }
            }
            console.log(modelInfo)
            await sleep(150);
            if (modelInfo.length > 0) {
                const indexresponse = modelInfo.filter(x => Boolean(x.status) == false && x.code == 2);
                if (indexresponse.length == 0) { // check response have timeout

                    await adddatafile(modelInfo, userid)
                    return res.status(200).json({ status: true, code: 0, message: "add package success", result: modelInfo })
                } else {
                    const status = indexresponse.length == 0 ? 1 : 2;
                    const message = indexresponse.length > 0 ? "cannot add package data ConnectionTimeOutError" : "cannot add package data";
                    await adddatafile(modelInfo, userid)
                    return res.status(400).json({ status: false, code: status, message: message, result: modelInfo });
                }
            }
        }
        return res.status(400).json({ status: true, code: 1, message: 'cannot add package', result: [] });

    } catch (error) {
        console.log("error status ")
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: error.toString(), result: null })
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
            let modelgroup = [];
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
                        // console.log(model);

                        if (model.length > 0) {

                            for (var i = 0; i < model.length; i++) {

                                modelresponse.push({ phone: model[i].Msisdn[0], productnumber: model[i].ProductNumber[0], countername: model[i].CounterName[0], starttime: model[i].StartTime[0], expirytime: model[i].ExpiryTime[0], refillstoptime: model[i].RefillStopTime[0]["$"]["xsi:nil"], message: "", status: true, code: 0, packagegroup: false })
                                let packagename = model[i].CounterName[0].toString().length >= 13 ? model[i].CounterName[0].toString().slice(0, 13) : model[i].CounterName[0].toString();
                                let namegroup = 1;

                                // if (modelresponse.length > 0) {

                                if (modelgroup.length > 0) {

                                    if (model[i].CounterName[0].toString().length >= 13) {
                                        let indexgroup = modelgroup.findIndex(x => x.countername.toString().slice(0, 13).toLowerCase() == model[i].CounterName[0].toString().slice(0, 13).toLowerCase());
                                        if (indexgroup != -1) {
                                            let groupcount = parseInt(modelgroup[indexgroup].countgroup) + 1;
                                            modelgroup[indexgroup].countgroup = groupcount;
                                        }
                                        else {
                                            modelgroup.push({ countername: packagename, countgroup: namegroup })
                                        }

                                    } else {
                                        let indexgroup = modelgroup.findIndex(x => x.countername.toString().toLowerCase() == model[i].CounterName[0].toString().toLowerCase());
                                        if (indexgroup != -1) {
                                            let groupcount = parseInt(modelgroup[indexgroup].countgroup) + 1;
                                            modelgroup[indexgroup].countgroup = groupcount;
                                        } else {
                                            modelgroup.push({ countername: model[i].CounterName.toString(), countgroup: namegroup })
                                        }
                                    }
                                    // const indexgroup = modelgroup.findIndex(x => x.countername.toString().slice(0, 13).toLowerCase() == model[i].CounterName[0].toString().slice(0, 13).toLowerCase());

                                } else {
                                    if (model[0].CounterName.toString().length >= 13) {
                                        modelgroup.push({ countername: packagename, countgroup: namegroup })
                                    } else {
                                        modelgroup.push({ countername: model[i].CounterName.toString(), countgroup: namegroup })
                                    }

                                }

                                // } else {
                                //     if (model[i].CounterName[0].toString().length >= 13) {
                                //         modelgroup.push({ countername: packagename, countgroup: namegroup })
                                //     } else {
                                //         modelgroup.push({ countername: model[i].CounterName.toString(), countgroup: namegroup })
                                //     }
                                // }   
                                // CHECK NAME FIND 13 LENGTH MODEL PACKAGE NAME
                                //  modelgroup countername group key == countername substr 13 length
                            }

                            console.log(modelgroup);
                            if (modelresponse.length > 0) { // package group // 
                                for (var i = 0; i < modelresponse.length; i++) {
                                    const index = modelgroup.findIndex(x => x.countername.toString().toLowerCase().slice(0, 13) == modelresponse[i].countername.toString().toLowerCase().slice(0, 13) && parseInt(x.countgroup) > 1);
                                    if (index != -1) {
                                        modelresponse[i].packagegroup = true;
                                    }
                                }
                            }
                        }
                        // console.log(model)
                    })
                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            modelresponse.push({ phone: item.toString(), productnumber: "not found data", countername: "not found data", starttime: "not found data", expirytime: "not found data", refillstoptime: "not found data", status: false, code: 2, mesage: "cannot query package ConnectTimeOutError" })
                        }
                    }

                    console.log(err)
                })
                const indexs = modelresponse.findIndex(x => x.status == false && x.code == 2);
                if (indexs != -1) {
                    break;
                }
            }
            console.log(modelresponse)
            const modelindex = modelresponse.filter(x => x.status == false && x.code == 2); // model response then if status == false && code == 2
            if (modelindex.length == 0) {
                return res.status(200).json({ status: true, code: 0, message: "get_package_listphone", result: modelresponse })
            } else {
                return res.status(400).json({ status: false, code: 2, message: "cannot_query_package_timeoutError", result: modelresponse })
            }
        }
        return res.status(400).json({ status: false, code: 0, message: "get_package_failed", result: [] })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot_query_package_failed", result: [] })
    }

})

app.post("/modifypackage", [auth], async (req, res) => {
    try {

        const body = req.body;
        if (body != null) {

            let userid = req.user.userid;
            let bodymodifield = "";
            let modifyres = {};
            console.log(body);
            if (req.body.bodymodifield == 1) {
                bodymodifield = bodymodiefield(req.body.phone, req.body.productnumber, req.body.expiretime)
            } else {
                bodymodifield = bodymodiefieldhours(req.body.phone, req.body.productnumber, req.body.starttime, req.body.expiretime);
            }

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


                    const models = JSON.stringify(result);
                    const modelresdata = JSON.parse(models);
                    const modeldata = modelresdata["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0]
                    console.log(modeldata)
                    if (modeldata.IsSuccess[0] == "true") {
                        modifyres = { Msisdn: req.body.phone, ProductNumber: req.body.productnumber, CounterName: req.body.countername, StartTime: req.body.starttime, ExpiryTime: req.body.expiretime, status: true, description: modeldata.Description[0], TransactionID: modeldata.TransactionID[0], code: modeldata.Code[0] }
                    } else {
                        modifyres = { Msisdn: req.body.phone, ProductNumber: req.body.productnumber, CounterName: req.body.countername, StartTime: null, ExpiryTime: null, status: false, description: modeldata.Description[0], TransactionID: modeldata.TransactionID[0], code: modeldata.Code[0] };
                    }
                })
            }).catch(err => {
                const error = JSON.stringify(err);
                const errors = JSON.parse(error);
                if (err) {
                    if (errors.code == "ETIMEDOUT") {
                        modifyres = { Msisdn: req.body.phone, ProductNumber: req.body.productnumber, CounterName: req.body.countername, StartTime: null, ExpiryTime: null, status: false, description: "not found data", TransactionID: null, code: 2 };
                    }
                }
                console.log(err)
            });
            if (modifyres.status == false && modifyres.code == 2) {
                return res.status(200).json({ status: false, code: 2, message: "canot modify package Connect TimeOut", result: modifyres });
            } else if (modifyres.status == false && modifyres.code == 0) {
                return res.status(200).json({ status: false, code: 0, message: "canot modify package", result: modifyres });

            } else {
                const modellog = [];
                modellog.push(modifyres);
                await modifielddatafile(modellog, userid);
                console.log(modellog)
                return res.status(200).json({ status: true, code: 0, message: "", result: modifyres });
            }
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot modify package", result: [] });

    }
})
app.post("/modifypackagehour", [auth], async (req, res) => {
    try {

        const body = req.body;
        console.log(body.length);
        if (body.length > 0) {
            let modelresponse = [];  // item response
            let userid = req.user.userid;
            for (let item of body) {
                let bodymodifield = "";
                console.log(item.phone, item.productnumber, item.starttime, item.expiretime)

                // let  bodymodifield  
                if (item.bodymodifield == 0) {
                    bodymodifield = bodymodiefield(item.phone, item.productnumber, item.expiretime)
                } else {
                    bodymodifield = bodymodiefieldhours(item.phone, item.productnumber, item.starttime, item.expiretime);
                }
                console.log(item.bodymodifield)

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

                        // console.log(result)

                        const models = JSON.stringify(result);
                        const modelresdata = JSON.parse(models);
                        // console.log(modelresdata);

                        // console.log(modelresdata["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0])

                        const modeldata = modelresdata["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0]

                        if (modeldata.IsSuccess[0] == "true") {
                            modelresponse.push({ Msisdn: item.phone, ProductNumber: item.productnumber, CounterName: item.countername, StartTime: item.starttime, ExpiryTime: item.expiretime, status: true, description: modeldata.Description[0], TransactionID: modeldata.TransactionID[0], code: modeldata.Code[0] });
                        } else {
                            modelresponse.push({ Msisdn: item.phone, ProductNumber: item.productnumber, CounterName: item.countername, StartTime: null, ExpiryTime: null, status: false, description: modeldata.Description[0], TransactionID: modeldata.TransactionID[0], code: modeldata.Code[0] });
                        }
                    })
                }).catch(err => {
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            modelresponse.push({ Msisdn: item.phone, ProductNumber: item.productnumber, CounterName: item.countername, StartTime: null, ExpiryTime: null, status: false, description: "not found data", TransactionID: null, code: 2 });
                        }
                    }
                    console.log(err)
                });
                const index = modelresponse.findIndex(x => Boolean(x.status) == false && x.code == 2);
                if (index != -1) {
                    break;
                }
            }
            // console.log("model response")
            // console.log(modelresponse)
            const responseindex = modelresponse.filter(x => Boolean(x.status) == false && x.code == 2);
            if (responseindex.length == 0) {
                await modifielddatafile(modelresponse, userid)
                // console.log("model result")
                return res.status(200).json({ status: true, code: 0, message: "modify_package_hours_success", result: modelresponse });

            } else {

                if (responseindex.length > 0) {
                    await modifielddatafile(modelresponse, userid)
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
});

app.post("/refuncaddpackage", [auth], async (req, res) => {
    try {

        const body = req.body;
        let model = [];
        let userid = req.user.userid;
        // console.log(body)
        if (body.length > 0) {
            let data = {
                "headermsg": "",
                "Msisdn": "",
                "contentmsg": "",
                "amount": "",
                "statussms": ""
            }
            let date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date())

            for (var i = 0; i < body.length; i++) {

                const format = /[^0-9]+/g
                body[i].msgcontent = body[i].msgcontent.toString().replace("_phone_", `${body[i].Msisdn}`) // replace content format
                body[i].msgcontent = body[i].msgcontent.toString().replace("_kip_", `${body[i].amount}`)
                body[i].msgcontent = body[i].msgcontent.toString().replace("_date_", `${date.toString().slice(0, 10)}`)

                data.headermsg = "Lao%2DTelecom";
                data.contentmsg = body[i].msgcontent;
                data.amount = body[i].amount;
                data.Msisdn = body[i].Msisdn


                const sendsms = await sendsmsaddpackage(data, userid);
                if (sendsms.status == false && sendsms.code == 1) {
                    model.push({ Msisdn: body[i].Msisdn, msgcontent: body[i].msgcontent, amount: body[i].amount, countername: body[i].countername, status: false, statussms: sendsms.status, code: 2 })
                    break;
                }
                data.statussms = sendsms.status;
                await addsmslogfile(data, req.user.userid); // write log send sms
                model.push({ Msisdn: body[i].Msisdn, msgcontent: body[i].msgcontent, amount: body[i].amount, countername: body[i].countername, status: sendsms, statussms: sendsms.status, code: 0 })
            }
        } else {
            return res.status(400).json({ status: false, code: 1, message: " request refunc not found cannot refunc failed." })
        }

        const index = model.findIndex(x => x.status == false && x.code == 2);
        if (index != -1) {
            return res.status(400).json({ status: false, code: 2, message: "cannot_sendsms", result: model });
        }

        return res.status(200).json({ status: true, code: 0, message: "refunc_addpackage_success", result: model });

    } catch (error) {
        console.log(error);

        return res.status(400).json({ status: false, code: 0, message: "cannot_refunc_addpackag_failed", result: [] });
    }
})

app.post("/sendsmscontent", [auth], async (req, res) => { // send sms model req
    try {

        const body = req.body;
        let userid = req.user;
        let model = [];
        console.log(body) // content then enter value content
        if (body.length > 0) {

            let headermsg = "Lao%2DTelecom"
            for (var i = 0; i < body.length; i++) {

                let linedata = { Msisdn: body[i].Msisdn, contentmsg: body[i].contentmsg, headermsg: headermsg, status: false }

                const sendsms = await sendsmsaddpackage(linedata, userid.userid);

                if (sendsms.status == true) {
                    body[i].status = sendsms.status;
                } else {
                    body[i].status = sendsms.status;
                }
                await sendsmslog(body[i], sendsms.smid, userid.userid);
                model.push({ Msisdn: body[i].Msisdn, contentmsg: body[i].contentmsg, status: body[i].status })
            }

            return res.status(200).json({ status: true, code: 0, message: "", result: model })
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 1, message: error.toString(), result: [] })
    }
});



app.post("/getpackagename", async (req, res) => { // package name

    try {

        const bosdy = req.body;
        const paths = path.join(__dirname, "./filedatatxt/packagename.txt");
        const filedata = await fs.readFile(paths, "utf8");
        let model = [];
        let modelpackagename = [];
        if (filedata.length < 15) {
            return;
        }
        const datafile = filedata.split(/\r?\n/);
        console.log(datafile);

        if (datafile.length > 0) {

            for (var i = 0; i < datafile.length; i++) {
                if (datafile[i] != '') {

                    if (model.length > 0) {
                        if (datafile[i].toString().length >= 13) { // pacakge name group 
                            const index = model.findIndex(x => x.toString().slice(0, 13) == datafile[i].toString().slice(0, 13));
                            if (index == -1) {
                                model.push(datafile[i].toString().slice(0, 13));
                                modelpackagename.push(datafile[i].toString())
                            }
                        } else {
                            model.push(datafile[i].toString())
                            modelpackagename.push(datafile[i].toString())
                        }

                    } else {
                        if (datafile[i].toString().length >= 13) {
                            model.push(datafile[i].toString().slice(0, 13));
                            modelpackagename.push(datafile[i].toString());
                        } else {
                            model.push(datafile[i]);
                            modelpackagename.push(datafile[i].toString());
                        }
                    }
                }
            }
            console.log(modelpackagename);
        }
        let pkaname = {
            packagename: datafile,
            packagegroupname: modelpackagename
        }

        return res.status(200).json({ status: true, code: 0, message: "", result: pkaname });
    } catch (error) {
        console.log(error);
    }
});

app.post("/getlogfileaddpackagesms/:filename", async (req, res) => { // log add package
    try {
        const body = req.body;
        const filename = req.params.filename;
        const datestart = req.query.datestart;

        let model = [];
        let modelpackagename = [];
        let modeldate = [];
        const paths = path.join(__dirname, "./filedatatxt/");
        let optionlog = req.body.optionlog;
        let filelogname = optionlog == 0 ? "fileaddpackagesms.txt" : optionlog == 1 ? "filesmscontent.txt" : ""
        console.log(body);
        let datafile = await fs.readFile(paths + filelogname, "utf8")
        console.log(datafile)
        if (optionlog == 0) {
            const folder = await fs.readdir(paths);
            const format = /^[\n]|[\r\n]/g

            if (datafile.toString().length > 0) {

                const datas = datafile.split(format);
                if (datas.length > 0) {

                    for (var i = 0; i < datas.length; i++) {
                        let linecol = datas[i].split("|");
                        if (linecol.length == 12) {
                            model.push({ Msisdn: linecol[0], ProductNumber: linecol[1], CounterName: linecol[2], StartTime: linecol[3], ExpiryTime: linecol[4], headermsg: linecol[5], contentmsg: linecol[6], status: linecol[7], code: linecol[8], statussms: linecol[9], datetimelog: linecol[11], userid: linecol[10] });
                        }
                    }
                    if (model.length > 0) {
                        modeldate = model.filter(x => x.datetimelog.toString().slice(0, 10) == datestart);
                        if (modeldate.length > 0) {
                            for (var i = 0; i < modeldate.length; i++) {
                                if (modelpackagename.length == 0) {
                                    modelpackagename.push({ CounterName: modeldate[i].CounterName, count: 1, datelog: modeldate[i].datetimelog });
                                } else {
                                    const index = modelpackagename.findIndex(x => x.CounterName.toString() == modeldate[i].CounterName.toString());
                                    if (index != -1) {
                                        modelpackagename[index].count = parseInt(modelpackagename[index].count) + 1;
                                    } else {
                                        modelpackagename.push({ CounterName: modeldate[i].CounterName, count: 1, datelog: modeldate[i].datetimelog });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return res.status(200).json({ status: true, code: 0, message: "log_fileaddpackagesms_success", result: { modellog: modeldate, modelgrouplog: modelpackagename } });

        } else if (optionlog == 1) {
            let model = [];
            if (datafile.length > 0) {
                const datamodel = datafile.toString().split(/^[\n]|[\r\n]/g) // log file stringfy json
                console.log(datamodel)
                if (datamodel.length > 0) {
                    for (var i = 0; i < datamodel.length; i++) {
                        if (datamodel[i] != '') {
                            const dataline = datamodel[i].toString().split("|");
                            if (dataline.length > 0) {
                                const date = dataline[5].toString().replace(new RegExp(":", "g"), "")
                                model.push({ Msisdn: dataline[0], content: dataline[1], status: dataline[3], smid: dataline[2], userid: dataline[4], datetime: date });
                            }
                        }
                    }
                    if (model.length > 0) {

                        if (model.length > 0) {
                            model.sort((a, b) => b.datetime - a.datetime)
                        }
                    }
                }
            }
            return res.status(200).json({ status: true, code: 0, messgae: "log_smscontent", result: model })

        } else if (optionlog == 2) {

            return res.status(200).json({ status: true, code: 0, message: "modify_log_success", result: [] })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot_get_logfile", result: [] })
    }
});

app.post("/createcontentsms", async (req, res) => {
    try {

        const body = req.body;
        let contentmsg = body.contentmsg;

        console.log(body.contentmsg)
        if (body.contentmsg == '') {
            return res.status(400).json({ status: false, code: 1, message: "please enter contentmsg", result: null })
        }
        const indexamount = body.contentmsg.indexOf("_kip_")
        if (indexamount != -1) {
            contentmsg = contentmsg.replace("_kip_", "1000")
        }

        const indexphone = body.contentmsg.indexOf("_phone_")
        if (indexphone != -1) {
            contentmsg = contentmsg.replace("_phone_", "856205xxxxxxx")
        }

        let datenow = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
        datenow = datenow.toString().slice(0, 10)
        const indexdate = body.contentmsg.indexOf("_date_")
        if (indexdate != -1) {
            contentmsg = contentmsg.replace("_date_", `${datenow}`)
        }
        const modelcontent = await filecontent();
        console.log(modelcontent.length)
        let linedata = `${body.contentmsg}|${contentmsg}|${modelcontent.length + 1}\n`;
        const paths = path.join(__dirname, "./filedatatxt/");
        let data = { id: body.contentmsg, value: contentmsg }
        await fs.appendFile(paths + "contentsms.txt", linedata, (err) => {
            if (err) {
                console.log(linedata);
                console.log(err);
                return res.status(400).json({ stauts: false, code: 2, message: "cannot create content message", result: null })
            }
        })
        return res.status(200).json({ status: true, code: 0, message: "create content success", result: data })

    } catch (error) {
        console.log(error);
    }
})
app.post("/getfilecontentmsg", async (req, res) => {
    try {
        const filedata = await filecontent();
        return res.status(200).json({ status: true, code: 0, message: "", result: filedata })
    } catch (error) {
        console.log(error);
    }
})

app.delete("/deletemsgcontent/:contentid", async (req, res) => {
    try {

        const id = req.params.contentid;
        const paths = path.join(__dirname, "./filedatatxt/")
        let model = await filecontent();
        const models = model.filter(x => x.index != id);
        if (models.length > 0) {

            await fs.truncate(paths + "contentsms.txt", 0, function () {
                console.log("contentsms edit")
            })

            for (var i = 0; i < models.length; i++) {
                let linedata = `${models[i].id}|${models[i].value}|${models[i].index}\n`;

                await fs.appendFile(paths + "contentsms.txt", linedata, (err) => {
                    if (err) {
                        console.log(linedata);
                        console.log(err);
                        return res.status(400).json({ stauts: false, code: 2, message: "cannot create content message", result: null })
                    }
                })
            }
        } else {
            await fs.truncate(paths + "contentsms.txt", 0, function () {
                console.log("delete contentsms")
            })
        }
        return res.status(200).json({ status: true, code: 0, message: "delete contentmsg success", result: id })

    } catch (error) {
        console.log(error);
    }

})



const sendsmsaddpackage = async (datas) => {
    try {

        const reqsms = {
            "CMD": "SENDMSG",
            "FROM": datas.headermsg,
            // "FROM": "Lao%2DTelecom",
            "TO": datas.Msisdn,
            "REPORT": "Y",
            "CHARGE": "8562052199062",
            "CODE": "45140377001",
            "CTYPE": "UTF-8",
            "CONTENT": datas.contentmsg
        }
        if (datas.headermsg == '') {
            return { status: false, code: 0 }
        }
        console.log(reqsms)
        const data = await axios.post("http://10.30.6.26:10080", reqsms, { timeout: 25000 });
        console.log(data.data)
        if (data.status == 200) {
            if (data.data.resultCode.toString() == "20000") {
                datas.status = true;
                return { status: true, code: 0, smid: data.data.SMID };
            }
        }
        // console.log("send add package : " + false);
        return { status: false, code: 0, smid: data.data.SMID };
    } catch (error) {
        console.log(error);
        console.log("send add package failed : " + false);
        const err = JSON.stringify(error);
        const errs = JSON.parse(err);
        console.log(errs);
        return { status: false, code: 1 };
    }
}


const adddatafile = async (resdata, userid) => {
    try {
        if (resdata.length > 0) {
            let date = datetime();
            for (var i = 0; i < resdata.length; i++) {
                let data = `${resdata[i].Msisdn + "|" + resdata[i].ProductNumber + "|" + resdata[i].CounterName + "|" + resdata[i].StartTime + "|" + resdata[i].ExpiryTime + "|" + resdata[i].headermsg + "|" + resdata[i].contentmsg + "|" + resdata[i].status + "|" + resdata[i].code + "|" + resdata[i].statussms + "|" + userid + "|" + date}\n`
                const folderpath = path.join("./filedatatxt/")
                await fs.appendFile(folderpath + "fileaddpackagesms.txt", data, (err) => {
                    if (err) {
                        console.log(resdata);
                        console.log("cannot write log fileaddpackage.")
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const modifielddatafile = async (resdata, userid) => {
    try {

        if (resdata.length > 0) {
            let date = datetime();
            for (var i = 0; i < resdata.length; i++) {
                let data = `${resdata[i].Msisdn + "|" + resdata[i].ProductNumber + "|" + resdata[i].StartTime + "|" + resdata[i].ExpiryTime + "|" + resdata[i].TransactionID + "|" + resdata[i].description + "|" + resdata[i].status + "|" + resdata[i].code + "|" + userid + "|" + date}\n`
                const folderpath = path.join("./filedatatxt/")
                await fs.appendFile(folderpath + "filemodifield.txt", data, (err) => {
                    if (err) {
                        console.log(resdata);
                        console.log("cannot write log filemodifieldpackage.")
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const addsmslogfile = async (data, userid) => {
    try {

        if (data) {

            let date = datetime();
            date = date.replace(new RegExp("-", "g"), "");
            let linedata = `${data.Msisdn}|${data.amount}|${data.contentmsg}|${data.statussms}|${userid}|${date}\n`
            const pathfile = path.join("./filedatatxt/")
            await fs.appendFile(pathfile + "filesendsms.txt", linedata, (err) => {

                if (err) {
                    console.log(linedata);
                    console.log(err);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const sendsmslog = async (data, smid, userid) => {
    try {

        if (data) {

            let date = datetime();
            date = date.replace(new RegExp("-", "g"), "")
            let linedata = `${data.Msisdn}|${data.contentmsg}|${smid}|${data.status}|${userid}|${date}\n`
            const pathfile = path.join("./filedatatxt/")
            await fs.appendFile(pathfile + "filesmscontent.txt", linedata, (err) => {

                if (err) {
                    console.log(linedata);
                    console.log(err);
                }
            });
        }
    } catch (error) {
        console.log(error);

    }
}

const filecontent = async () => {
    try {

        const paths = path.join(__dirname, "./filedatatxt/")
        const filedata = await fs.readFile(paths + "contentsms.txt", "utf8");
        console.log(filedata)
        let datafile = filedata.toString().split("\n")
        let model = [];

        if (datafile.length > 0) {
            for (var i = 0; i < datafile.length; i++) {
                let line = datafile[i].toString().split("|")
                if (line.length == 3) {
                    model.push({ id: line[0], value: line[1], index: line[2] });
                }
            }
        }

        return model;
    } catch (error) {
        console.log(error);
        return []
    }
}

const sleep = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}
const datetime = () => {
    try {

        const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", hour12: false }).format(new Date());
        const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());

        return date + "-" + time;

    } catch (error) {
        console.log(error);
    }

}

module.exports = app;