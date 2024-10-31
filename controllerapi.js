
const app = require("express").Router();
const express = require("express")();

const { bodyinquery, bodymodiefield, bodyaddpackage, changemaxdate, changemainoffering, adddatafile } = require("./modelbody");
const { parseString } = require("xml2js");
const fetch = require("node-fetch");




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
            // console.log(modeldata)
            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);

                model.push(datass);

                // console.log(typeof datas);// 
                // console.log(model[0]['soap:Envelope']['soap:Body']) // 
                modelbody.push(model[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['CounterArray'][0]['CounterInfo'])
                // console.log(modelbody[0].length)
                if (modelbody.length > 0) {
                    for (var ii = 0; ii < modelbody[0].length; ii++) {
                        // console.log({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0] })
                        modelresponse.push({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0], "RefillStopTime": modelbody[0][ii]['RefillStopTime'][0]['$']['xsi:nil'] });
                    }
                }
            });

            return res.json({ status: true, code: 0, message: "success", result: modelresponse });
        }).catch(err => {
            // console.log(err)

            const error = JSON.stringify(err)
            const errors = JSON.parse(error);
            console.log(errors)

            if (err) {
                if (errors.code == "ETIMEDOUT") {
                    return res.status(400).json({ status: false, code: 2, message: "ConnectTimeoutError", result: [] });
                }
            }
            //     if (err["cause"].name == "ConnectTimeoutError") 
            return res.status(400).json({ status: false, code: 1, message: "cannot inquery phone", result: [] });
        })


    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, code: 1, message: "cannot inquery phone" });
    }
});

app.post("/modifielddatetime", async (req, res) => {
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
            return res.status(400).json({ status: false, code: 2, message: "please check body modifielddatetime ", result: null });
        }

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

            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);
                // console.log(datass) 

                // console.log(datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0])
                modelresponse = datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0];



            });

            return res.json({ status: true, code: 0, message: "success", result: modelresponse });
        }).catch(err => {
            console.log(err)
            const error = JSON.stringify(err);
            const errors = JSON.parse(error);
            if (err) {
                if (errors.code == "ETIMEDOUT") {
                    return res.status(400).json({ status: false, code: 3, message: "cannot modify ConnectTimeoutError", result: null });
                }
            }
            return res.json({ status: false, code: 2, message: "cannot modify phone", result: null });
        })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, code: 1, message: "cannot modify phone", result: null });

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
        // console.log(phone, countername, datestart, dateexpire, refillstoptime);
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
            counternames = "Prepaid_Staff 15GB";
        } else if (countername == 5) {
            counternames = "Prepaid_Staff_25GB";
        }
        // console.log(counternames);

        const bodyquery = await bodyaddpackage(phone, counternames, datestart, dateexpire, refillstoptime);
        // console.log(bodyquery);

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

            const modeldata = responseText

            parseString(modeldata, function (err, result) {
                let datas = JSON.stringify(result);
                const datass = JSON.parse(datas);


                modelbody.push(datass['soap:Envelope']['soap:Body']);
                const modeldatasuccess = datass['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0]; // operation status
                const counterresponsepackage = datass['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo']; // counterinfo data


                if (modeldatasuccess.IsSuccess[0] == 'true') {
                    let modelInfo = [];

                    if (counterresponsepackage.length > 0) {
                        for (var i = 0; i < counterresponsepackage.length; i++) {

                            const data = { Msisdn: counterresponsepackage[i].Msisdn[0], ProductNumber: counterresponsepackage[i].ProductNumber[0], CounterName: counterresponsepackage[i].CounterName[0], StartTime: counterresponsepackage[i].StartTime[0], ExpiryTime: counterresponsepackage[i].ExpiryTime[0], status: modeldatasuccess.IsSuccess[0] };
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

                    // console.log(modelInfo);
                } else {
                    const data = { status: modeldatasuccess.IsSuccess[0], Code: modeldatasuccess.Code[0], Msisdn: phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: modeldatasuccess.Description[0] };
                    const response = {
                        "status": false,
                        "message": "failed",
                        "code": 1,
                        "result": data
                    }
                    modelresponse = response;
                }
            });

            if (modelresponse.status = true) {

                adddatafile(modelresponse, 0);
                return res.status(200).json(modelresponse);
            } else {
                return res.status(400).json(modelresponse);
            }

        }).catch(err => {
            console.log(err)
            const error = JSON.stringify(err);
            const errors = JSON.parse(error);
            if (err) {
                if (errors.code == "ETIMEDOUT") {
                    modelresponse = { status: false, code: 2, message: "cannot add package ConnectTimeoutError", result: null }
                }
            }
        });

        if (modelresponse.status == false && modelresponse.code == 2) {
            return res.status(400).json(modelresponse);
        }



    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "cannot add package", result: null });
    }

});


