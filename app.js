var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db')

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

dotenv.config({ path: './config/config.env' })

connectDB()

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static("frontend/build"))
    app.get("*",(req, res) => {
        res.sendfile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

module.exports = app;
