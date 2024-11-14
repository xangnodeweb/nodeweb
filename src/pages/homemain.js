import *  as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inquery from "./inquery";
import Modifielddatetime from "./modifielddatetime";
import Modifieldlistphone from "./modifieldlistphone";
import Addpackagephone from "./addpackagephone";
import Addpackagelistphone from "./addpackagelistphone";
import Descriptionpage from "./descriptionpage";
import ChangMaxDate from "./changmaxdate";
import Descriptionlogpage from "./descriptionlogdetail";
export default function Homemain() {


    const [path, setpaths] = useState('')
    const [pages, setpage] = useState(false)
    useEffect(() => {
        const paths = new URL(window.location.href);
        setpaths(paths.pathname)
    }, [])
    const callpage = ({ status, loadpage }) => {
        try {
            console.log(status)
            setpage(status)
            if (loadpage == 0) {
                window.location.reload(); // loadpage == 0 reload location
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (



        <>
            {
                !pages ?
                    <div className="w-100 h-100-vh bg-white d-flex">

                        <div className="main-slidebar">
                            <div className="icon-menu iconmenu  w-100 bg-white  d-flex">
                                <span className="m-auto"> soap query phone {/*soap data phonenumber*/} </span>

                                <i className="fa fa-chevron-left color-white border-t-l-radius-15-px  border-b-l-radius-15-px bg-default border-white"></i>
                            </div>

                            <div className="nav-link">
                                <li className={`${path == "/inquery" ? "bg-menubar" : ""}`}>
                                    <a href="/inquery">
                                        <i className="fa fa-newspaper-o"> </i>
                                        <span > inquery phone </span>

                                    </a>

                                </li>
                                <li className={`${path == "/modifielddatetime" ? "bg-menubar" : ""}`}>
                                    <a href="/modifielddatetime">
                                        <i className="fa fa-calendar"> </i>
                                        <span > modify datetime </span>
                                    </a>
                                </li>
                                <li className={`${path == "/Modifieldlistphone" ? "bg-menubar" : ""}`}>
                                    <a href="/Modifieldlistphone">
                                        <i className="fa fa-calendar-plus-o"> </i>
                                        <span > modify list datetime </span>
                                    </a>
                                </li>
                                <li className={`${path == "/Addpackagephone" || path == "/Addpackagelistphone" ? "bg-menubar" : ""} card-item-add`}>
                                    <div className="d-flex align-items-center">
                                        <a >
                                            <i className="fa fa-id-card-o"> </i>
                                            <span > add package phone </span>
                                        </a>
                                        <i className="fa fa-chevron-down arrow"> </i>
                                    </div>
                                    <ul className="link-submenu">
                                        <li style={{ backgroundColor: `${path == "/Addpackagephone" ? "#FFFFFF5c" : ""}` }} > <a href="/Addpackagephone"> add package phone</a> </li>
                                        <li style={{ backgroundColor: `${path == "/Addpackagelistphone" ? "#FFFFFF5c" : ""}` }} > <a href="/Addpackagelistphone"> add package listphone</a> </li>
                                    </ul>
                                </li>
                                <li className={`${path == "/changemaxdate" ? "bg-menubar" : ""}`}>
                                    <a href="/changemaxdate">
                                        <i className="fa fa-bars"> </i>
                                        <span > changemax date </span>
                                    </a>
                                </li>

                                <li className={`${path == "/desclogpage" ? "bg-menubar" : ""} card-item-detail`}>
                                    <div className="d-flex align-items-center justify-content-between ">
                                        <a >
                                            <i className="fa fa-file-text-o"> </i>
                                            <span > description page </span>
                                        </a>
                                        <i className="fa fa-chevron-down arrow" ></i>
                                    </div>
                                    <ul className="link-submenu mb-0">

                                        <li
                                            onClick={() => {
                                                console.log("page");
                                                setpage(true)
                                            }}
                                        > <a > description page </a> </li>
                                        <li style={{ backgroundColor: ` ${path == "/desclogpage" ? "#FFFFFF5c" : ""}` }}> <a href="/desclogpage"> detaillog page </a> </li>

                                    </ul>
                                </li>

                            </div>


                        </div >
                        <div className="home-section">
                            <div className="w-100 bg-default h-50-px d-flex align-items-center px-3">
                                <i className="fa fa-home color-white f-24-px"></i><span className="color-white ml-2 f-20-px"> Home : {path.replace("/", "").toLocaleLowerCase()} </span>
                            </div>
                            <BrowserRouter>

                                <Routes>
                                    <Route path="/inquery" element={<Inquery />} />
                                    <Route path="/modifielddatetime" element={<Modifielddatetime />} />
                                    <Route path="/modifieldlistphone" element={<Modifieldlistphone />} />
                                    <Route path="/Addpackagephone" element={<Addpackagephone />} />
                                    <Route path="/Addpackagelistphone" element={<Addpackagelistphone />} />
                                    <Route path="/Descriptionpage" element={<Descriptionpage />} />
                                    <Route path="/changemaxdate" element={<ChangMaxDate />} />
                                    <Route path="/desclogpage" element={<Descriptionlogpage />} />
                                </Routes>
                            </BrowserRouter>

                        </div>

                    </div >
                    :
                    <>
                        <div className="w-100 h-100-vh bg-gray">
                            <Descriptionpage callpages={callpage} />
                        </div>


                    </>
            }
        </>


    )

}