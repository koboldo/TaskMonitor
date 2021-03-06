/* jshint node: true, esversion: 6 */
'use strict';

const XLSX = require('excel4node');
const moment = require('moment');
const logger = require('./logger').logger; 
const request = require('request');


let local_util = {
    logErrAndCall: function(err,cb) {
        // logger.error(util.inspect(err));
        logger().error(err.name);
        logger().error(err.message);
        // logger.error(err.stack)
        cb(err, null);
    }, 
    
    parseStringToDate(dateTxt) {
        let tokens = dateTxt.split(/[\s:-]+/);
        return new Date(tokens[0],tokens[1]-1,tokens[2],tokens[3],tokens[4]);
    },

    prepareProtocol: function(rows, cb) {
        let allProtocols = {};
        rows.forEach((row) => {
            let protocolKey = row.PROTOCOL_NO + '_' + row.VENTURE_ID;
            if(!allProtocols.hasOwnProperty(protocolKey)) {
                let protocol = {};
                protocol.ORDERS = [];
                protocol.TOTAL_PRICE = 0;
                protocol.OFFICE = "";
                protocol.OFFICE_CODE = "";
                allProtocols[protocolKey] = protocol;
            }

            let p = allProtocols[protocolKey];
            p.TOTAL_PRICE += row.PRICE;
            p.ORDERS.push(row);
            if(p.OFFICE == "") p.OFFICE = row.OFFICE;
            if(p.OFFICE_CODE == "") p.OFFICE_CODE = row.OFFICE_CODE;
        });
        logger().info(JSON.stringify(allProtocols));
        let wb = new XLSX.Workbook({
            defaultFont: {
                size: 12,
                name: 'Calibri',
                color: '000000'
            },
            dateFormat: 'yyyy-mm-dd',
        });

        let styles = prepareStyles(wb);

        for(let protocol in allProtocols) {
            let officeCode = allProtocols[protocol].OFFICE_CODE;
            let tabName = protocol.replace(/[\[\]\*\?\:\/\\]/g,'').toUpperCase();
            let ws = wb.addWorksheet(tabName);
            ws.column(1).setWidth(5);
            ws.column(6).setWidth(15);
            ws.column(7).setWidth(15);
            ws.column(10).setWidth(30);
            ws.row(2).setHeight(80);
            ws.cell(1,1,1,3,true).string('PROTOKÓŁ z dnia').style(styles.headerStyle).style(styles.alignRight);
            ws.cell(1,4,1,5,true).date(new Date()).style(styles.headerStyle).style(styles.alignLeft);
            ws.cell(1,10).string(protocol).style(styles.headerStyle);
           
            ws.cell(1,2).string('').style(styles.borderCell);
            ws.cell(2,2).string('Data wydania').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,3).string('Nr zamówienia').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,4).string('Nr kandytata').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,5).string('Zlecający').style(styles.verticalHeaderStyle).style(styles.borderCell);
            if(officeCode == 'POZ') {
                ws.cell(2,6).string('Opis');
                ws.cell(2,7).string('Komentarz');
            } else {
                ws.cell(2,6).string('');
                ws.cell(2,7).string('');
            }
            ws.cell(2,6).style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,7).style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,8).string('TYP').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,9).string('Kwota [PLN]').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,10).string('Akceptacja').style(styles.verticalHeaderStyle).style(styles.borderCell);
            ws.cell(2,1,2,10).style(styles.borderHeaderTop);

            let cnt = 0;
            for(let orderIdx in allProtocols[protocol].ORDERS) {
                let order = allProtocols[protocol].ORDERS[orderIdx];
                cnt++;
                ws.cell(2+cnt,1).string(cnt.toString()).style(styles.borderCell);
                // ws.cell(2+cnt,2).string(order.LAST_MOD.toString()).style(styles.borderCell);
                ws.cell(2+cnt,2).date(moment.utc(order.LAST_MOD.toString(),'X').local().toDate()).style(styles.borderCell);
                ws.cell(2+cnt,3).string(order.WORK_ID).style(styles.borderCell);
                ws.cell(2+cnt,4).string(order.ITEM_NO).style(styles.borderCell);
                ws.cell(2+cnt,5).string(order.VENTURE).style(styles.borderCell);
                if(officeCode == 'POZ') {
                    ws.cell(2+cnt,6).string(order.DESCRIPTION);
                    if(order.COMMENT != null) {
                        let commentDecoded = Buffer.from(order.COMMENT.substring(2), 'base64');
                        let commentArray = JSON.parse(decodeURIComponent(commentDecoded.toString()));
                        ws.cell(2+cnt,7).string(commentArray.length ? commentArray[0].text : "");
                    }
                    // ws.cell(2+cnt,7).string(order.COMMENT);
                } else {
                    ws.cell(2+cnt,6).string('');
                    ws.cell(2+cnt,7).string('');
                }
                ws.cell(2+cnt,6).style(styles.borderCell);
                ws.cell(2+cnt,7).style(styles.borderCell);                
                ws.cell(2+cnt,8).string(order.TYPE).style(styles.borderCell);
                ws.cell(2+cnt,9).number(order.PRICE).style(styles.alignRight).style(styles.borderCell);
                ws.cell(2+cnt,10).string('').style(styles.borderCell);
            }
            cnt++;
            cnt++;
            ws.row(1+cnt).setHeight(5);
            ws.cell(2+cnt,1).string('FV').style(styles.headerStyle);
            ws.cell(2+cnt,9).formula('SUM(I3:' + XLSX.getExcelCellRef((cnt+1), 9) +')').style(styles.headerStyle).style(styles.alignRight);
            ws.cell(2+cnt,10).string('biuro ' + allProtocols[protocol].OFFICE).style(styles.alignRight);
            ws.cell(2+cnt,1,2+cnt,10).style(styles.borderHeaderTop);
            cnt++;
            ws.cell(2+cnt,1).string('PO').style(styles.headerStyle);
            ws.cell(2+cnt,1,2+cnt,10).style(styles.borderHeaderBotton);
            ws.cell(2,8,2+cnt,8).style(styles.borderHeaderRight);
            ws.cell(2,9,2+cnt,9).style(styles.borderHeaderRight);
            ws.cell(2,10,2+cnt,10).style(styles.borderHeaderRight);
        }
        
        // wb.write('out.xlsx',cb);
        wb.writeToBuffer().then((buffer)=>{ 
            cb(buffer.toString('base64'));
        });
    },
    
    httpGet: function(url, timeout) {
    	
    	// wrap a request in an promise and use async await
    	return new Promise((resolve, reject) => {
        	
        	let options = {
        		    url: url,
        		    timeout: timeout
    		};
        	
            request(options, (error, response, body) => {
                if (error) {
                	logger().warn('error http get '+url);
                	reject(error);
                } else if (response.statusCode != 200) {
                	logger().warn('wrong status '+response.statusCode+' on get for '+url);
                    reject('Invalid status code <' + response.statusCode + '> for '+url);
                }
                resolve(body);
            });
        });
    }
};

