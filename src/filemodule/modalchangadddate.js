import * as React from "react";

import { useEffect, useState } from "react";
import { Modal, ButtonToolbar, Button, RadioGroup, } from "rsuite";
export default function Modalchangeadddate({ callmodal, opendialog, openbutton, modelchangemax }) {

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
                    openbutton.openbutton == 0 ?

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
                        </> :
                        <Modal.Body>
                            <div className="w-100 text-center d-flex flex-column">
                                <i className="fa fa-exclamation-circle f-55-px"></i>
                                <span className="f-18-px"> {openbutton.lbmsg} </span>

                            </div>

                        </Modal.Body>
                }

                <Modal.Footer style={{ "marginTop": openbutton.openbutton == 1 ? "12px" : "" }}>
                    {
                        openbutton.openbutton == 1 ?
                            <>
                                <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 0 })}> Ok </Button>
                            </>
                            :
                            <>
                                <Button appearance="primary" onClick={(e) => callmodal({ status: false, confirmbtn: 2 })}> Ok </Button>
                                <Button style={{ "backgroundColor": "#575757", color: "#FFF" }} onClick={() => callmodal({ status: false, confirmbtn: 0 })}> Cancel </Button>
                            </>
                    }

                </Modal.Footer>


            </Modal>


        </>


    )

}