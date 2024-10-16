import * as React from "react"
import { useEffect, useState } from "react";


export default function Descriptionpage({ callpages }) {

    return (

        <div className="w-100 h-100-vh bg-white ">

            <div className="w-100 h-100-px bg-default d-flex align-items-center pl-3">
                <div onClick={() => callpages({ status: false, loadpage: 0 })} className="w-50-px min-w-50-px h-50-px border-radius-50 d-flex align-items-center justify-content-center bg-white">
                    <i className="fa fa-long-arrow-left color-bg-default f-35-px"> </i>
                </div>
                <span onClick={() => callpages({ status: false, loadpage: 0 })} className="f-20-px color-white ml-2"> page main </span>

            </div>
            <div className="w-100 border-1- d-flex flex-column">
                <span className="m-auto f-20-px">  soap modify or add package  </span>
                <div className="pl-3 d-flex flex-column mb-3">
                    <div className="d-flex">
                        <span className="f-18-px"> 1/ page inquery phone  </span>
                        &nbsp;    <span className="f-18-px"> ກວດເບິ່ງ package  ເບີໂທ </span>
                    </div>
                    <div className="d-flex">
                        <span className="f-18-px"> 2/ page modify datetime  </span>
                        &nbsp;  <span className="f-18-px"> ອັບເດດຂໍ້ມູນ date expire ແບບ user </span>
                    </div>
                    <div className="d-flex">
                        <span className="f-18-px"> 3/ page modify list datetime  </span>
                        &nbsp;      <span className="f-18-px"> ອັບເດດຂໍ້ມູນ date expire ແບບ file  </span>
                    </div >
                    <div className="d-flex">
                        <span className="f-18-px"> 4/ page add package phone user </span>
                        &nbsp;   <span className="f-18-px"> ອັບເດດຂໍ້ມູນ date expire ແບບ file  </span>
                    </div>
                    <div className="d-flex">
                        <span className="f-18-px"> 5/ page add package listphone ແບບ file </span>
                        &nbsp;  <span className="f-18-px"> ອັບເດດຂໍ້ມູນ date expire ແບບ user </span>
                    </div>
                    <div className="d-flex">
                        <span className="f-18-px"> 6/ description ລາຍລະອຽດການໃຊ້ soap query phone </span>
                       
                    </div>

                </div>

                <div className="w-100 text-center">
                    <img src="http://172.28.27.50:8080/image/main.png" className="w-70 h-500-px" />
                </div>

                <div className="pl-3 mt-5">
                    <span className="f-20-px f-weight-900"> 1/ page inquery phone </span>
                </div>
                <div className="w-100 d-flex flex-column pl-3 mt-2">

                    {/* <span className="f-14-px"> 1/ enter value phone 856205xxxxxxx </span> */}      <span className="f-18-px"> 1/ ປ້ອນເບິໂທ 856205xxxxxxx ໃຫ້ຄົບ  </span>
                    {/* <span className="f-14-px" > 2/ display list  package  </span> */} <span className="f-18-px" > 2/ ປ້ອນຄົບແລ້ວ ກົດປູ່ມ search ເພື່ອຄົ້ນຫາ ແລະ ສະແດງ package </span>
                    {/* <span className="f-14-px" > 3/ select list phone package  </span>          */}        <span className="f-18-px" > 3/ ສະແດງຂໍ້ມູນ package ທີ່ຂອງເບີທີ່ຄົ້ນຫາ   </span>
                </div>
                <div className="w-70 text-center position-relative m-auto">
                    <img src="http://172.28.27.50:8080/image/inquery-main.png" className="w-100 h-500-px mt-3" />
                    <div className="position-absolute top-93-px left-33">
                        <div className="position-relative">
                            <div className="" style={{}}>
                                <span className="w-40-px h-40-px border-radius-50 bg-gray f-20-px d-flex align-items-center justify-content-center"> 1 </span>
                            </div>
                            <i className="fa fa-long-arrow-left position-absolute left-10-px-l bottom-0 transform-30-l"></i>
                        </div>
                    </div>

                    <div className="position-absolute left-11  top-33">

                        <div className="position-relative">
                            <div className=" " style={{}}>
                                <span className="w-40-px h-40-px bg-gray border-radius-50 f-20-px d-flex justify-content-center align-items-center "> 2 </span>
                            </div>
                            <i className="fa fa-long-arrow-right position-absolute top-0 right-10-px-l transform-20-l"> </i>
                        </div>
                    </div>


                    <div className="position-absolute top-260-px right-35-px">
                        <div className="position-relative">
                            <div className="" >
                                <span className="w-40-px h-40-px bg-gray border-radius-50 f-20-px d-flex justify-content-center align-items-center "> 3 </span>

                                <i className="fa fa-long-arrow-left position-absolute left-0 top-11-px-l transform-60"> </i>
                            </div>
                        </div>

                    </div>


                </div>
                <div className="w-100 d-flex flex-column">
                    <div className="d-flex mt-5">
                        <span className="f-20-px f-weight-900 ml-3"> 2/ modify datetime  </span>   <span className="f-20-px f-weight-900 ml-3"> ອັບເດດ date expireTime ແບບ user  </span>

                    </div>
                    <div className="d-flex flex-column pl-3">
                        {/* <span> 1/ enter value phone 856205xxxxxxx  </span>     */}     <span className="f-18-px"> 1/ ປ້ອນເບິໂທເພື່ອຄົ້ນຫາ package ທີ່ຕ້ອງການອັບເດດ date expireTime  </span>
                        {/* <span> 2/ click button select package Prepaid_Staff   </span>    */}
                        <span className="f-18-px"> 2/  ຄລິກເລືອກປຸ່ມກົດ select  ເລືອກໄດ້ ແຕ່ສະເພາະ Package Prepaid Staff_3GB, Staff_5GB, Staff_10GB, Staff_25GB   </span>
                        {/* <span> 3/ select dateexpire  </span> */}
                        <span className="f-18-px"> 3/ ກວດເບິ່ງຂໍ້ມູນທີ່ເລືອກປ້ອນ productnumber ເລືອກກົດທີ່ປຸ່ມ select package ທີ່ສະແດງ ແລະ ເລືອກວັນເວລາທີ່ ຕ້ອງການອັບເດດ   </span>
                        <span className="f-18-px"> 4/ ກົດປຸ່ມ modify ເພື່ອອັບເດດຂໍ້ມູນທີ່ເລືອກ  </span>
                        <span className="f-18-px"> 5/ ຖ້າອັບເດດ modify expireTime success ອັບເດດຂໍ້ມູນສຳເລັດ ຈະມີຂໍ້ຄວາມສະແດງ ຕາມຮູບ ເລກ 5  </span>
                    </div>
                    <div className="w-70 m-auto position-relative d-flex flex-column ">
                        <img src="http://172.28.27.50:8080/image/modify-main.png" className="w-100 h-500-px mt-5" />

                        <div className="position-absolute left-34 top-16 ">
                            <div className="position-relative">
                                <div className=" w-40-px h-40-px bg-gray border-radius-50 d-flex justify-content-center align-items-center">
                                    <span> 1 </span>
                                </div>
                                <i className="fa fa-long-arrow-left f-20-px position-absolute bottom-17-l left-4-l transform-61-l">  </i>
                            </div>
                        </div>

                        <div className="position-absolute right-0 top-33">
                            <div className="position-relative">
                                <div className="position-absolute right-10-px-l top-33 w-40-px h-40-px bg-gray border-radius-50 d-flex justify-content-center align-items-center" style={{}}>
                                    <span> 2 </span>
                                </div>
                                <i className="fa fa-long-arrow-left f-20-px position-absolute top-0 left-46-px-l top-0 transform-24">  </i>

                            </div>

                        </div>

                        <div className="position-absolute top-41 left-35">
                            <div className="position-relative">

                                <div className=" w-40-px h-40-px bg-gray border-radius-50 d-flex justify-content-center align-items-center" style={{}}>
                                    <span> 3 </span>
                                </div>
                                <i className="fa fa-long-arrow-left f-20-px position-absolute bottom-17-l left-2-px-l transform-53-l">  </i>
                            </div>
                        </div>



                        <div className="position-absolute left-38 bottom-35">
                            <div className="position-relative">

                                <div className="  w-40-px h-40-px bg-gray border-radius-50 d-flex justify-content-center align-items-center" style={{}}>
                                    <span> 4 </span>
                                </div>
                                <i className="fa fa-long-arrow-left f-20-px position-absolute bottom-10-l left-11-px-l transform-35-l">  </i>

                            </div>
                        </div>

                    </div>
                    <div className=" d-flex flex-column mt-5 mb-6 position-relative px-5 pt-5 mx-auto">

                        <img src="http://172.28.27.50:8080/image/addpackage-success-main.png" className="w-400-px h-200-px mt-5" />
                        <div className="w-40-px h-40-px bg-default border-radius-50 d-flex justify-content-center align-items-center position-absolute left-0 top-0" >
                            <span> 5 </span>
                        </div>

                    </div>
                </div>

                <div className="w-100 d-flex flex-column mt-3">
                    <div className="d-flex flex-column px-3">
                        <div className="d-flex ">

                            <span className="f-20-px f-weight-900"> 3/ modifylistphone file list </span> &nbsp;
                            <span className="f-20-px f-weight-900"> ອັບເດດ date expire ແບບ file </span>
                        </div>

                        <span className="f-18-px"> 1/ ຄລິກເລືອກ ປຸ່ມ 3 ປຸ່ມ ເພື່ອເລືອກປະເພດຟາຍ ແບບ txt ແລະ file xlsx ຫຼັງຈາກເລືອກຟາຍແລ້ວ ກົດປຸ່ມ choose file ເພື່ອເລືອກຟາຍ </span>
                        <span className="f-18-px"> 2/ ກົດປຸ່ມ load file data ເພື່ອໂຫຼດຂໍ້ມູນຈາກຟາຍ  </span>
                        <span className="f-18-px"> 3/ ສະແດງຂໍ້ມູນ ສາມາດກົດປຸ່ມເລືອກ ແບບ ສະແດງຂໍ້ມູນ : ຂໍ້ມູນທັງໝົດ , ຂໍ້ມູນບໍ່ມີ package ແລະ ຂໍ້ມູນມີ package </span>
                        <span className="f-18-px"> 4/ ເລືອກວັນທີ date expire ທີ່ຕ້ອງການອັບເດດ  </span>
                        <span className="f-18-px"> 5/ ກົດປຸ່ມອັບເດດ modify datetime ເພື່ອອັບເດດຂໍ້ມູນ ຖ້າອັບເດດ ສຳເລັດຈະ download ຟາຍ xlsx ຖ້າສຳເລັດ ກະລຸນາກວດເບິ່ງວ່າ ມີຂໍ້ມູນໃນຟາຍ  status ເປັນ false ແມ່ນຂໍ້ມູນທີ່ modify ບໍ່ສຳເລັດ ແລະ ຖ້າເປັນ status true ແມ່ນສຳເລັດ   </span>
                        <span className="f-18-px"> 6/ ສະແດງຂໍ້ມູນອັບເດດ ປຸ່ມເລືອກເບິ່ງຂໍ້ມູນອັບເດດ ຂໍ້ມູນທັງໝົດ , ຂໍ້ມູນອັບເດດສຳເລັດ ແລະ ຂໍ້ມູນອັບເດດບໍ່ສຳເລັດ  </span>
                        <span className="f-18-px"> 7/ ສາມາດກົດປຸ່ມ download ເພື່ອດາວໂຫຼດຟາຍທີ່ອັບເດດ  </span>
                    </div>
                    <div className="w-70 m-auto position-relative pt-5">
                        <img src="http://172.28.27.50:8080/image/modifylistphone-main.png" className="w-100  h-500-px" />

                        <div className="top-18 left-32 position-absolute">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 1 </span>
                                </div>
                                <i className="fa fa-long-arrow-left  position-absolute left-9-l bottom-4-l transform-16-l"> </i>

                                <i className="fa fa-long-arrow-left transform-65-l position-absolute"> </i>


                            </div>
                        </div>

                        <div className="position-absolute top-40 left-37">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 2 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute top-8-px-l left-0 transform-30 "> </i>
                            </div>
                        </div>

                        <div className="position-absolute  top-14 right-35">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray   d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 3 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute bottom-5-l left-8-l transform-30-l "> </i>
                            </div>
                        </div>

                        <div className="position-absolute top-52 left-10">
                            <div className="position-relative ">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 4 </span>
                                </div>
                                <i className="fa fa-long-arrow-right position-absolute top-0 right-10-px-l transform-9-l "> </i>
                            </div>
                        </div>

                        <div className="position-absolute top-64 left-32">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 5 </span>
                                </div>
                                <i className="fa fa-long-arrow-left  top-0 left-11-px-l position-absolute transform-55"></i>
                            </div>
                        </div>

                        <div className="position-absolute  bottom-178-px right-30">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 6 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute  bottom-0  left-11-px-l transform-5-l"> </i>
                            </div>
                        </div>
                        <div className="position-absolute  bottom-24 right-15-px-l">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span className="f-20-px"> 7 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute left-4-l  top-9-px-l transform-50"> </i>
                            </div>
                        </div>



                    </div>
                    <div className="w-100 my-3 d-flex flex-column position-relative px-5 ">

                        <div>
                            <span className="f-20-px"> ແບບ file txt ແລະ file xlsx </span>
                        </div>

                        <div className="w-100  position-relative d-flex justify-content-center">

                            <div className="d-flex flex-column align-items-center border-grey">
                                <img src="http://172.28.27.50:8080/image/file-txt-modify-main.png" className="w-355-px h-220-px" />
                                <span className="f-16-px">  ປະເພດຟາຍ file txt </span>
                            </div>

                            <div className="d-flex flex-column align-items-center border-grey ml-7">
                                <img src="http://172.28.27.50:8080/image/file-xlsx-modify-main.png" className="w-355-px h-220-px" />
                                <span className="f-16-px">  ປະເພດຟາຍ file xlsx </span>
                            </div>

                        </div>
                    </div>
                    <div className="w-100 my-3 d-flex position-relative px-5 justify-content-center">
                        <div className="d-flex flex-column align-items-center">
                            <img src="http://172.28.27.50:8080/image/dialog-typefile-main.png" className="w-355-px h-220-px" />
                            <span className="f-16-px">  ກະລຸນາເລືອກຟາຍໃຫ້ຖືກປະເພດ </span>
                        </div>

                        <div className="d-flex flex-column align-items-center ml-5 ">
                            <img src="http://172.28.27.50:8080/image/file-notfound-data-main.png" className="w-355-px h-220-px" />
                            <span className="f-16-px">  ຟາຍທີ່ທ່ານເລືອກ ບໍ່ມີຂໍ້ມູນ </span>
                        </div>
                        <div className="d-flex flex-column align-items-center ml-5 ">
                            <img src="http://172.28.27.50:8080/image/modify-success.main.png" className="w-355-px h-220-px" />
                            <span className="f-16-px">  ອັບເດດຂໍ້ມູນສຳເລັດ </span>
                        </div>
                    </div>


                </div>

                <div className="w-100 d-flex flex-column">
                    <div className="px-3 d-flex flex-column">

                        {/* <span className="f-20-px f-weight-900"> 4/ add package phone </span> */}
                        <span className="f-20-px f-weight-900"> 4/ add package phone ຕື່ມ package ແບບ user </span>
                        {/* <span> 1/ enter value phone , packagename , datestart , dateexpire , daterefillstop </span> */}
                        <span className="f-18-px"> 1/ ປ້ອນຂໍ້ມູນ ເບີໂທ , ເລືອກ package , ເລືອກວັນທີ່ເລີ່ມຕົ້ນ , ເລືອກວັນທີ່ໝົດອາຍຸ , ເລືອກມື້ RefillStopTime ຖ້າປ້ອນຂໍ້ມູນຄົບ ໃຫ້ກົດປຸ່ມ add package </span>

                        <span className="f-18-px"> 2/ ກົດປຸ່ມ add package ເພື່ອຕື່ມ pagekage ເບີທີ່ປ້ອນ ຖ້າສຳເລັດຈະມີ ຟາຍ download xlsx ກະລຸນາເປີດຟາຍເພື່ອກວດເບິ່ງ ການຕື່ມ pagekage  </span>
                        <span className="f-18-px"> 3/ ສະແດງລາຍການ package ຂອງເບີທີ່ຕື່ມ add package </span>

                    </div>

                    <div className="w-70 m-auto position-relative pt-5">

                        <img src="http://172.28.27.50:8080/image/addpackagephone-main.png" className="w-100 h-500-px" />

                        <div className=" top-18 left-33 position-absolute ">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px  border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span> 1 </span>
                                </div>
                                <i className="fa fa-long-arrow-left bottom-0 left-0 position-absolute bottom-13-px-l  transform-55-l left-5-px  ">  </i>
                            </div>
                        </div>

                        <div className="position-absolute  bottom-23 left-30 ">
                            <div className="position-relative">

                                <div className="w-40-px h-40-px position-absolute border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span> 2 </span>
                                </div>
                                <i className="fa fa-long-arrow-left  position-absolute top-11-px-l right-14-px-l transform-67">  </i>
                            </div>

                        </div>

                        <div className="position-absolute top-64 right-0 ">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px  border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span> 3 </span>
                                </div>
                                <i className="fa fa-long-arrow-left top-9-px-l left-4-l position-absolute transform-46"> </i>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="w-100 d-flex flex-column mt-5">

                    <div className="px-3 d-flex flex-column">

                        <span className="f-20-px f-weight-900">  5/ add package listphone ຕື່ມ package ແບບຟາຍ file txt ແລະ file xlsx </span>

                        <span className="f-18-px"> 1/  ກະລຸນາເລືອກແບບຟາຍທີ່ຕ້ອງການ ແລ້ວເລືອກປຸ່ມ file open txt  ແລະ file open xlsx ເພື່ອເລືອກປະເພດຟາຍ  ຄລິກເລືອກ ຟາຍ txt ແລະ ຟາຍ xlsx ເລືອກໄດ້ 2 ແບບ ເລືອກຟາຍແລ້ວກົດ load file data ເພື່ອໂຫຼດ ດາຕ້າ ຈາກຟາຍ </span>
                        <span className="f-18-px"> 2/  ຫຼັງຈາກ ກົດປຸ່ມ load file data ຖ້າສຳເລັດ ຈະມີຂໍ້ມູນສະແດງ ຂໍ້ມູນເບີ ແລະ ຊື່ package ທີ່ຮູບເລກ 2    </span>
                        <span className="f-18-px">  3/ ເລືອກປ້ອນ ວັນທີ່ເລິ່ມຕົ້ນ datestart  , ເລືອກວັນທີ່ໝົດອາຍຸ dateexpire , ເລືອກມື້ date RillStopTime ປ້ອນຄົບແລ້ວ ກົດປຸ່ມ add package ເພື່ອ add package data </span>
                        <span className="f-18-px"> 4/ ຫຼັງຈາກ ກົດ add package ຖ້າສຳເລັດ ຈະໄດ້ຟາຍ xlsx ເປີດຟາຍເພື່ອກວດເບິ່ງວ່າ ເບີໃດທີ່ add package ສຳເລັດ ຫຼື ບໍ່ສຳເລັດ ຖ້າບໍ່ສຳເລັດ status  ຈະເປັນ false ຖ້າສຳເລັດ ຈະເປັນ true </span>
                    </div>

                    <div className="w-70 position-relative m-auto pt-5">

                        <img src="http://172.28.27.50:8080/image/addpackagelistphone-main.png" className="w-100 h-500-px" />

                        <div className="position-absolute top-12 left-35">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span > 1 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute bottom-12-px-l left-3-px transform-67-l"> </i>
                            </div>

                        </div>

                        <div className="position-absolute top-30 right-0">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray  d-flex justify-content-center align-items-center">
                                    <span > 2 </span>
                                </div>
                                <i className="fa fa-long-arrow-left top-9-px-l left-3-px-l position-absolute transform-45"> </i>
                            </div>
                        </div>

                        <div className="position-absolute  bottom-26 left-39  ">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray d-flex justify-content-center align-items-center">
                                    <span > 3 </span>
                                </div>
                                <i className="fa fa-long-arrow-left position-absolute top-0 left-11-px-l transform-40"> </i>
                            </div>
                        </div>

                        <div className="position-absolute  bottom-10 left-30">
                            <div className="position-relative">
                                <div className="w-40-px h-40-px border-radius-50 bg-gray   d-flex justify-content-center align-items-center">
                                    <span > 4 </span>

                                    <i className="fa fa-long-arrow-left position-absolute top-11-px-l left-0 transform-60"> </i>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="w-100  d-flex flex-column px-5">
                        <span className="f-20-px my-3"> - ແບບ file txt or xlsx </span>
                        <div className="d-flex justify-content-center mb-3">
                            <div className=" d-flex  flex-column  ">
                                <img src="http://172.28.27.50:8080/image/file-txt-addpackage-main.png" className="h-300-px w-100 border-grey" />
                                <span className="f-18-px m-auto pt-2"> ຟາຍ txt ຂໍ້ມູນໃນຟາຍ </span>
                            </div>

                            <div className=" d-flex  flex-column ml-5 ">
                                <img src="http://172.28.27.50:8080/image/file-xlsx-addpackage-main.png" className="h-300-px w-100" />
                                <span className="f-18-px m-auto pt-2"> ຟາຍ xlsx ຂໍ້ມູນໃນຟາຍ </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-100 py-3 d-flex justify-content-center mt-5 mb-3">

                        <div className=" d-flex flex-column w-355-px h-200-px  align-items-center">
                            <img src="http://172.28.27.50:8080/image/add-notfoundfile-main.png" className="h-300-px w-100" />
                            <span className="f-18-px pt-2">  ຟາຍທີ່ທ່ານເລືອກບໍ່ມີຂໍ້ມູນ  </span>
                        </div>
                        <div className=" d-flex flex-column w-355-px h-200-px align-items-center ml-5">
                            <img src="http://172.28.27.50:8080/image/addpackage-success-main.png" className="h-300-px w-100" />
                            <span className="f-18-px pt-2">  add package ສຳເລັດ  </span>
                        </div>
                    </div>
                </div>
                <div className="w-100  d-flex flex-column px-5">

                    <span className="color-red f-20-px "> ໝາຍເຫດ :  </span>
                    <span className="f-18-px "> - ກໍລະນີທິ່ມີຂໍ້ຄວາມ ConnectTimeoutError ແມ່ນລະບົບບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້  </span>
                    <div className="w-100 d-flex pt-4 mt-2 pb-3">

                        <div className="d-flex flex-column">
                            <img src="http://172.28.27.50:8080/image/inquery-timeout-main.png" className="w-355-px h-200-px m-auto  pb-1" />
                            <span className="m-auto">  ການແຈ້ງເຕືອນທີ່ເປັນຂໍ້ຄວາມ ConnectTimeoutError ແມ່ນລະບົບບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້  </span>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    )

}