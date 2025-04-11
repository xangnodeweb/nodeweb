const app = require("express").Router();

const { changemainoffering, changemaxdate, bodysetvalidity, querybalance } = require("./modelbody");

const { parseString } = require("xml2js");
const fetch = require("node-fetch");
const { v4 } = require("uuid")
const fs = require("fs").promises;
const path = require("path");
const axios = require("axios")
const https = require("https");


app.post("/changemainoffering", async (req, res) => {
    try {
        const body = req.body;

        let model = []

        if (body.length > 0) {

            for (var i = 0; i < body.length; i++) {
                let msgseq = v4();
                let datareq = {
                    "ChanelRequest": "ISD",
                    "MessageSeq": msgseq,
                    "LoginSystemCode": "APIGEEAPI",
                    "Password": "cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q",
                    "RemoteIP": "10.180.2.21",
                    "ChannelID": "3",
                    "PrimaryIdentity": body[i].phone,
                    "OldPrimaryOffering": body[i].oldoffering,
                    "NewPrimaryOffering": body[i].newoffering
                }

                let modelresponse = {};

                const headers = {
                    'Content-Type': 'application/json',
                    'apikey': '1ceLL3KitsCAUekVdYTYSaYHrGho6QKA'
                }
                await axios.post("https://172.28.26.72:9443/api/cbs_bc_services/ChangeSubOffering", datareq, { headers: headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) }).then(data => {

                    let datass = data.data;
                    // console.log(datas.data)

                    if (data.status == 200) {

                        if (datass.ChangeSubOfferingResultMsg) {

                            if (datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult) {

                                if (datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult.AddOffering) {
                                    let modelresult = datass.ChangeSubOfferingResultMsg.ResultHeader;
                                    let modeladdoffering = datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult
                                    modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult.Version, resultcode: modelresult.ResultCode, resultDesc: modelresult.ResultDesc, offeringkey: modeladdoffering.AddOffering.OfferingKey.OfferingID, purchaseseq: modeladdoffering.AddOffering.OfferingKey.PurchaseSeq, effectiveTime: modeladdoffering.AddOffering.EffectiveTime, expirationTime: modeladdoffering.AddOffering.ExpirationTime, rentdeductionstatus: modeladdoffering.AddOffering.RentDeductionStatus, status: true, code: 0, message: "success", }
                                }
                            } else {
                                let modelresult = datass.ChangeSubOfferingResultMsg.ResultHeader;
                                modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult.Version, resultcode: modelresult.ResultCode, resultDesc: modelresult.ResultDesc, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 0, message: "failed", }
                            }
                        }

                    } else {
                        modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: null, resultcode: null, resultDesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 1, message: "failed", }
                    }

                }).catch(err => {

                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);

                    if (errors) {

                        if (errors.code == "ETIMEDOUT") {
                            modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: null, resultcode: null, resultDesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 2, message: "cannot changemainoffering ConnecTimeOutError", }
                        } else {
                            modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: null, resultcode: null, resultDesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 1, message: "failed", }
                        }
                    }
                });

                if (modelresponse) {
                    if (!modelresponse.status && modelresponse.code == 2) {
                        model.push(modelresponse);
                        break;
                    } else {
                        model.push(modelresponse);
                    }
                }
            }
            // console.log(model)
            const modelindex = model.findIndex(x => x.status == false && x.code == 2);
            if (modelindex == -1) {
                return res.status(200).json({ status: true, code: 0, message: "changemain offering success", result: model })
            } else {
                console.log({ status: false, code: 2, message: "cannot changemain offering ConnectTimeOutError", result: model })
                return res.status(400).json({ status: false, code: 2, message: "cannot changemain offering ConnectTimeOutError", result: model })

            }

        }
    } catch (error) {
        console.log(error);
        const errors = JSON.stringify(error);
        const err = JSON.parse(errors);

        return res.status(400).json({ status: false, code: 1, message: "changemain offering failed", result: null });
    }
});


