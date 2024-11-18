import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import { dateformat , datetimeformat } from "../filemodule/dataformat";
import ModalInfoapp from "../filemodule/modalinfo";
export default function inquery() {

    const [users, setUsers] = useState([]);
    const [phone, setphone] = useState(null);

    const [isphone, setisphone] = useState(false);
    const [iserr, setiserr] = useState(0);

    const isrefphone = React.createRef();
    const [openmodal, setopenmodel] = useState(false);
    const [msg, setmsg] = useState({
        title: "",
        message: "",
        btnlength: 0
    });
    const [loading, setloading] = useState(false)

    async function onqueryphone() {
        try {
            if (phone == null) {
                clearloaddata(true, 1);
                isrefphone.current.focus();
                return;
            }
            const phones = phone.toString().replace(/[^0-9]+/g, '')
            const formatnumber = /^85620[0-9]{8}/
            if (phones.toString().length < 13) {
                clearloaddata(true, 1);
                return;
            }
            if (!formatnumber.test(phones)) {
                clearloaddata(true, 2);
                isrefphone.current.focus();
                return
            }
            setloading(true);
            clearloaddata(false , 0);
            const datas = { "phone": phones };
            // console.log(phone)
            const data = await axios.post("http://172.28.27.50:3000/api/inqueryphone", datas);
            // console.log(data)
            if (data.status == 200) {
                setUsers(data.data.result);
                setloading(false);
            }

            clearloaddata(false, 0);
        } catch (error) {
            if (error) {
                if (error.response) {
                    const statucode = error.response.data;
                    if (statucode.status == false && statucode.code == 2) {
                        setloading(false);
                        callopenmodal("", "cannot inquery phone ConnectTimeoutError", 1);
                        return
                    }
                }
                setloading(false);
                callopenmodal("", "cannot inquery phone ", 1);
            }
            setloading(false);
        
        }

    }
    // const changedvalue = (e) => {
    //     try {
    //         e.preventDefault();
    //         console.log(e.target.value)
    //     } catch (error) {
    //     }
    // }
    const cleardata = () => {
        try {

            setUsers([]);
            setphone('');
            isrefphone.current.focus();
        } catch (error) {
            console.log(error)
        }
    }
    const obChangphone = (e) => {
        try {
            setphone(e.target.value)
        } catch (error) {
            console.log(error)
        }
    }
    const callmodal = ({ status }, e) => {
        try {
            setopenmodel(status);
        } catch (error) {
            console.log(error)
        }
    }

    const callopenmodal = (title, message, btnlength) => {
        msg.title = title;
        msg.message = message;
        msg.btnlength = btnlength;
        setopenmodel(true);
    }
    const clearloaddata = (isphones, iserrors) => {
        setisphone(isphones);
        setiserr(iserrors);
    }
    useEffect(() => {


    }, [])


    return (
        <div className="w-100  bg-white d-flex ">

            <div className="w-30 border-1- d-flex flex-column px-3 pt-3">

                <div className="w-100 box-shadow px-3 pt-3 pb-4 flex-column">

                    <span  >  phonenumber </span>
                    {/* <input type="text" onChange={(e) => setphone(e.target.value)} /> */}
                    <div className="w-100 pt-2">
                        <Phonenumber onChange={obChangphone} value={phone} helperText={isphone ? iserr == 1 ? "please enter value 13 character format (85620) 5xxxxxxx" : iserr == 2 ? "please enter format (85620) 5xxxxxxx" : "" : ""} error={isphone ? true : false} placeholder="(85620) 5XXXXXXX" inputRef={isrefphone} />

                    </div>

                    <button className="mt-4 w-100 btn-default" onClick={onqueryphone}> search </button>
                    <button className="btn mt-4 w-100" onClick={cleardata}> cleardata </button>
                </div>

            </div>
            <div className="w-70 border-1- px-5 pt-3">
                <div className="w-100 max-h-400-px overflow-y-scroll ">

                    <table >
                        <thead>
                            <tr>
                                <th> msisdn </th>
                                <th> productname</th>
                                <th> countername </th>
                                <th>RefillStopTime </th>
                                <th>starttime</th>
                                <th> expiretime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.length > 0 && users.map((item, index) =>
                                    <tr key={index}>
                                        <td>{item.Msisdn}</td>
                                        <td> {item.ProductNumber} </td>
                                        <td> {item.CounterName} </td>
                                        <td>{item.RefillStopTime}</td>
                                        <td>{datetimeformat(item.StartTime)}</td>
                                        <td>{datetimeformat(item.ExpiryTime)}</td>
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
                <div className="w-100 pt-2">
                    <span> package data count : {users.length == 0 ? 0 : users.length} </span>
                </div>

            </div>
            <ModalInfoapp callmodal={callmodal} opendialog={openmodal} statuslb={msg} />
            <div className={`position-absolute top-0 left-0 d-flex align-items-center w-100 h-100-vh bg-backdrop ${loading == true ? "d-flex" : "display-none"}`}>
                <div className="loader">

                </div>
            </div>
        </div>

    )
}

const Phonenumber = props => (<InputMask mask="(99999) 99999999" value={props.value} onChange={props.onChange}  >
    {inputProps => <TextField {...inputProps} fullWidth helperText={props.helperText} error={props.error} placeholder={props.placeholder} inputRef={props.inputRef} />}
</InputMask>)

