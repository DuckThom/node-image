const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const view = require('./routes/view');
const upload = require('./routes/upload');
const bodyParser = require('body-parser');

try {
    const apiKeys = require('./keys.json');

    app.use('/upload', function (req, res, next) {
        let allow = false;

        apiKeys.forEach(function (key) {
            if (allow) {
                return;
            }

            allow = (req.query.key === key.value);
        });

        if (!allow) {
            res.status(403).send({
                message: "This API key is not allowed to upload images",
                code: 403
            });

            res.end();
        } else {
            next();
        }
    });
} catch (ex) {
    console.log('No API keys found, add them to ./keys.json');
    console.log('NOTE: Without API keys, this app can be used by anyone!');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/view', view);
app.use('/upload', upload);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    let response = {
        message: "Whoops, looks like something broke :(",
        code: err.status || 500,
        payload: {}
    };

    console.log(err);

    if (req.app.get('env') === 'development') {
        response.message = err.message;
        response.error = err;
    }

    res.status(err.status || 500).send(response);
});

module.exports = app;
