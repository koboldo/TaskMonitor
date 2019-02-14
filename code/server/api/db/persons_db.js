/* jshint node: true, esversion: 6 */
'use strict';

const async = require('async');
const util = require('util');
const dbUtil = require('./db_util');
// const logger = require('../logger').getLogger('monitor');
const logger = require('../logger').logger; 
const logErrAndCall = require('../local_util').logErrAndCall;
const addCtx = require('../logger').addCtx;

const queries = {
	getPersons: 'SELECT ID, EXCEL_ID, EMAIL, LAST_NAME, FIRST_NAME, OFFICE_CODE, ROLE_CODE, RANK_CODE, IS_ACTIVE, IS_EMPLOYED, PROJECT_FACTOR, IS_FROM_POOL, COMPANY, AGREEMENT_CODE, ACCOUNT, PHONE, POSITION, ADDRESS_STREET, ADDRESS_POST, SALARY, SALARY_RATE, LEAVE_RATE, MODIFIED_BY, DATETIME(CREATED ,"unixepoch", "localtime") AS CREATED, DATETIME(LAST_MOD ,"unixepoch", "localtime") AS LAST_MOD FROM PERSON ORDER BY LAST_NAME, FIRST_NAME, MODIFIED_BY ASC',
	getPerson: 'SELECT ID, EXCEL_ID, EMAIL, LAST_NAME, FIRST_NAME, OFFICE_CODE, ROLE_CODE, RANK_CODE, IS_ACTIVE, IS_EMPLOYED, PROJECT_FACTOR, IS_FROM_POOL, COMPANY, AGREEMENT_CODE, ACCOUNT, PHONE, POSITION, ADDRESS_STREET, ADDRESS_POST, SALARY, SALARY_RATE, LEAVE_RATE, MODIFIED_BY, DATETIME(CREATED ,"unixepoch", "localtime") AS CREATED, DATETIME(LAST_MOD ,"unixepoch", "localtime") AS LAST_MOD FROM PERSON WHERE ID = ?',
	getPersonHistory: 'SELECT ID, EXCEL_ID, EMAIL, LAST_NAME, FIRST_NAME, OFFICE_CODE, ROLE_CODE, RANK_CODE, IS_ACTIVE, IS_EMPLOYED, PROJECT_FACTOR, IS_FROM_POOL, COMPANY, AGREEMENT_CODE, ACCOUNT, PHONE, POSITION, ADDRESS_STREET, ADDRESS_POST, SALARY, SALARY_RATE, LEAVE_RATE, DATETIME(HIST_CREATED ,"unixepoch", "localtime") AS HIST_CREATED, DATETIME(CREATED ,"unixepoch", "localtime") AS CREATED, DATETIME(LAST_MOD ,"unixepoch", "localtime") AS LAST_MOD, MODIFIED_BY FROM PERSON_HIST WHERE ID = ?',
	getMaxPersonId: 'SELECT MAX(ID) AS MAX_ID FROM PERSON',
	getPersonOrderIds: 'SELECT WO.ID FROM WORK_ORDER WO, PERSON_WO PW WHERE PW.PERSON_ID = ? AND PW.WO_ID = WO.ID AND WO.STATUS_CODE = "AS"',
	getPersonOrderStats:
	`WITH PARAMS AS ( SELECT CAST (STRFTIME('%%s', '%(dateAfter)s', 'start of day') AS INTEGER) AS AFTER_DATE, CAST (STRFTIME('%%s', '%(dateBefore)s', 'start of day', '+1 day', '-1 second') AS INTEGER) AS BEFORE_DATE )
	, SELECTED_WO AS ( SELECT ID, CASE STATUS_CODE WHEN 'CO' THEN DATETIME ( WO.LAST_MOD ,"unixepoch" ,"localtime" ) ELSE NULL END AS DONE_DATE FROM WORK_ORDER AS WO JOIN PERSON_WO AS PWO ON WO.ID = PWO.WO_ID JOIN PARAMS PA WHERE (STATUS_CODE = 'CO' AND LAST_MOD BETWEEN PA.AFTER_DATE AND PA.BEFORE_DATE) OR (WO.STATUS_CODE IN ('AS') AND PWO.CREATED BETWEEN PA.AFTER_DATE AND PA.BEFORE_DATE) UNION SELECT ID, CASE STATUS_CODE WHEN 'CO' THEN DATETIME ( WO.LAST_MOD ,"unixepoch" ,"localtime" ) ELSE NULL END AS DONE_DATE FROM WORK_ORDER_HIST AS WO JOIN PARAMS PA WHERE (STATUS_CODE = 'CO' AND LAST_MOD BETWEEN PA.AFTER_DATE AND PA.BEFORE_DATE) ) 
	SELECT WO.ID WO_ID, WO.WORK_NO WO_WORK_NO, SW.DONE_DATE WO_DONE_DATE, DATETIME(PWO.CREATED, "unixepoch", "localtime") AS WO_ASSIGNED_DATE, WO.STATUS_CODE WO_STATUS_CODE, WO.TYPE_CODE WO_TYPE_CODE, WO.COMPLEXITY WO_COMPLEXITY, WO.COMPLEXITY_CODE WO_COMPLEXITY_CODE, WO.PRICE WO_PRICE, PWO.PERSON_ID, P.EMAIL AS PERSON_EMAIL, P.FIRST_NAME AS PERSON_FIRST_NAME, P.LAST_NAME AS PERSON_LAST_NAME, P.OFFICE_CODE AS PERSON_OFFICE_CODE, P.ROLE_CODE AS PERSON_ROLE_CODE, P.IS_FROM_POOL AS PERSON_IS_FROM_POOL FROM WORK_ORDER AS WO JOIN PERSON_WO AS PWO ON WO.ID = PWO.WO_ID JOIN PARAMS PA JOIN PERSON AS P ON PWO.PERSON_ID = P.ID JOIN SELECTED_WO SW ON SW.ID = PWO.WO_ID`,
	getIsFromPool: 'SELECT CASE WHEN ( P.IS_FROM_POOL == "Y" OR ( "DETACHED" <> ? AND ( SELECT CASE WHEN COUNT(1) > 0 THEN "Y" ELSE "N" END IS_FROM_POOL FROM PERSON P1 ,PERSON_WO PW1 WHERE P1.ID = PW1.PERSON_ID AND PW1.WO_ID = WO.ID AND P1.IS_FROM_POOL = "Y" ) == "Y" ) ) AND WT.IS_FROM_POOL == "Y" THEN "Y" ELSE "N" END IS_FROM_POOL FROM PERSON P ,WORK_TYPE WT ,WORK_ORDER WO WHERE WO.ID = ? AND P.ID = ? AND WT.OFFICE_CODE = WO.OFFICE_CODE AND WT.TYPE_CODE = WO.TYPE_CODE AND WT.COMPLEXITY_CODE = WO.COMPLEXITY_CODE'
};

