import * as React from "react";

import { useState, useEffect } from "react";

import axios from "axios";

import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask"
import Select from "@mui/material/Select";
import { FormHelperText, MenuItem, useStepContext } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import Modalchangeadddate from "../filemodule/modalchangadddate";


export default function ChangMaxDate() {

    const [btncheckoption, setbtncheckoption] = useState(0);
    const [modelfile, setmodelfile] = useState([]);

    const [oldoffervalue, setoldoffervalue] = useState(0); // primary main offering value == to 3000001 or back

    const [modelsubscriber, setmodelsubscriber] = useState([]); // model level 1  response

    const [modelchangemaxdate, setmodelchangemaxdate] = useState([]); // model level 2

    const [modelchangemaxday, setmodelchangemaxday] = useState([]); // 
    const [validitydate, setvaliditydate] = useState(null); // valie setvalidity

    const [modelsetvalidity, setmodelsetvalidity] = useState([]);

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
    const [editlinetwo, seteditlinetwo] = useState(0);

    
    const ismaxday = React.createRef();
    const isvalidity = React.createRef();



    const openfiletxt = (e) => {
        try {

            const file = e.target.files[0];
            const render = new FileReader();
            let model = [];
            render.onload = () => {

                const datafile = render.result.split(/\r?\n/);
                console.log(datafile)
                let formatphone = /^20[0-9]{8}$/;
                if (datafile.length > 1) {

                    for (var i = 0; i < datafile.length; i++) {

                        const datas = datafile[i].toString().split("|")
                        if (formatphone.test(datas[0])) {
                            model.push({ phone: datas[0], oldoffering: datas[1], newoffering: datas[2] });

                        } else {
                            // call modal
                            break;
                        }
                        console.log(model);
                    }

                    if (model.length > 0) {
                        if (model[0].oldoffering == "3000001") {
                            setoldoffervalue(1)
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
            console.log(modelfile)

            if (modelfile.length == 0) {
                setopenmodal(true);
                openmsg.lbmsg = "please select file txt";
                openmsg.openbutton = 1;

                seterrormsg(true);
                setlinenum(1);
                setmsgvalids(1);
                return;
            }

            const data = await axios.post("http://127.0.0.1:3000/apichangemain/changemainoffering", modelfile);
            console.log(data.data);
            if (data.status == 200) {


                setbtncheckoption(1);
                setmodelsubscriber(data.data.result)


                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(0);

                seteditline(1);

                // setmsgvalid(2);
                // seterror(false)

                if (data.data.result.length > 0) {
                    let model = [];
                    for (var i = 0; i < data.data.result.length; i++) {
                        const datamodel = { phone: data.data.result[i].phone, balance: "3000000", datevalue: 0 };
                        model.push(datamodel);
                    }
                    setmodelchangemaxdate(model);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function onaddchangmaxdate() {
        try {

            if (modelchangemaxdate.length == 0) {
                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(2);

                seteditlineone(1)
                return;
            }
            console.log(modelchangemaxdate)
            const modelindex = modelchangemaxdate.filter(x => x.datevalue == 0);
            if (modelindex > 0) {
                seterror(true);
                setmsgvalid(3);

                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(2);

                seteditlineone(1);
                return;
            }


            console.log(modelchangemaxdate)

            const data = await axios.post("http://127.0.0.1:3000/apichangemain/changemaxday", modelchangemaxdate);

            console.log(data.data);
            if (data.status == 200) {
                if (data.data.result.length > 0) {
                    setmodelchangemaxday(data.data.result);
                }
                seterrormsg(false);
                setlinenum(3);
                setmsgvalids(0);

                seteditlineone(1);
            }

        } catch (error) {
            console.log(error);
            seterrormsg(true);
            setlinenum(3);
            setmsgvalids(3);


        }
    }

    async function onsetvalidity() {
        try {

            if (validitydate == null) {
                seterrormsg(true);
                setlinenum(3);
                setmsgvalids(3);

                seteditlinetwo(0);
                console.log("please check validity date value")
                return;
            }
            if (validitydate == "0") {
                seterrormsg(true);
                setlinenum(3);
                setmsgvalids(3);

                seteditlinetwo(0);
                console.log("please check validity date value")
                return;
            }

            if (modelchangemaxday.length == 0) {
                seterrormsg(true);
                setlinenum(3);
                setmsgvalids(3);

                seteditlinetwo(0);
                console.log("please check data chang max day data you not found data success")
                return;
            }
            console.log(modelchangemaxday)
            let model = [];
            if (modelchangemaxday.length > 0) {

                for (var i = 0; i < modelchangemaxday.length; i++) {
                    model.push({ phone: modelchangemaxday[i].phone, validitydate: validitydate });
                }

            }
            if (model.length == 0) {

                return;
            }

            console.log(model);
            const data = await axios.post("http://localhost:3000/apichangemain/setvalidity", model)
            console.log(data.data);

            if (data.status == 200) {

                setmodelsetvalidity(data.data.result);

                seterrormsg(false);
                setlinenum(4);
                setmsgvalids(0);

                seteditlinetwo(1);
            }

        } catch (error) {
            console.log(error)
        }

    }



    const selectvalue = (e) => {
        try {
            const primaryvalues = e.target.value;
            setoldoffervalue(primaryvalues);
            if (primaryvalues == 1) {

                if (modelfile.length > 0) {

                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "3000001", item.newoffering = "1814607249" });
                    console.log(modelfile);
                }
            } else if (primaryvalues == 2) {

                if (modelfile.length > 0) {
                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "1814607249", item.newoffering = "3000001" });
                    console.log(modelfile);
                }
            } else {
                if (modelfile.length > 0) {
                    modelfile.forEach(item => { item.phone = item.phone, item.oldoffering = "", item.newoffering = "" })

                    console.log(modelfile);
                }
            }

            console.log(e.target.value)

        } catch (error) {
            console.log(error)
        }
    }


    const validityvalue = (e) => {
        try {

            const validitydates = e.target.value.replace(/[^0-9]+/g, "");
            console.log(validitydates)
            setvaliditydate(validitydates);

        } catch (error) {
            console.log(error)
        }

    }



    const btnmodelfileoption = (e) => {
        try {
            console.log(e.target.value)

            setbtncheckoption(e.target.value)

        } catch (error) {
            console.log(error)
        }
    }

    const valuevalidity = (e) => {
        try {
            // e.preventDefault();
            if (e) {
                console.log(e.target.value)
                const datevalues = e.target.value.replace(/[^0-9]+/g, "");
                console.log(datevalues);

                if (modelchangemaxdate.length > 0) {
                    modelchangemaxdate.forEach(x => { x.phone = x.phone, x.balance = x.balance, x.datevalue = datevalues });
                    // setmodelchangemaxdate(modelchangemaxdate)
                    console.log(modelchangemaxdate)
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



        } catch (error) {
            console.log(error)
        }
    }
    const openmodalsbtn = ({ status, openbutton }) => {

        try {
            // status == open modal and openbutton == open show button
            console.log(modelchangemaxdate)
            console.log(status, openbutton)
            if (modelchangemaxdate.length == 0) {
                setopenmodal(status);
                openmsg.lbmsg = "please load data file and check data Changemain offering";
                openmsg.openbutton = 1; // openbutton == 1 button one button message info

                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(2)

                seteditlineone(0);
                return;
            }

            const modeldatavalues = modelchangemaxdate.findIndex(x => x.datevalue == 0);
            if (modeldatavalues != -1) {
                seterrormsg(true);
                setlinenum(2);
                setmsgvalids(2);

                seteditlineone(0);
                return;
            }

            setopenmodal(status);
            // setopenbutton(0);
            openmsg.lbmsg = "please check data Changemax day";
            openmsg.openbutton = 0; // openbutton 0 default send model response changmain offering message confirm

            seterrormsg(false);
            setlinenum(2);
            setmsgvalids(0);


        } catch (error) {
            console.log(error);
        }
    }


    const editbtnvalue = (linenumber, btnvalue) => {
        try {

            if (linenumber == 0) {
                seteditline(btnvalue);

            } else if (linenumber == 1) {

                seteditlineone(btnvalue);
                clearmodellinenum(1);

            } else if (linenumber == 2) {

                seteditlinetwo(btnvalue);
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



    return (

        <div className="w-100 position-relative d-flex  h-100-vh flex-column pb-5">


            <div className="w-100 border-1-solid d-flex  h-300-px p-3">
                <div className="d-flex flex-column box-shadow p-3 w-35 h-230-px">
                    <div>
                        <label for="btnfile" className="btnfile"> no file change  </label>
                        <input type="file" id="btnfile" onChange={(e) => openfiletxt(e)} className="w-100" />
                    </div>
                    <div className="d-flex flex-column">
                        <span> primaryOffering  </span>
                        <FormControl>
                            <Select onChange={selectvalue} value={oldoffervalue} >
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
                                    <button className={`${error && msgvalid == 1 ? "border-2-red" : ""} btn w-100`} onClick={() => onchangemainoffeprimary()} > load data file </button>
                                </>
                                : <button className={`${error && msgvalid == 1 ? "border-2-red" : ""} btn w-100`} onClick={() => editbtnvalue(0, 0)} > edit changmainoffering </button>
                        }


                    </div>
                </div>
                <div className=" min-w-50-px mx-3 d-flex justify-content-center h-300-px">
                    <div className={errormsg == true && linenum == 1 && msgvalids == 1 ? `border-left-red` : linenum >= 2 ? "border-left-success" : linenum == 0 ? "border-left" : ""}>
                    </div>
                    <div className={`${errormsg == true && linenum == 1 && msgvalids == 1 ? "bg-red" : linenum >= 2 ? "bg-default" : linenum == 0 ? "bg-box-gray" : ""} min-w-50-px w-50-px h-50-px border-radius-50 d-flex justify-content-center align-items-center position-absolute`} >
                        <span className="f-20-px f-weight-900 color-white"> 1 </span>
                    </div>
                </div>
                <div className="w-100">
                    <div className="d-flex mb-1">

                        <button className={`h-30-px px-3 mr-3 border-radius-3-px ${btncheckoption == 0 ? "bg-default color-white" : ""}`} onClick={(e) => btnmodelfileoption(e)} value={0} > request </button>
                        <button className={`h-30-px px-3 border-radius-3-px ${btncheckoption == 1 ? "bg-default color-white" : ""}`} onClick={(e) => btnmodelfileoption(e)} value={1}> response </button>
                    </div>

                    <div className="w-100 h-245-px border-1-solid overflow-hidden overflow-y-scroll">
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
                                                            <td>{item.phone}</td>
                                                            <td>{item.oldoffering}</td>
                                                            <td>{item.newoffering}</td>
                                                            <td> {item.resultcode}</td>
                                                            <td>{item.status ? item.status.toString() : item.status.toString()}</td>
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
                                </> : btncheckoption == 1 && modelsubscriber.length == 0 ?
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
                    <Phonenumber placeholder="365" onChange={(e) => valuevalidity(e)} error={error && msgvalid == 3 ? true : false} helperText={error && msgvalid == 3 ? "please enter value day" : ""} inputRef={ismaxday} />

                    {
                        editlineone == 0 ?

                            <>
                                <button className="btn w-100 mt-3" onClick={() => openmodalsbtn({ status: true, openbutton: 0 })}> changemaxdate </button>
                            </>
                            :
                            <button className="btn w-100 mt-3" onClick={(e) => editbtnvalue(1, 0)}> editchangemaxdate </button>

                    }



                </div>
                <div className="min-w-50-px mx-3 position-relative d-flex justify-content-center h-325-px ">
                    <div className={errormsg == true && linenum == 2 && msgvalids == 2 ? `border-left-red` : linenum >= 3 ? "border-left-success" : linenum <= 2 ? "border-left" : ""}>
                    </div>
                    <div className={`${errormsg == true && linenum == 2 && msgvalids == 2 ? "bg-red" : linenum >= 3 ? "bg-default" : linenum <= 2 ? "bg-box-gray" : ""} min-w-50-px w-50-px h-50-px border-radius-50  d-flex justify-content-center align-items-center position-absolute`}>
                        <span className="f-20-px f-weight-900 color-white"> 2 </span>
                    </div>
                </div>
                <div className="w-100 border-1-  my-3 ">
                    <div className="d-flex flex-column">

                        <div className="w-100 h-300-px border-1-solid overflow-hidden overflow-y-scroll">
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
                                                    <td>{item.phone}</td>
                                                    <td>{item.datevalue}</td>
                                                    <td>{item.status.toString()}</td>
                                                </tr>

                                            </React.Fragment>
                                        )
                                        )}
                                </tbody>
                            </table>
                            <div className="text-center pt-3">
                                {modelchangemaxdate.length == 0 ?
                                    <>
                                        <span className="f-16-px"> no record </span>
                                    </> : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-100 border-1-solid h-300-px d-flex px-3">
                <div className="d-flex flex-column  box-shadow p-3  w-35 my-3 h-160-px">
                    <span> validity date </span>
                    <Phonenumber placeholder="000000" onChange={(e) => validityvalue(e)} />
                    {

                        editlinetwo == 0 ?
                            <>
                                <button className="btn mt-5 w-100" onClick={() => onsetvalidity()}> set validity </button>
                            </>
                            :
                            <button className="btn mt-5 w-100" onClick={() => editbtnvalue(2, 0)}> edit setvalidity </button>
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
                <div className="w-100 h-300-px border-1-solid overflow-hidden overflow-y-scroll ">
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
                        {modelchangemaxdate.length == 0 ?
                            <>
                                <span className="f-16-px"> no record </span>
                            </> : ""
                        }
                    </div>
                </div>

            </div>




            <div className="w-100 position-absolute left-0 top-0">
                <Modalchangeadddate callmodal={callmodal} opendialog={openmodal} openbutton={openmsg} modelchangemax={modelchangemaxdate} />
            </div>
        </div >
    )

}

const Phonenumber = props => (<InputMask mask="999" value={props.value} onChange={props.onChange}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} inputRef={props.inputRef} inputProps={{ readOnly: props.readOnly }} />}
</InputMask>)