app.post("/changemaxday", async (req, res) => {
    try {

        const body = req.body;

        const phone = body.phone;
        const datevalue = body.datevalue;
        const balance = body.balance; // default sim postpaid balance default value ==  3000000
        let model = [];
        let modelresponse = [];
        let modelresponsetext = {};
        // console.log(body)

        if (body.length > 0) {

            for (var i = 0; i < body.length; i++) {

                let messageseq = v4().toString().replace(new RegExp(/-/g, "g"), "").slice(0, 30);
                // console.log(messageseq)
                let datareq = {
                    ChanelRequest: "CBS_SUB_MAX_VALIDITY",
                    MessageSeq: messageseq,
                    LoginSystemCode: "APIGEEAPI",
                    Password: "cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q",
                    RemoteIP: "10.180.2.21",
                    ChannelID: "3",
                    PrimaryIdentity: body[i].phone,
                    Code: "C_SUB_MAX_VALIDITY",
                    Value: body[i].datevalue
                }

                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8',
                    'apikey': '1ceLL3KitsCAUekVdYTYSaYHrGho6QKA'
                }

                await axios.post("https://172.28.26.72:9443/api/cbs_bc_services/ChangeSubInfo", datareq, { headers: headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) }).then(data => {

                    let datas = data.data;
                    // console.log(data.data);
                    if (data.status == 200) {

                        let modelresult = datas.ChangeSubInfoResultMsg
                        if (modelresult != null) {
                            if (modelresult.ResultHeader != null) {
                                if (modelresult.ResultHeader.ResultCode == 0) {
                                    modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: modelresult.ResultHeader.Version, resultdesc: modelresult.ResultHeader.ResultDesc, resultcode: modelresult.ResultHeader.ResultCode, status: true, code: 0, message: "success" }

                                } else {
                                    modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: modelresult.ResultHeader.Version, resultdesc: modelresult.ResultHeader.ResultDesc, resultcode: modelresult.ResultHeader.ResultCode, status: false, code: 1, message: "failed" }
                                }
                            } else {
                                modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: null, resultdesc: null, resultcode: null, status: false, code: 1, message: "failed" }
                            }
                        } else {
                            modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: null, resultdesc: null, resultcode: null, status: false, code: 1, message: "failed" }
                        }
                    }
                }).catch(err => {
                    console.log(err);
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);
                    if (errors) {
                        if (errors.code == "ETIMEDOUT") {
                            modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: null, resultdesc: null, resultcode: null, status: false, code: 2, message: "cannot changemaxday ConnectTimeoutError" }
                        } else {
                            modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, version: null, resultdesc: null, resultcode: null, status: false, code: 1, message: "failed" }
                        }
                    }
                });

                if (modelresponsetext) {
                    if (modelresponsetext.status == false && modelresponsetext.code == 2) {
                        modelresponse.push(modelresponsetext);
                        break;
                    } else {
                        modelresponse.push(modelresponsetext);
                    }
                }
            }

            const modelindex = modelresponse.findIndex(x => x.status == false && x.code == 2); // check data Connecttimeout 
            if (modelindex == -1) {
                return res.status(200).json({ status: true, code: 0, message: "changemaxday success", result: modelresponse });

            } else {
                console.log({ status: false, code: 2, message: "cannot changemaxday ConnectTimeOutError", result: modelresponse })
                return res.status(400).json({ status: false, code: 2, message: "cannot changemaxday ConnectTimeOutError", result: modelresponse });
            }
        }
        return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });

    } catch (error) {
        console.log(error);
        const err = JSON.stringify(error);
        const errors = JSON.parse(err);

        return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });

    }
});



