const { sequelize } = require('../models/db.js');
var jwt_decode = require("jwt-decode");
var express = require('express');
var app = express();
const { uuid } = require('uuidv4');
var secret = require('../config/secret.js');
app.set('superSecret', secret.code);

exports.getuser = async (req, res) => {
    // GET JWT TOKEN
    const jwttoken = JSON.stringify(req.headers.authorization);
    // DECODE JWT TOKEN
    var decodednow = jwt_decode(jwttoken);

    var struser = "SELECT * FROM user WHERE id=? AND role=? and status=?"
    var checkuser = await sequelize.query(struser, {
        replacements: [decodednow.id, 'Admin', 'Active'],
        type: sequelize.QueryTypes.SELECT,
    });

    if (!checkuser) {
        return res.status(200).json({
            error: true,
            response: "User Not Found!",
        });
    }

    return res.status(200).json({
        error: false,
        response: "Success Get Data!",
        data: checkuser,
    });
};

exports.addadmin = async (req, res) => {
    // GET JWT TOKEN
    const jwttoken = JSON.stringify(req.headers.authorization);
    // DECODE JWT TOKEN
    var decodednow = jwt_decode(jwttoken);
    const email = req.body.email;
    const no_telp = req.body.no_telp;
    const status = 'Active';
    const role = 'Admin';
    var id = uuid();
    
    var struser = "SELECT * FROM user WHERE id=? AND role=? and status=?"
    var checkuser = await sequelize.query(struser, {
        replacements: [decodednow.id, 'Admin', 'Active'],
        type: sequelize.QueryTypes.SELECT,
    });

    if (!checkuser) {
        return res.status(200).json({
            error: true,
            response: "User Not Found!",
        });
    }

    var struserexisting = "SELECT * FROM user WHERE email=? LIMIT 1"
    var checkuserexisting = await sequelize.query(struserexisting, {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
    });

    if (checkuserexisting) {
        return res.status(200).json({
            error: true,
            response: "Email Already Exist!",
        });
    }

    var stradduser = "INSERT INTO user (uid, no_telp, email, role, status) VALUES(?, ?, ?, ?, ?)"
    var adduser = await sequelize.query(stradduser, {
        replacements: [id, no_telp, email, role, status],
        type: sequelize.QueryTypes.SELECT,
    });
    
    if(adduser){
        return res.status(200).json({
            error: false,
            response: "Add User Success!",
        })
    }

    return res.status(200).json({
        error: true,
        response: "Add User Failed. Please Try Again!",
    })
};

exports.editadmin = async (req, res) => {
    // GET JWT TOKEN
    const jwttoken = JSON.stringify(req.headers.authorization);
    // DECODE JWT TOKEN
    var decodednow = jwt_decode(jwttoken);
    const email = req.body.email;
    const no_telp = req.body.no_telp;
    const status = req.body.status;
    const role = req.body.role;
    var id = req.body.id;
    
    var struser = "SELECT * FROM user WHERE id=? AND role=? and status=?"
    var checkuser = await sequelize.query(struser, {
        replacements: [decodednow.id, 'Admin', 'Active'],
        type: sequelize.QueryTypes.SELECT,
    });

    if (!checkuser) {
        return res.status(200).json({
            error: true,
            response: "User Not Found!",
        });
    }

    var strupdateuser = "UPDATE user SET no_telp=?, email=?, role=?, status=? WHERE id=?"
    var updateuser = await sequelize.query(strupdateuser, {
        replacements: [no_telp, email, role, status, id],
        type: sequelize.QueryTypes.SELECT,
    });
    
    if(updateuser){
        return res.status(200).json({
            error: false,
            response: "Update User Success!",
        })
    }

    return res.status(200).json({
        error: true,
        response: "Update User Failed. Please Try Again!",
    })
};

exports.deleteadmin = async (req, res) => {
    // GET JWT TOKEN
    const jwttoken = JSON.stringify(req.headers.authorization);
    // DECODE JWT TOKEN
    var decodednow = jwt_decode(jwttoken);
    var id = req.params.id;
    
    var struser = "SELECT * FROM user WHERE id=? AND role=? and status=?"
    var checkuser = await sequelize.query(struser, {
        replacements: [decodednow.id, 'Admin', 'Active'],
        type: sequelize.QueryTypes.SELECT,
    });

    if (!checkuser) {
        return res.status(200).json({
            error: true,
            response: "User Not Found!",
        });
    }

    var strdeleteuser = "DELETE FROM user WHERE id=?"
    var deleteuser = await sequelize.query(strdeleteuser, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
    });
    
    if(deleteuser){
        return res.status(200).json({
            error: false,
            response: "Delete User Success!",
        })
    }

    return res.status(200).json({
        error: true,
        response: "Delete User Failed. Please Try Again!",
    })
}