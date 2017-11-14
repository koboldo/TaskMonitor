/* jshint node: true */
'use strict';

var util = require('util');
var mapper = require('./mapper.js');

var codes_db = require('./db/codes_db');

var codes = {
    
    readCodes: function(req, res) {
        
        codes_db.readCodes(req.params.codeTable,function(err, codeRows) {
			if(err) {
				res.status(500).json({status:'error', message: 'request processing failed'});
				return;
			}
            
            var codes = mapper.mapList(mapper.code.mapToJson,codeRows);
            res.json(codes);
        });
    },
    
    readTables: function(req, res) {
        
        codes_db.readTables(function(err, tableRows) {
            if(err) {
				res.status(500).json({status:'error', message: 'request processing failed'});
				return;
			}

            var tables = mapper.mapList(mapper.codeTable.mapToJson,tableRows);
            res.json(tables);
        });
    }
};

module.exports = codes;