app.post("/setvalidity", async (req, res) => {
    try {

        const body = req.body;

        let model = [];
        // console.log(body)
        if (body.length > 0) {


            for (var i = 0; i < body.length; i++) {
                let phone = body[i].phone;
                let validitydate = body[i].validitydate
                let messageseq = v4();
                // let modelresponsetext = { phone: "", validityincrement: "", version: 0, resultcode: 0, resultdesc: "", currentlifecycleindex: 0, newlifecyclestatus: null, chgvalidity: null, status: false, code: 0, message: "" };

                const dataseq = {
                    ChanelRequest: "CBS_SetDays",
                    MessageSeq: messageseq,
                    LoginSystemCode: "APIGEEAPI",
                    Password: "cdVOUWF+57KsMd57vH8D3H+ykq4CbeLtc8wCapSScPhjazQDDuTrFUP4sDBpyX+q",
                    RemoteIP: "10.180.2.21",
                    ChannelID: "3",
                    PrimaryIdentity: body[i].phone,
                    OpType: "2",
                    ValidityIncrement: `${body[i].validitydate}`
                }

                const headers = {
                    'Content-Type': 'application/json',
                    'apikey': '1ceLL3KitsCAUekVdYTYSaYHrGho6QKA'
                }

                // console.log(dataseq)
                await axios.post("https://172.28.26.72:9443/api/cbs_bc_services/ChangeSubValidity", dataseq, { headers: headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) }).then(data => {
                    // console.log(data.data)


                    let modelresult = data.data

                    // console.log(modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult.LifeCycleChgInfo)
                    let models = [];
                    if (modelresult.ChangeSubValidityResultMsg) {
                        if (modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult) {

                            let modelresultheader = modelresult.ChangeSubValidityResultMsg.ResultHeader;
                            let modellifecycleinfo = modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult;

                            if (modellifecycleinfo) {
                                if (modellifecycleinfo.LifeCycleChgInfo.NewLifeCycleStatus) {
                                    for (var i = 0; i < modellifecycleinfo.LifeCycleChgInfo.NewLifeCycleStatus.length; i++) {
                                        models.push(modellifecycleinfo.LifeCycleChgInfo.NewLifeCycleStatus[i])
                                    }
                                }
                            }
                            // console.log(modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult.LifeCycleChgInfo)
                            model.push({ phone: phone, validityincrement: validitydate, version: modelresultheader.Version, resultcode: modelresultheader.ResultCode, resultdesc: modelresultheader.ResultDesc, currentlifecycleindex: modellifecycleinfo.LifeCycleChgInfo.CurrentLifeCycleIndex, newlifecyclestatus: models, chgvalidity: modellifecycleinfo.LifeCycleChgInfo.ChgValidity, status: true, code: 0, message: "" })

                        } else {

                            // console.log(modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult.LifeCycleChgInfo)
                            model.push({ phone: phone, validityincrement: validitydate, version: modelresultheader.Version, resultcode: modelresultheader.ResultCode, resultdesc: modelresultheader.ResultDesc, currentlifecycleindex: 0, newlifecyclestatus: null, chgvalidity: null, status: false, code: 0, message: "failed" })
                        }
                    }

                }).catch(err => {
                    console.log(err)
                    const error = JSON.stringify(err);
                    const errors = JSON.parse(error);

                    if (errors) {

                        if (errors.code == "ETIMEDOUT") {
                            model.push({ phone: phone, validityincrement: validitydate, version: null, resultcode: null, resultdesc: null, currentlifecycleindex: 0, newlifecyclestatus: null, chgvalidity: null, status: false, code: 2, message: "cannot setvalidity ConnectTimeOutError" })
                        } else {
                            model.push({ phone: phone, validityincrement: validitydate, version: null, resultcode: null, resultdesc: null, currentlifecycleindex: 0, newlifecyclestatus: null, chgvalidity: null, status: false, code: 1, message: "failed" })
                        }
                    }

                });
                // modelresponse.push(modelresponsetext);
                if (model.length > 0) {
                    const modelindex = model.findIndex(x => x.status == false && x.code == 2);
                    if (modelindex != -1) {
                        break;
                    }
                }

            }

        }

        if (model.length > 0) {
            const modelindexsuccess = model.findIndex(x => x.status == false && x.code == 2);
            if (modelindexsuccess == -1) {
                adddatafile(model);
                return res.status(200).json({ status: true, code: 0, message: "setvalidity success", result: model })

            } else {
                adddatafile(model);
                console.log({ status: false, code: 2, message: "setvalidity ConnectTimeOutError", result: model })
                return res.status(400).json({ status: false, code: 2, message: "setvalidity ConnectTimeOutError", result: model })

            }
        }

        return res.status(400).json({ status: false, code: 1, message: "cannot setvalidity", result: null });
        // console.log(model)


    } catch (error) {
        console.log(error);
        const err = JSON.stringify(error);
        const errors = JSON.parse(err);

        return res.status(400).json({ status: false, code: 1, message: "cannot setvalidity", result: null });

    }

})

