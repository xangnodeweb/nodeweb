const app = require("express").Router();

const { changemainoffering, changemaxdate, bodysetvalidity } = require("./modelbody");

const { parseString } = require("xml2js");
const fetch = require("node-fetch")

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
                const databody = await changemainoffering(body[i].phone, body[i].oldoffering, body[i].newoffering);
                console.log(databody);

                if (databody == null) {
                    return res.status(400).json({ status: false, code: 1, message: "please check body changemain offering" })
                }
                let modelresponse = {};
                let data = {};
                let datasuboffering = {};
                // return res.status(200).json(databody)
                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }

                await fetch("http://172.28.236.57:8080/services/BcServices", {
                    method: "POST",
                    headers: headers,
                    body: databody
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    console.log(responseText)
                    const modeldata = responseText

                    parseString(modeldata, function (err, result) {
                        let datas = JSON.stringify(result);
                        const datass = JSON.parse(datas);

                        // console.log(datass)
                        console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"]);
                        console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ResultHeader"][0]);

                        const modelresult = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ResultHeader"][0];
                        data = { phone: body[i].phone, newoffering: body[i].newoffering, oldoffering: body[i].oldoffering, version: modelresult["cbs:Version"][0], resultcode: modelresult["cbs:ResultCode"][0], resultdesc: modelresult["cbs:ResultDesc"][0], offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: modelresult["cbs:ResultCode"][0] == '0' ? true : false, code: 0, message: modelresult["cbs:ResultCode"][0] == '0' ? "success" : "failed" }

                        // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]);
                        // console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]["bcs:AddOffering"][0]);

                        const modelsubofferings = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"];
                        console.log(modelsubofferings);

                        if (modelsubofferings) {
                            const modelsuboffering = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubOfferingResultMsg"][0]["ChangeSubOfferingResult"][0]["bcs:AddOffering"][0];
                            // console.log(modelsuboffering) // modelsuboffer != true ? null : datasuboffering
                            datasuboffering = {
                                offeringkey: modelsuboffering["bcs:OfferingKey"][0]["bcc:OfferingID"][0],
                                purchaseseq: modelsuboffering["bcs:OfferingKey"][0]["bcc:PurchaseSeq"][0],
                                effectiveTime: modelsuboffering["bcs:EffectiveTime"][0], expirationTime: modelsuboffering["bcs:ExpirationTime"][0], rentdeductionstatus: modelsuboffering["bcs:RentDeductionStatus"][0]
                            }
                            data.offeringkey = datasuboffering.offeringkey
                            data.purchaseseq = datasuboffering.purchaseseq
                            data.effectiveTime = datasuboffering.effectiveTime
                            data.expirationTime = datasuboffering.expirationTime
                            data.rentdeductionstatus = datasuboffering.rentdeductionstatus
                            data.status = data.status ? true : false
                        }
                        modelresponse = data;
                        console.log(datasuboffering)
                        console.log(data)

                    });

                }).catch(err => {
                    console.log(err)

                    const error = JSON.stringify(err)
                    const errors = JSON.parse(error);
                    console.log(errors)

                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            data = { phone: null, newoffering: null, oldoffering: null, version: null, resultcode: null, resultdesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 2, message: "ConnectTimeoutError" };
                            modelresponse = data;

                            // return res.status(400).json({ status: false, code: 2, message: "ConnectTimeoutError", result: null });
                        }
                    }

                    data = { phone: null, newoffering: null, oldoffering: null, version: null, resultcode: null, resultdesc: null, offeringkey: null, purchaseseq: null, effectiveTime: null, expirationTime: null, rentdeductionstatus: null, status: false, code: 2, message: "cannot changemainoffering" };
                    modelresponse = data;

                    //     if (err["cause"].name == "ConnectTimeoutError") 
                    return res.status(400).json({ status: false, code: 1, message: "changemain offering failed", result: null });
                });

                if (modelresponse.status && modelresponse.code == 2) {
                    break;
                }
                model.push(modelresponse);
            }

            const modelindex = model.filter(x => x.status == true && x.code == 2);
            if (modelindex.length > 0) {
                return res.status(400).json({ status: false, code: 2, message: "changemain offering ConnectTimeoutError", result: model });
            } else {
                return res.status(200).json({ status: true, code: 0, message: "changemain offering success", result: model });
            }
        }
    } catch (error) {
        console.log(error);
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
        console.log(body)

        if (body.length > 0) {

            for (var i = 0; i < body.length; i++) {

                const bodydatas = changemaxdate(body[i].phone, body[i].balance, body[i].datevalue);
                console.log(bodydatas)

                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }
                await fetch("http://172.28.236.57:8080/services/BcServices", {
                    method: "POST",
                    headers: headers,
                    body: bodydatas
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    console.log(responseText)
                    const modeldata = responseText

                    parseString(modeldata, function (err, result) {
                        let datas = JSON.stringify(result);
                        const datass = JSON.parse(datas);

                        console.log(datass)
                        console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubInfoResultMsg"][0]["ResultHeader"][0])

                        const datachange = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubInfoResultMsg"][0]["ResultHeader"][0];
                        // success or failed ==  Resultcode  0 or Resultcode != 0 
                        const statusresult = datachange["cbs:ResultCode"][0] == '0' ? true : false;
                        console.log(statusresult)
                        console.log(datachange["cbs:ResultCode"][0])
                        console.log(typeof datachange["cbs:ResultCode"][0])

                        modelresponsetext = { phone: body[i].phone, datevalue: body[i].datevalue, status: statusresult, code: datachange["cbs:ResultCode"][0], message: datachange["cbs:ResultDesc"][0] };

                        console.log(datachange);
                    })
                }).catch(err => {
                    console.log(err)

                    const error = JSON.stringify(err)
                    const errors = JSON.parse(error);
                    console.log(errors)

                    if (err) {
                        if (errors.code == "ETIMEDOUT") {

                            modelresponsetext = { phone: body[i].phone, status: false, code: 2, message: "ConnectTimeoutError", result: [] }

                        } else {
                            modelresponsetext = { phone: body[i].phone, status: false, code: 1, message: "cannot changemax_day", result: [] }

                        }
                    }


                })

                if (modelresponsetext) {
                    if (modelresponsetext.status) {

                        modelresponse.push(modelresponsetext);
                    } else {

                        if (!modelresponsetext.status && modelresponsetext.code == 2) {
                            modelresponse.push(modelresponsetext);
                            break;
                        } else {
                            modelresponse.push(modelresponsetext);
                        }
                    }

                }
            }

            const modelindex = modelresponse.findIndex(x => x.status == false && x.code == 2);

            if (modelindex != -1) {
                return res.status(400).json({ status: false, code: 2, message: "connectTimeoutError", result: modelresponse });
            } else {
                return res.status(200).json({ status: true, code: 0, message: "changemax_day success", result: modelresponse });
            }
        }
        return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 1, message: "cannot changemax day", result: null });
    }
});

