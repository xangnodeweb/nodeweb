
const app = require("express").Router();
const express = require("express")();

const { bodyinquery, bodymodiefield, bodyaddpackage } = require("./modelbody");
const { parseString } = require("xml2js");
const fetch = require("node-fetch");
const { json } = require("express");


app.post("/inqueryphone", async (req, res) => {
    try {
        const body = req.body;
        const bodyquery = await bodyinquery(body.phone);
        if (bodyquery == null) {
            return res.status(400).json({ status: false, code: 0, message: "please check body inquery " })
        }
        const headers = {
            'Content-Type': 'text/xml;charset=utf-8'
        }
        let model = [];
        let modelbody = [];
        let modelresponse = [];

        await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
            method: "POST",
            headers: headers,
            body: bodyquery
        }).then(response => {
            return response.text();
        }).then(responseText => {

            // console.log(responseText)
            const modeldata = responseText
            console.log(modeldata)
            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);


                model.push(datass);

                console.log(typeof datas);
                console.log(model[0]['soap:Envelope']['soap:Body'])
                // modelbody.push(model[0]['soap:Envelope']['soap:Body'])
                modelbody.push(model[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['CounterArray'][0]['CounterInfo'])
                console.log(modelbody[0].length)
                if (modelbody.length > 0) {
                    for (var ii = 0; ii < modelbody[0].length; ii++) {
                        // console.log({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0] })
                        modelresponse.push({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0], "RefillStopTime": modelbody[0][ii]['RefillStopTime'][0]['$']['xsi:nil'] });
                        //    modelresponse.push(modelbody[0]);
                    }
                    console.log(modelresponse)
                }
            });

            return res.json({ status: true, code: 0, message: "success", result: modelresponse });
        }).catch(err => {
            console.log(err)
        
            const error = JSON.stringify(err)
            const errors = JSON.parse(error);
            console.log(JSON.parse(error))
            console.log(errors.code)
            if (err) {
                if (errors.code == "ETIMEDOUT") {
                    return res.status(400).json({ status: false, code: 2, message: "ConnectTimeoutError", result: [] })
                }
            }

            // if (err["errno"]) {
            //     if (err["cause"].name == "ConnectTimeoutError") {
            //        }
            // }

            return res.status(400).json({ status: false, code: 1, message: "cannot inquery phone", result: [] });
        })


    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 1, message: "cannot inquery phone" });
    }
});

app.post("/modifielddatetme", async (req, res) => {
    try {
        const body = req.body;

        const phone = req.body.phone;
        const productno = req.body.productno;
        const expire = req.body.expire;
        const bodys = bodymodiefield(phone, productno, expire)
        console.log(body)
        const headers = {
            'Content-Type': 'text/xml;charset=utf-8'
        }
        if (!bodys) {
            return res.status(400).json({ status: false, code: 2, message: "please check body modifielddatetime ", result: null })
        }
        // console.log(bodys)
        let model = [];
        let modelbody = [];
        let modelresponse = {};
        await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
            method: "POST",
            headers: headers,
            body: bodys
        }).then(response => {
            return response.text();
        }).then(responseText => {

            // console.log(responseText)
            const modeldata = responseText
            console.log(modeldata)
            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);
                console.log(datass)

                console.log(datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0])
                modelresponse = datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0];



            });

            return res.json({ status: true, code: 0, message: "success", result: modelresponse });
        }).catch(err => {
            console.log(err)
            return res.json({ status: false, code: 2, message: "cannot modify phone", result: null });
        })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, code: 2, message: "cannot modify phone", result: null });

    }
});

