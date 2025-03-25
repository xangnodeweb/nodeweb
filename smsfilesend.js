const app = require("express").Router();

const path = require("path");
const fs = require("fs/promises");

const axios = require("axios");
const auth = require("./user/auth");


app.post("/smssendfile", [auth], async (req, res) => {

    try {

        const body = req.body;
        let model = [];
        let optionselectfile = body.optionselectfile;
        let userid = req.user.userid;
        // console.log(body.smsbody) 
        console.log(body.msgcontent)
        console.log(body.optionselectfile)
        if (optionselectfile == 0) {

            let msgcontent = body.msgcontent;

            if (body.smsbody.length > 0) {

                for (var i = 0; i < body.smsbody.length; i++) {

                    let amount = '';
                    let contentmsg = '';
                    amount = body.smsbody[i].amount;

                    if (body.smsbody[i].amount != '') {

                        // index phone 
                        contentmsg = body.msgcontent;

                        let indexphone = contentmsg.indexOf("_phone_");
                        // console.log(indexphone)
                        if (indexphone != -1) {

                            contentmsg = contentmsg.replace(new RegExp("_phone_", "g"), body.smsbody[i].Msisdn);
                        }

                        // amount 

                        let indexamount = contentmsg.indexOf("_amount_");
                        if (indexamount != -1) {
                            contentmsg = contentmsg.replace(new RegExp("_amount_", "g"), body.smsbody[i].amount);
                        }

                        // index date

                        let date = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date());
                        date = date.toString().slice(0, 10);
                        let indexdate = contentmsg.indexOf("_date_");
                        if (indexdate != -1) {
                            contentmsg = contentmsg.replace(new RegExp("_date_", "g"), date.toString());
                        }
                        // console.log(contentmsg)
                        model.push({ Msisdn: body.smsbody[i].Msisdn, amount: amount, msgcontent: contentmsg, statussms: false, code: 0, status: false, message: "" })

                    } else {

                        // else not amount check content amount
                        contentmsg = body.msgcontent;
                        let indexamount = contentmsg.indexOf("_amount_")
                        if (indexamount != -1) {

                            model.push({ Msisdn: body.smsbody[i].Msisdn, amount: amount, msgcontent: contentmsg, statussms: false, code: 1, status: false, message: "content_format_incorrent." })
                            break;
                        }

                        let indexphone = contentmsg.indexOf("_phone_");
                        // console.log(indexphone)
                        if (indexphone != -1) {
                            contentmsg = contentmsg.replace(new RegExp("_phone_", "g"), body.smsbody[i].Msisdn);
                        }

                        // index date

                        let date = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date());
                        date = date.toString().slice(0, 10);
                        let indexdate = contentmsg.indexOf("_date_");
                        if (indexdate != -1) {
                            contentmsg = contentmsg.replace(new RegExp("_date_", "g"), date.toString());
                        }
                        model.push({ Msisdn: body.smsbody[i].Msisdn, amount: '', msgcontent: contentmsg, statussms: false, code: 0, status: false, message: "" })
                    }

                }

                const indexmodel = model.findIndex(x => x.status == false && x.code == 1);
                if (indexmodel != -1) {
                    return res.status(400).json({ status: false, code: 1, message: "please check content message incorrent.", result: [] });
                }

            } else {

                return res.status(400).json({ status: false, code: 0, message: "model_notfound_sendsms_failed" })
            }
            console.log(model);
            return res.status(200).json({ status: true, code: 0, message: "", result: model })
        } else {

            if (body.smsbody.length > 0) {
                for (var i = 0; i < body.smsbody.length; i++) {
                    let contentmsg = "";
                    model.push({ Msisdn: body.smsbody[i].Msisdn, amount: '', msgcontent: body.smsbody[i].msgcontent, statussms: false, code: 0, status: false, message: "" })

                }
            }
        }


        if (model.length > 0) {

            let header = "Lao%2DTelecom"
            for (var i = 0; i < model.length; i++) {


                try {
                    let datas = {
                        "CMD": "SENDMSG",
                        "FROM": header,
                        "TO": model[i].Msisdn.toString(),
                        "REPORT": "Y",
                        "CHANGE": "8562052199062",
                        "CODE": "45140377001",
                        "CTYPE": "UTF-8",
                        "CONTENT": model[i].msgcontent.toString()
                    }

                    console.log(datas);
                    let data = await axios.post("http://10.30.6.26:10080", datas, { timeout: 15000 })

                    console.log(data.data);

                    if (data.status == 200) {

                        if (data.data.SMID) {
                            if (data.data.resultCode == "20000") {
                                model[i].statussms = true;
                            } else {
                                model[i].statussms = false;
                            }
                            await logsendsms(model[i], data.data.SMID, userid)
                        } else {
                            await logsendsms(model[i], null, userid)
                        }
                    } else {
                        await logsendsms(model[i], null, userid)
                    }
                } catch (error) {

                    await logsendsms(model[i], userid)
                    console.log(error);
                }




            }



        }


        return res.status(200).json({ status: true, code: 0, message: "", result: model })

    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, code: 1, message: "cannot_sendsms_failed" })
    }
})


const logsendsms = async (data, smid, userid) => {

    try {


        const paths = path.join(__dirname, "./filedatatxt/")
        let date = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date());
        date = date.toString().slice(0, 10);
        let line = `${data.Msisdn}|${data.msgcontent}|${smid}|${data.statussms}|${date}\n`;
        await fs.appendFile(paths + "filesmscontent.txt", line, (err) => {

            if (err) {
                console.log(data);
                console.log("cannot write log sendsms");
            }
        })


    } catch (error) {
        console.log(error);
    }

}


module.exports = app;