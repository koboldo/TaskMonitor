/* jshint node: true, esversion: 6 */
'use strict';

var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var crypto = require('crypto');
var util = require('util');
var fs = require('fs');
var path  = require('path');
var nodemailer = require('nodemailer');
var sprintf = require("sprintf-js").sprintf;

var dbUtil = require('./db/db_util');

// var logger = require('./logger').getLogger('monitor'); 
var logger = require('./logger').logger; 
const addCtx = require('./logger').addCtx;

var authQuery = 'SELECT ID, EMAIL, IS_ACTIVE, ROLE_CODE, OFFICE_CODE, FIRST_NAME, LAST_NAME FROM PERSON WHERE EMAIL = ? AND PASSWORD = ? AND IS_ACTIVE = "Y"';
var resetQuery = 'SELECT ID, EMAIL, IS_ACTIVE FROM PERSON WHERE EMAIL = ?';
var resetTokenQuery = 'SELECT PWD_TOKEN FROM PERSON WHERE ID = ?';

var conf;
try {
    var confPath = path.join(process.env.WM_CONF_DIR, 'conf.json');
    conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
} catch(err) {
    logger().error('Failed to load configuration. ',err.message);
    process.exit(1);
}

var auth = {
    authenticate: function(req, res) {
        var user = req.body.email;
        var passwd = (req.body.password) ? req.body.password : '';
        var passwdSha1 = sha1(passwd);
        
        if(logger().isDebugEnabled()) logger().debug('authentication for ' + user + ' with hash ' + passwdSha1);
        
        var db = dbUtil.getDatabase();
        var authStat = db.prepare(authQuery).bind([user, passwdSha1]).get(addCtx(function(err,userRow) {
            authStat.finalize();
            db.close();

            if(err) {
                if(logger().isDebugEnabled()) logger().debug('authentication failed with error ' + err.message);
                return res.status(400).json({ 
                                    sucess: false,
                                    message: err.message});
            }
            
            if(userRow == null) {
                if(logger().isDebugEnabled()) logger().debug('authentication failed, no user with hash found');
                return res.status(403).json({
                                success: false,
                                message: "authetication failed"
                                });
            }

            if(userRow.ROLE_CODE) userRow.ROLE_CODE = userRow.ROLE_CODE.split(',');

            if(userRow.IS_ACTIVE == "N") {
                return res.status(403).json({
                                success: false,
                                message: "user locked"
                                });
            }
            if(userRow.IS_ACTIVE == "Y") {
                var token = jwt.sign(
                                {email:userRow.EMAIL, id: userRow.ID, role: userRow.ROLE_CODE},
                                conf.secret,
                                { expiresIn: 60 * parseInt(conf.session.timeout) });
                if(logger().isDebugEnabled()) logger().debug('authentication token ' + token);
                res.json({email: userRow.EMAIL, id: userRow.ID, token: token, firstName: userRow.FIRST_NAME, lastName: userRow.LAST_NAME, roleCode: userRow.ROLE_CODE, officeCode: userRow.OFFICE_CODE});
            }
        }));
    },
    
    validateToken: function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        if(token) {
            if(logger().isDebugEnabled()) logger().debug('validating token for ' + req.path);
            if(logger().isDebugEnabled()) logger().debug('front version ' + req.get('Front-Version'));

            try {
                var decoded = jwt.verify(token, conf.secret);
                if(logger().isDebugEnabled()) logger().debug('decoded token data: ' + util.inspect(decoded));
                req.context = {};
                req.context.id = decoded.id;
                req.context.role = decoded.role;


            } catch(err) {
                logger().error(err);
                return res.status(403).json({
                                success: false,
                                message: err.message
                                });
            }
            next();
        } else {
            logger().error('token not found for ' + req.path);
            res.status(403).json({
                                success: false,
                                message: "token not found"
                                });
        }
    },

    sendHash: function(req, res) {
        
        var userEmail = req.body.email;

        var db = dbUtil.getDatabase();
        var authStat = db.prepare(resetQuery).bind(userEmail).get(addCtx(function(err,userRow) {
            authStat.finalize();
            if(err) {
                res.status(500).json({status:'error', message: 'request processing failed'});
                return;
            }

            if(userRow == null) {
                res.status(404).json({status:'error', message: 'adres email nie został odnaleziony'});
                return;
            }

            if(userRow.IS_ACTIVE != 'Y') {
                res.status(406).json({status:'error', message: 'user account is locked'});
                return;
            }

            let hash = crypto.createHmac('sha256',conf.secret).update('I need your account ' + userRow.EMAIL).digest('hex');

            let idObj = {ID: userRow.ID};
            let userObj = {PWD_TOKEN: hash};

            dbUtil.performUpdate(idObj, userObj, 'PERSON', addCtx((err,result) => {
                if (err) {
                    db.close();
                    logger().error(err);
                    res.status(500).json({status:'error', message: 'request processing failed'});
                    return;
                }

                sendMailWithLink(userRow.EMAIL,userRow.ID,hash,(err, info) => {
                    db.close();
                    if (err) {
                        logger().error(err);
                        res.status(500).json({status:'error', message: 'request processing failed'});
                        return;
                    }
            
                    logger().info('Message sent: ' + info.messageId);
                    res.status(200).json({success: 1});
                });
            }, db)); 
        }));
    },

    validateHash: function(req, res) {
        var userId = req.body.id;
        var hash = req.body.hash;
        var passwd = (req.body.password) ? req.body.password : '';
        var passwdSha1 = sha1(passwd);

        var db = dbUtil.getDatabase();
        var resetTokenStat = db.prepare(resetTokenQuery).bind(userId).get(addCtx(function(err,userRow) {
            resetTokenStat.finalize();
            if(err) {
                db.close();
                logger().error(err);
                res.status(500).json({status:'error', message: 'request processing failed'});
                return;
            }

            if(userRow.PWD_TOKEN != hash) {
                db.close();
                res.status(400).json({status:'error', message: 'invalid request'});
                return;
            }

            let idObj = {ID: userId};
            let userObj = {PASSWORD: passwdSha1, PWD_TOKEN: ''};

            dbUtil.performUpdate(idObj, userObj, 'PERSON', addCtx((err,result) => {
                db.close();
                if (err) {
                    logger().error(err);
                    res.status(500).json({status:'error', message: 'request processing failed'});
                    return;
                }
                res.status(200).json({success: 1});
            }));
        }));
    }
};

function sendMailWithLink(email,id, hash, cb) {

    let mailTemplate;
    try {
        mailTemplate = fs.readFileSync(path.join(__dirname,'../template/mail_reset_passwd.html'), 'utf8');
        mailTemplate = sprintf(mailTemplate, {hash: hash, id: id});
    } catch(err) {
        logger().error(err);
        cb(err);
        return;
    }

    let mailOpts = {
        from: conf.smtp.from,
        to: email, 
        subject: 'BOT: ustaw hasło',
        html: mailTemplate
    };
    
    let transporter = nodemailer.createTransport({
        
        host: conf.smtp.host,
        port: conf.smtp.port,
        secure: conf.smtp.secure, 
        auth: {
            user: conf.smtp.username,
            pass: conf.smtp.password
        }    
    });

    transporter.sendMail(mailOpts, (err, info) => {
        cb(err, info);
    });   
}


module.exports = auth;