app.post("/addpackage", async (req, res) => {
    try {
        const body = req.body;
        // const phone = body.phone;
        // const countername = body.countername;
        // const start = body.starttime;
        // const expiry = body.expirytime;

        const { phone, countername, datestart, dateexpire, refillstoptime } = body;
        console.log(phone, countername, datestart, dateexpire, refillstoptime);
        let counternames = "";
        if (countername == 1) {
            counternames = "Prepaid_Staff_3GB";
        } else if (countername == 2) {
            counternames = "Prepaid_Staff_5GB";
        } else if (countername == 3) {
            counternames = "Prepaid_Staff_7GB";
        } else if (countername == 4) {
            counternames = "Prepaid_Staff_10GB";
        } else if (countername == 5) {
            counternames = "Prepaid_Staff_15GB";
        } else if (countername == 5) {
            counternames = "Prepaid_Staff_25GB";
        }
        console.log(counternames);

        const bodyquery = await bodyaddpackage(phone, counternames, datestart, dateexpire, refillstoptime);
        console.log(bodyquery);

        if (bodyquery == null) {
            return res.status(400).json({ status: false, code: 0, message: "please check body inquery " })
        }
        const headers = {
            'Content-Type': 'text/xml;charset=utf-8'
        }
        let model = [];
        let modelbody = [];
        let modelresponse = {};

        await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
            method: "POST",
            headers: headers,
            body: bodyquery
        }).then(response => {
            return response.text();
        }).then(responseText => {

            // console.log(responseText)
            const modeldata = responseText
            console.log(modeldata)
            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);


                modelbody.push(datass['soap:Envelope']['soap:Body']);
                const modeldatasuccess = datass['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0];
                const counterresponsepackage = datass['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo'];
                // const modelcounterarra = model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo'][0];

                console.log(modeldatasuccess);
                console.log(counterresponsepackage);
                console.log(typeof datas);
                // console.log(model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0]);

                if (modeldatasuccess.IsSuccess[0] == 'true') {
                    let modelInfo = [];
                    // modelbody.push(data);
                    if (counterresponsepackage.length > 0) {
                        for (var i = 0; i < counterresponsepackage.length; i++) {

                            const data = { Msisdn: counterresponsepackage[i].Msisdn[0], ProductNumber: counterresponsepackage[i].ProductNumber[0], CounterName: counterresponsepackage[i].CounterName[0], StartTime: counterresponsepackage[i].StartTime[0], ExpiryTime: counterresponsepackage[i].ExpiryTime[0], status: modeldatasuccess.IsSuccess[0] };
                            // const data = { status: modeldatasuccess.IsSuccess[0], Code: modeldatasuccess.Code[0], Msisdn: counterresponsepackage.Msisdn[0], PhoneNumber: counterresponsepackage.ProductNumber[0], CounterName: counterresponsepackage.CounterName[0], StartTime: counterresponsepackage.StartTime[0], ExpiryTime: counterresponsepackage.ExpiryTime[0] };
                            modelInfo.push(data)
                        }
                    }
                    const response = {
                        "status": true,
                        "message": "success",
                        "code": 0,
                        "result": modelInfo
                    }
                    modelresponse = response;

                    console.log(modelInfo);
                } else {
                    const data = { status: modeldatasuccess.IsSuccess[0], Code: modeldatasuccess.Code[0], Msisdn: phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: modeldatasuccess.Description[0] };
                    const response = {
                        "status": false,
                        "message": "failed",
                        "code": 1,
                        "result": data
                    }
                    modelresponse = response;
                    console.log(data);
                }
            });

            return res.json(modelresponse);
        }).catch(err => {
            console.log(err)
            if (err["cause"]) {
                if (err["cause"].name == "ConnectTimeoutError") {
                    return res.status(400).json({ status: false, code: 2, message: "ConnectTimeoutError", result: null })
                }
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 2, message: "ConnectTimeoutError", result: null })
    }

})



// data list file

