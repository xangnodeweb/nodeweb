import * as React from "react";

import { useState, useEffect } from "react";

import axios from "axios";

import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask"
import Select from "@mui/material/Select";
import { FormHelperText, MenuItem, useStepContext } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import Modalchangeadddate from "../filemodule/modalchangadddate";

import { changeexporttoset } from "../filemodule/xlsxload";

export default function ChangMaxDate() {

    const [btncheckoption, setbtncheckoption] = useState(0);
    const [modelfile, setmodelfile] = useState([]);

    const [oldoffervalue, setoldoffervalue] = useState(0); // primary main offering value == to 3000001 or back

    const [modelsubscriber, setmodelsubscriber] = useState([]); // model level 1  response

    const [modelchangemaxdate, setmodelchangemaxdate] = useState([]); // model level 2

    const [modelchangemaxday, setmodelchangemaxday] = useState([]); // 
    const [validitydate, setvaliditydate] = useState(null); // valie setvalidity

    const [valuechangemaxday, setvaluechangemaxday] = useState(null); // value change maxday


    const [modelsetvalidity, setmodelsetvalidity] = useState([]);
    const [ismodelsetvalidity, setismodelsetvalidity] = useState([]);

    const [openmodal, setopenmodal] = useState(false);
    const [openmsg, setopenmsg] = useState({
        lbmsg: "",
        openbutton: 0,
        lbmsgtitle: ""

    });

    const [msgvalid, setmsgvalid] = useState(0);
    const [error, seterror] = useState(false);

    const [errormsg, seterrormsg] = useState(false)
    const [linenum, setlinenum] = useState(0);
    const [msgvalids, setmsgvalids] = useState(0);


    const [editline, seteditline] = useState(0);
    const [editlineone, seteditlineone] = useState(0);
    const [editlinetwo, seteditlinetwo] = useState(0);   // edit line one two == 0 == default || 1 == error line one || 2 == success line one || 3 == success two or error default 3 setvalidity || 4 success line 3

    const [lineonesuccess, setlineonesuccess] = useState(false);

    const [iseditlineone, setiseditlineone] = useState(false);
    const [loading, setloading] = useState(false);

    const ismaxday = React.createRef();
    const isvalidity = React.createRef();




    const openfiletxt = (e) => {
        try {

            const file = e.target.files[0];
            const render = new FileReader();
            let model = [];
            setmodelfile([]);
            render.onload = () => {

                const datafile = render.result.split(/\r?\n/);
                // console.log(datafile)
                let formatphone = /^20[0-9]{8}$/;
                if (datafile.length > 1) {

                    for (var i = 0; i < datafile.length; i++) {

                        const datas = datafile[i].toString().split("|")
                        // console.log(datas);
                        if (datas.length == 3) {
                            if (formatphone.test(datas[0])) {
                                const dataoldoferring = !datas[1] ? "" : datas[1];
                                const datanewoferring = !datas[2] ? "" : datas[2];
                                model.push({ phone: datas[0], oldoffering: dataoldoferring, newoffering: datanewoferring });
                            } else {
                                // call modal
                                break;
                            }
                        } else {
                            openmodalsuccess(true, 1, "please check data file", "");
                            return;
                        }

                        // console.log(model);
                    }

                    if (model.length > 0) {
                        if (model[0].oldoffering == '3000001') {
                            setoldoffervalue(1)
                        } else if (model[0].newoffering == '1814607249') {
                            setoldoffervalue(2)
                        }
                    }

                    if (model.length == 0) {
                        //  call model
                        return;
                    }
                    setmodelfile(model);
                }
            }
            render.readAsText(file);
        } catch (error) {
            console.log(error)
        }
    }

    async function onchangemainoffeprimary() {

        try {
            // console.log(modelfile)
            setloading(true)
            if (modelfile.length == 0) {
                // setopenmodal(true);
                // openmsg.lbmsg = "please select file txt";
                // openmsg.openbutton = 1;

                seterror(true);
                setmsgvalid(1);

                openmodalsuccess(true, 1, "please select file txt", "");


                openlinecolor(true, 1, 1);
                // seterrormsg(true);
                // setlinenum(1);
                // setmsgvalids(1);
                setloading(false);
                return;
            }

            const modelindex = modelfile.findIndex(x => x.oldoffering == '')
            if (modelindex != -1) {
                // seterrormsg(true);
                // setlinenum(1);
                // setmsgvalids(1);
                setloading(false);
                openlinecolor(true, 1, 1);

                openmodalsuccess(true, 1, "please select primary offering", "");
                return;
            }


            const data = await axios.post("http://172.28.27.50:3000/apichangemain/changemainoffering", modelfile);
            // console.log(data.data);
            if (data.status == 200) {


                setbtncheckoption(1);
                setmodelsubscriber(data.data.result)


                openmodalsuccess(true, 1, "changemain offering success", "");

                // seterrormsg(true);
                // setlinenum(2);
                // setmsgvalids(0);
                openlinecolor(true, 0, 2);

                seteditline(1);

                setmsgvalid(0);
                seterror(false)

                if (data.data.result.length > 0) {
                    let model = [];
                    for (var i = 0; i < data.data.result.length; i++) {
                        const datamodel = { phone: data.data.result[i].phone, balance: "3000000", datevalue: 0 };
                        model.push(datamodel);
                    }
                    setmodelchangemaxdate(model);
                }
                setloading(false);
                setlineonesuccess(true);
            }

        } catch (error) {
            console.log(error)
            if (error) {
                if (error.response) {

                    let statuscode = error.response.data;
                    if (statuscode.status == false && statuscode.code == 2) {
                        // if (statuscode.result.length > 0) {
                        // setmodelsubscriber(statuscode.result)

                        setloading(false);
                        setbtncheckoption(1);
                        openmodalsuccess(true, 1, "cannot changemainoffering ConnectTimeoutError", "");
                        return;
                        // }

                    } else {
                        setloading(false);
                        openmodalsuccess(true, 1, "cannot changemain offering ", "");
                        return;
                    }
                } else {
                    setloading(false);
                    openmodalsuccess(true, 1, "cannot changemain offering ", "");
                    return;
                }
            }


            setloading(false);
            setlineonesuccess(true);
        }
    }
    async function onaddchangmaxdate() {
        try {
            setloading(true);
            if (modelchangemaxdate.length == 0) {

                openlinecolor(true, 2, 2);

                openmodalsuccess(true, 1, "not found data changemainoffering", "");
                // seteditlineone(1)
                setloading(false);
                return;
            }


            const modelindex = modelchangemaxdate.filter(x => x.datevalue == 0);
            // console.log(modelindex)
            if (modelindex > 0) {
                seterror(true);
                setmsgvalid(3);


                openlinecolor(true, 2, 2);
                openmodalsuccess(true, 1, "please check value day geater date 0 ", "");

                setloading(false);
                // seteditlineone(1);
                return;
            }


            // console.log(modelchangemaxdate)

            const data = await axios.post("http://172.28.27.50:3000/apichangemain/changemaxday", modelchangemaxdate);

            // console.log(data.data);
            if (data.status == 200) {
                if (data.data.result.length > 0) {
                    setmodelchangemaxday(data.data.result);
                }
                // seterrormsg(false);
                // setlinenum(3);
                // setmsgvalids(0);

                openlinecolor(false, 0, 3);

                seteditlineone(1);

                seterror(false);
                setmsgvalid(0);
                openmodalsuccess(true, 1, "changemaxday success", "");
                setloading(false);
            }

        } catch (error) {
            console.log(error);
            if (error) {
                if (error.response) {
                    let statuscode = error.response.data;
                    openlinecolor(true, 2, 2);
                    if (statuscode.status == false && statuscode.code == 2) {
                        setloading(false)
                        openmodalsuccess(true, 1, "cannot changemaxday ConnectTimeoutError", "");
                        return;
                    } else {
                        setloading(false);
                        openmodalsuccess(true, 1, "cannot Changemaxday", "");
                        return;
                    }
                } else {
                    setloading(false);
                    openmodalsuccess(true, 1, "cannot Changemaxday", "");
                    return;
                }

            }
            setloading(false);
        }
    }

    async function onsetvalidity() {
        try {
            setloading(true);
            if (validitydate == null) {
                // seterrormsg(true);
                // setlinenum(3);
                // setmsgvalids(3);

                openlinecolor(true, 3, 3);
                seteditlinetwo(0);
                setloading(false);
                return;
            }
            if (validitydate == "0") {
                setmsgvalids(true, 3, 3);
                seteditlinetwo(0);
                setloading(false);
                return;
            }

            if (modelchangemaxday.length == 0) {

                openlinecolor(true, 3, 3);
                seteditlinetwo(0);
                // console.log("please check data chang max day data you not found data success")
                setloading(false);
                return;
            }
            const modelindex = ismodelsetvalidity.findIndex(x => parseInt(x.validitydate) <= 0);
            if (modelindex.length > 0) {
                setloading(false);
                return;
            }

            const data = await axios.post("http://172.28.27.50:3000/apichangemain/setvalidity", ismodelsetvalidity)
            // console.log(data.data);

            if (data.status == 200) {

                setmodelsetvalidity(data.data.result);

                openlinecolor(false, 0, 4)

                seteditlinetwo(1);
                openmodalsuccess(true, 1, "setvalidity success", "");
                seterror(false);
                setmsgvalid(0);
                setloading(false);

                changeexporttoset({ modeloffer: modelsubscriber, modelchangemax: modelchangemaxday, modelsetvalidity: data.data.result });
            }

        } catch (error) {
            console.log(error)

            if (error) {
                if (error.response) {
                    let statuscode = error.response.data;
                    if (statuscode.status == false && statuscode.code == 2) {
                        if (statuscode.result.length > 0) {
                            setmodelsetvalidity(statuscode.result);
                            changeexporttoset({ modeloffer: modelsubscriber, modelchangemax: modelchangemaxday, modelsetvalidity: statuscode.result });

                        }

                        openlinecolor(true, 3, 3);

                        openmodalsuccess(true, 1, "cannot setvalidity ConnectTimeoutError", "");
                        setloading(false);
                        return;
                    } else {
                        openlinecolor(true, 3, 3);
                        openmodalsuccess(true, 1, "cannot setvalidity", "");
                        setloading(false);
                        return;
                    }
                } else {
                    openlinecolor(true, 3, 3);
                    openmodalsuccess(true, 1, "cannot setvalidity", "");
                    setloading(false);
                    return;
                }
            }
            setloading(false);
        }
    }



    const selectvalue = (e) => {
        try {
            const primaryvalues = e.target.value;
            setoldoffervalue(primaryvalues);
            if (primaryvalues == 1) {

                if (modelfile.length > 0) {

                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "3000001", item.newoffering = "1814607249" });
                    // console.log(modelfile);
                }
            } else if (primaryvalues == 2) {

                if (modelfile.length > 0) {
                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "1814607249", item.newoffering = "3000001" });
                    // console.log(modelfile);
                }
            } else {
                if (modelfile.length > 0) {
                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "", item.newoffering = "" })
                    // console.log(modelfile);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const validityvalue = (e) => {
        try {

            const validitydates = e.target.value.replace(/[^0-9]+/g, "");
            setvaliditydate(validitydates);

        } catch (error) {
            console.log(error)
        }
    }

    const btnmodelfileoption = (e) => {
        try {
            setbtncheckoption(e.target.value)
        } catch (error) {
            console.log(error)
        }
    }

    const valuevalidity = (e) => {
        try {
            // e.preventDefault();
            if (e) {
                // console.log(e.target.value)
                const datevalues = e.target.value.replace(/[^0-9]+/g, "");
                // console.log(datevalues);
                setvaluechangemaxday(datevalues);
                if (parseInt(e.target.value) > 3650) {
                    seterror(true);
                    setmsgvalid(2)
                    return;

                }
                seterror(false);
                setmsgvalid(0)
                if (modelchangemaxdate.length > 0) {
                    modelchangemaxdate.forEach(x => { x.phone = x.phone, x.balance = x.balance, x.datevalue = parseInt(datevalues) });
                    // setmodelchangemaxdate(modelchangemaxdate)
                    // console.log(modelchangemaxdate)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    const callmodal = ({ status, confirmbtn }) => {
        try {

            setopenmodal(status);

            if (confirmbtn == 2) {
                onaddchangmaxdate();
                seteditlineone(1);
            }
            // console.log(status, confirmbtn)

            if (confirmbtn == 3) {
                onsetvalidity();
                seteditlinetwo(1);
            }

        } catch (error) {
            console.log(error)
        }
    }
    const openmodalsbtn = ({ status, openbutton }) => {

        try {
            // status == open modal and openbutton == open show button
            // console.log(modelchangemaxdate)
            // console.log(status, openbutton)
            // console.log(valuechangemaxday)
            if (modelchangemaxdate.length == 0) {
                setopenmodal(status);
                openmsg.lbmsg = "please load data file and check data Changemain offering";
                openmsg.openbutton = 1; // openbutton == 1 button one button message info

                openlinecolor(true, 1, 1);
                // seterrormsg(true);
                // setlinenum(1);
                // setmsgvalids(1);

                setmsgvalid(1);
                seterror(true);

                seteditlineone(0);
                return;
            }
            if (valuechangemaxday == null) {
                setmsgvalid(3);
                seterror(true);
                ismaxday.current.focus();

                openlinecolor(true, 2, 2);
                return;
            }
            if (parseInt(valuechangemaxday) == 0) {
                setmsgvalid(3);
                seterror(true);

                openlinecolor(true, 2, 2);
                ismaxday.current.focus();
                return;
            }
            if (valuechangemaxday == "") {
                setmsgvalid(3);
                seterror(true);

                ismaxday.current.focus();

                openlinecolor(true, 2, 2);
                return;
            }
            if (parseInt(valuechangemaxday) > 3650) {
                seterror(true);
                setmsgvalid(2);
                return;
            }

            if (parseInt(valuechangemaxday) != 0) {
                modelchangemaxdate.forEach(x => { x.phone = x.phone, x.balance = x.balance, x.datevalue = valuechangemaxday });

            }
            const modeldatavalues = modelchangemaxdate.findIndex(x => x.datevalue == 0);
            if (modeldatavalues != -1) {

                openlinecolor(true, 2, 2);

                openmodalsuccess(true, 1, "", "");
                seteditlineone(0);
                return;
            }

            setopenmodal(status);
            // setopenbutton(0);
            openmsg.lbmsg = "please check data Changemax day";
            openmsg.openbutton = 0; // openbutton 0 default send model response changmain offering message confirm
            openmsg.lbmsgtitle = "please want save changmaxday ?"


            openlinecolor(false, 0, 2);

        } catch (error) {
            console.log(error);
        }
    }

    const openmodalonaddvalidity = () => {
        try {

            // console.log(validitydate);
            if (validitydate == null) {
                seterror(true);
                setmsgvalid(4);
                isvalidity.current.focus();
                openlinecolor(true, 3, 3);
                // seterrormsg(true);
                // setlinenum(3);
                // setmsgvalids(3);
                return;
            }
            if (validitydate == '' || validitydate == 0) {
                seterror(true);
                setmsgvalid(4);
                openlinecolor(true, 3, 3);
                isvalidity.current.focus();

                return;
            }
            if (modelchangemaxday.length == 0) {

                openlinecolor(true, 2, 2);
                openmodalsuccess(true, 1, "not found data changemaxday please check data ", "")
                return;
            }
            let model = [];
            setismodelsetvalidity([]);
            if (modelchangemaxday.length > 0) {


                for (var i = 0; i < modelchangemaxday.length; i++) {
                    model.push({ phone: modelchangemaxday[i].phone, validitydate: parseInt(validitydate) });
                }
            }
            setismodelsetvalidity(model);
            // console.log(model);

            setopenmodal(true);
            openmsg.openbutton = 4;
            openmsg.lbmsg = "";
            openmsg.lbmsgtitle = "you want setvalidity or not ?";

            // console.log(openmsg);


        } catch (error) {
            console.log(error)
        }

    }

    // linenum btnvalue == default or btnedit
    const editbtnvalue = (linenumber, btnvalue, btnedit) => {
        try {

            if (linenumber == 0) {
                seteditline(btnvalue);
                seteditlineone(0);
                seteditlinetwo(0);

                setmodelsetvalidity([]);
                setmodelchangemaxday([]);
                setmodelsubscriber([]);
                setvaliditydate('');
                setvaluechangemaxday('');
                seterrormsg(false);
                setlinenum(0);
                setmsgvalids(0);
                setbtncheckoption(0);
                setlineonesuccess(false)

            } else if (linenumber == 1) {

                seteditlineone(btnvalue);

                if (btnvalue == 0 && btnedit == true) {

                    setiseditlineone(btnedit);

                    setmodelsetvalidity([]);

                    // seterrormsg(false);
                    // setlinenum(2);
                    // setmsgvalids(0);

                    openlinecolor(false, 0, 2);
                    setvaliditydate('');

                    seteditlinetwo(0);
                    ismaxday.current.focus();
                }
                // clearmodellinenum(1);

            } else if (linenumber == 2) {
                seteditlinetwo(btnvalue);
                setlinenum(3);
                isvalidity.current.focus();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const clearmodellinenum = (linenum) => {
        try {

            if (linenum == 0) {

                seteditlinetwo(0);
                setmodelsetvalidity([]);
                setmodelchangemaxday([]);

            } else if (linenum == 1) {

                seteditlineone(0);
                seterrormsg(false);
                setlinenum(2);
                setmsgvalids(0);


                setmodelsetvalidity([]);

                ismaxday.current.focus();

            } else if (linenum == 2) {

            }
        } catch (error) {
            console.log(error);
        }
    }

    const loaddataeditmodel = () => {
        try {

            // console.log(validitydate == 0)
            // console.log(modelchangemaxdate.length == 0)
            // console.log(modelchangemaxdate)
            if (parseInt(valuechangemaxday) == 0) {
                setmsgvalid(3);
                seterror(true);
                ismaxday.current.focus();
                return;
            }
            if (valuechangemaxday == "") {
                setmsgvalid(3);
                seterror(true);
                ismaxday.current.focus();
                return;
            }
            if (modelchangemaxdate.length == 0) {
                return;
            }

            const modelindexday = modelchangemaxdate.findIndex(x => x.datevalue == 0);
            if (modelindexday.length > 0) {
                return;
            }

            setopenmodal(true);
            openmsg.lbmsg = "you want edit or cancle ?";
            openmsg.openbutton = 3;
            openmsg.lbmsgtitle = "please check data edit";

        } catch (error) {
            console.log(error);
        }
    }

    const checklinenumonadd = () => { // check linenum success

        try {

            if (modelfile.length == 0) {
                seterrormsg(true);
                setlinenum(1);
                setmsgvalids(1);
                openmodalsuccess(true, 1, "please load data file changemainoffering")
                return;
            }
            if (modelchangemaxdate.length == 0) {

                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(2);

                openmodalsuccess(true, 1, "");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const openmodalsuccess = (openmodal, openbutton, lbmsg, lbmsgtitle) => {
        try {
            setopenmodal(openmodal);
            openmsg.openbutton = openbutton;
            openmsg.lbmsg = lbmsg;
            openmsg.lbmsgtitle = lbmsgtitle;
        } catch (error) {
            console.log(error)
        }
    }

    const openlinecolor = (errormsg, msgvalid, linenum) => {
        try {

            seterrormsg(errormsg);
            setlinenum(linenum);
            setmsgvalids(msgvalid);
            // setloading(loading);
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className="w-100 position-relative d-flex flex-column pb-5 ">


            <div className="w-100 d-flex  h-300-px p-3">
                <div className="d-flex flex-column box-shadow p-3 w-35 h-230-px">
                    <div>
                        <label for="btnfile" className={`${error && msgvalid == 1 ? "border-2-red" : ""} btnfile`}> no file change  </label>
                        <input type="file" id="btnfile" onChange={(e) => openfiletxt(e)} className="w-100" />
                    </div>
                    <div className="d-flex flex-column">
                        <span> primaryOffering  </span>
                        <FormControl>
                            <Select onChange={selectvalue} value={oldoffervalue} readOnly={editline == 1 ? true : false} >
                                <MenuItem value={0}> none </MenuItem>
                                <MenuItem value={1}> 3000001 </MenuItem>
                                <MenuItem value={2}> 1814607249 </MenuItem>

                            </Select>
                        </FormControl>
                    </div>
                    <div className="pt-3">
                        {
                            editline == 0 ?
                                <>
                                    <button className={`${error && msgvalid == 1 ? "border-2-red" : ""} btn-default w-100`} onClick={() => onchangemainoffeprimary()} > load data file </button>
                                </>
                                : <button className={`${error && msgvalid == 1 ? "border-2-red" : ""} btn-edit w-100  color-white`} onClick={() => editbtnvalue(0, 0, false)} > edit changmainoffering </button>
                        }

                    </div>
                </div>
                <div className=" min-w-50-px mx-3 d-flex justify-content-center h-300-px">
                    <div className={errormsg == true && linenum == 1 && msgvalids == 1 ? `border-left-red` : lineonesuccess && linenum >= 2 ? "border-left-success" : lineonesuccess == false && linenum <= 2 ? "border-left" : ""}>
                    </div>
            
                  <div className={`${errormsg == true && linenum == 1 && msgvalids == 1 ? "bg-red" : lineonesuccess && linenum >= 2 ? "bg-default" : lineonesuccess == false && linenum <= 2 ? "bg-box-gray" : ""} min-w-50-px w-50-px h-50-px border-radius-50 d-flex justify-content-center align-items-center position-absolute`} >
                        <span className="f-20-px f-weight-900 color-white"> 1 </span>
                    </div>
                </div>
                <div className="w-100">
                    <div className="d-flex mb-1">

                        <button className={`h-30-px px-3 mr-3 border-radius-3-px ${btncheckoption == 0 ? "btn-default " : ""}`} onClick={(e) => btnmodelfileoption(e)} value={0} > request </button>
                        <button className={`h-30-px px-3 border-radius-3-px ${btncheckoption == 1 ? "btn-default " : ""}`} onClick={(e) => btnmodelfileoption(e)} value={1}> response </button>
                    </div>

                    <div className="w-100 h-245-px overflow-hidden overflow-y-scroll">
                        {
                            btncheckoption == 0 ?
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>phone</th>
                                                <th>oldoffering</th>
                                                <th>newoffering</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                modelfile.map((item, index) => (
                                                    <React.Fragment>
                                                        <tr key={index}>
                                                            <td>{item.phone}</td>
                                                            <td>{item.oldoffering}</td>
                                                            <td>{item.newoffering}</td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                        </tbody>
                                    </table>
                                </>
                                :
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>phone</th>
                                                <th>oldoffering</th>
                                                <th>newoffering</th>
                                                <th> resultcode </th>
                                                <th>status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                modelsubscriber.map((item, index) => (
                                                    <React.Fragment>
                                                        <tr key={index}>
                                                            <td className={!item.status ? "bg-default-td" : ""}>{item.phone}</td>
                                                            <td className={!item.status ? "bg-default-td" : ""}>{item.oldoffering}</td>
                                                            <td className={!item.status ? "bg-default-td" : ""}> {item.newoffering}</td>
                                                            <td className={!item.status ? "bg-default-td" : ""}> {item.resultcode}</td>
                                                            <td className={!item.status ? "bg-default-td" : ""}>{item.status ? item.status.toString() : item.status.toString()}</td>
                                                        </tr>

                                                    </React.Fragment>
                                                ))}
                                        </tbody>
                                    </table>
                                </>
                        }
                        <div className="text-center pt-3">
                            {btncheckoption == 0 && modelfile.length == 0 ?

                                <>
                                    <span className="f-16-px"> no record </span>
                                </> :
                                btncheckoption == 1 && modelsubscriber.length == 0 ?
                                    <>
                                        <span className="f-16-px"> no record </span>
                                    </> : ""
                            }
                        </div>
                    </div>

                </div>

            </div>

            <div className="w-100 d-flex px-3">
                <div className="w-35 d-flex flex-column p-3 box-shadow h-160-px my-3">
                    <span className="pb-1"> change max day value  </span>
                    <Phonenumber placeholder="3650" onChange={(e) => valuevalidity(e)} value={valuechangemaxday} error={error && msgvalid == 3 ? true : error && msgvalid == 2 ? true : false} helperText={error && msgvalid == 3 ? "please enter value day" : error && msgvalid == 2 ? "please enter value less number 3650" : ""} inputRef={ismaxday} readOnly={editlineone == 1 ? true : false} />

                    {
                        editlineone == 0 && iseditlineone == false ?
                            <>
                                <button className="btn-default w-100 mt-3" onClick={() => openmodalsbtn({ status: true, openbutton: 0 })}> changemaxdate </button>
                            </>
                            :
                            editlineone == 0 && iseditlineone == true ?
                                <>
                                    <button className="btn-default w-100 mt-3" onClick={() => loaddataeditmodel()} > saveedit changemaxdate </button>
                                </> :
                                <button className="btn w-100 mt-3 btn-edit color-white" onClick={(e) => editbtnvalue(1, 0, true)}> editchangemaxdate </button>
                    }

                </div>
                <div className="min-w-50-px mx-3 position-relative d-flex justify-content-center h-325-px ">
                    <div className={errormsg == true && linenum == 2 && msgvalids == 2 ? `border-left-red` : linenum >= 3 ? "border-left-success" : linenum <= 2 ? "border-left" : ""}>
                    </div>
                    <div className={`${errormsg == true && linenum == 2 && msgvalids == 2 ? "bg-red" : linenum >= 3 ? "bg-default" : linenum <= 2 ? "bg-box-gray" : ""} min-w-50-px w-50-px h-50-px border-radius-50  d-flex justify-content-center align-items-center position-absolute`}>
                        <span className="f-20-px f-weight-900 color-white"> 2 </span>
                    </div>
                </div>
                <div className="w-100  my-3 ">
                    <div>
                        <span> detail changemaxday </span>
                    </div>
                    <div className="d-flex flex-column">

                        <div className="w-100 h-300-px  overflow-hidden overflow-y-scroll">

                            <table>
                                <thead>
                                    <tr>
                                        <th>phone</th>
                                        <th> validity date</th>
                                        <th>status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        modelchangemaxday.map((item, index) => (
                                            <React.Fragment>
                                                <tr >
                                                    <td className={!item.status ? "bg-default-td" : ""}> {item.phone}</td>
                                                    <td className={!item.status ? "bg-default-td" : ""}>{item.datevalue}</td>
                                                    <td className={!item.status ? "bg-default-td" : ""}>{item.status.toString()}</td>
                                                </tr>

                                            </React.Fragment>
                                        )
                                        )}
                                </tbody>
                            </table>
                            <div className="text-center pt-3">
                                {modelchangemaxday.length == 0 ?
                                    <>
                                        <span className="f-16-px"> no record </span>
                                    </> : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-100  h-300-px d-flex px-3">
                <div className="d-flex flex-column  box-shadow p-3  w-35 my-3 h-160-px">
                    <span> validity date </span>
                    <Phonenumber placeholder="0000" onChange={(e) => validityvalue(e)} value={validitydate} error={error && msgvalid == 4 ? true : false} helperText={error && msgvalid == 4 ? "please enter value validity day" : ""} inputRef={isvalidity} readOnly={editlinetwo == 1 ? true : false} />
                    {

                        editlinetwo == 0 ?
                            <>
                                <button className="btn-default mt-5 w-100" onClick={() => openmodalonaddvalidity()}> set validity </button>
                            </>
                            :
                            <button className="btn-edit mt-5 w-100  color-white" onClick={() => editbtnvalue(2, 0 , false)}> edit setvalidity </button>
                    }


                </div>

                <div className="min-w-50-px mx-3 d-flex justify-content-center">

                    <div className="w-100 position-relative d-flex justify-content-center h-300-px">
                        <div className={`${errormsg == true && linenum == 3 && msgvalids == 3 ? "border-left-red" : linenum >= 4 ? "border-left-success " : linenum <= 3 ? "border-left" : ""} `}>
                        </div>
                        <div className={`${errormsg == true && linenum == 3 && msgvalids == 3 ? "bg-red" : linenum >= 4 ? "bg-default" : linenum <= 3 ? "bg-box-gray" : ""} min-w-50-px w-50-px h-50-px border-radius-50  d-flex justify-content-center align-items-center position-absolute`}>
                            <span className="f-20-px f-weight-900 color-white"> 3 </span>
                        </div>
                    </div>

                </div>

                <div className="w-100 h-300-px  overflow-hidden overflow-y-scroll ">
                    <div>
                        <span> detail setvalidity data </span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>phone</th>
                                <th> validity date</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                modelsetvalidity.map((item, index) => (
                                    <React.Fragment>
                                        <tr >
                                            <td className={`${item.status == false ? "bg-default-td" : ""}`} >{item.phone}</td>
                                            <td className={`${item.status == false ? "bg-default-td" : ""}`} >{item.validityincrement}</td>
                                            <td className={`${item.status == false ? "bg-default-td" : ""}`} >{item.status.toString()}</td>
                                        </tr>

                                    </React.Fragment>
                                )
                                )}
                        </tbody>
                    </table>
                    <div className="text-center pt-3">
                        {modelsetvalidity.length == 0 ?
                            <>
                                <span className="f-16-px"> no record </span>
                            </> : ""
                        }
                    </div>
                </div>

            </div>




            <div className="w-100 position-absolute left-0 top-0">
                <Modalchangeadddate callmodal={callmodal} opendialog={openmodal} openbutton={openmsg} modelchangemax={modelchangemaxdate} modelsetvalidity={ismodelsetvalidity} />
            </div>


            <div className={`${loading ? "d-flex" : "display-none"} position-absolute left-0 top-0 w-100 h-100 bg-backdrop  d-flex justify-content-center align-items-center`}>
                <div className="loader">

                </div>

            </div>



        </div >
    )

}

const Phonenumber = props => (<InputMask mask="9999" value={props.value} onChange={props.onChange} readOnly={props.readOnly}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} inputRef={props.inputRef} inputProps={{ readOnly: props.readOnly }} />}
</InputMask>)