app.post("/setvalidity", async (req, res) => {

    try {

        const body = req.body;

        const phone = body.phone;
        const validitydate = body.validitydate;
        let model = [];
        let modelresponse = [];
        let modelresponsetext = {};
        if (body.length > 0) {


            for (var i = 0; i < body.length; i++) {

                const bodysetvaliditys = bodysetvalidity(body[i].phone, body[i].validitydate);
                console.log(bodysetvaliditys);
                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }

                await fetch("http://172.28.236.57:8080/services/BcServices", {
                    method: "POST",
                    headers: headers,
                    body: bodysetvaliditys
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    console.log(responseText)
                    const modeldata = responseText

                    parseString(modeldata, function (err, result) {
                        let datas = JSON.stringify(result);
                        const datass = JSON.parse(datas);

                        console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ResultHeader"][0]);
                        console.log(datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ChangeSubValidityResult"]);

                        const data = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ResultHeader"][0];
                        const datanewliftcyclestatus = datass["soapenv:Envelope"]["soapenv:Body"][0]["bcs:ChangeSubValidityResultMsg"][0]["ChangeSubValidityResult"];
                        const statusresult = data["cbs:ResultCode"][0] == '0' ? true : false;
                        modelresponsetext = { phone: body[i].phone,  validityincrement : body[i].validitydate , code: data["cbs:ResultCode"][0], status: statusresult, message: "", resultdesc: data["cbs:ResultDesc"][0], currentlifecycleindex: 0, newlifecyclestatus: [] }

                        if (datanewliftcyclestatus) {
                            let models = [];
                            if (datanewliftcyclestatus[0]) {
                                if (datanewliftcyclestatus[0]["bcs:LifeCycleChgInfo"][0]["bcs:NewLifeCycleStatus"].length > 0) {

                                    const modelnewlife = datanewliftcyclestatus[0]["bcs:LifeCycleChgInfo"][0]["bcs:NewLifeCycleStatus"];
                                   console.log(modelnewlife)
                                    for (var ii = 0; ii < modelnewlife.length; ii++) {
                                        models.push({ statusname: modelnewlife[ii]["bcs:StatusName"][0], statusexpiretime: modelnewlife[ii]["bcs:StatusExpireTime"][0], statusindex: modelnewlife[ii]["bcs:StatusIndex"][0] });

                                        console.log(models)
                                    }
                                    if (models.length > 0) {

                                        console.log(models)
                                            modelresponsetext.newlifecyclestatus = models;
                                            modelresponsetext.currentlifecycleindex  = 0;
                                    }
                                }
                            }
                            console.log(modelresponsetext);
                        }
                    });

                }).catch(err => {
                    console.log(err)

                    const error = JSON.stringify(err)
                    const errors = JSON.parse(error);
                    console.log(errors)

                    if (err) {
                        if (errors.code == "ETIMEDOUT") {
                            modelresponsetext = { phone: body[i].phone,  validityincrement : body[i].validitydate, code: 2, status: false, message: "ConnectTimeoutError", resultdesc: "", currentlifecycleindex: 0, newlifecyclestatus: [] }

                        }
                    }
                });

                if (modelresponse.status) {
                    modelresponse.push(modelresponsetext);

                } else {

                    if (!modelresponsetext.status && modelresponsetext.code == 2) {
                        modelresponse.push(modelresponsetext);
                        break;
                    } else {
                        modelresponse.push(modelresponsetext);
                    }
                }

            }
            const modelindex = modelresponse.findIndex(x => x.status == false && x.code == 2);
            if (modelindex.length > 0) {
                return res.status(400).json({ status: false, code: 2, messgae: "ConnectTimeoutError", result: modelresponse });
            } else {
                return res.status(200).json({ status: true, code: 0, messgae: "set validity success", result: modelresponse });

            }
        }
        return res.status(400).json({ status: false, code: 0, message: "cannot setvalidity", result: null });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 0, message: "cannot setvalidity", result: null });

    }


})



module.exports = app;