app.post("/inquerylistphone", async (req, res) => {
    try {
        const body = req.body;

        let datamodel = []; // model data package == 
        let indexmodel = [];// index name package
        let data = req.body;
        console.log(data)
        if (data.length == 0) {
            return res.status(200).json({ status: false, code: 1, message: "body data not found phonenumber" });
        }
        if (data.length > 0) {
            let responseerr = { status: false, code: 0, message: "" };

            // for (var i = 0; i < data.length; i++) {
            for (let item of data) {
                // console.log(item)
                let format = /^85620[0-9]{8}/

                if (format.test(item)) {
                    const bodyquery = await bodyinquery(item.toString());
                    if (bodyquery == null) {
                        return res.status(400).json({ status: false, code: 0, message: "please check body inquery " })
                    }
                    const headers = {
                        'Content-Type': 'text/xml;charset=utf-8'
                    }
                    let model = [];
                    let modelbody = []; // model response fetch ? body : not found body response
                    let modelresponse = []; // model response

                    let modelnoresponsebody = [];
                    let modelnotbody = [];
                    await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                        method: "POST",
                        headers: headers,
                        body: bodyquery
                    }).then(response => {
                        return response.text();
                    }).then(responseText => {

                        const modeldata = responseText;
                        // console.log(modeldata)
                        parseString(modeldata, function (err, result) {

                            let datas = JSON.stringify(result);
                            const datass = JSON.parse(datas);
                            model.push(datass);

                            // console.log(typeof datas);
                            modelbody.push(model[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['CounterArray'][0]['CounterInfo'])

                            // 
                            let datanobody = JSON.stringify(result);
                            let databodynodata = JSON.parse(datanobody);
                            modelnoresponsebody.push(databodynodata);
                            // console.log(modelnoresponsebody[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['OperationStatus'][0])
                            modelnotbody.push(modelnoresponsebody[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['OperationStatus'][0])

                            if (modelbody.length > 0) {
                                for (var ii = 0; ii < modelbody[0].length; ii++) {
                                    modelresponse.push({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0], "RefillStopTime": modelbody[0][ii]['RefillStopTime'][0]['$']['xsi:nil'] });
                                }
                                if (modelresponse.length > 0) {
                                    // const index = modelresponse.findIndex(x => x.CounterName == 'Prepaid_Staff_5GB');
                                    const modelindexstaff = modelresponse.filter(x => x.CounterName.toString().indexOf("Prepaid_Staff") != -1)
                                    console.log(modelindexstaff)
                                    if (modelindexstaff.length == 1) {
                                        datamodel.push({ phone: modelindexstaff[0].Msisdn, ProductNumber: modelindexstaff[0].ProductNumber, status: true, CounterName: modelindexstaff[0].CounterName, description: "success", ExpiryTime: modelindexstaff[0].ExpiryTime, packagegroup: false });
                                    } else if (modelindexstaff.length > 1) {
                                        for (var i = 0; i < modelindexstaff.length; i++) {
                                            const data = { phone: modelindexstaff[i].Msisdn, ProductNumber: modelindexstaff[i].ProductNumber, status: true, CounterName: modelindexstaff[i].CounterName, description: "success", ExpiryTime: modelindexstaff[i].ExpiryTime, packagegroup: true }
                                            datamodel.push(data)
                                        }
                                    } else {
                                        datamodel.push({ phone: data[i].toString(), ProductNumber: null, status: false, CounterName: 'Prepaid_Staff_5GB', description: "not found package Prepaid_Staff", ExpiryTime: null, packagegroup: false });
                                    }
                                }
                                // console.log(modelresponse)
                            } else {
                                datamodel.push({ phone: item.phone.toString(), ProductNumber: null, status: false, CounterName: null, desription: "not found detail", ExpiryTime: "", packagegroup: false });
                            }
                        });
                    }).catch(async err => {

                        if (err["cause"]) {
                            if (err["cause"].name == "ConnectTimeoutError") {
                                responseerr.status = false;
                                responseerr.code = 2;
                                responseerr.message = "cannot inquery phone ConnectTimeoutError"
                            }
                        }

                        if (modelnotbody[0]) {
                            let errorphone = modelnotbody[0]['IsSuccess'][0] == 'false' && modelnotbody[0]['Code'][0] == "VSMP-06040707" ? modelnotbody[0]['Description'][0] : "phone number incorrent"
                            datamodel.push({ phone: item.toString(), ProductNumber: null, status: false, CounterName: null, description: errorphone, ExpiryTime: "" });
                        }

                    });

                    if (responseerr.status == false && responseerr.code == 2) {
                        return res.status(400).json({ status: false, code: 2, message: responseerr.message })
                    }

                } else {
                    datamodel.push({ phone: item.toString(), ProductNumber: null, status: false, CounterName: null, description: "format phone number incorrent", ExpiryTime: "" });
                }
            }
        }
        // console.log(datamodel);
        return res.json(datamodel)

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 1, message: "cannot detail phone." })
    }
});

