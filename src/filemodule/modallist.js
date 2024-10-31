import * as React from "react";
import { useState, useEffect } from "react";

import { Modal, Button } from "rsuite"


export default function Modalconfirm({ callmodal, opendialog, optionbtn }) {


    return (

        <>
            <Modal backdrop={true} keyboard={true} open={opendialog} onClose={(e) => callmodal({ status: false, btnconfirm: 0 }, e)}>
                <Modal.Body>
                    <div className="w-100 d-flex flex-column">
                        <i className="fa fa-exclamation-circle f-70-px m-auto"> </i>
                        <span className="f-18-px m-auto">  {optionbtn.titlemsg} </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" onClick={(e) => callmodal({ status: false, btnconfirm: 1 }, e)}> OK </Button>
                    <Button onClick={(e) => callmodal({ status: false, btnconfirm: 0 }, e)} > Cancle</Button>
                </Modal.Footer>
            </Modal>


        </>

    )

}