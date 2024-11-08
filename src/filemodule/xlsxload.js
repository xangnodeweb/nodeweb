import * as React from "react"

import * as XLSX from "xlsx";
import * as XLSXpopulate from "xlsx-populate/browser/xlsx-populate";
const exceljs = require("exceljs");
import { dateformat, dateexport } from "../filemodule/dataformat"

export const Excelexport = ({ data, date }) => {

    if (data.length == 0) {
        return;
    }
    const createdownload = () => {
        handleexport().then((url) => {
            const downloadAncharnode = document.createElement("a");
            downloadAncharnode.setAttribute("href", url);
            downloadAncharnode.setAttribute("download", "file_modified.xlsx");
            downloadAncharnode.click();
            downloadAncharnode.remove();
        });
    };
    const workBook2blob = (workbook) => {
        const wopts = {
            bookType: "xlsx",
            type: "binary",
            bookSST: false

        };

        const wbout = XLSX.write(workbook, wopts);
        const blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        });
        return blob;
    };
    const s2ab = (s) => {

        const buf = new ArrayBuffer(s.length);
        console.log(buf);
        const view = new Uint8Array(buf);
        console.log(view);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i);
        }
        console.log(data);
        return buf;
    }

    const handleexport = () => {

        const title = [{ A: "report data modify" }];
        const title1 = [{ B: "", C: "", D: "", E: "", F: "" }]; // merge column sheet A1 - G1

        let table = [
            {
                A: "No",
                B: "Phone",
                C: "ProductNumber",
                D: "ExpireTime",
                E: "TransactionID",
                F: "Status"
            }
        ];

        data.forEach((element, index) => {
            table.push({
                A: index + 1,
                B: element.Msisdn.toString(),
                C: element.ProductNumber == null ? "none" : element.ProductNumber,
                D: element.ExpiryTime,
                E: element.TransactionID,
                F: element.status.toString() == "true" ? "true" : "Error",
            });
        });

        table = [{ A: `date : ${date}`, B: "", C: "", D: "", E: "", F: `phone count : ` + data.length }].concat(title1).concat(table)

        const finalData = [...title, ...title1, ...table];
        console.log(finalData);
        const wb = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(finalData, {
            skipHeader: true
        });
        XLSX.utils.book_append_sheet(wb, sheet, "file_modifieds");
        const workbookBlob = workBook2blob(wb)

        const headerIndexs = [];
        finalData.forEach((data, index) =>
            data["A"] !== "ProductNumber" ? headerIndexs.push(index) : null);

        console.log(headerIndexs);
        const totalrecord = data.length;

        const dataInfo = {
            titleCell: "A1",
            titleRange: "A1:F2",
            titleRange1: "A5:F5",
            titleRange2: "A3:E3",
            titleRange3: "F3:F3",
            tbodyRange: `A4:F${finalData.length}`,
            theadRange: headerIndexs?.length >= 1 ? `A${headerIndexs[0] + 1}:F${headerIndexs[0] + 1}` : null,
            theadRange1: headerIndexs?.length >= 1 ? `A${headerIndexs[1] + 1}:F${headerIndexs[1] + 1}` : null,

            tFirstColumnReage: headerIndexs?.length >= 1 ? `A${headerIndexs[0] + 1}:F${headerIndexs[0] + 1}` : null,
            tLastColumnRange: headerIndexs?.length >= 1 ? `A${headerIndexs[0] + 1}:F${headerIndexs[0] + 1}` : null,
            tFirstColumnReage1: headerIndexs?.length >= 1 ? `A${headerIndexs[1] + 1}:A${totalrecord + headerIndexs[1] + 1}` : null,
            tLastColumnRange1: headerIndexs?.length >= 1 ? `F${headerIndexs[1] + 1}:F${totalrecord + headerIndexs[1] + 1}` : null,

        }
        return addStyle(workbookBlob, dataInfo);

    };

    const addStyle = (workbookBlob, dataInfo) => {
        return XLSXpopulate.fromDataAsync(workbookBlob).then((workbook) => {
            console.log(workbook)
            workbook.sheets().forEach((sheet) => {
                sheet.usedRange().style({
                    fontFamily: "Time New Roman",
                    verticalAlignment: "center"
                });

                sheet.column("A").width(10);
                sheet.column("B").width(25);
                sheet.column("C").width(15);
                sheet.column("D").width(15);
                sheet.column("E").width(40);
                sheet.column("F").width(40);

                sheet.column("B").style({
                    numberFormat: 0
                });

                sheet.range(dataInfo.titleRange).merged(true).style({
                    bold: true,
                    horizontalAlignment: "center",
                    verticalAlignment: "center"
                });

                if (dataInfo.tbodyRange) {
                    sheet.range(dataInfo.tbodyRange).style({
                        horizontalAlignment: "center",
                        fontSize: "10",
                        fontColor: "000000",
                        fontFamily: "Ebrima"
                    });
                }
                if (dataInfo.titleRange1) {

                    sheet.range(dataInfo.titleRange1).style({
                        horizontalAlignment: "center",
                        fontSize: "10",
                        fontColor: "000000",
                        fontFamily: "Ebrima",
                        fill: "F8F8F8",
                        bold: true,

                    });
                }

                if (dataInfo.titleRange2) {
                    sheet.range(dataInfo.titleRange2).merged(true).style({
                        horizontalAlignment: "right",
                        fontSize: "10",
                        fontColor: "000000",
                        fontFamily: "Ebrima",
                    });
                }
                if (dataInfo.titleRange3) {
                    sheet.range(dataInfo.titleRange3).merged(true).style({
                        horizontalAlignment: "center",
                        fontSize: "10",
                        fontColor: "000000",
                        fontFamily: "Ebrima",
                    });
                }
                sheet.range(dataInfo.theadRange).style({
                    fill: "F1F1F1",
                    bold: true,
                    horizontalAlignment: "center"
                });

                if (dataInfo.theadRange1) {

                    sheet.range(dataInfo.theadRange1).style({
                        fill: "808080",
                        bold: true,
                        horizontalAlignment: "center",
                        fontColor: "ffffff"
                    });
                }



            })
            return workbook.outputAsync().then((workbookBlob) => URL.createObjectURL(workbookBlob))
        })
    }
    return (
        <button className="min-w-115-px h-35-px color-white" onClick={createdownload}> download </button>
    )
}