app.post("/modifieldlistdatetime", async (req, res) => {
    try {

        const body = req.body;

        let model = [];
        let modelresponse = [];

        // console.log(body);

        if (body != null) {
            if (body.length > 0) {
                console.log("body modify")
                for (var i = 0; i < body.length; i++) {

                    const phone = body[i].phone;
                    const productno = body[i].ProductNumber;
                    const expire = body[i].datetime;
                    console.log(i);
                    if (body[i].ProductNumber == null) {
                        modelresponse.push({ status: false, code: 1, message: "not found package productnumber", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire, TransactionID: null, description: null, orderRef: null })
                        continue;

                        // modelresponse.push({ status: modelresponsetext[0].IsSuccess[0], code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: "", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                    }

                    let bodyrequest = bodymodiefield(phone, productno, expire);
                    if (bodyrequest == null) {
                        modelresponse.push({ status: false, code: 1, message: "please check body modifydatetime ", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire, TransactionID: null, description: null, orderRef: null })
                        // modelresponse.push({ status: modelresponsetext[0].IsSuccess[0], code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: "", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });

                    }

                    const headers = {
                        'Content-Type': 'text/xml;charset=utf-8'
                    }
                    // if (!bodyrequest) {
                    //     return res.status(400).json({ status: false, code: 1, message: "" })
                    // }

                    let model = [];
                    let modelbody = [];
                    let modelresponsetext = {};
                    await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                        method: "POST",
                        headers: headers,
                        body: bodyrequest
                    }).then(response => {
                        return response.text();
                    }).then(responseText => {

                        const modeldata = responseText;
                        console.log(modeldata)
                        parseString(modeldata, function (err, result) {
                            let datas = JSON.stringify(result);
                            const datass = JSON.parse(datas);

                            const model = datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0];

                            modelresponsetext = model

                        });
                        //    console.log(modelresponsetext);
                    }).catch(err => {
                        console.log(err);
                        if (err["cause"]) {
                            if (err["cause"].name == "ConnectTimeoutError") {
                                modelresponsetext = { status: false, code: 2, TransactionID: null, description: null, orderRef: null, message: "error_ConnectTimeoutError", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire }
                                // modelresponsetext.push();
                            }
                        }
                    });

                    console.log(modelresponsetext);
                    // console.log(modelresponsetext.IsSuccess[0].toString())
                    console.log(`model length :  ${modelresponse.length + "" + i}`);
                    if (!modelresponsetext.status) {

                        if (modelresponsetext.status == false && modelresponsetext.code == 2) {
                            modelresponse.push(modelresponsetext);
                            break;
                        }

                        if (modelresponsetext.IsSuccess[0] == 'true') {
                            // console.log({ status: modelresponsetext[0].IsSuccess[0], code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire })
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                            // modelresponse.push({ status: modelresponsetext[0].IsSuccess[0] == 'true' ? true : false, code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: modelresponsetext[0].IsSuccess[0] ? "" : "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire })

                        }
                    } else {

                        console.log("IsSucces true")
                        // console.log(modelresponsetext)
                        if (modelresponsetext.IsSuccess[0] == 'true') {
                            // console.log({ status: modelresponsetext[0].IsSuccess[0], code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire })
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                            // modelresponse.push({ status: modelresponsetext[0].IsSuccess[0] == 'true' ? true : false, code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: modelresponsetext[0].IsSuccess[0] ? "" : "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire })

                        } else {
                            //  console.log({ status: modelresponsetext[0].IsSuccess[0], code: modelresponsetext[0].Code[0], TransactionID: modelresponsetext[0].TransactionID[0], description: modelresponsetext[0].Description[0], orderRef: modelresponsetext[0].OrderRef[0], message: "", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                        }
                    }
                }

                if (modelresponse.length > 0) {
                    const indextimeout = modelresponse.filter(x => x.status == false && x.code == 2);
                    console.log("index model : " + indextimeout);
                    if (indextimeout.length == 0) {
                        return res.status(200).json({ status: true, code: 0, message: "", result: modelresponse });
                    } else {
                        return res.status(400).json({ status: false, code: 2, message: "", result: modelresponse });
                    }
                }
            }
        }

        return res.status(400).json({ status: false, code: 1, message: "cannot modify dateexpire", result: [] });


    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "cannot modify phone", result: [] });
    }
})

