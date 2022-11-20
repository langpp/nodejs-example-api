const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const secret = require('./config/secret.js');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

app.use(compression());

app.set('superSecret', secret.code);
app.use(cors());

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.locals.user = req.session;
  next();
});

app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(morgan('dev'));
app.set('view engine', 'ejs');

// FILE UPLOAD in public folder
app.use(express.static('public'));
// API using for API URL
require('./routes/api.js')(app);
// WEB using for html url like send mail html, 404, etc
require('./routes/web.js')(app);

// Create a Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})