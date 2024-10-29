import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";

import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";
import ModalInfoapp from "../filemodule/modalinfo";

import FormControl from "@mui/material/FormControl"
import FormHelpText from "rsuite/esm/FormHelpText";

import { addpackageExportexcel } from "../filemodule/xlsxload";
import { dateformat } from "../filemodule/dataformat";

export default function Addpackagephone() {

    const [phone, setphone] = useState("")
    const [countername, setcountername] = useState(0)
    const [datestart, setdatestart] = useState(null);
    const [dateexpire, setdateexpire] = useState(null);
    const [refillstoptime, setrefillstoptime] = useState(null);

    const [dataaddpackage, setdataaddpackage] = useState([]);

    const [iserr, setiserr] = useState(false); // status input or lable
    const [ismsg, setmsgs] = useState(0); // message input lable helper
    const [openmsg, setopenmsg] = useState(false)
    const [ismsgs, setismsgs] = useState({
        title: "",
        message: "",
        btnlength: 0,
        btnconfirmexpire: 0
    });
    const [loading, setloading] = useState(false);

    const valuephone = (e) => {
        try {

            setphone(e.target.value)
            // const format = /^[0-9\d]+$/

        } catch (error) {
            console.log(error)
        }
    }

    const datestartvalue = (e) => {
        try {

            const date = e.$d;
            const datestarts = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(date);
            setdatestart(datestarts)
            // console.log(datestarts);
        } catch (error) {
            console.log(error)
        }
    }
    const dateendvalue = (e) => {
        try {
            // console.log(e.$d);
            const dataend = e.$d;
            const dateends = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(dataend);
            setdateexpire(dateends);


        } catch (error) {
            console.log(error)
        }
    }
    const datrefillstopvalue = (e) => {
        try {
            // console.log(e.$d);
            const datarefillstop = e.$d;
            const daterefillstops = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(datarefillstop);
            setrefillstoptime(daterefillstops);

        } catch (error) {
            console.log(error)
        }
    }
    const countnamevalue = (e) => {
        try {
            // console.log(e.target.value);
            setcountername(e.target.value)
            setmsgs(0)

        } catch (error) {
            console.log(error)
        }
    }

    async function onaddpackage() {
        try {

            const format = /^85620[0-9]{8}/
            const phonenumber = phone.toString().replace(/[^0-9]+/g, "")
            // console.log(phonenumber)
            if (phonenumber.length < 13) {
                validinput(true, 6);

                // console.log({ "message": 6, "status": true })
                return;

            }
            // console.log(phone)
            if (!format.test(phonenumber)) {
                validinput(true, 5);
                return;
            }

            if (countername == 0) { // countername item value Select
                validinput(true, 8);
                return;
            }


            // error ismsgs 1 please value || ismsg please enter next day  
            // date start 0 1 2 || date expire 0 3 4 || phone format or length phone 0 5 6 || refillstop 0 7 || countername 8
            if (!datestart) {
                validinput(true, 1);
                return;
            }

            if (!dateexpire) {
                validinput(true, 3);
                return;
            }
            const datestarts = datestart.toString().replace(new RegExp("-", "g"), "");
            const dateexpires = dateexpire.toString().replace(new RegExp("-", "g"), "");

            if (parseInt(datestarts) > parseInt(dateexpires)) {
                calldialog("please check datestart and dateend", "please enter dateexpire greater than datestart", 1, 1, true);
                // call btn confirm lb error 
                return;
            }
            if (!refillstoptime) {
                validinput(true, 7);
                return;
            }
       
            validinput(false, 0);
            const datas = { "phone": phonenumber, "countername": countername, "datestart": datestart, "dateexpire": dateexpire, "refillstoptime": refillstoptime };
            // console.log(datas);
            setloading(true);
       
            const data = await axios.post("http://127.0.0.1:3000/api/addpackage", datas);
            if (data.status == 200) {
                // console.log(data.data.result);
                if (data.data.status == true) {
                    if (data.data.result[0].status == "true") {
                        if (data.data.result.length > 0) {
                            addpackageExportexcel({ data: data.data.result });
                        }
                        const datapackage = await getmodelpackage(data.data.result[0].Msisdn);
                        setdataaddpackage(datapackage);
                        setloading(false);
                        calldialog("", "add package success", 1, 0, true);
                    }

                } else {
                    setloading(false);
                    calldialog("", "cannot add package", 1, 0, true);
                }
                validinput(false, 0);
            }
        } catch (error) {
            // console.log(error)
            if (error) {
                if (error.response) {
                    const statuscode = error.response.data;

                    if (statuscode.status == false && statuscode.code == 2) {
                        setloading(false)
                        calldialog("", "cannot add package ConnectTimeoutError ", 1, 0, true);
                    } else {
                        setloading(false)
                        calldialog("", "cannot add package ", 1, 0, true);
                    }
                }else{
                    setloading(false)
                    calldialog("", "cannot add package ", 1, 0, true);
                }
            }
            setloading(false)
        }
    }

    const getmodelpackage = async (phones) => {
        try {

            const dataphone = { phone: phones }
            const data = await axios.post("http://127.0.0.1:3000/api/inqueryphone", dataphone);
            // console.log(data.data);
            if (data.status == 200) {
                // setdataaddpackage(data.data);
                return data.data.result;
            }
            return [];
        } catch (error) {
            console.log(error)
            return [];
        }
    }


    const callmodal = ({ status, delvalue }, e) => {
        try {
            setopenmsg(status);  // delvalue == clear
            // console.log(status, delvalue)
            if (delvalue == 2) {
                validinput(true, 4);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const calldialog = (title, message, btnlength, btnconfirmexpire, isopenmodal) => {
        try {

            ismsgs.title = title;
            ismsgs.message = message;
            ismsgs.btnlength = btnlength;
            ismsgs.btnconfirmexpire = btnconfirmexpire; // btnconfirmexpire == 1  btn valid true valid dateexpire
            // console.log(ismsgs)
            setopenmsg(isopenmodal);

        } catch (error) {
            console.log(error)
        }
    }

    const validinput = (iserr, isvalid) => {
        setiserr(iserr); // iserr false and isvlid
        setmsgs(isvalid);
    }

    useEffect(() => {

    }, [])

    return (
        <div className="w-100  d-flex bg-white position-relative">
            <div className="w-30 border-1- px-5 d-flex flex-column pt-4">

                <div className="w-100 box-shadow  px-3 py-5 d-flex flex-column">
                    <span className="mb-2">  phonenumber  </span>
                    <Phonenumber onChange={valuephone} value={phone} placeholder="(85620) 5xxxxxxx" helperText={iserr && ismsg == 5 ? "please enter format phone (85620) 5xxxxxxx" : iserr && ismsg == 6 ? "please enter 13 character phone (85620) 5xxxxxxx" : ""} error={iserr && ismsg == 5 || iserr && ismsg == 5 ? true : false} />

                    <span className="mt-1"> countername </span>
                    <FormControl >
                        <Select onChange={countnamevalue} value={countername} error={iserr && ismsg == 8 ? true : false} >
                            <MenuItem value={0}> disable package</MenuItem>
                            <MenuItem value={1}> Prepaid_Staff_3GB </MenuItem>
                            <MenuItem value={2}> Prepaid_Staff_5GB </MenuItem>
                            <MenuItem value={3}> Prepaid_Staff_7GB </MenuItem>
                            <MenuItem value={4}> Prepaid_Staff_10GB </MenuItem>
                            <MenuItem value={5}> Prepaid_Staff_15GB </MenuItem>
                            <MenuItem value={6}> Prepaid_Staff_25GB </MenuItem>
                        </Select>
                        {ismsg == 8 ? <>  <FormHelpText > please select package</FormHelpText> </> : ""}

                    </FormControl>

                    <span className="mt-2 mb-1"> startTime </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']} className="pt-0">
                            <DatePicker
                                // label="start datetime"
                                format="DD/MM/YYYY"
                                onChange={datestartvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                className="datepicker"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {iserr && ismsg == 1 ? <> <span className="color-red"> please select date start </span></> : iserr && ismsg == 2 ? <> <span className="color-red"> please select next date start </span></> : ""}
                    <span className="mt-2 mb-1"> expireTime </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']} className="">
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={dateendvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                slotProps={{
                                    textField: {
                                        helperText: iserr && ismsg == 3 ? "please select date dateexpire" : iserr && ismsg == 4 ? "please select next day dateexpire" : ""
                                    }
                                }}
                            />

                        </DemoContainer>
                    </LocalizationProvider>
                    <span className="mt-2"> RefillStopTime </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']} className="">
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={datrefillstopvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                slotProps={{
                                    textField: {
                                        helperText: iserr && ismsg == 7 ? "please select date refillstop" : ""
                                    }
                                }}
                                slots={{
                                    textField: (param) => <TextField   {...param} />
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {/* {iserr && ismsg == 3 ? <> <span className="color-red"> please select date expiry </span></> : iserr && ismsg == 4 ? <> <span className="color-red"> please select next  date expiry </span></> : ""} */}
                    <button className="mt-4 " onClick={onaddpackage}> add package </button>


                </div>


            </div>
            <div className="w-70 border-1- px-5 pt-4">

                <div className="w-100 h-500-px overflow-y-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th> msisdn </th>
                                <th> productname </th>
                                <th> countername </th>
                                <th> starttime </th>
                                <th> expiretime </th>
                                <th> RefillStopTime </th>
                            </tr>

                        </thead>
                        <tbody>
                            {
                                dataaddpackage && dataaddpackage.length > 0 && dataaddpackage.map((item, index) =>

                                    <tr>
                                        <td> {item.Msisdn} </td>
                                        <td> {item.ProductNumber} </td>
                                        <td> {item.CounterName} </td>
                                        <td> {dateformat(item.StartTime)} </td>
                                        <td> {dateformat(item.ExpiryTime)} </td>
                                        <td> {item.RefillStopTime} </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                </div>
                <div className="w-100">
                    <span> package list count : {0} </span>
                </div>
            </div>

            <ModalInfoapp callmodal={callmodal} opendialog={openmsg} statuslb={ismsgs} />
            <div className={`  ${loading ? "div-loader bg-backdrop flex" : "display-none"}`}>
                <div className="loader">

                </div>
            </div>
        </div>
    )
}

const Phonenumber = props => (<InputMask mask="(99999) 99999999" value={props.value} onChange={props.onChange}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} />}
</InputMask>)

