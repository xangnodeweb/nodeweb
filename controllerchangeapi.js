const app = require("express").Router();

const { changemainoffering, changemaxdate, bodysetvalidity } = require("./modelbody");

const { parseString } = require("xml2js");
const fetch = require("node-fetch");
const { v4 } = require("uuid")
const fs = require("fs").promises;
const path = require("path");
const axios = require("axios")
const https = require("https");

// app.post("/changemainoffering", async (req, res) => {
//     try {
//         const body = req.body;

//         const phone = body.phone;// 
//         const oldoffering = body.oldoffering;
//         const newoffering = body.newoffering;

//         console.log(body);

//         let model = []
//         let msgseq = v4();
//         if (body.length > 0) {

//             for (var i = 0; i < body.length; i++) {

//                 const databody = await changemainoffering(body[i].phone, body[i].oldoffering, body[i].newoffering, msgseq);

//                 console.log(databody);

//                 if (databody == null) {
//                     return res.status(400).json({ status: false, code: 1, message: "please check body changemain offering" })
//                 }
//                 let modelresponse = {};
//                 let data = {};
//                 let datasuboffering = {};

//                 const headers = {
//                     'Content-Type': 'text/xml;charset=utf-8'
//                 }

//                 await fetch("http://172.28.236.57:8080/services/BcServices", {
//                     method: "POST",
//                     headers: headers,
//                     body: databody
//                 }).then(response => {
//                     return response.text();
//                 }).then(responseText => {

//                     // console.log(responseText)
//                     const modeldata = responseText

//                     parseString(modeldata, function (err, result) {
//                         let datas = JSON.stringify(result);
//                         const datass = JSON.parse(datas);


//                         console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"]);
//                         console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ResultHeader"][0]);

//                         const modelresult = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ResultHeader"][0];
//                         data = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult["cbs:Version"][0], resultcode: modelresult["cbs:ResultCode"][0], resultdesc: modelresult["cbs:ResultDesc"][0], offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: modelresult["cbs:ResultCode"][0] == '0' ? true : false, code: 0, message: modelresult["cbs:ResultCode"][0] == '0' ? "success" : "failed" }

//                         // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]);
//                         // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]["bcs:AddOffering"][0]);

//                         const modelsubofferings = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"];
//                         console.log(modelsubofferings);

//                         if (modelsubofferings) {
//                             const modelsuboffering = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]["bcs:AddOffering"][0];
//                             // console.log(modelsuboffering) // modelsuboffer != true ? null : datasuboffering
//                             datasuboffering = {
//                                 offeringkey: modelsuboffering["bcs:OfferingKey"][0]["bcc:OfferingID"][0],
//                                 purchaseseq: modelsuboffering["bcs:OfferingKey"][0]["bcc:PurchaseSeq"][0],
//                                 effectiveTime: modelsuboffering["bcs:EffectiveTime"][0], expirationTime: modelsuboffering["bcs:ExpirationTime"][0], rentdeductionstatus: modelsuboffering["bcs:RentDeductionStatus"][0]
//                             }
//                             data.offeringkey = datasuboffering.offeringkey
//                             data.purchaseseq = datasuboffering.purchaseseq
//                             data.effectiveTime = datasuboffering.effectiveTime
//                             data.expirationTime = datasuboffering.expirationTime
//                             data.rentdeductionstatus = datasuboffering.rentdeductionstatus
//                             data.status = data.status ? true : false
//                         }
//                         modelresponse = data;
//                         console.log(datasuboffering)
//                         console.log(data)

//                     });

//                 }).catch(err => {
//                     console.log(err)

//                     const error = JSON.stringify(err)
//                     const errors = JSON.parse(error);
//                     if (err) {
//                         if (errors.code == "ETIMEDOUT") {
//                             data = { phone: body[i].phone, newoffering: null, oldoffering: null, version: null, resultcode: null, resultdesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 2, message: "ConnectTimeoutError" };
//                             modelresponse = data;

//                         } else {
//                             data = { phone: body[i].phone, newoffering: null, oldoffering: null, version: null, resultcode: null, resultdesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 2, message: "cannot changemainoffering" };
//                             modelresponse = data;
//                         }
//                     }
//                 });


//                 model.push(modelresponse);

//                 if (!modelresponse.status && modelresponse.code == 2) {
//                     break;
//                 }
//             }


//             const modelindex = model.filter(x => x.status == false && x.code == 2);
//             if (modelindex.length > 0) {
//                 return res.status(400).json({ status: false, code: 2, message: "changemain offering ConnectTimeoutError", result: model });
//             } else {
//                 return res.status(200).json({ status: true, code: 0, message: "changemain offering success", result: model });
//             }