//  export default excelexport; 

export const Exportexcels = async ({ data }) => { // modifield

    try {

        if (data.length == 0) {
            return;
        }
        const datenows = dateexport();

        const worksheet = new exceljs.Workbook();
        const sheet = worksheet.addWorksheet("My Sheet");

        const worksheetrow = worksheet.getWorksheet(1);
        worksheetrow.mergeCells('A1', 'F1');
        worksheetrow.getRow(1).height = 20;
        worksheetrow.getCell('A1', 'F1').fill = {
            bgColor: "BDC0BE"
        };

        worksheetrow.getCell('A1', 'F1').font = {
            name: 'Cambria',
            size: 12,
            bold: true

        }

        worksheetrow.mergeCells('D2', 'F2');
        worksheetrow.getRow(2).font = {
            name: 'Cambria',
            size: 11
        }
        sheet.getCell('D2').alignment = {
            horizontal: "right",
            vertical: "middle"
        }


        sheet.getCell('D2').value = `date export : ${datenows}`;

        // sheet.getCell(1).value = "report modifield data";
        sheet.getCell("A1").value = "report modify data";
        sheet.getCell("A3").value = "id"; // no 
        sheet.getCell("B3").value = "Msisdn"; // no 
        sheet.getCell("C3").value = "ProductNumber"; // no 
        sheet.getCell("D3").value = "ExpiryTime"; // no 
        sheet.getCell("E3").value = "TransactionID"; // no 
        sheet.getCell("F3").value = "status"; // no 


        sheet.columns = [
            {
                key: "id",
                width: 20
            },
            {
                key: "Msisdn",
                width: 20
            },
            {
                key: "ProductNumber",
                width: 20
            },
            {
                key: "ExpiryTime",
                width: 20
            },
            {
                key: "TransactionID",
                width: 20
            },
            {
                key: "status",
                width: 20
            },
        ]

        data.map((product, index) => {
            sheet.addRow({
                id: index + 1,
                Msisdn: product.Msisdn,
                ProductNumber: product.ProductNumber == null ? 'false' : product.ProductNumber,
                ExpiryTime: product.ExpiryTime,
                TransactionID: product.TransactionID == null ? 'false' : product.TransactionID,
                status: product.status.toString()
            });
        });
        console.log(sheet);

        const statusCol = sheet.getColumn(6);
        statusCol.eachCell(cell => {
            const cellValue = sheet.getCell(cell?.address).value;

            if (cellValue != 'true') {
                sheet.getCell(cell?.address).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "C5D9F1" }
                }
            }
        })

        sheet.eachRow(function (row, rowNumber) {
            row.alignment = {
                horizontal: "center",
                vertical: "middle"
            }
            if (rowNumber == 3) {
                row.font = {
                    name: 'Cambria',
                    size: 12,
                    bold: true
                }
                row.height = 20;
            }
            if (rowNumber >= 4) {
                row.font = {
                    size: 12
                }
                row.height = 20;
                row.font = {
                    name: "Cambria",
                    size: 10,

                }
            }
            row.eachCell((cell, colNumber) => {

                if (rowNumber == 3) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: "solid",
                        fgColor: { argb: 'BDC0BE' }
                    }
                    cell.font = {
                        name: 'Cambria',
                        size: 10,
                        bold: true
                    }
                }
            })
        })


        worksheet.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreasheet.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "download.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

    } catch (error) {
        console.log(error)
    }
}