app.post("/querybalance", async (req, res) => {
    try {

        const body = req.body;

        let model = [];
        if (body.length > 0) {
            let headers = {
                'Content-Type': 'text/xml;charset=UTF-8'
            }
            for (var i = 0; i < body.length; i++) {


                // console.log(body[i])
                let uuid = v4();

                let bodyquery = await querybalance(body[i].phone, uuid);
                let phone = body[i].phone

                await fetch("http://172.28.236.57:8080/services/ArServices/", {
                    method: "POST",
                    headers: headers,
                    body: bodyquery
                }).then(response => {
                    return response.text();
                }).then(responsetext => {
                    // console.log(responsetext)
                    parseString(responsetext, async function (err, result) {

                        let datas = JSON.stringify(result);
                        let dataqs = JSON.parse(datas); // response data query

                        const balancestatus = dataqs["soapenv:Envelope"]["soapenv:Body"]

                        if (balancestatus) {

                            let statusbn = balancestatus[0]["ars:QueryBalanceResultMsg"][0]["ResultHeader"]
                            // console.log(statusbn[0]["cbs:ResultCode"][0])
                            if (statusbn[0]["cbs:ResultCode"][0].toString() == "0") {

                                const dataeresult = dataqs["soapenv:Envelope"]["soapenv:Body"][0]["ars:QueryBalanceResultMsg"]
                                if (dataeresult.length > 0) {

                                    if (dataeresult[0]["QueryBalanceResult"]) {
                                        let result = dataeresult[0]["QueryBalanceResult"][0]["ars:AcctList"][0]["ars:BalanceResult"][0]
                                        let lastupdatetime = result["arc:BalanceDetail"].length > 0 ? result["arc:BalanceDetail"][0]["arc:LastUpdateTime"][0] : ""
                                        if (dataeresult[0]["QueryBalanceResult"].length > 0) {
                                            if (dataeresult[0]["QueryBalanceResult"][0]["ars:AcctList"]) {
                                                if (dataeresult[0]["QueryBalanceResult"][0]["ars:AcctList"].length != 0) {
                                                    if (dataeresult[0]["QueryBalanceResult"][0]["ars:AcctList"][0]["ars:BalanceResult"]) {
                                                        model.push({ Msisdn: body[i].phone, totalamount: result["arc:TotalAmount"][0], lastupdatetime: lastupdatetime, status: true, code: "" })
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        model.push({ Msisdn: body[i].phone, totalamount: 0, status: false, code: 0 })
                                    }
                                }
                            } else {
                                await sleep(50)
                                model.push({ Msisdn: body[i].phone, totalamount: 0, status: false, code: 0 })
                            }
                        }
                    })

                })

            }

        }
        // console.log(model.length)

        return res.status(200).json({ status: true, code: 0, message: "", result: model })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "", result: [] });
    }

})







app.post("/getdatafile/:id", async (req, res) => {
    try {

        const filenames = req.params.id;
        console.log(filenames);
        const paths = path.join(__dirname, "./filedatatxt/");
        // console.log(paths);
        const format = /^[\n]|[\r\n]/g;
        let model = [];
        const data = await fs.readFile(paths + "" + filenames, "utf8")
        // console.log(data);
        const datas = data.split(format);
        const models = datas.filter(x => x.toString().length > 1);
        if (models.length > 0) {
            for (var i = 0; i < models.length; i++) {
                model.push(`${models[i]}`);
            }
        }
        // console.log(model)
        return res.status(200).json({ status: true, code: 1, message: "read file success", result: model })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "cannot get data file log", result: [] });
    }
});
app.post("/datafileclear/:namefile", async (req, res) => {
    try {

        const namefiles = req.params.namefile;

        const paths = path.join(__dirname, "./filedatatxt/");
        const fileclear = await fs.truncate(paths + "" + namefiles, 0)
        // console.log(fileclear)
        return res.json({ status: true, code: 0, message: "filedat clear success", result: [] });
    } catch (error) {
        const errors = JSON.stringify(error)
        console.log(JSON.parse(errors))
        // console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "cannot clear filedata" })
    }


})



const sleep = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}

const datetime = () => {
    try {
        const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", hour12: false }).format(new Date());
        const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());
        return date.replace(new RegExp("-", "g"), "") + "" + time.replace(new RegExp(":", "g"), "");
    } catch (error) {
        console.log(error)
    }
}

const adddatafile = async (bodydata) => {
    try {

        let data = "";
        if (bodydata.length > 0) {
            let date = datetime();
            // console.log(date);
            for (var i = 0; i < bodydata.length; i++) {

                const status = bodydata[i].status ? "true" : "false"
                data = `${bodydata[i].phone + "|" + bodydata[i].validityincrement + "|" + bodydata[i].resultcode + "|" + status + "|" + date}\n`;
                const folderpath = path.join("./filedatatxt/");
                await fs.appendFile(folderpath + "filedatachange.txt", data, (err) => {
                    if (err) {
                        console.log(bodydata)
                        console.log("cannot setvalidity");
                    }
                });
            }
        }

    } catch (error) {
        console.log(error)
    }
}



module.exports = app;