//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ status: false, code: 1, message: "changemain offering failed", result: null });
//     }
// });

app.post("/changemainoffering", async (req, res) => {
    try {
        const body = req.body;

        const phone = body.phone;// 
        const oldoffering = body.oldoffering;
        const newoffering = body.newoffering;

        console.log(body);
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
                let data = {};
                let datasuboffering = {};

                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8',
                    'apikey': '1ceLL3KitsCAUekVdYTYSaYHrGho6QKA'
                }
                const datas = await axios.post("https://172.28.26.72:9443/api/cbs_bc_services/ChangeSubOffering", datareq, { headers: headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
                let datass = datas.data;
                console.log(datas.data)

                if (datas.status == 200) {

                    if (datass.ChangeSubOfferingResultMsg) {

                        if (datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult) {

                            if (datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult.AddOffering) {
                                let modelresult = datass.ChangeSubOfferingResultMsg.ResultHeader;
                                let modeladdoffering = datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult
                                modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult.Version, resultcode: modelresult.ResultCode, resultDesc: modelresult.ResultDesc, offeringkey: modeladdoffering.AddOffering.OfferingKey.OfferingID, purchaseseq: modeladdoffering.AddOffering.OfferingKey.PurchaseSeq, effectiveTime: modeladdoffering.AddOffering.EffectiveTime, expirationTime: modeladdoffering.AddOffering.ExpirationTime, rentdeductionstatus: modeladdoffering.AddOffering.RentDeductionStatus, status: true, code: 0, message: "success", }
                                // console.log(modelresponse)
                                // console.log(datass.ChangeSubOfferingResultMsg.ChangeSubOfferingResult.AddOffering)
                            }
                        } else {
                            let modelresult = datass.ChangeSubOfferingResultMsg.ResultHeader;
                            modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult.Version, resultcode: modelresult.ResultCode, resultDesc: modelresult.ResultDesc, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 0, message: "failed", }
                        }
                    }

                } else {
                    modelresponse = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult.Version, resultcode: modelresult.ResultCode, resultDesc: modelresult.ResultDesc, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 0, message: "failed", }
                }
                model.push(modelresponse);
            }
            // console.log(model)

            return res.status(200).json({ status: true, code: 0, message: "changemain offering success", result: model })
        }
    } catch (error) {
        console.log(error);
        const errors = JSON.stringify(error);
        const err = JSON.parse(errors);
        // console.log(err.code == "ETIMEDOUT");
        if (err.code == "ETIMEDOUT") {
            return res.status(400).json({ status: false, code: 2, message: "changemain offering ConnectTimeOutError", result: null });

        } else {
            return res.status(400).json({ status: false, code: 1, message: "changemain offering failed", result: null });

        }

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

                const data = await axios.post("https://172.28.26.72:9443/api/cbs_bc_services/ChangeSubInfo", datareq, { headers: headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
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
                modelresponse.push(modelresponsetext);
            }

            // console.log(modelresponse)
            return res.status(200).json({ status: false, code: 0, message: "changemaxday success", result: modelresponse });
        }
        return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });

    } catch (error) {
        console.log(error);
        const err = JSON.stringify(error);
        const errors = JSON.parse(err);
        if (errors) {
            if (errors.code == "ETIMEDOUT") {
                return res.status(400).json({ status: false, code: 2, message: "cannot changemax day ConnectTimeOutError", result: null });

            } else {
                return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });

            }
        }

    }
});

// app.post("/setvalidity", async (req, res) => {
//     try {

//         const body = req.body;

//         const phone = body.phone;
//         const validitydate = body.validitydate;
//         let model = [];
//         let modelresponse = [];
//         let modelresponsetext = {};


//         if (body.length > 0) {

//             for (var i = 0; i < body.length; i++) {
//                 const bodysetvaliditys = bodysetvalidity(body[i].phone, body[i].validitydate);
//                 // console.log(bodysetvaliditys);

//                 const headers = {
//                     'Content-Type': 'text/xml;charset=utf-8'
//                 }

//                 await fetch("http://172.28.236.57:8080/services/BcServices", {
//                     method: "POST",
//                     headers: headers,
//                     body: bodysetvaliditys
//                 }).then(response => {
//                     return response.text();
//                 }).then(responseText => {

//                     // console.log(responseText)
//                     const modeldata = responseText

//                     parseString(modeldata, function (err, result) {
//                         let datas = JSON.stringify(result);
//                         const datass = JSON.parse(datas);

