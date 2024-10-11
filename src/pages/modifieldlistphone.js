import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import * as xlsx from "xlsx"
import ModalInfoapp from "../filemodule/modalinfo";
import { datenow } from "../filemodule/dataformat";
import { Excelexport, Exportexcels } from "../filemodule/xlsxload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import TextField from "@mui/material/TextField";
import { redirectDocument } from "react-router-dom";
import { contains } from "rsuite/esm/DOMHelper";
const exceljs = require("exceljs")
export default function Modifieldlistphone() {

    const [file, setfile] = useState(null);
    const [filedata, setfiledata] = useState([])
    const [filedatas, setfiledatas] = useState([]);

    const [btncheck, setbtncheck] = useState(0)
    const [modellistfile, setmodellistfile] = useState([]); // model data select list

    const [modellistmodified, setmodellistmodified] = useState([]) // model data modifield
    const [modelstatusmodified, setmodelstatusmodified] = useState([]) // model data modifield response

    const [modelnullpackage, setmodelnullpackage] = useState([]);

    const [loading, setloading] = useState(false);

    const [datemodifield, setdatemodifield] = useState(null);
    const [isdate, setisdate] = useState(false);
    const [msg, setmsg] = useState({
        title: "",
        message: "",
        btnlength: 0
    });
    const [openmodal, setmodal] = useState(false);
    const [btnclick, setbtnclick] = useState(0)
    const showfile = (e) => {
        if (btncheck != 1) return;
        const file = e.target.files[0];
        const render = new FileReader();
        clearmodeldata();

        render.onload = () => {
            const datafilelist = render.result.split(/\r?\n/);
            // console.log(guestlist);
            const format = /^85620[0-9]{8}$/;
            let model = [];
            if (datafilelist.length > 0) {
                for (var i = 0; i < datafilelist.length; i++) {
                    if (format.test(datafilelist[i])) {
                        model.push(`${datafilelist[i]}`);
                    }
                }
                if (model.length > 0) {
                    setfiledata(datafilelist);
                } else {
                    callopenmodal("cannot loadfile", "please check file data phone", 1, true)
                    return;
                }
            }
        }

        if (file.name.toString().substr(file.name.toString().length - 3) != "txt") {
            console.log(`type file : ${file.name.toString().substr(file.name.toString().length - 3)}`);
            setfiledata([]);
            callopenmodal("please check file", "please enter value file type .txt", 1, true);
            return;
        }
        render.readAsText(file);
    }
    const showfilexlsx = (e) => {
        try {
            if (btncheck != 2) return;
            const file = e.target.files[0];
            const reader = new FileReader();
            console.log(file)
            clearmodeldata();

            reader.onload = (event) => {


                const workbook = xlsx.read(event.target.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                // const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 2, blankrows: false });
                const sheetData = xlsx.utils.sheet_to_txt(sheet);

                if (sheetData.toString().length < 13) { // not found data phone
                    return;
                }
                const datamodel = JSON.stringify(sheetData);
                console.log(sheetData)
                setfiledata([]);

                const sheetDatas = sheetData.toString().split("\n") // data type array
                // const format = /^85620[0-9]{8}/
                const format = /^85620[0-9]{8}$/ // format data phone 85620[0-9]{8} 8 digit
                let modelphone = [];
                let modelphones = [];

                const modelsheet = sheetDatas.filter(x => format.test(x.toString()) == true); // filter data phone format 856205xxxxxxx == data phone

                for (var i = 0; i < modelsheet.length; i++) {
                    if (modelphones.length == 0) {

                        modelphones.push(modelsheet[i].toString());
                        console.log(modelsheet[i].toString())
                        console.log("model phone : 1");
                        console.log(modelphones);
                    } else {

                        console.log(modelsheet[i].toString())
                        var index = modelphones.findIndex(x => x.toString() == modelsheet[i].toString());

                        console.log("model phone : 1");
                        if (index != -1) {
                            continue;
                        }
                        modelphones.push(modelsheet[i].toString());
                        console.log(modelphones);
                    }
                }
                modelphone.push(...modelsheet);
                if (modelphone.length == 0) {
                    return;
                }

                setfiledata(modelphone)
                console.log("sheetdata  " + sheetData.length)

            };
            const nameslice = file.name.toString().indexOf(".");
            const namefile = file.name.toString().replace(file.name.toString().substr(0, nameslice + 1), "");
            const modelfile = ["xlsx", "xls"];
            const indexfile = modelfile.findIndex(x => x.toString() == namefile);
            if (indexfile == -1) {
                setfiledata([]);
                callopenmodal("please check file", "please enter value file type .xlsx or xlsx", 1, true);
                return;
            }
            reader.readAsBinaryString(file);
        } catch (error) {
            console.log(error)
        }

    }


    const btnfile = async () => {
        try {
            setloading(true);
            console.log(filedata)
            if (filedata.length == 0) {
                console.log("data : " + filedata.length);
                callopenmodal("please select file", "not found file data txt or xlsx please check file", 1, true);
                setloading(false);
                clearmodeldata();
                return;
            }


            console.log("select file ")
            console.log(filedata)

            const data = await axios.post("http://127.0.0.1:3000/api/inquerylistphone", filedata);
            console.log(data.data)
            if (data.status == 200) {
                setmodellistfile(data.data);
                console.log(data.data.result)
                setmodelnullpackage(data.data);
                setloading(false);
                setbtnclick(0);
            }
            // console.log(file) // inquery not package product number response
            setloading(false);
        } catch (error) {
            console.log(error)
            let message = error.response ? error.response.data : "";
            setloading(false)
            if (message.status == false && message.code != 0) {
                callopenmodal("cannot read file data", message.message, 1, true);
            }
        }
    }

    async function onmodifielddate() {
        try {

            if (datemodifield == null) {
                console.log("please check value date");
                setisdate(true);
                setloading(false);
                return;
            }
            if (datemodifield == '') {
                console.log("please check value date")
                setisdate(true);
                setloading(false);
                return;
            }

            if (modellistfile.length == 0) {
                callopenmodal("file not found data", "please check file data txt or xlsx", 1, true);
                return;
            }

            setloading(true);

            setmodellistmodified([]);
            let model = [];
       
            const modelfilecheck = modellistfile.filter(x => x.ProductNumber == null);
            console.log(modelfilecheck)
            if (modelfilecheck.length != 0) {
                callopenmodal("cannot modify package data", `please check phone ${modelfilecheck[0].phone} not found  productnumber`, 1, true);
                setloading(false);
                return
            }

            console.log(modellistfile);
            if (modellistfile.length > 0) {
                for (var i = 0; i < modellistfile.length; i++) {
                    console.log(modellistfile[i])

                    const datas = { "phone": modellistfile[i].phone, "ProductNumber": modellistfile[i].ProductNumber, "datetime": datemodifield }
                    modellistmodified.push(datas);
                }
            }

            var modelindex = modellistmodified.filter(x => x.ProductNumber != null);
            if (modelindex.length == 0) {
                callopenmodal("cannot modify package data", "data modify not found package", 1, true);
                setloading(false);
                return;
            }

            console.log(modellistmodified)
            //    /^85620[0-9]{8}/
            let modeldata = [];
         
            const data = await axios.post("http://127.0.0.1:3000/api/modifieldlistdatetime", modellistmodified);
            // console.log(data.data);
            if (data.status == 200) {
                // console.log(data.data);
                setmodelstatusmodified(data.data.result);
                console.log(data.data)
                if (data.data.result.length == 0) {
                    return;
                }
                Exportexcels({ data: data.data.result })  // download file
                callopenmodal("", "modify data phone success", 1, true);
            }


            setloading(false)
        } catch (error) {
            console.log(error)
            if (error) {
                if (error.response) {
                    const statuscode = error.response.data;
                    if (statuscode.status == false && statuscode.code == 2) {
                        const data = error.response.data.result;

                        callopenmodal("cannot read file data", `${data.length > 0 ? data[0].message : "cannot modify ConnectTimeoutError"}`, 1, true);
                        setloading(false);
                    }
                }
            }

            console.log(error.response.data);
            setloading(false);
        }

    }

    const callmodal = ({ status, delvalue }, e) => { // call parameter modal // delvalue delete file change
        try {
            setmodal(status);
            if (delvalue == 1) {
                setfiledata([]);
                showfile(null)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const btncheckbox = (e) => { // checkbox type file
        try {
            console.log("value : " + e.target.value)
            setfiledata([])
            setbtncheck(e.target.value);
            clearmodeldata();
        } catch (error) {
            console.log(error)
        }
    }

    const datevalue = (e) => {
        try {
            setisdate(false);
            // setdatemodifield(e.target.value);
            console.log(e.$d)
            const dates = e.$d;
            const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(dates);
            console.log(date.toString().replace(new RegExp("-", "g"), ""));
            const dateselect = date.toString().replace(new RegExp("-", "g"), "");
            const datenow = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date());

            const datenows = datenow.toString().replace(new RegExp("-", "g"), "");
            if (parseInt(dateselect) < parseInt(datenows)) {
                callopenmodal("please next Date modifiy", "please select day next Datenow", 1, true);
                return;
            }
            console.log({ "dateselect": dateselect, "datenow": datenows })
            console.log(date);
            setdatemodifield(date);

        } catch (error) {
            console.log(error)
        }
    }
    const dateformat = (date) => {
        try {
            const formatdate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(date));
            const dateformats = formatdate.toString().replace(new RegExp(",", "g"), "")
            return dateformats;
        } catch (error) {
            // console.log(error)
        }
    }

    const valuemodeldata = (btnvalue) => {

        if (btnvalue == 0) {
            setmodellistfile(modelnullpackage)
            // modellistfile
            setbtnclick(0)
        } else if (btnvalue == 1) {
            if (modelnullpackage.length > 0) {
                let model = [];
                for (var i = 0; i < modelnullpackage.length; i++) {
                    if (modelnullpackage[i].CounterName == null) {
                        model.push(modelnullpackage[i])
                    }
                }
                setmodellistfile(model);
                console.log(modellistfile)
                setbtnclick(1)
            }
        } else if (btnvalue == 2) {

            if (modelnullpackage.length > 0) {

                let models = [];
                for (var i = 0; i < modelnullpackage.length; i++) {
                    if (modelnullpackage[i].CounterName != null) {
                        models.push(modelnullpackage[i]);
                    }
                }
                setmodellistfile(models);
                console.log(modellistfile)
                setbtnclick(2)
            }

        }



    }
    const clearmodeldata = () => {
        setmodellistfile([]);
        setmodelnullpackage([]);
        setfiledata([]);
        setfiledatas([]);
        setmodelstatusmodified([]);
    }
    const callopenmodal = (title, message, btnlength, isopenmodal) => {
        msg.title = title;
        msg.message = message;
        msg.btnlength = btnlength;
        setmodal(isopenmodal);
    }

    useEffect(() => {
        console.log(file)

    }, [])


    return (
        <>
            <div className="w-100  bg-white d-flex position-relative overflow-hidden h-94">
                <ModalInfoapp callmodal={callmodal} opendialog={openmodal} statuslb={msg} />
                <div className="w-30  d-flex flex-column px-3 pt-3">
                    <div className="w-100 d-flex flex-column border-grey box-shadow px-3 pt-4 pb-5 transition-box-btn">
                        {
                            btncheck == 1 ?
                                <>
                                    <input type="file" id="files" onChange={(e) => showfile(e)} /> <label for="files" className="btnfile" >  Choose file txt </label>
                                </> : btncheck == 2 ? <>
                                    <input type="file" id="files" onChange={(e) => showfilexlsx(e)} /> <label for="files" className="btnfile w-115-px" >  Choose file xlsx </label>
                                </> : btncheck == 0 ? <>
                                    <div className="d-flex flex-column ">
                                        <span className=""> No file  chosen</span>
                                        <button className="btnfile bg-default-btn border-radius-3-px mt-3" >  none </button>

                                    </div>
                                </> : ""
                        }

                        <div className="w-100 py-4 d-flex justify-content-between flex-wrap-wrap">
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="lbcheck" className="w-20-px" value={0} checked={btncheck == 0 ? true : false} onClick={(e) => btncheckbox(e)} />
                                <label for="lbcheck" className="ml-1"> none </label>
                            </div>
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="lbcheck" className="w-20-px" value={1} checked={btncheck == 1 ? true : false} onClick={(e) => btncheckbox(e)} />
                                <label for="lbcheck" className="ml-1"> open file txt </label>
                            </div>
                            <div className="d-flex align-items-center ml-3">
                                <input type="checkbox" id="lbchecks" className="w-20-px" value={2} checked={btncheck == 2 ? true : false} onClick={(e) => btncheckbox(e)} />
                                <label for="lbchecks" className="ml-1"> open file xlsx</label>
                            </div>
                        </div>
                        <div className="w-100 d-flex  ">
                            {
                                btncheck == 1 ?
                                    <button className="border-radius-3-px  w-100 white-space-nowrap" onClick={btnfile}> load file data </button>
                                    : btncheck == 2 ? <button className="border-radius-3-px  white-space-nowrap  w-100 " onClick={btnfile}> load file xlsx </button>
                                        : ""
                            }

                        </div>

                    </div>
                    <div className="w-100 border-grey border-radius-3-px h-300-px mt-5 box-shadow d-flex flex-column px-3 pt-3">

                        <span className="mb-1">  date modifield </span>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker format="DD/MM/YYYY" onChange={datevalue} renderInput={(param) => <TextField  {...param} />} />
                            </DemoContainer>
                        </LocalizationProvider>
                        {isdate ? <><span className="color-red"> please select date modify </span> </> : ""}
                        <button onClick={onmodifielddate} className="mt-3 border-radius-3-px " > modified datetime  </button>
                    </div>


                </div>

                <div className="w-70 h-100 pb-3 overflow-y-scroll  px-3 d-flex flex-column mt-3 ">
                    <div className="w-100 d-flex ">
                        <button className={`${btnclick == 0 ? "bg-default color-white" : "bg-default-btn"} px-3 mr-3`} onClick={() => valuemodeldata(0)}> data all </button>
                        <button className={`${btnclick == 1 ? "bg-default color-white" : "bg-default-btn"} px-3 mr-3`} onClick={() => valuemodeldata(1)}> data package null </button>
                        <button className={`${btnclick == 2 ? "bg-default color-white" : "bg-default-btn"} px-3`} onClick={() => valuemodeldata(2)}> data package </button>
                    </div>
                    <div className="w-100 px-0 h-290-px  max-h-290-px  d-flex flex-column overflow-y-scroll mt-1">
                        <table className="table position-sticky top-0 left-0">
                            <thead>
                                <tr>
                                    <th>phone</th>
                                    <th>ProductNumber </th>
                                    <th>CounterName</th>
                                    <th> expiryTime </th>
                                    <th>status</th>
                                    {/* <th> description </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modellistfile && modellistfile.length > 0 && modellistfile.map((item, index) =>
                                        <tr key={index}>

                                            <td className={`${item.packagegroup ? "bg-default-td" : ""}`}> {item.phone} </td>
                                            <td> {item.ProductNumber == null ? "not found data" : item.ProductNumber} </td>
                                            <td className={`${item.packagegroup ? "bg-default-td" : ""}`}> {item.CounterName == null ? "not found data" : item.CounterName} </td>
                                            <td> {dateformat(item.ExpiryTime) == null ? "not found data" : dateformat(item.ExpiryTime)}</td>
                                            <td> {item.status ? item.status.toString() : "false"} </td>
                                            {/* <td> {item.description} </td> */}
                                        </tr>

                                    )
                                }

                            </tbody>
                        </table>
                        {modellistfile.length == 0 ? <>
                            <div className="w-100 text-center py-4">
                                <span className="f-14-px "> no record </span>
                            </div>
                        </> : ""
                        }
                    </div>
                    <span className="pt-2 pl-2"> file dataphone count : {modellistfile.length} </span>
                    <span className="f-14-px  pl-2"> Detail modify </span>
                    <div className="w-100 d-flex flex-column">
                        <div className="min-h-300-px max-h-300-px overflow-y-scroll">
                            <table className="table position-sticky top-0 left-0">
                                <thead>
                                    <tr>
                                        <th>phone</th>
                                        <th>ProductNumber </th>
                                        <th>expiryTime</th>
                                        <th>TransactionID</th>
                                        {/* <th> description </th> */}
                                        <th>status</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        modelstatusmodified && modelstatusmodified.length > 0 && modelstatusmodified.map((item, index) =>
                                            <tr key={index}>

                                                <td className={!item.status ? "bg-grey-default" : ""}> {item.Msisdn} </td>
                                                <td className={!item.status ? "bg-grey-default" : ""}> {item.ProductNumber == null ? "not found data" : item.ProductNumber} </td>
                                                <td className={!item.status ? "bg-grey-default" : ""}> {item.ExpiryTime} </td>
                                                <td className={!item.status ? "bg-grey-default" : ""}> {item.TransactionID == null ? "not found data" : item.ProductNumber} </td>
                                                {/* <td> {item.description} </td> */}
                                                <td className={!item.status ? "bg-grey-default" : ""}> {item.status.toString()} </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </table>

                        </div>
                        {/* <span> detail data modify count : {modelstatusmodified.length} </span> */}
                        {/* <Excelexport data={modelstatusmodified} date={datenow()} /> */}
                        <button onClick={() => Exportexcels({ data: modelstatusmodified })} className="w-115-px "> export </button>

                    </div>
                </div>

                <div className={`position-absolute top-0 left-0 d-flex align-items-center w-100 h-100-vh bg-backdrop ${loading ? "display-flex" : "display-none"}`}>
                    <div className="loader ">
                    </div>
                </div>

            </div>
        </>
    )
}