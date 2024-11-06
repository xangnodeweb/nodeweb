import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"
import Stack from "@mui/material/Stack";
import Modalconfirm from "../filemodule/modallist"

export default function Descriptionlogpage() {

    const [selectvalue, setselectvalue] = useState(0)
    const [modellogpage, setmodellogpage] = useState([]);

    const [modellogpages, setmodellogpages] = useState();
    const [modeldatefile, setmodeldatefile] = useState([]);
    const [selectdate, setselectdate] = useState('0');

    const [loading, setloading] = useState(false);
    const [openmodal, setopenmodal] = useState(false);

    const [optionbtn, setoptionbtn] = useState({
        titlemsg: "",
        btnconfirm: 0
    })

    async function getdesclogpage() {
        try {
            setloading(false);
            let namefile = "";
            let modeldate = [];
            setmodeldatefile([]);
            if (selectvalue == 0) {
                setloading(true);
                return;
            }

            if (selectvalue == 1) {
                namefile = "fileaddpackage.txt"
            } else if (selectvalue == 2) {
                namefile = "filedatachange.txt"
            }
            const data = await axios.post(`http://127.0.0.1:3000/apichangemain/getdatafile/${namefile}`);
            console.log(data.data);
            if (data.status == 200) {
                setmodellogpage(data.data.result);

                setloading(false);
                if (data.data.result.length > 0) {
                    setmodellogpages(data.data.result);

                    if (selectvalue == 1) {
                        for (var i = 0; i < data.data.result.length; i++) {

                            console.log(data.data.result.toString().split("|"));

                            if (modeldate.length > 0) {
                                const model = data.data.result[i].toString().split("|");
                                const index = modeldate.findIndex(x => x.toString().slice(0, 8) == model[6].toString().slice(0, 8));

                                if (index == -1) {
                                    modeldate.push(model[6].toString().slice(0, 8));
                                }

                            } else {
                                const model = data.data.result[i].toString().split("|");
                                if (model.length > 0) {
                                    if (model[6].slice(0, 8)) {
                                        modeldate.push(model[6].toString().slice(0, 8));
                                    }
                                }
                            }
                        }
                    } else {

                        for (var i = 0; i < data.data.result.length; i++) {
                            console.log(data.data.result[i].toString().split("|"));
                            if (modeldate.length > 0) {

                                const model = data.data.result[i].toString().split("|");
                                if (model[4]) {
                                    const index = modeldate.findIndex(x => x.toString() == model[4].toString().slice(0, 8));
                                    if (index == -1) {
                                        modeldate.push( model[4].toString().slice(0, 8) );
                                    }
                                }

                            } else {
                                const model = data.data.result[i].toString().split("|");
                                if (model[4]) {
                                    modeldate.push(  model[4].toString().slice(0, 8) );
                                }

                            }
                        }
                        console.log(modeldate)


                    }
                    // console.log(modeldate)
                    let models = [];
                    if (modeldate.length > 0) {
                        for (var i = 0; i < modeldate.length; i++) {
                            models.push({ datelog: modeldate[i] });
                        }
                        setmodeldatefile(models)
                        // setselectdate();
                    }
                    console.log(modeldatefile);

                    openmodalconfirm({ status: true, btnconfirm: 1, msg: `read data file success` })
                }
            }
        } catch (error) {
            console.log(error)
            setloading(false);
        }
    }

    async function cleardatafile() {
        try {
            setloading(true);
            let namefile = "";
            if (selectvalue == 0) {
                return;
            }

            if (selectvalue == 1) {
                namefile = "fileaddpackage.txt"
            } else if (selectvalue == 2) {
                namefile = "filedatachange.txt";
            }
            // console.log(namefile)

            const data = await axios.post("http://127.0.0.1:3000/apichangemain/datafileclear/" + namefile);
            console.log(data.data);

            if (data.status == 200) {
                getdesclogpage()
            }


        } catch (error) {
            console.log(error)
        }
    }



    const selectvaluepage = (e) => {
        try {
            // console.log(e.target.value);
            setselectvalue(e.target.value);
        } catch (error) {
            console.log(error);
        }
    }

    const callmodal = ({ status, btnconfirm }, e) => {
        try {

            setopenmodal(status);

            if (btnconfirm == 1) {
                cleardatafile()
            }
        } catch (error) {
            console.log(error);
        }
    }
    const openmodalconfirm = ({ status, btnconfirm, msg }) => {
        try {
            setopenmodal(status)
            optionbtn.titlemsg = msg
            optionbtn.btnconfirm = btnconfirm;
        } catch (error) {
            console.log(error)
        }
    }

    const selectdatevalue = (e) => {
        try {
            let model = [];

            setselectdate(e.target.value);
            if (modellogpages.length > 0) {
                console.log(modellogpages)
                var modellog = modellogpages.filter(x => x.toString().includes(e.target.value));
                console.log(modellog);
                if (modellog.length > 0) {

                    setmodellogpage(modellog)
                }
            }
            // console.log(e.target.value);

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="w-100   p-3 position-relative">

            <div className=" p-2  w-100 d-flex justify-content-center box-shadow  justify-content-start">
                <div className="d-flex flex-column w-50">
                    <span> select detaillog page </span>
                    <div className="d-flex align-items-center">
                        <FormControl className="w-100 max-w-450-px">
                            <Select onChange={selectvaluepage} value={selectvalue} >
                                <MenuItem value={0} > disable page </MenuItem>
                                <MenuItem value={1} > detaillog addpackage </MenuItem>
                                <MenuItem value={2}> detaillog changemainoffering </MenuItem>
                            </Select>
                        </FormControl>
                        <div className="d-flex mt-1">
                            <button className="btn mx-2 bg-default color-white" onClick={() => getdesclogpage()}> search </button>
                            <button className="btn ml-1" onClick={(e) => openmodalconfirm({ status: true, btnconfirm: 0, msg: "you want delete data file ?" }, e)}> deletelog </button>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center w-40 ">
                    <div className="d-flex flex-column w-100">

                        <span> datelog </span>
                        <Select onChange={selectdatevalue} value={selectdate} placeholder="date data log" readOnly={modeldatefile.length == 0 ? true : false} >
                            {
                                <MenuItem value={'0'}> disable menu </MenuItem>

                            }
                            {
                                modeldatefile && modeldatefile.length > 0 && modeldatefile.map((item, index) =>
                                (
                                    <MenuItem value={item.datelog} >  {item.datelog}  </MenuItem>
                                ))
                            }
                        </Select>
                    </div>

                    {/* <button className="mt-2 ml-2 p-2 border-radius-3-px" >  selectdate  </button> */}
                </div>


            </div>

            <div className="w-100 mt-3 d-flex flex-column-reverse border-grey box-shadow p-3">

                {
                    modellogpage.length > 0 ?
                        modellogpage.length > 0 && modellogpage.map((item, index) =>
                        (<div key={index}>
                            <span className="f-16-px"  >
                                {item.toString()}
                            </span>
                        </div>)
                        ) :
                        <div className="w-100 text-center">
                            <span className="f-18-px"> no record log </span>
                        </div>
                    // <Stack >
                    //     <CircularProgress size={"4rem"} className="m-auto" />
                    // </Stack>
                }
            </div>
            <Modalconfirm callmodal={callmodal} opendialog={openmodal} optionbtn={optionbtn} />
        </div>

    )

}