function prepareStyles(wb) {
    let styles = {
        headerStyle: wb.createStyle({
            font: {
                bold: true
            }
        }),

        verticalHeaderStyle: wb.createStyle({
            alignment: {
                wrapText: true,
                textRotation: 90,
                horizontal: 'right',
                vertical: 'center'
            },
            font: {
                bold: true
            }
        }),

        alignLeft: wb.createStyle({
            alignment: {
                horizontal: 'left'
            }
        }), 

        alignRight: wb.createStyle({
            alignment: {
                horizontal: 'right'
            }
        }),

        borderCell: wb.createStyle({
            border: { 
                left: {
                    style: 'thin',
                    color: '000000'
                },
                right: {
                    style: 'thin',
                    color: '000000'
                },
                top: {
                    style: 'thin',
                    color: '000000'
                },
                bottom: {
                    style: 'thin',
                    color: '000000'
                },
            }
        }),

        borderHeaderTop: wb.createStyle({
            border: { 
                top: {
                    style: 'thick',
                    color: '000000'
                }
            }
        }),

        borderHeaderBotton: wb.createStyle({
            border: { 
                bottom: {
                    style: 'thick',
                    color: '000000'
                }
            }
        }),

        borderHeaderLeft: wb.createStyle({
            border: { 
                left: {
                    style: 'thick',
                    color: '000000'
                }
            }
        }),

        borderHeaderRight: wb.createStyle({
            border: { 
                right: {
                    style: 'thick',
                    color: '000000'
                }
            }
        })
    };
    return styles;
}        
module.exports = local_util;