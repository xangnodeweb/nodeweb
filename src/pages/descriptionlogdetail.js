import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
export default function Descriptionlogpage() {

    const [selectvalue, setselectvalue] = useState(0)
    const [modellogpage, setmodellogpage] = useState([]);

    async function getdesclogpage(params) {
        try {

            let namefile = "";
            if (selectvalue == 0) {
                return;
            }

            if (selectvalue == 1) {
                namefile = "fileaddpackage.txt"
            } else if (selectvalue == 2) {
                namefile = "filedatachange.txt"
            }
            const data = await axios.post("http://172.28.27.50:3000/apichangemain/getdatafile/" + namefile);
            console.log(data.data);
            if (data.status == 200) {
                setmodellogpage(data.data.result);

            }
        } catch (error) {
            console.log(error)
        }
    }

    async function cleardatafile() {
        try {

            let namefile = "";
            if (selectvalue == 0) {
                return;
            }

            if (selectvalue == 1) {
                namefile = "fileaddpackage.txt"
            } else if (selectvalue == 2) {
                namefile = "filedatachange.txt";
            }
            console.log(namefile)

            const data = await axios.post("http://172.28.27.50:3000/apichangemain/datafileclear/" + namefile);
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
            console.log(e.target.value);
            setselectvalue(e.target.value);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div className="w-100   p-3">

            <div className=" p-2  w-50 d-flex align-items-center box-shadow">
                <div className="d-flex flex-column w-100">
                    <span> select detaillog page </span>
                    <div className="d-flex align-items-center">
                        <FormControl className="w-100">
                            <Select onChange={selectvaluepage} value={selectvalue} >
                                <MenuItem value={0} > disable page </MenuItem>
                                <MenuItem value={1} > detaillog addpackage </MenuItem>
                                <MenuItem value={2}> detaillog changemainoffering </MenuItem>
                            </Select>
                        </FormControl>
                        <div className="d-flex mt-1">
                            <button className="btn mx-2" onClick={getdesclogpage}> search </button>
                            <button className="btn ml-1" onClick={cleardatafile}> deletelog </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-100 mt-3 d-flex flex-column-reverse border-grey box-shadow p-3">

                {modellogpage.length > 0 ?
                    modellogpage.length > 0 && modellogpage.map((item, index) =>
                        <div key={index}>
                            <span className="f-16-px"  >
                                {item.toString()}

                            </span>
                        </div>


                    ) :
                    <div className="w-100 text-center">
                        <span className="f-18-px"> no record log </span>
                    </div>
                }




            </div>



        </div>

    )

}