//                         // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ResultHeader"][0]);
//                         // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ChangeSubValidityResult"]);

//                         const data = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ResultHeader"][0];
//                         const datanewliftcyclestatus = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ChangeSubValidityResult"];
//                         const statusresult = data["cbs:ResultCode"][0] == '0' ? true : false;
//                         modelresponsetext = { phone: body[i].phone, validityincrement: body[i].validitydate, code: data["cbs:ResultCode"][0], status: statusresult, message: "", resultdesc: data["cbs:ResultDesc"][0], currentlifecycleindex: 0, newlifecyclestatus: [] }

//                         if (datanewliftcyclestatus) {
//                             let models = [];
//                             if (datanewliftcyclestatus[0]) {
//                                 if (datanewliftcyclestatus[0]["bcs:LifeCycleChgInfo"][0]["bcs:NewLifeCycleStatus"].length > 0) {

//                                     const modelnewlife = datanewliftcyclestatus[0]["bcs:LifeCycleChgInfo"][0]["bcs:NewLifeCycleStatus"];
//                                     console.log(modelnewlife)
//                                     for (var ii = 0; ii < modelnewlife.length; ii++) {
//                                         models.push({ statusname: modelnewlife[ii]["bcs:StatusName"][0], statusexpiretime: modelnewlife[ii]["bcs:StatusExpireTime"][0], statusindex: modelnewlife[ii]["bcs:StatusIndex"][0] });

//                                         // console.log(models)
//                                     }
//                                     if (models.length > 0) {

//                                         console.log(models)
//                                         modelresponsetext.newlifecyclestatus = models;
//                                         modelresponsetext.currentlifecycleindex = 0;
//                                     }
//                                 }
//                             }
//                         }
//                     });

//                 }).catch(err => {
//                     console.log(err)

//                     const error = JSON.stringify(err)
//                     const errors = JSON.parse(error);
//                     console.log(errors)

//                     if (err) {
//                         if (errors.code == "ETIMEDOUT") {
//                             modelresponsetext = { phone: body[i].phone, validityincrement: body[i].validitydate, code: 2, status: false, message: "ConnectTimeoutError", resultdesc: "", currentlifecycleindex: 0, newlifecyclestatus: [] }

//                         } else {
//                             modelresponsetext = { phone: body[i].phone, validityincrement: body[i].validitydate, code: 1, status: false, message: "cannot setvalidity", resultdesc: "", currentlifecycleindex: 0, newlifecyclestatus: [] }

//                         }
//                     }
//                 });

//                 if (modelresponse.status) {
//                     modelresponse.push(modelresponsetext);

//                 } else {

//                     if (!modelresponsetext.status && modelresponsetext.code == 2) {
//                         modelresponse.push(modelresponsetext);
//                         break;
//                     } else {
//                         modelresponse.push(modelresponsetext);
//                     }
//                 }

//             }

//             const modelindex = modelresponse.findIndex(x => x.status == false && x.code == 2);
//             if (modelindex != -1) {

//                 return res.status(400).json({ status: false, code: 2, messgae: "ConnectTimeoutError", result: modelresponse });

//             } else {


//                 adddatafile(modelresponse);
//                 return res.status(200).json({ status: true, code: 0, messgae: "set validity success", result: modelresponse });

//             }
//         }
//         return res.status(400).json({ status: false, code: 0, message: "cannot setvalidity", result: null });

//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ status: false, code: 0, message: "cannot setvalidity", result: null });

//     }
// });

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
                    console.log(data.data)


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
                    // console.log(modelresult.ChangeSubValidityResultMsg.ChangeSubValidityResult.LifeCycleChgInfo)
                    model.push({ phone: phone, validityincrement: validitydate, version: null, resultcode: null, resultdesc: null, currentlifecycleindex: 0, newlifecyclestatus: null, chgvalidity: null, status: false, code: 0, message: "failed" })

                });
                // modelresponse.push(modelresponsetext);
            }

        }


        // console.log(model)
        adddatafile(model);
        return res.status(200).json({ status: true, code: 0, message: "setvalidity success", result: model })
     

    } catch (error) {
        console.log(error);
        const err = JSON.stringify(error);
        const errors = JSON.parse(err);
        if (errors) {
            if (errors.code == "ETIMEDOUT") {
                return res.status(400).json({ status: false, code: 2, message: "cannot setvalidity ConnectTimeOutError", result: null });

            } else {
                return res.status(400).json({ status: false, code: 1, message: "cannot setvalidity", result: null });

            }
        }
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
            console.log(date);
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