app.post("/addpackagelistphone", async (req, res) => {
    try {

        const body = req.body;

        console.log(body)
        let modelres = [];
        if (body.length > 0) {
            for (var i = 0; i < body.length; i++) {

                const phone = body[i].phone;
                let countername = body[i].countername;
                const starttime = body[i].starttime;
                const expiretime = body[i].expiretime;
                const refillstoptime = body[i].RefillStopTime;
                // countername = body[i].countername == 1 ? "Prepaid_Staff_3GB" : body[i].countername == 2 ? "Prepaid_Staff_5GB" : body[i].countername == 3 ? "Prepaid_Staff_7GB" : body[i].countername == 4 ? "Prepaid_Staff_10GB" : body[i].countername == 5 ? "Prepaid_Staff_15GB" : body[i].countername == 6 ? "Prepaid_Staff_20GB" : ""

                if (countername == "") return;

                const bodyadd = await bodyaddpackage(phone, countername, starttime, expiretime, refillstoptime);
                console.log(bodyadd)

                if (bodyadd == null) {
                    return res.status(400).json({ status: false, code: 1, message: "please check body data" });
                }

                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }
                let model = [];

                let modelbody = [];

                await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                    method: "POST",
                    headers: headers,
                    body: bodyadd
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    const modeldata = responseText;
                    console.log(modeldata)
                    parseString(modeldata, function (err, result) {

                        let data = JSON.stringify(result);
                        const datas = JSON.parse(data);
                        // console.log(data)
                        model.push(datas);
                        // console.log(model);
                        const statusmodel = model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0];
                        if (statusmodel.IsSuccess[0] == 'true') {

                            let modelcounterarra = model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo'][0];

                            // statusmodel   modelcounterarra
                            const data = { status: statusmodel.IsSuccess[0], Code: statusmodel.Code[0], Msisdn: modelcounterarra.Msisdn[0], ProductNumber: modelcounterarra.ProductNumber[0], CounterName: modelcounterarra.CounterName[0], StartTime: modelcounterarra.StartTime[0], ExpiryTime: modelcounterarra.ExpiryTime[0], message: "success" }

                            //  modelbody.push(model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0])
                            console.log(data)
                            modelres.push(data)
                            console.log(modelcounterarra)
                        } else { // fetch response failed add package status false
                            const data = { status: statusmodel.IsSuccess[0], Code: statusmodel.Code[0], Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: statusmodel.Description[0] }
                            modelres.push(data);
                        }

                        console.log(modelbody)
                        console.log(statusmodel)


                    })

                }).catch(error => {
                    if (error["cause"]) {
                        if (error["cause"].name == "ConnectTimeoutError") {
                            const data = { status: false, code: 2, Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: "ConnectTimeoutError" }
                            modelres.push(data);
                        }
                    }

                    console.log(error)
                })
            }
            if (modelres.length > 0) {
                var indexmodel = modelres.filter(x => x.status == false && x.code == 2);
                if (indexmodel.length > 0) {
                    return res.status(400).json({ status: false, code: 2, message: "cannot add package ConnectTimeoutError", result: modelres })
                }
            }

            return res.status(200).json({ status: true, code: 0, message: "success", result: modelres })
        }

        return res.status(400).json({ status: false, code: 1, message: "cannot addpackage phone", result: [] })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "", result: [] })
    }
});

const sleep = (ms) => {
    return new Promise(ress => setTimeout(ress, ms));
}


module.exports = app;