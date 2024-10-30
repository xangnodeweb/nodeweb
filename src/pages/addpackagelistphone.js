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
import { MenuItem } from "@mui/material";
import ModalInfoapp from "../filemodule/modalinfo";
import * as xlsx from "xlsx";
import { addpackageExportexcel } from "../filemodule/xlsxload";
export default function Addpackagelistphone() {

    const [countername, setcountername] = useState(0)
    const [datestart, setdatestart] = useState(null);
    const [dateexpire, setdateexpire] = useState(null);
    const [refillstoptime, setrefillstoptime] = useState(null)

    const [filedata, setfiledata] = useState([]); // filedata txt
    const [filedatas, setfiledatas] = useState([]) // filedata xlsx

    const [modelfile, setmodelfile] = useState([]);

    const [iserr, setiserr] = useState(false); // status input or lable
    const [ismsg, setmsgs] = useState(0); // message input lable helper
    const [openmsg, setopenmsg] = useState(false)
    const [btnor, setbtnor] = useState(true)
    const [ismsgs, setismsgs] = useState({
        title: "",
        message: "",
        btnlength: 0
    });
    const [btnchecks, setbtncheck] = useState(0);
    const [loading, setloading] = useState(false);
    const btnopenfiletxt = async (e) => {
        try {
            const file = e.target.files[0];
            const render = new FileReader();
            if (e.size == 0) {
                // console.log(e.size == 0 ? "name 0 " : "")
                // console.log(e.target.files[0])
                return;
            }
            setmodelfile([])
            render.onload = () => {
                const datafilelist = render.result.split(/\r?\n/);
                // console.log(datafilelist)

                let modeldata = [];
                if (datafilelist.length == 1) {
                    const datafile = datafilelist[0] == '' ? null : datafilelist[0];
                    // console.log(datafile)
                    if (datafile == null) {

                        calldialog("please check file", "file txt not found data", 1, 0)

                        return;
                    } else {


                        const datafileonerecord = datafilelist[0].toString().split(",");
                        // console.log(datafileonerecord)
                        if (datafileonerecord.length > 1) {
                            modeldata.push({ phone: datafileonerecord[0], countername: datafileonerecord[1], starttime: datestart, expiretime: dateexpire, RefillStopTime: refillstoptime });
                            setmodelfile(modeldata)
                        }else{
                            
                            calldialog("please check file", "please check data file phone and package name", 1, 0)
                            return
                        }
        
                    }
                } else {

                    if (datafilelist.length > 0) {

                        for (var i = 0; i < datafilelist.length; i++) {
                            // console.log(datafilelist[i].toString().split(","))
                            const modelphone = datafilelist[i].toString().split(",");

                            if (modelphone.length != 2) {

                                calldialog("please check file", "please check data file phone and package", 1, 0)
                                return;

                            }
                            const phones = modelphone[0];
                            const counternames = modelphone[1];
                            // console.log(modelphone);
                            // console.log(phones, counternames);

                            filedata.push({ phone: phones, countername: modelphone[1], starttime: datestart, expiretime: dateexpire, RefillStopTime: refillstoptime });
                        }
                    }
                    // console.log(filedata)
                    if (filedata.length > 0) {
                        modeldata.push(...filedata);
                    }

                    // filedata.push(...datafilelist);
                    // for (var i = 0; i < filedata.length; i++) {
                    //     modeldata.push({ phone: filedata[i], countername: countername, starttime: datestart, expiretime: dateexpire, RefillStopTime: refillstoptime });
                    // }  
                    // console.log(modeldata);
                    setmodelfile(modeldata)
                }

            }

            if (file.name.toString().substr(file.name.toString().length - 3) != "txt") {
                console.log(`type fiel : ${file.name.toString().substr(file.name.toString().length - 3)}`)
                ismsgs.title = "please check file";
                ismsgs.message = "please enter value file type .txt";
                ismsgs.btnlength = 1;
                setfiledata([]);
                setopenmsg(true);
                return;
            }

            render.readAsText(file);
        } catch (error) {
            console.log(error)
        }
    }

    const showfilexlsx = (e) => {
        try {

            const file = e.target.files[0];
            const render = new FileReader();
            // console.log(file);
            clearmodelfile();

            render.onload = (event) => {

                const workbook = xlsx.read(event.target.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                // const sheetData = xlsx.utils.sheet_to_json(sheet);

                const sheetData = xlsx.utils.sheet_to_txt(sheet);
                // console.log(sheetData)
                let models = [];
                const model = JSON.stringify(sheetData);
                // console.log(model.split('\n'));

                // console.log(sheetData.toString().split('\n'));

                const modeldata = sheetData.toString().split('\n');
                if (modeldata.length > 0) {
                    let phoneformat = /^85620[0-9]{8}/
                    let counternameformat = ""  //  counter name Prepaid_Staff_5GB  value Prepaid_Staff_  ([0-9]{3}) > 3
                    let filestatus = false;
                    for (var i = 0; i < modeldata.length; i++) {
                        // console.log(modeldata[i]);

                        if (modeldata[i] == "\t") {  // next data string not found data
                            continue;
                        }
                        const data = modeldata[i].split('\t');
                        // console.log(data);
                        if (data.length != 2) { // column last >  2 data column if then 2 phone , countername

                            calldialog("please check file", "please check data file : phone and package ", 1, 0);
                            return;
                        }

                        // console.log(data[0]);
                        if (!phoneformat.test(data[0])) {
                            calldialog("please check file", "data file phonenumber incorrent ", 1, 0);
                            return;
                        }


                        const phones = data[0];
                        const counternames = data[1];

                        filedata.push({ phone: phones, countername: counternames, starttime: datestart, expiretime: dateexpire, RefillStopTime: refillstoptime });
                    }
                    setmodelfile(filedata)
                }

            }

            render.readAsBinaryString(file);  // call function onload
        } catch (error) {
            console.log(error)
        }
    }

    const datestartvalue = (e) => {
        try {

            const date = e.$d;
            const datestarts = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(date);
            setdatestart(datestarts)

            const datevaluestart = datestarts.toString().replace(new RegExp("-", "g"), "");
            if (dateexpire != null) {
                const datevalueexpire = dateexpire.toString().replace(new RegExp("-", "g"), "");
                if (parseInt(datevaluestart) > parseInt(datevalueexpire)) {
                    validinput(true, 2);
                    return;
                } else {
                    validinput(false, 0);
                }
            }

            if (modelfile.length > 0) {
                modelfile.forEach(item => { item.countername = item.countername, item.RefillStopTime = refillstoptime, item.starttime = datestarts, item.expiretime = dateexpire })
            }

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

            const dateexpires = dateends.toString().replace(new RegExp("-", "g"), "");
            if (datestart != null) {
                const datestarts = datestart.toString().replace(new RegExp("-", "g"), "");
                if (parseInt(datestarts) > parseInt(dateexpires)) {
                    validinput(true, 4);
                    return;
                }
            }
            if (modelfile.length > 0) {
                modelfile.forEach(item => { item.countername = item.countername, item.RefillStopTime = refillstoptime, item.starttime = datestart, item.expiretime = dateends })
            }

            validinput(false, 0);
        } catch (error) {
            console.log(error)
        }
    }

    const daterefillstopvalue = (e) => {
        try {
            // console.log(e.$d);
            const datarefillstop = e.$d;
            const daterefillstops = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(datarefillstop);
            setrefillstoptime(daterefillstops);
            if (modelfile.length > 0) {
                modelfile.forEach(item => { item.phone = item.phone, item.countername = item.countername, item.RefillStopTime = daterefillstops, item.starttime = datestart, item.expiretime = dateexpire })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const countnamevalue = (e) => {
        try {

            setcountername(e.target.value)
            if (modelfile.length > 0) {
                modelfile.forEach(item => { phone: item.phone, item.countername = countername, item.RefillStopTime = refillstoptime, item.starttime = datestart, item.expiretime = dateexpire })
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function onaddpackage() {
        try {
            // error ismsgs 1 please value || ismsg please enter next day  
            // date start 0 1 2 || date expire 0 3 4 || phone format or length phone 0 5 6 || refillstop 0 7 || countername 8
            if (modelfile.length == 0) {
                calldialog("please select file", "file txt or xlsx not found data", 1, 0)
                return;
            }

            if (!datestart) {

                validinput(true, 1);
                return;
            }
            if (!dateexpire) {

                validinput(true, 3);
                return;
            }

            if (!refillstoptime) {

                validinput(true, 7);
                return;
            }

            const datestarts = datestart.toString().replace(new RegExp("-", "g"), "");
            const dateexpires = dateexpire.toString().replace(new RegExp("-", "g"), "");

            if (parseInt(datestarts) > parseInt(dateexpires)) {
                calldialog("please check datestart and dateend", "please enter dateexpire greater than datestart", 1, 0)
                return;
            }
            setiserr(false);
            setmsgs(0)
            const namepackage = "Prepaid_Staff_";
            const modelcountername = modelfile.filter(x => !x.countername.toString().toLowerCase().includes(namepackage.toLocaleLowerCase()));

            if (modelcountername.length > 0) {
                calldialog("cannot add package", `please check countername  phone : ${modelcountername[0].phone}`, 1, 0)
                return;

            }
            setloading(true);
            const data = await axios.post("http://127.0.0.1:3000/api/addpackagelistphone", modelfile);
            if (data.status == 200) {

                addpackageExportexcel({ data: data.data.result })
                validinput(false, 0);
                setloading(false);
                calldialog("add package", "add package success", 1, 0)
                return;
            }

        } catch (error) {
            console.log(error)
            const statuscode = error.response.data;
            if (error) {
                if (error.response) {
                    if (statuscode.status == false && statuscode.code == 2) {
                        if (statuscode.result.length > 0) {
                            const modelsuccess = statuscode.result.filter(x => x.status == 'true');
                            if (modelsuccess.length > 0) {
                                addpackageExportexcel({ data: modelsuccess });
                                calldialog("please check data add package ", `add package  phone success count : ${modelsuccess.length}`, 1, 1)
                                return;
                            }
                        }
                        ismsgs.title = "cannot add package ";
                        ismsgs.message = statuscode.message;
                        ismsgs.btnlength = 1;
                        setopenmsg(true);
                    } else {
                        ismsgs.title = "cannot add package";
                        ismsgs.message = statuscode.message;
                        ismsgs.btnlength = 1;
                        setopenmsg(true);
                        return;
                    }
                }
            }
        }
    }
    const callmodal = ({ status, delvalue }, e) => {
        try {
            setopenmsg(status);  // delvalue == clear
            if (delvalue == 1) {
                setiserr(true);
                // setmsgs(4)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const btncheck = (e) => {
        try {

            setbtncheck(e.target.value)
            setfiledata([]);
            setmodelfile([]);
        } catch (error) {
            console.log(error)
        }
    }

    const loaddatafile = (e) => {
        try {
            e.preventDefault();
            // console.log(modelfile)
            console.log("file data length : " + modelfile.length)
            if (modelfile.length == 0) {

                ismsgs.title = "please select file";
                ismsgs.message = "please open file  txt or xlsx";
                ismsgs.btnlength = 1;
                setopenmsg(true);
                return;
            }
            if (modelfile.length > 0) {
                modelfile.forEach(item => { item.phone = item.phone, item.countername = countername, item.datestart = datestart, item.dateexpire = dateexpire, item.RefillStopTime = refillstoptime });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const calldialog = (title, message, btnlength, btnconfirmlength) => {
        try {
            ismsgs.message = message;
            ismsgs.title = title;
            ismsgs.btnlength = btnlength;

            setopenmsg(true);

        } catch (error) {
            console.log(error);
        }
    }
    const clearmodelfile = () => {
        setfiledata([]);
        setmodelfile([]);
    }

    const validinput = (iserr, message) => {
        setiserr(iserr);
        setmsgs(message);
    }



    useEffect(() => {

    }, [])


    return (
        <div className="w-100  d-flex bg-white position-relative">

            <div className="w-30 border-1-slid px-5 d-flex flex-column pt-4">

                <div className="w-100  box-shadow d-flex flex-column   px-3 pb-5 mb-3 ">

                    <div className="w-100 d-flex justify-content-around pt-3 ">
                        <div className="d-flex align-items-center">
                            <input type="checkbox" id="lbcheck" value={0} onChange={(e) => btncheck(e)} checked={btnchecks == 0 ? true : false} className="w-20-px" />
                            <label for="lbcheck" className="ml-2"> none </label>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type="checkbox" id="lbcheck" value={1} onChange={(e) => btncheck(e)} checked={btnchecks == 1 ? true : false} className="w-20-px" />
                            <label for="lbcheck" className="ml-2"> file open txt </label>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type="checkbox" id="lbcheck" value={2} onChange={(e) => btncheck(e)} checked={btnchecks == 2 ? true : false} className="w-20-px" />
                            <label for="lbcheck" className="ml-2"> file open xlsx </label>
                        </div>
                    </div>
                    <div className="d-flex algin-items-center overflow-hidden py-4">
                        {
                            btnchecks == 1 ? <>
                                <label className="btnfile w-115-px" for="file"> choose file txt </label>
                                <input type="file" id="file" onChange={(e) => btnopenfiletxt(e)} className="w-115-px pt-2" />
                            </> : btnchecks == 2 ? <>
                                <label className="btnfile w-115-px" for="file"> choose filexlsx </label>
                                <input type="file" id="file" onChange={(e) => showfilexlsx(e)} className="w-115-px pt-2" />
                            </> : <>
                                <label className="btnfile-none w-115-px bg-gray" for="file"> none </label>
                            </>
                        }
                    </div>

                    <button className="mt-1 " onClick={(e) => loaddatafile(e)}> load file data </button>
                </div>

                <div className="w-100 box-shadow  px-3 py-4 d-flex flex-column">
                    {/* <span className="mb-2">  phonenumber  </span>
                <Phonenumber onChange={valuephone} value={phone} placeholder="(85620) 5xxxxxxx" helperText={iserr && ismsg == 5 ? "please enter format phone (85620) 5xxxxxxx" : iserr && ismsg == 6 ? "please enter 13 character phone (85620) 5xxxxxxx" : ""} error={iserr && ismsg == 5 || iserr && ismsg == 5 ? true : false} /> */}

                    {/* <span className="mt-1"> countername </span> */}
                    {/* <FormControl >
                        <Select onChange={countnamevalue} value={countername} error={iserr && ismsg == 8 ? true : false}  >
                            <MenuItem value={0}> disable package </MenuItem>
                            <MenuItem value={1}> Prepaid_Staff_3GB </MenuItem>
                            <MenuItem value={2}> Prepaid_Staff_5GB</MenuItem>
                            <MenuItem value={3}> Prepaid_Staff_7GB </MenuItem>
                            <MenuItem value={4}> Prepaid_Staff_10GB </MenuItem>
                            <MenuItem value={5}>Prepaid_Staff_15GB </MenuItem>
                            <MenuItem value={6}> Prepaid_Staff_25GB </MenuItem>
                        </Select>
                        <FormHelperText> {iserr && ismsg == 8 ? " please select package" : ""} </FormHelperText>
                    </FormControl> */}


                    <span className="mt-2 mb-1"> startTime </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']} className="pt-0">
                            <DatePicker

                                format="DD/MM/YYYY"
                                onChange={datestartvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                className="datepicker"
                                slotProps={{
                                    textField: {
                                        helperText: iserr && ismsg == 1 ? "please select date start" : iserr && ismsg == 2 ? "please select datestart is less then expire date" : ""
                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    {/* {iserr && ismsg == 1 ? <> <span className="color-red"> please select date start </span></> : iserr && ismsg == 2 ? <> <span className="color-red"> please select next date start </span></> : ""} */}
                    <span className="mt-2 mb-1"> expireTime </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']} className="">
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={dateendvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                slotProps={{
                                    textField: {
                                        helperText: iserr && ismsg == 3 ? "please select dateexpire" : iserr && ismsg == 4 ? "please select next day dateexpire" : ""
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
                                onChange={daterefillstopvalue}
                                rederInput={(param) => <TextField  {...param} />}
                                slotProps={{
                                    textField: {
                                        helperText: iserr && ismsg == 7 ? "please select date refillstop" : ""
                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <button className="mt-4 " onClick={onaddpackage}> add package </button>





                </div>


            </div>
            <div className="w-70  px-5 pt-4">

                <div className="w-100 h-500-px overflow-y-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th> msisdn </th>
                                <th> countername </th>
                                <th> RefillStopTime </th>
                                <th> starttime </th>
                                <th> expiretime </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                modelfile.map((item, index) => (

                                    <React.Fragment>
                                        <tr>
                                            <td>{item.phone}</td>
                                            <td>{item.countername}</td>
                                            <td>{item.RefillStopTime}</td>
                                            <td>{item.starttime}</td>
                                            <td>{item.expiretime}</td>
                                        </tr>
                                    </React.Fragment>
                                )
                                )

                            }
                        </tbody>
                    </table>
                    {
                        modelfile.length == 0 ?
                            <>
                                <div className="text-center pt-3">
                                    <span className="f-18-px"> no record </span>
                                </div>
                            </>
                            : ""
                    }
                </div>
                <div className="w-100 pt-2">
                    <span>  record data phone count : {modelfile.length}    </span>
                </div>
            </div>

            <ModalInfoapp callmodal={callmodal} opendialog={openmsg} statuslb={ismsgs} />
            <div className={loading ? "div-loader bg-backdrop d-flex" : "display-none"}>
                <div className="loader">

                </div>

            </div>

        </div>

    )
}

const Phonenumber = props => (<InputMask mask="(99999) 99999999" value={props.value} onChange={props.onChange}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} />}
</InputMask>)

