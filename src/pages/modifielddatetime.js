import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Modelapp from "../pages/modal";
import InputMask from "react-input-mask";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { datevaluereplace, datenowreplace } from "../filemodule/dataformat"

export default function Modifielddatetime() {

    const [users, setUsers] = useState([]);
    const [phone, setphone] = useState(null);

    const [productno, setproductno] = useState(null);
    const [dateexpire, setdateexpire] = useState(null);
    const [modifymodel, setmodifymodel] = useState([]);
    const [countname, setcountname] = useState('');

    const [isbtn, setisbtn] = useState(false);
    const [isphonevalid, setisphonevalid] = useState(0);
    const isrefphone = React.createRef();
    const [isbtnexpire, setisbtnexpire] = useState(false);
    const [isproductno, setisproductno] = useState('');
    const [isproductnovalue, setisproductvalue] = useState(0);

    const [openmodals, setopenmodal] = useState(false);
    const [loading, setloading] = useState(false);
    const [datastatus, setdata] = useState({
        "productnumber": "",
        "phonenumber": "",
        "IsSuccess": false,
        "dateexpire": "",
        "Description": "",
        "title": "",
        "optionbtn": 0
    });


    async function onqueryphone() {
        try {
            if (phone == null) {
                inputvalid(true, 1);
                // isphone valid  iserror valid input
                isrefphone.current.focus();
                return;
            }

            const phonenumber = phone.toString().replace(/[^0-9]+/g, "");
            const format = /^85620[0-9]{8}/
            console.log(phonenumber)
            const datas = { "phone": phonenumber };
            console.log(phone)

            if (phonenumber.length < 13) {

                inputvalid(true, 2);
                isrefphone.current.focus(); // format phone 
                return
            }
            if (!format.test(phonenumber)) { // format 856205xxxxxxx
                inputvalid(true, 3);
                isrefphone.current.focus();
                return
            }

            setloading(true);
            setisphonevalid(0);
            const data = await axios.post("http://127.0.0.1:3000/api/inqueryphone", datas);
            console.log(phone)
            console.log(data.data);
            if (data.status == 200) {
                setUsers(data.data.result);
                inputvalid(false, 4); // data success input readonly
                setloading(false);
                return;
            }

            console.log(data.data)
        } catch (error) {

            const statuscode = error.response.data;
            console.log(statuscode)
            if (error) {
                if (error.response) {
                    if (statuscode.status == false && statuscode.code == 2) {
                        setloading(false)
                        callopenmodal("", "", "", "", "cannot modify phone ConnectTimeoutError", "", 1, true);
                    } else {
                        setloading(false);
                        callopenmodal("", "", "", "", "cannot modify phonenumber", "", 1, true);
                    }
                }
            }else{
            
                callopenmodal("", "", "", "", "cannot modify phonenumber", "", 1, true);
            }
            setloading(false);
        }
    }
    async function onupdateexpire() {
        try {

            if (phone == null) {
                // console.log(phone)
                inputvalid(true, 1);
                isrefphone.current.focus();
                return;
            }

            if (productno == null || productno == '') {
                validmodify(true, "please select product name.", 1)
                return;
            }
            console.log(dateexpire);
            if (dateexpire == null) {
                validmodify(true, 'please select date.', 2)
                return;
            }

            const dateexpires = dateexpire.toString().replace(new RegExp("-", "g"), "");
            const datenow = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
            const datenowformat = datenow.toString().replace(new RegExp("-", "g"), "");


            if (parseInt(dateexpires) < parseInt(datenowformat)) {
                validmodify(true, 'please select next day', 5)
                return;
            }
            setloading(true);
            const datas = { phone: phone, productno: productno, expire: dateexpire }
            // console.log(datas)
            validmodify(false, "", "", 0);

            const data = await axios.post("http://127.0.0.1:3000/api/modifielddatetimes", datas);
            console.log(data.data)
            if (data.status == 200) {
                // console.log(data.data.result) 

                setmodifymodel(data.data.result)
                validmodify(false, "", 0);
                onqueryphone();
                callopenmodal(datas.phone, datas.productno, data.data.result.IsSuccess[0], datas.expire, data.data.result.Description[0], "Response success", 0, true);
                setloading(false);
            }

            validmodify(false, "", 0);
        } catch (error) {
            console.log(error)
            if (error) {
                if (error.response) {
                    const statuscode = error.response.data;
                    console.log(statuscode);
                    setloading(false)
                    if (statuscode.status == false && statuscode.code == 3) {
                        console.log(statuscode.message);
                        callopenmodal("", "", "false", "", statuscode.message, "", 2, true);
                    } else {
                        callopenmodal("", "", "", "", "cannot modify phone", "", 1, true);
                    }
                } else {

                }
                setloading(false);
            }

        }
    }

    const phonevalue = (e) => {
        try {
            // console.log(e.target.value)
            const phones = e.target.value.replace(/[^0-9]+/g, "");
            setphone(phones);

        } catch (error) {
            console.log(error)
        }

    }


    const productvalue = (phone, countname) => {
        try {
            const model = ['Prepaid_Staff_3GB', 'Prepaid_Staff_5GB', 'Prepaid_Staff_7GB', 'Prepaid_Staff_10GB', 'Prepaid_Staff_15GB', 'Prepaid_Staff_25GB'];
            const index = model.findIndex(x => x.toString() == countname);
            console.log()
            if (index == -1) {
                return;
            }

            setproductno(phone)
            setcountname(countname)
            // console.log(phone, countname)

        } catch (error) {
            console.log(error)
        }

    }
    const cleardata = () => {
        try {

            setUsers([]);
            setphone('');
            setisbtn(false); setdateexpire
            setisphonevalid(0);
            setproductno('');
            setdateexpire('')
            isrefphone.current.focus();

        } catch (error) {
            console.log(error)
        }
    }

    const callmodal = ({ status }, e) => {
        try {
            e.preventDefault();
            setopenmodal(status);
            // console.log({ "stastus": status })
            // console.log(status);
        } catch (error) {
        }

    }
    const dateformat = (date) => {
        try {

            const dates = new Date(date);
            const formartdate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(date));
            const dateformat = formartdate.toString().replace(new RegExp(",", "g"), "")
            return dateformat;


        } catch (error) {
            console.log(error)
        }
    }

    const callopenmodal = (phonenumber, productnumber, IsSuccess, dateexpire, Description, title, optionbtn, isopen) => {

        datastatus.phonenumber = phonenumber;
        datastatus.productnumber = productnumber;
        datastatus.IsSuccess = IsSuccess;
        datastatus.dateexpire = dateexpire;
        datastatus.Description = Description;
        datastatus.title = title;
        datastatus.optionbtn = optionbtn;
        setopenmodal(isopen)

    }
    const inputvalid = (isvalid, inputerror) => {
        setisbtn(isvalid); // isvalid false inputerror 0
        setisphonevalid(inputerror);
    }
    const validmodify = (isvalid, productlb, isproductvalue) => { //isbtnexpire valid lb input
        setisbtnexpire(isvalid);
        setisproductno(productlb);
        setisproductvalue(isproductvalue) // isproductvalue == 2
    }

    const dateexpirevalue = (e) => {
        try {
            const dates = e.$d;
            const date = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(dates);
            const dateexpires = datevaluereplace(dates); // value date select
            const datenowreplaces = datenowreplace(); // yyyyMMdd
            if (parseInt(dateexpires) < parseInt(datenowreplaces)) {
                validmodify(true, 'please select next day.', 5)
            } else {
                validmodify(false, '', 0)
            }
            setdateexpire(date);
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {


    }, [])

    return (

        <div className="w-100 h-93 bg-white d-flex position-relative ">

            <Modelapp callmodal={callmodal} openmodal={openmodals} statuslb={datastatus} />


            <div className="w-30   d-flex flex-column px-3 pt-3 px-5">
                <div className="w-100 d-flex flex-column px-4 border-grey pb-5 pt-3 border-radius-3-px box-shadow">
                    <span>  phonenumber </span>
                    {/* <input type="text" onChange={phonevalue} value={phone} ref={isrefphone} onCompleted="off" className={` ${isbtn && isphonevalid == 1 ? "border-red" : ""}`} readOnly={!isbtn && isphonevalid == 2 ? true : false} /> */}
                    <Phonenumber onChange={phonevalue} value={phone} error={isbtn && isphonevalid == 1 ? true : false} helperText={isbtn && isphonevalid == 1 ? "please enter phonenumber" : isbtn && isphonevalid == 2 ? "please enter 13 character (85620 5xxxxxxx)" : isbtn && isphonevalid == 3 ? "please enter phone format (85620 5xxxxxxx)" : ""} inputRef={isrefphone} readOnly={!isbtn && isphonevalid == 4 ? true : false} placeholder="85620 5xxxxxxx" />
                    {
                        !isbtn && isphonevalid == 4 ? <button className="btn-iquery mt-4 border-radius-3-px" onClick={cleardata}> cleardata </button> : <button className="btn-iquery mt-4 border-radius-3-px" onClick={onqueryphone}> send </button>
                    }
                </div>
                <div className="w-100 d-flex flex-column mt-12 px-4 border-grey pb-5 pt-5 border-radius-3-px box-shadow">
                    <span className="m-auto"> Modifield Datetime </span>
                    <span> productname </span>

                    <TextField type="number" error={isbtnexpire && isproductnovalue == 1 ? true : false} value={productno} helperText={isbtnexpire && isproductnovalue == 1 ? isproductno : ""} disabled className={` mt-2`} />
                    <span className="mt-3"> dateexpire </span>
                    {/* <TextField type="date" onChange={(e) => setdateexpire(e.target.value)}   readOnly={true} error={isbtnexpire && isproductnovalue == 2 ? true : ""} helperText={isbtnexpire && isproductnovalue == 2 ? " please select datetime." : ""} /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker format="DD/MM/YYYY" onChange={dateexpirevalue} renderInput={(param) => <TextField {...param} />} slotProps={{ textField: { helperText: isbtnexpire && isproductnovalue == 2 ? "please select dateExpire" : isbtnexpire && isproductnovalue == 5 ? "please select next day" : "" } }} />
                        </DemoContainer>
                    </LocalizationProvider>

                    <button className="mt-4" onClick={onupdateexpire}> modify </button>

                </div>
            </div>
            <div className="w-70  pt-4 ">
                <div className="w-100 h-500-px max-h-467-px  overflow-y-scroll px-3 ">

                    <table >
                        <thead>
                            <tr>
                                <th> msisdn </th>
                                <th> productname</th>
                                <th> countname </th>
                                <th>RefillStopTime </th>
                                <th>starttime</th>
                                <th> expiretime</th>
                                <th> select </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.length > 0 && users.map((item, index) =>
                                    <tr key={index} className="td-column">
                                        <td>{item.Msisdn}</td>
                                        <td> {item.ProductNumber} </td>
                                        <td> {item.CounterName} </td>
                                        <td>{item.RefillStopTime}</td>
                                        <td>{dateformat(item.StartTime)}</td>
                                        <td>{dateformat(item.ExpiryTime)}</td>
                                        < td className="px-2">
                                            <button className="px-2 h-30-px" onClick={() => productvalue(item.ProductNumber, item.CounterName)}> select </button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        users.length == 0 ? <div className="w-100 text-center py-4">
                            <span> no record . </span>
                        </div> : ""
                    }

                </div>
                <div className="w-100 pl-2">
                    <span> package data count : {users.length == 0 ? 0 : users.length} </span>
                </div>
                {
                    modifymodel.length > 0 ?
                        <div className="border-1-solid p-3 w-50 border-radius-3-px ml-3">
                            <span> status modify </span>
                            <div className=" d-flex flex-column">
                                <span className="my-2"> status : {modifymodel.IsSuccess}</span>
                                <span className="my-2"> Code : {modifymodel.Code}</span>
                                <span className="my-2"> Decription : {modifymodel.Description}</span>
                                <span className="my-2"> TransactionID : {modifymodel.TransactionID}</span>
                                <span className="my-2"> status : {modifymodel.IsSuccess}</span>

                            </div>

                        </div>
                        :
                        ""
                }

            </div>
            <div className={`position-absolute top-0 left-0 d-flex align-items-center w-100 h-100-vh bg-backdrop ${loading == true ? "d-flex" : "display-none"}`}>
                <div className="loader">

                </div>

            </div>
        </div>
    )
}

const Phonenumber = props => (<InputMask mask="99999 99999999" value={props.value} onChange={props.onChange}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} inputRef={props.inputRef} inputProps={{ readOnly: props.readOnly }} />}
</InputMask>)


