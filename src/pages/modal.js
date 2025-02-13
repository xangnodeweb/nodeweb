import * as React from "react";
import { useState, useEffect } from "react";
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';

const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;

export default function Modelapp({ callmodal, openmodal, statuslb, }) {

    useEffect(() => {


    }, [])

    return (
        <>
            {/* <div className={`w-100 h-100-vh ${title == false ? "display-none" : "display-block"}`} > */}

            <Modal backdrop={true} keyboard={true} open={openmodal} onClose={(e) => callmodal({ status: false }, e)} dialogClassName={` ${statuslb.optionbtn == 1 ? "modal-success" : ""}`} >
                <Modal.Header>
                    <Modal.Title>   <span className="f-20-px f-weight-400">  {statuslb.title} </span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="w-100 mt-2 d-flex flex-column align-items-center ">
                        {
                            statuslb.optionbtn != 1 ?
                                <>
                                    <div className="d-flex flex-column">
                                        {
                                            statuslb.IsSuccess == "true" ? <i className="fa fa-check-circle f-80-px m-auto color-success"></i>
                                                : <i className="fa fa-times-circle f-80-px m-auto"></i>
                                        }
                                    </div>
                                    <div className="min-w-50 max-w-76 d-flex flex-column border-grey border-radius-5-px pl-3  mt-3 pt-3 pb-10 box-shadow pr-4" >
                                        {
                                            statuslb.optionbtn != 1 ?
                                                <>
                                                    <span className="py-1 f-16-px"> IsSuccess : {statuslb.IsSuccess} </span>
                                                    <span className="py-1 f-16-px"> PhoneNumber : {statuslb.phonenumber} </span>
                                                    <span className="py-1 f-16-px"> productnumber : {statuslb.productnumber} </span>
                                                    <span className="py-1 white-space-nowrap f-16-px"> DateExpire : {statuslb.dateexpire} </span>

                                                </>
                                                :
                                                <span className="py-1 white-space-nowrap f-16-px">  {statuslb.Description} </span>

                                        }

                                    </div>
                                </>
                                :
                                <div className="d-flex flex-column">
                                    <i className="fa fa-check-circle-o f-70-px m-auto">  </i>
                                    <span className="f-14-px mt-2">{statuslb.Description} </span>
                                </div>
                        }
                    </div>


                    {/* <Placeholder.Paragraph /> */}
                </Modal.Body>
                <Modal.Footer>
                    {
                        statuslb.optionbtn != 1 ?
                            <>    <Button onClick={(e) => callmodal({ status: false }, e)} appearance="primary">
                                Ok
                            </Button>
                                {/* <Button onClick={(e) => callmodal({ status: false }, e)} appearance="subtle">
                                    Cancel
                                </Button> */}
                            </>
                            :
                            <>
                                <Button onClick={(e) => callmodal({ status: false }, e)} appearance="primary" className={statuslb.optionbtn == 1 ? "w-100" : ""}>
                                    Ok
                                </Button>
                            </>

                    }

                </Modal.Footer>
            </Modal>
            {/* </div> */}
        </>
    );
};
