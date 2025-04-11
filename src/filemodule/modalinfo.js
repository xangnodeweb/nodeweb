import * as React from "react";
import { useState, useEffect } from "react";
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';

export default function ModalInfoapp({ callmodal, opendialog, statuslb, }) {

    // statuslb == field == statuslb.title , statuslb.message

    useEffect(() => {

    }, [])

    return (
        <>
            {/* <div className={`w-100 h-100-vh ${title == false ? "display-none" : "display-block"}`} > */}

            <Modal backdrop={true} keyboard={true} open={opendialog} onClose={(e) => callmodal({ status: false, delvalue: 1 }, e)}>
                <Modal.Header>
                    <Modal.Title>   <span className="f-20-px f-weight-400">  {statuslb.title} </span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="w-100 text-center">

                        <i className="fa fa-exclamation-circle f-70-px"></i>
                    </div>
                    <div className="w-100 mt-2 d-flex flex-column align-items-center ">
                        <span>  {statuslb.message}</span>
                    </div>


                    {/* <Placeholder.Paragraph /> */}
                </Modal.Body>
                <Modal.Footer>
                    {
                        statuslb.btnlength == 1 ?
                            <Button onClick={(e) => callmodal({ status: false, delvalue: statuslb.btnconfirmexpire == 1 ?  2 : 0 }, e)} appearance="primary">
                                Ok
                            </Button>
                            : <>
                                <Button onClick={(e) => callmodal({ status: false }, e)} appearance="primary">
                                    Ok
                                </Button>
                                <Button onClick={(e) => callmodal({ status: false }, e)} appearance="subtle">
                                    Cancel
                                </Button>
                            </>


                    }

                </Modal.Footer>
            </Modal>
            {/* </div> */}
        </>
    );
};