// ??
const filters = {
    getPersonOrdersReport: {
        dateAfter: '%(dateAfter)s',
        dateBefore: '%(dateBefore)s'
    }
};

const persons_db = {
	
	readOrders: function(params,cb){
		const db = dbUtil.getDatabase();
		const query = dbUtil.prepareFiltersByInsertion(queries.getPersonOrderStats,params,filters.getPersonOrdersReport);
		const getPersonOrdersReportStat = db.prepare(query);
		getPersonOrdersReportStat.all(addCtx(function(err, rows) {
			
			if(err) return logErrAndCall(err,cb);
			let persons = transformReportRows(rows);
			cb(null,persons);
		}));
	},

	readAll: function(cb) {
		const db = dbUtil.getDatabase();
		const getPersonsStat = db.prepare(queries.getPersons);
		getPersonsStat.all(addCtx(function(err, rows) {
			
			if(err) return logErrAndCall(err,cb);
			
			// we need to group async funcs in order to deal in the same thread
			const calls = [];
			
			rows.forEach(function(row){

				if(row.ROLE_CODE) row.ROLE_CODE = row.ROLE_CODE.split(',');

				calls.push(addCtx(function(async_cb) {

					const getPersonOrderIdsStat = db.prepare(queries.getPersonOrderIds);
					getPersonOrderIdsStat.bind(row.ID).all(addCtx(function(err,idRows){
						getPersonOrderIdsStat.finalize();

						const ids = [];
						idRows.forEach((idRow) => { ids.push(idRow.ID); });
						row.WORK_ORDERS = ids;
						async_cb();
					}));
				}));
			});
			
			async.parallelLimit(calls, 5, addCtx(function(err, result) {
                    getPersonsStat.finalize();
                    db.close();
					if (err) {
                        logErrAndCall(err,cb);
					} else {
						cb(null,rows);
					}
				}));
		}));
	},

	read: function(personId, cb) {
		const db = dbUtil.getDatabase();
				
		// TODO: validation in middleware
        const getPersonStat = db.prepare(queries.getPerson);
		getPersonStat.bind(personId).get(addCtx(function(err, row) {
			getPersonStat.finalize();
			if(err) return logErrAndCall(err,cb);
			
			if(row == null) {
				cb(null,null);
				return;
			}

			if(row.ROLE_CODE) row.ROLE_CODE = row.ROLE_CODE.split(',');

			const getPersonOrderIdsStat = db.prepare(queries.getPersonOrderIds);
			getPersonOrderIdsStat.bind(row.ID).all(addCtx(function(err,idRows){
				getPersonOrderIdsStat.finalize();
				
				const ids = [];
				idRows.forEach((idRow) => { ids.push(idRow.ID); });
				row.WORK_ORDERS = ids;
				cb(null,row);
			}));
			// dbUtil.getRowsIds(getPersonOrderIdsStat, row.ID, function(ids){
			// 	row.WORK_ORDERS = ids;
            //     getPersonOrderIdsStat.finalize();
            //     getPersonStat.finalize();
            //     db.close();
			// 	cb(null,row);
			// });
		}));
	},
	
	update: function(personId, person, cb) {
        const idObj = {};
        // idObj.name = 'ID';
		// idObj.value = personId;
		idObj.ID = personId;
		
		if(person.ROLE_CODE) person.ROLE_CODE = [].concat(person.ROLE_CODE).join(',');
        
        if(logger().isDebugEnabled()) logger().debug('update person of id ' + personId + ' with object: ' + util.inspect(person));
        
        dbUtil.performUpdate(idObj, person, 'PERSON', addCtx(function(err,result) {
            if(err) return logErrAndCall(err,cb);
            cb(null,result);
        }));
	},
	
	create: function(person, cb) {
        
		if(person.ROLE_CODE) person.ROLE_CODE = [].concat(person.ROLE_CODE).join(',');
		
		if(logger().isDebugEnabled()) logger().debug('insert person with object: ' + util.inspect(person));
        
        dbUtil.performInsert(person, 'PERSON', null, addCtx(function(err, newId){
            if(err) return logErrAndCall(err,cb);
            cb(null,newId);
        }));
	},

	addOrder: function(orderRelation, detachExistingRelation, cb) {
		if(logger().isDebugEnabled()) logger().debug('insert relation : ' +  util.inspect(orderRelation));
		
		const mydb = dbUtil.getDatabase();

		let newRelationId;
		let isFromPool;

		async.series([
			addCtx(function(_cb){
				const getIsFromPoolStat = mydb.prepare(queries.getIsFromPool);
				const bindings = [(detachExistingRelation) ? "DETACHED": "NOT_DETACHED" ,orderRelation.WO_ID, orderRelation.PERSON_ID];
				console.log('bindings ' + JSON.stringify(bindings));
				getIsFromPoolStat.bind(bindings);
				getIsFromPoolStat.get(addCtx(function(err,result){
					getIsFromPoolStat.finalize();
	
					if(err) _cb(err);
					else {
						isFromPool = result.IS_FROM_POOL;
						_cb(null);
					}
				}));
			}),

			addCtx(function(_cb) {
				dbUtil.startTx(mydb,addCtx(function(err, result){
					if(err) _cb(err);
					else _cb(null,result);
				}));
			}),

			addCtx(function(_cb) {
				if(detachExistingRelation == true) {
					const obj = {};
					obj.WO_ID = orderRelation.WO_ID;
					dbUtil.performDelete(obj,'PERSON_WO',addCtx(function(err,result){
						if(err) _cb(err);
						_cb(null,result);						
					}), mydb);
				} else {
					_cb(null,true);
				}
			}),

			addCtx(function(_cb) {
				dbUtil.performInsert(orderRelation,'PERSON_WO',null,addCtx(function(err,newId){
					if(err) _cb(err);
					else {
						newRelationId = newId;
						_cb(null,newId);
					}
				}), mydb);				
			}),
		
			addCtx(function(_cb){
				const idObj = {};
				idObj.ID = orderRelation.WO_ID;

				const wo = {};
				wo.IS_FROM_POOL = isFromPool;

				if(logger().isDebugEnabled()) logger().debug('update workOrder of id ' + idObj.ID  + ' with object: ' + util.inspect(wo));
        
				dbUtil.performUpdate(idObj, wo, 'WORK_ORDER', addCtx(function(err,result) {
					if(err) _cb(err);
					else _cb(null,result);
				}), mydb);
			})],

			function(err, results) {
				if(err) {
					dbUtil.rollbackTx(mydb);
					logErrAndCall(err,cb);
				} else {
					dbUtil.commitTx(mydb);
					cb(null,newRelationId);
				}
				mydb.close();
		});
	},
	
	deleteOrder: function(orderRelation, cb) {
		if(logger().isDebugEnabled()) logger().debug('delete relation : ' +  util.inspect(orderRelation));

		dbUtil.performDelete(orderRelation,'PERSON_WO',addCtx(function(err,newId){
			if(err) return logErrAndCall(err,cb);
            cb(null,newId);
		}));
	},
	
	readHistory: function(personId, cb) {
		const db = dbUtil.getDatabase();
		const getPersonStat = db.prepare(queries.getPersonHistory);
		getPersonStat.bind(personId).all(addCtx(function(err, rows) {
			
			if(err) return logErrAndCall(err,cb);
			
			// we need to group async funcs in order to deal in the same thread
			const calls = [];
			
			rows.forEach(function(row){

				if(row.ROLE_CODE) row.ROLE_CODE = row.ROLE_CODE.split(',');

				calls.push(function(async_cb) {

					const getPersonOrderIdsStat = db.prepare(queries.getPersonOrderIds);
					getPersonOrderIdsStat.bind(row.ID).all(addCtx(function(err,idRows){
						getPersonOrderIdsStat.finalize();

						const ids = [];
						idRows.forEach((idRow) => { ids.push(idRow.ID); });
						row.WORK_ORDERS = ids;
						async_cb();
					}));
				});
			});
			
			async.parallelLimit(calls, 5, addCtx(function(err, result) {
                    getPersonStat.finalize();
                    db.close();
					if (err) {
                        logErrAndCall(err,cb);
					} else {
						cb(null,rows);
					}
				}));
		}));
	}
};

function transformReportRows(rows) {
	const personsMap = {};
	rows.forEach((row)=>{
		const pid = row.PERSON_ID;
		const personTransformed = (personsMap[pid]) ? true : false;

		const person = {};
		const order = {};
		for(const field in row) {
			if(!personTransformed && field.startsWith('PERSON_')) {
				let newField = field.slice(7);
				person[newField] = row[field];
			}
			if(field.startsWith('WO_')) {
				let newField = field.slice(3);
				order[newField] = row[field];
			}
		}
		person.WORK_ORDERS = [];
		if(!personTransformed) {
			personsMap[pid] = person;
		}
		personsMap[pid].WORK_ORDERS.push(order);
	});
	const persons = [];
	for(let id in personsMap) persons.push(personsMap[id]);
	return persons;
}

module.exports = persons_db;