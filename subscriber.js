const app = require("express").Router();

const { v4 } = require("uuid");
const { newsubscriber } = require("./modelbody")
const fetch = require("node-fetch");
const { parseString } = require("xml2js");
const { response } = require("express");
app.post("/createnewsubscriber", async (req, res) => {
    try {

        const body = req.body;


        console.log(body)
        if (body.length > 0) {

            let header = {
                'Content-Type': 'text/xml;charset=utf-8'
            }

            for (var item = 0; item < body.length; item++) {

                const uuid = v4();
                const datetime = await datetimenow();
                let tranid = datetime + "" + uuid;
                const bodynewsubscriber = await newsubscriber(body[item].msisdn, body[item].offeringID, "", tranid);
                console.log(body[item])
                console.log(bodynewsubscriber)
                await fetch("", {
                    method: 'POST',
                    headers: header,
                    body: bodynewsubscriber
                }).then(res => {
                    return res.text();

                }).then(responsetext => {

                    const responsedata = responsetext;
                    parseString(responsedata, function (err, result) {

                        let data = JSON.stringify(result);
                        let datas = JSON.parse(data);
                        console.log(datas)
                        console.log(datas["soapenv:Envelope"]["soapenv:Body"][0]["bcs:CreateSubscriberResultMsg"])
                        console.log(datas["soapenv:Envelope"]["soapenv:Body"][0]["bcs:CreateSubscriberResultMsg"][0]["ResultHeader"][0])
                        console.log(datas["soapenv:Envelope"]["soapenv:Body"][0]["bcs:CreateSubscriberResultMsg"][0]["CreateSubscriberResult"][0])
                        // var resultcreate = datas["soapenv:Envelope"]["soapenv:Body"][0] != null ? datas["bcs:CreateSubscriberResultMsg"][0]["CreateSubscriberResult"] : ""
                        // console.log(resultcreate)

                        const headerdata = datas["soapenv:Envelope"]["soapenv:Body"][0]["bcs:CreateSubscriberResultMsg"][0]["ResultHeader"][0]
                        const createsubsciber = datas["soapenv:Envelope"]["soapenv:Body"][0]["bcs:CreateSubscriberResultMsg"][0]["CreateSubscriberResult"][0];
                        const subscriberbody = BodySubscribers(createsubsciber, headerdata)
                        if (subscriberbody != null) {
                            if (subscriberbody.ResultCode == "0") {
                                body[item].status = "true";
                            }
                            body[item].createsubscriber = {
                                OfferingKey : subscriberbody.OfferingKey,
                                EffectiveTime : subscriberbody.EffectiveTime,
                                EffectiveTimes : subscriberbody.EffectiveTimes,
                                ExpirationTime : subscriberbody.ExpirationTime,
                                PurchaseSeq : subscriberbody.PurchaseSeq
                            };
                        }
                        console.log(subscriberbody)
                    })

                }).catch(error => {

                    console.log(error);

                })

            }

        }

        return res.status(200).json({ status: true, message: "", code: 0, result: body })

    } catch (error) {
        console.log(error);
    }

})

const datetimenow = async () => {
    try {

        const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date());
        const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(new Date());
        let datetime = date.toString().replace(new RegExp("-", "g"), "") + "" + time.toString().replace(new RegExp(":", "g"), "");
        console.log(datetime)

        return datetime;

    } catch (error) {
        console.log(error)
    }
}

const BodySubscribers = function (request, reqheader) {
    try {

        let version = "";
        let ResultCode = "";
        let ResultDesc = "";
        let EffectiveTime = "";
        let OfferingInst = "";
        let OfferingKey = "";
        let EffecttiveTimes = "";
        let ExpirationTime = "";
        let PurchaseSeq = "";

        if (reqheader) {
            if (reqheader != null) {
                if (reqheader["cbs:Version"] != null) {
                    version = reqheader["cbs:Version"][0].toString();

                }
                if (reqheader["cbs:ResultCode"] != null) {
                    ResultCode = reqheader["cbs:ResultCode"][0].toString();

                }
                if (reqheader["cbs:ResultDesc"] != null) {
                    ResultDesc = reqheader["cbs:ResultDesc"][0].toString();
                }
            }
        }


        if (request) {
            if (request != null) {

                if (request["bcs:EffectiveTime"] != null) {
                    EffectiveTime = request["bcs:EffectiveTime"].toString();
                }
    console.log(EffectiveTime)
                if (request["bcs:OfferingInst"] != null) {
                    if (request["bcs:OfferingInst"].length > 0) {

                        if (request["bcs:OfferingInst"][0] != null) {

                            if (request["bcs:OfferingInst"][0]["bcc:OfferingKey"] != null) {
                                if (request["bcs:OfferingInst"][0]["bcc:OfferingKey"][0]["bcc:OfferingID"] != null) {
                                    OfferingKey = request["bcs:OfferingInst"][0]["bcc:OfferingKey"][0]["bcc:OfferingID"][0];
                                }
                                if (request["bcs:OfferingInst"][0]["bcc:OfferingKey"][0]["bcc:PurchaseSeq"] != null) {
                                    PurchaseSeq = request["bcs:OfferingInst"][0]["bcc:OfferingKey"][0]["bcc:PurchaseSeq"][0];
                                }
                            }
                            if (request["bcs:OfferingInst"][0]["bcc:EffectiveTime"] != null) {
                                EffecttiveTimes = request["bcs:OfferingInst"][0]["bcc:ExpirationTime"][0];
                            }
                            if (request["bcs:OfferingInst"][0]["bcc:ExpirationTime"] != null) {
                                ExpirationTime = request["bcs:OfferingInst"][0]["bcc:ExpirationTime"][0];
                            }
                        }

                    }
                }

            }

        }
        let headerres = {
            ResultCode: ResultCode,
            ResultDesc: ResultDesc,
            version: version,

            createsubscriber: {
                OfferingKey: OfferingKey,
                EffectiveTime: EffectiveTime,
                EffectiveTimes: EffecttiveTimes,
                ExpirationTime: ExpirationTime,
                PurchaseSeq: PurchaseSeq
            }
        }
        console.log(headerres)
        return headerres
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = app