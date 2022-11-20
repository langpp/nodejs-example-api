const { sequelize } = require('../models/db.js');
var jwt = require('jsonwebtoken');
var jwt_decode = require("jwt-decode");
var express = require('express');
var app = express();
var secret = require('../config/secret.js');

app.set('superSecret', secret.code);

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    var struser = "SELECT * FROM user WHERE email=? AND password=? LIMIT 1"
    var checkuser = await sequelize.query(struser, {
        replacements: [email, password],
        type: sequelize.QueryTypes.SELECT,
    });
    if(!checkuser){
        return res.status(200).json({
            error: true,
            response: "Account Not Found!",
        });
    }else{
        // SET PAYLOAD JWT
        const payload = {
            id: checkuser.dataValues.id,
            email: checkuser.dataValues.email,
            no_telp: checkuser.dataValues.no_telp,
            role: checkuser.dataValues.role,
            status: checkuser.dataValues.status,
        };
        
        // CREATE JWT 30 DAYS
        var token = jwt.sign(payload, app.get("superSecret"), {
            expiresIn: "30d",
        });

        return res.status(200).json({
            error: false,
            response: "Login Success!",
            data: [{ token: token }],
        });
    }
};

exports.refreshtoken = (req, res) => {
    // GET JWT TOKEN
    const jwttoken = JSON.stringify(req.headers.authorization);
    // DECODE JWT TOKEN
    var decodednow = jwt_decode(jwttoken);
    let header = req.headers.authorization.split(" ");
    let token = header[1];
    if (req.headers.authorization) {
        jwt.verify(token, app.get("superSecret"), (err, decoded) => {
            if (err) {
                if (err.message == "jwt expired") {
                    // CREATE PAYLOAD
                    const payload = {
                        id: decodednow.id,
                        email: decodednow.email,
                        no_telp: decodednow.no_telp,
                        role: decodednow.role,
                        status: decodednow.status,
                    };
                    // SIGN NEW JWT IN 30 DAYS
                    var newtoken = jwt.sign(payload, app.get("superSecret"), {
                        expiresIn: "30d",
                    });
                    return res.status(200).json({
                        error: false,
                        data: [{ token: newtoken }],
                        response: "Token Refresh",
                    });
                }

                return res.status(500).json({
                    error: true,
                    response: "Failed Refresh Token!",
                });
            }
            return res.status(200).json({
                error: false,
                response: "Not Refresh!",
            });
        });
    } else {
        return res.status(403).json({
            error: true,
            response: "No token provided",
        });
    }
};