// data list file

app.post("/inquerylistphone", async (req, res) => {
    try {
        const body = req.body;

        let datamodel = []; // model data package == 
        let indexmodel = [];// index name package
        let data = req.body;

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
                    //
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

                            modelbody.push(model[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['CounterArray'][0]['CounterInfo']); //


                            let datanobody = JSON.stringify(result);
                            let databodynodata = JSON.parse(datanobody); // model list package phone
                            modelnoresponsebody.push(databodynodata);

                            modelnotbody.push(modelnoresponsebody[0]['soap:Envelope']['soap:Body'][0]['inquiryCounterResponse'][0]['inquiryCounterResult'][0]['OperationStatus'][0]); // default response cannot  inquery phone 
                            // modelnotbody == model not found CounterInfo


                            if (modelbody[0].length > 0) {
                                // model inquery phone success 
                                for (var ii = 0; ii < modelbody[0].length; ii++) {
                                    modelresponse.push({ "Msisdn": modelbody[0][ii]['Msisdn'][0], "ProductNumber": modelbody[0][ii]['ProductNumber'][0], "CounterName": modelbody[0][ii]['CounterName'][0], "StartTime": modelbody[0][ii]['StartTime'][0], "ExpiryTime": modelbody[0][ii]['ExpiryTime'][0], "NumChildCounter": modelbody[0][ii]['NumChildCounter'][0], "RefillStopTime": modelbody[0][ii]['RefillStopTime'][0]['$']['xsi:nil'] });
                                }

                                if (modelresponse.length > 0) {
                                    // const index = modelresponse.findIndex(x => x.CounterName == 'Prepaid_Staff_5GB');
                                    const modelindexstaff = modelresponse.filter(x => x.CounterName.toString().indexOf("Prepaid_Staff") != -1) // list package phone > 1 package

                                    if (modelindexstaff.length == 1) {
                                        datamodel.push({ phone: modelindexstaff[0].Msisdn, ProductNumber: modelindexstaff[0].ProductNumber, status: true, CounterName: modelindexstaff[0].CounterName, description: "success", ExpiryTime: modelindexstaff[0].ExpiryTime, packagegroup: false, code: 0 });
                                    } else if (modelindexstaff.length > 1) {

                                        for (var i = 0; i < modelindexstaff.length; i++) {
                                            const data = { phone: modelindexstaff[i].Msisdn, ProductNumber: modelindexstaff[i].ProductNumber, status: true, CounterName: modelindexstaff[i].CounterName, description: "success", ExpiryTime: modelindexstaff[i].ExpiryTime, packagegroup: true, code: 0 }
                                            datamodel.push(data)
                                        }

                                    } else {
                                        datamodel.push({ phone: item.toString(), ProductNumber: null, status: false, CounterName: null, description: "not found package", ExpiryTime: null, packagegroup: false, code: 0 });
                                    }
                                }

                            } else {
                                datamodel.push({ phone: item.phone.toString(), ProductNumber: null, status: false, CounterName: null, desription: "not found detail", ExpiryTime: null, packagegroup: false, code: 0 });
                            }
                        });
                    }).catch(async err => {
                        console.log(err)
                        const error = JSON.stringify(err);
                        const errors = JSON.parse(error)
                        if (err) {
                            if (errors.code == "ETIMEDOUT") {
                                responseerr.status == false;
                                responseerr.code = 2;
                                responseerr.message = "cannot inquery listphone ConnectTimeoutError"
                            }
                        }
                    });

                    if (responseerr.status == false && responseerr.code == 2) {
                        datamodel.push({ phone: item.toString(), ProductNumber: null, status: false, CounterName: null, description: "", ExpiryTime: null, packagegroup: false, code: 2, message: "cannot inquery phone ConnectTimeoutError" });
                        break;
                    }

                } else {
                    datamodel.push({ phone: item.toString(), ProductNumber: null, status: false, CounterName: null, description: "format phone number incorrent", ExpiryTime: "" });
                }
            }
            const modelindex = datamodel.filter(x => x.status == false && x.code == 2);

            if (modelindex.length > 0) {
                return res.status(400).json({ status: false, code: 2, message: "cannot inquery listphone ConnectTimeoutError", result: datamodel });
            } else {
                return res.status(200).json({ status: true, code: 0, message: "inquery list phone success", result: datamodel });
            }


        }
        // console.log(datamodel);
        return res.status(400).json({ status: false, code: 1, message: "cannot inquery list phone", result: datamodel });

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

        if (body != null) {
            if (body.length > 0) {

                for (var i = 0; i < body.length; i++) {

                    const phone = body[i].phone;
                    const productno = body[i].ProductNumber;
                    const expire = body[i].datetime;

                    if (body[i].ProductNumber == null) {
                        modelresponse.push({ status: false, code: 1, message: "not found package productnumber", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire, TransactionID: null, description: null, orderRef: null })
                        continue;
                    }

                    let bodyrequest = bodymodiefield(phone, productno, expire);
                    if (bodyrequest == null) {
                        modelresponse.push({ status: false, code: 1, message: "please check body modifydatetime ", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire, TransactionID: null, description: null, orderRef: null })

                    }

                    const headers = {
                        'Content-Type': 'text/xml;charset=utf-8'
                    }


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
                        // console.log(modeldata)
                        parseString(modeldata, function (err, result) {
                            let datas = JSON.stringify(result);
                            const datass = JSON.parse(datas);

                            const model = datass["soap:Envelope"]["soap:Body"][0]["modifyCounterResponse"][0]["modifyCounterResult"][0];

                            modelresponsetext = model

                        });
                        //    console.log(modelresponsetext);
                    }).catch(err => {
                        console.log(err);

                        const error = JSON.stringify(err)
                        const errors = JSON.parse(error);
                        if (err) {
                            if (errors.code == "ETIMEDOUT") {
                                modelresponsetext = { status: false, code: 2, TransactionID: null, description: null, orderRef: null, message: "cannot modify phone ConnectTimeoutError", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire }
                            } else {
                                modelresponsetext = { status: false, code: 0, TransactionID: null, description: null, orderRef: null, message: "cannot modify phone", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire }
                            }

                        }
                        //     if (err["cause"].name == "ConnectTimeoutError") {
                    });
                    // modelresponsetext  model responsetext 
                    if (!modelresponsetext.status) {
                        // modelresponsetext status == false && modelresponsetext code 2 // fetch timeout
                        if (modelresponsetext.status == false && modelresponsetext.code == 2) {
                            modelresponse.push(modelresponsetext);
                            break;
                        }

                        if (modelresponsetext.IsSuccess[0] == 'true') {
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                        }
                    } else {

                        if (modelresponsetext.IsSuccess[0] == 'true') {
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "success", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                        } else {
                            modelresponse.push({ status: modelresponsetext.IsSuccess[0], code: modelresponsetext.Code[0], TransactionID: modelresponsetext.TransactionID[0], description: modelresponsetext.Description[0], orderRef: modelresponsetext.OrderRef[0], message: "", Msisdn: phone, ProductNumber: productno, ExpiryTime: expire });
                        }
                    }
                }

                if (modelresponse.length > 0) {
                    const indextimeout = modelresponse.filter(x => x.status == false && x.code == 2);
                    if (indextimeout.length == 0) {
                        return res.status(200).json({ status: true, code: 0, message: "success", result: modelresponse });
                    } else {
                        return res.status(400).json({ status: false, code: 2, message: "cannot modify dateexpire", result: modelresponse });
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
        let modelres = [];
        if (body.length > 0) {
            for (var i = 0; i < body.length; i++) {

                const phone = body[i].phone;
                let countername = body[i].countername;
                const starttime = body[i].starttime;
                const expiretime = body[i].expiretime;
                const refillstoptime = body[i].RefillStopTime;
                // countername = body[i].countername == 1 ? "Prepaid_Staff_3GB" : body[i].countername == 2 ? "Prepaid_Staff_5GB" : body[i].countername == 3 ? "Prepaid_Staff_7GB" : body[i].countername == 4 ? "Prepaid_Staff_10GB" : body[i].countername == 5 ? "Prepaid_Staff_15GB" : body[i].countername == 6 ? "Prepaid_Staff_20GB" : ""

                if (countername == "") {
                    const data = { status: false, code: 1, Msisdn: phone, ProductNumber: null, CounterName: countername, StartTime: null, ExpiryTime: null, message: "not found countername" }

                    modelres.push(data)

                    continue
                };


                const bodyadd = await bodyaddpackage(phone, countername, starttime, expiretime, refillstoptime);


                if (bodyadd == null) {
                    return res.status(400).json({ status: false, code: 1, message: "please check body data" });
                }

                const headers = {
                    'Content-Type': 'text/xml;charset=utf-8'
                }
                let model = [];
                // let modelbody = [];

                await fetch("http://10.0.10.35/vsmpltc/web/services/amfwebservice.asmx", {
                    method: "POST",
                    headers: headers,
                    body: bodyadd
                }).then(response => {
                    return response.text();
                }).then(responseText => {

                    const modeldata = responseText;

                    parseString(modeldata, function (err, result) {

                        let data = JSON.stringify(result);
                        const datas = JSON.parse(data);

                        model.push(datas);

                        const statusmodel = model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['OperationStatus'][0];
                        if (statusmodel.IsSuccess[0] == 'true') {

                            let modelcounterarra = model[0]['soap:Envelope']['soap:Body'][0]['AddCounterResponse'][0]['AddCounterResult'][0]['CounterArray'][0]['CounterInfo'][0];

                            // statusmodel   modelcounterarra
                            const data = { status: statusmodel.IsSuccess[0], code: statusmodel.Code[0], Msisdn: modelcounterarra.Msisdn[0], ProductNumber: modelcounterarra.ProductNumber[0], CounterName: modelcounterarra.CounterName[0], StartTime: modelcounterarra.StartTime[0], ExpiryTime: modelcounterarra.ExpiryTime[0], message: "success" }
                            modelres.push(data);

                        } else { // fetch response failed add package status false
                            const data = { status: statusmodel.IsSuccess[0], code: statusmodel.Code[0], Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: statusmodel.Description[0] }
                            modelres.push(data);
                        }



                    })

                }).catch(error => {

                    console.log(error);

                    const errors = JSON.stringify(error);
                    const errorss = JSON.parse(errors);
                    if (error) {

                        if (errorss.code == "ETIMEDOUT") {
                            const data = { status: false, code: 2, Msisdn: body[i].phone, ProductNumber: "not found data", CounterName: "not found data", StartTime: "not found data", ExpiryTime: "not found data", message: "ConnectTimeoutError" }
                            modelres.push(data);

                        }
                    }
                });
            }

            if (modelres.length > 0) {
                var indexmodel = modelres.filter(x => x.status == false && x.code == 2);
                if (indexmodel.length > 0) {
                    return res.status(400).json({ status: false, code: 2, message: "cannot add package ConnectTimeoutError", result: modelres })
                }
            }
            adddatafile(modelres, 1);
            return res.status(200).json({ status: true, code: 0, message: "success", result: modelres })
        }

        return res.status(400).json({ status: false, code: 1, message: "cannot addpackage phone", result: [] })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, code: 1, message: "", result: [] });
    }
});




const sleep = (ms) => {
    return new Promise(ress => setTimeout(ress, ms));
}




module.exports = app;