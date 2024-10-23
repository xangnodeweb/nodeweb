import * as React from "react";

import { useEffect, useState } from "react";
import { Modal, ButtonToolbar, Button, RadioGroup, } from "rsuite";
export default function Modalchangeadddate({ callmodal, opendialog, openbutton, modelchangemax, modelsetvalidity }) {

    return (

        <>
            <Modal backdrop={true} key={true} open={opendialog} onClose={(e) => callmodal({ status: false, confirmbtn: 0 }, e)}>

                <Modal.Header>
                    {
                        openbutton.lbmsgtitle != '' ?
                            <>
                                <Modal.Title>
                                    <span> {openbutton.lbmsgtitle} </span>
                                </Modal.Title>
                            </> : ""
                    }
                </Modal.Header>
                {
                    // openbutton {lbtitle , openbutton ,  lbmsg}
                    openbutton.openbutton == 0 || openbutton.openbutton == 3 ?

                        <>
                            <Modal.Body>
                                <div className="mt-4">

                                    <table>

                                        <thead>
                                            <tr>
                                                <th> phone </th>
                                                <th> balance max </th>
                                                <th> day </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                modelchangemax && modelchangemax.length > 0 && modelchangemax.map((item, index) =>
                                                    <tr>
                                                        <td>{item.phone}</td>
                                                        <td>{item.balance}  </td>
                                                        <td >{item.datevalue} </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            </Modal.Body>
                        </> : openbutton.openbutton == 4 ?

                            <>
                                <Modal.Body>
                                    <div className="mt-4">

                                        <table>

                                            <thead>
                                                <tr>
                                                    <th> phone </th>
                                                    <th> validityincrement </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    modelsetvalidity && modelsetvalidity.length > 0 && modelsetvalidity.map((item, index) =>
                                                        <tr>
                                                            <td>{item.phone}</td>
                                                            <td >{item.validitydate} </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </Modal.Body>
                            </> :
                            <Modal.Body>
                                <div className="w-100 text-center d-flex flex-column">
                                    <i className="fa fa-exclamation-circle f-70-px"></i>
                                    <span className="f-18-px mt-2"> {openbutton.lbmsg} </span>

                                </div>

                            </Modal.Body>
                }

                <Modal.Footer style={{ "marginTop": openbutton.openbutton == 1 ? "12px" : "" }}>
                    {
                        openbutton.openbutton == 1 ?
                            <>
                                <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 0 })}> Ok </Button>
                            </>
                            : openbutton.openbutton == 0 ?
                                <>
                                    <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 2 })}> Ok </Button>
                                    <Button style={{ "backgroundColor": "#575757", color: "#FFF" }} onClick={() => callmodal({ status: false, confirmbtn: 0 })}> Cancel </Button>
                                </> : openbutton.openbutton == 3 ?
                                    <>
                                        <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 2 })}> edit </Button>
                                        <Button style={{ "backgroundColor": "#575757", color: "#FFF" }} onClick={() => callmodal({ status: false, confirmbtn: 0 })}> Cancel </Button>
                                    </> : openbutton.openbutton == 4 ?
                                        <>
                                            <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 3 })}> Ok </Button>
                                            <Button style={{ "backgroundColor": "#575757", color: "#FFF" }} onClick={() => callmodal({ status: false, confirmbtn: 0 })}> Cancel </Button>
                                        </> : ""
                    }

                </Modal.Footer>


            </Modal>


        </>


    )

}