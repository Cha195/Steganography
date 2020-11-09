const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');

const imageRouter = require('./routes/imageRouter');
const audioRouter = require('./routes/audioRouter');
const videoRouter = require('./routes/videoRouter');

app.use(morgan('dev'));
app.use(bodyparser.json());

app.use('/imageSteg',imageRouter);
app.use('/audioSteg',audioRouter);
app.use('/videoSteg',videoRouter);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});

module.exports = app;