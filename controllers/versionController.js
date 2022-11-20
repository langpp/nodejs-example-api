var express = require('express');
var app = express();
var secret = require('../config/secret.js');

app.set('superSecret', secret.code);

exports.getversion = async (req, res) => {
    return res.status(200).json({
        android: "1.0.0",
        ios: "1.0.0",
        website: "1.0.0",
        api: "1.0.0"
    });
};