const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const secret = require("../config/secret.js");
const db = require("../models/db.js");
app.set("superSecret", secret.code);

module.exports = (app) => {
	// Landing page
	app.get("/", function (req, res, next) {
		res.render("index");
	});

	// 404
	app.get("*", function (req, res, next) {
		res.render("error/404");
		next();
	});
};