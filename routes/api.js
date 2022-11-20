const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const secret = require('../config/secret.js');
app.set('superSecret', secret.code);

module.exports = (app) => {
  const admin = require("../controllers/adminController.js");
  const auth = require("../controllers/authController.js");
  const version = require("../controllers/versionController.js");

  // ADMIN URL
  app.get('/api/admin/detail', tokencheck, admin.getuser);
  app.post('/api/admin/add', tokencheck, admin.addadmin);
  app.put('/api/admin/edit', tokencheck, admin.editadmin);
  app.delete('/api/admin/delete/:user_id', tokencheck, admin.deleteadmin);

  // AUTH URL
  app.post('/api/auth/login', auth.login);
  app.post('/api/auth/refreshtoken', tokencheck, auth.refreshtoken);

  // VERSION URL
  app.get('/api/version', tokencheck, version.getversion);
}

const tokencheck = (req, res, next) => {
  if (req.headers.authorization) {
    let header = req.headers.authorization.split(' ');
    let token = header[1];
    if (token) {
      jwt.verify(token, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.status(401).send({
            error: true,
            response: 'Failed to authenticate token'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        error: true,
        response: 'No token provided'
      });
    }
  } else {
    return res.status(401).send({
      error: true,
      response: 'No token provided'
    });
  }
};