export const addpackageExportexcel = async ({ data }) => {

    try {
        // data = [{
        //     Code: "VSMP-00000000",
        //     CounterName: "Prepaid_Staff_3GB",
        //     ExpiryTime: "2024-10-31T23:59:59.0700000+07:00",
        //     Msisdn: "8562058177781",
        //     ProductNumber: "1141",
        //     StartTime: "2024-10-01T00:00:00.0700000+07:00",
        //     message: "success",
        //     status: "true"
        // }]
        if (data.length == 0) {
            return;
        }

        const worksheet = new exceljs.Workbook();
        const sheet = worksheet.addWorksheet("My Sheet");

        const worksheetrow = worksheet.getWorksheet(1);
        worksheetrow.mergeCells('A1', 'G2');
        // worksheetrow.getRow(1).height = 20;
        worksheetrow.getCell('A1', 'G2').fill = {
            bgColor: "BDC0BE"
        };
        // sheet.getCell(1).value = "report modifield data";
        sheet.getCell("A1").value = "report modify data";
        sheet.getCell("A3").value = "id"; // no 
        sheet.getCell("B3").value = "Msisdn"; // no 
        sheet.getCell("C3").value = "ProductNumber"; // no 
        sheet.getCell("D3").value = "CounterName"; // no 
        sheet.getCell("E3").value = "StartTime"; // no 
        sheet.getCell("F3").value = "ExpiryTime"; // no 
        sheet.getCell("G3").value = "status" // status phone data

        worksheetrow.getCell('A1', 'G2').font = {
            name: "Cambria"
        };

        sheet.columns = [
            {
                key: "id",
                width: 10
            },
            {
                key: "Msisdn",
                width: 20
            },
            {
                key: "ProductNumber",
                width: 15
            },
            {
                key: "CounterName",
                width: 20
            },
            {
                key: "StartTime",
                width: 35
            },
            {
                key: "ExpiryTime",
                width: 35
            },
            {
                key: "status",
                width: 20
            },
        ]
        data.map((product, index) => {
            sheet.addRow({
                id: index + 1,
                Msisdn: product.Msisdn,
                ProductNumber: product.ProductNumber,

                StartTime: product.StartTime,
                ExpiryTime: product.ExpiryTime,

                CounterName: product.CounterName,
                status: product.status.toString()
            });
        });
        console.log(sheet);

        const statusCol = sheet.getColumn(7);
        statusCol.eachCell(cell => {
            const cellValue = sheet.getCell(cell?.address).value;

            if (cellValue != 'true') {
                sheet.getCell(cell?.address).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "C5D9F1" }
                }
            }
        })

        sheet.eachRow(function (row, rowNumber) {
            row.alignment = {
                horizontal: "center",
                vertical: "middle"
            }
            if (rowNumber == 3) {
                row.font = {
                    name: 'Cambria',
                    size: 10,
                    bold: true
                }
                row.height = 20;
            }
            if (rowNumber >= 4) {
                row.font = {
                    size: 10
                }
                // row.height = 20
            }
            row.eachCell((cell, colNumber) => {

                if (rowNumber == 3) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: "solid",
                        fgColor: { argb: 'BDC0BE' }
                    }
                }
            })
        })


        worksheet.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreasheet.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "download.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });

    } catch (error) {
        console.log(error)
    }
}




export const changeexporttoset = ({ modeloffer, modelchangemax, modelsetvalidity }) => {
    try {

        // console.log(modeloffer);
        // console.log(modelchangemax);
        // console.log(modelsetvalidity);


        const worksheet = new exceljs.Workbook();
        const sheet = worksheet.addWorksheet("My Sheet");

        const worksheetrow = worksheet.getWorksheet(1);
        worksheetrow.mergeCells("A1", "E2");
        sheet.getCell("A1").value = "report changemainoferring"

        sheet.getCell("A3").value = "phone"; // no 
        sheet.getCell("B3").value = "oldoffering"; // 
        sheet.getCell("C3").value = "newoffering"; //  
        sheet.getCell("D3").value = "status"; // 
        sheet.getCell("E3").value = "resultdesc"; // 

        worksheetrow.getCell('A3', 'E3').fill = {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: 'D9D9D9' },
            fgColor: { argb: 'D9D9D9' }
        }
        // worksheetrow.getCell('B3', 'E3').fill = {
        //     type: "pattern",
        //     pattern: "solid",
        //     bgColor: { argb: 'D9D9D9' },
        //     fgColor: { argb: 'D9D9D9' }
        // }
        const totalrecord = modeloffer.length + modelchangemax.length + modelsetvalidity.length + 15;
        worksheetrow.getCell('A1', `E${totalrecord}`).font = {
            name: "Cambria"
        };

        sheet.columns = [
            {
                key: "phone",
                width: 20
            },
            {
                key: "oldoffering",
                width: 20
            },
            {
                key: "newoffering",
                width: 20
            },
            {
                key: "status",
                width: 20
            },
            {
                key: "resultdesc",
                width: 40
            }
        ]

        modeloffer.map(products => {
            sheet.addRow({
                phone: products.phone,
                oldoffering: products.oldoffering,
                newoffering: products.newoffering,
                status: products.status,
                resultdesc: products.resultDesc

            });
        });

        const statuscol = sheet.getColumn(4);
        statuscol.eachCell(cell => {
            const cellValue = sheet.getCell(cell?.address).value;

            if (cellValue == false) {

                sheet.getCell(cell?.address).fill = {
                    type: "pattern",
                    pattern: "lightDown",
                    fgColor: { argb: "60878C" }
                }
            }
        });




        // console.log(modelchangemax);

        const colone = modeloffer.length + 6;
        worksheetrow.mergeCells(`A${colone}`, `E${colone + 1}`);
        sheet.getCell(`A${colone}`).value = "report changemaxday"

        sheet.getCell(`A${colone + 2}`).value = "phone"; // no 
        sheet.getCell(`B${colone + 2}`).value = "maxdayvalidity"; // 
        sheet.getCell(`C${colone + 2}`).value = "code"; //  
        sheet.getCell(`D${colone + 2}`).value = "status"; //  
        sheet.getCell(`E${colone + 2}`).value = "resultdesc"; // 


        worksheetrow.getCell(`A${colone + 2}`, `F${colone + 2}`).font = {
            name: "Cambria"
        };


        sheet.columns = [
            {
                key: "phone",
                width: 20
            },
            {
                key: "maxdayvalidity",
                width: 20
            },
            {
                key: "code",
                width: 20
            },
            {
                key: "status",
                width: 20
            },
            {
                key: "message",
                width: 20
            }
        ];

        modelchangemax.map(products => {
            sheet.addRow({
                phone: products.phone,
                maxdayvalidity: products.datevalue,
                code: products.code,
                status: products.status,
                message: products.message
            });
        });

        const statusone = sheet.getColumn(4);
        statusone.eachCell(cell => {
            const cellValue = sheet.getCell(cell?.address).value;

            if (cellValue == false) {

                sheet.getCell(cell?.address).fill = {
                    type: "pattern",
                    pattern: "lightDown",
                    fgColor: { argb: "60878C" }
                }
            }
        });



        // console.log(modelsetvalidity)

        const coltwo = modeloffer.length + modelchangemax.length + 12;
        worksheetrow.mergeCells(`A${coltwo}`, `E${coltwo + 1}`);
        sheet.getCell(`A${coltwo}`).value = "report setvalidity"

        sheet.getCell(`A${coltwo + 2}`).value = "phone"; // no 
        sheet.getCell(`B${coltwo + 2}`).value = "validityincrement"; // 
        sheet.getCell(`C${coltwo + 2}`).value = "code"; //  
        sheet.getCell(`D${coltwo + 2}`).value = "status"; // 
        sheet.getCell(`E${coltwo + 2}`).value = "resultdesc"; // 


        worksheetrow.getCell(`A${coltwo + 2}`, `E${coltwo + 2}`).font = {
            name: "Cambria"
        };


        sheet.columns = [
            {
                key: "phone",
                width: 20
            },
            {
                key: "validityincrement",
                width: 20
            },
            {
                key: "code",
                width: 20
            },
            {
                key: "status",
                width: 20
            },
            {
                key: "resultdesc",
                width: 20
            }
        ];

        modelsetvalidity.map(products => {
            sheet.addRow({
                phone: products.phone,
                validityincrement: products.validityincrement,
                code: products.resultcode,
                status: products.status,
                resultdesc: products.resultdesc != null ?  products.resultdesc : products.message
            });
        });

        const statustwo = sheet.getColumn(4);
        statustwo.eachCell(cell => {
            const cellValue = sheet.getCell(cell?.address).value;

            if (cellValue == false) {

                sheet.getCell(cell?.address).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "60878C" }
                }
            }
        });

        const colonecolor = modeloffer.length + 8;
        const colcolortwo = modeloffer.length + modelchangemax.length + 14;

        sheet.eachRow(function (row, rowNumber) {

            row.font = {
                name: "Cambria",
                size: 10
            }

            row.alignment = {
                horizontal: "center",
                vertical: "middle"
            }

            row.eachCell((cell, colNumber) => {

                if (rowNumber == 3) {
                    // console.log(cell)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: "BDC0BE" }
                    }

                }

                if (rowNumber == colonecolor) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: "BDC0BE" }
                    }
                }

                if (rowNumber == colcolortwo) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: "BDC0BE" }
                    }
                }
                cell.height = 20;

            });



        })

        worksheet.xlsx.writeBuffer().then(data => {

            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreasheet.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "download.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });



    } catch (error) {
        console.log(error)
    }



}