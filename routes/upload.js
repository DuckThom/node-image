const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const URLSafeBase64 = require('urlsafe-base64');

function makeUrl() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let name = "";

    for (let i = 0; i < 6; i++) {
        name = name + chars.charAt(Math.floor(Math.random()*chars.length));
    }

    return name;
}

router.post('/', function(req, res, next) {
    const imagesDir = path.join(__dirname, '../public/images');

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        let randomName = "";

        for (let i = 0; i < 5; i++) {
            if (randomName !== "" && !fs.exists(imagesDir + '/' + randomName)) {
                break;
            }

            randomName = makeUrl();
        }

        try {
            let saveTo = path.join(imagesDir, randomName);
            file.pipe(fs.createWriteStream(saveTo));
        } catch (ex) {
            next(ex);
        }

        console.log('Saved uploaded file as: ' + randomName);

        res.status(200).send({
            message: req.protocol + "://" + req.header('Host') + "/view/" + randomName,
            code: 200
        });
        return;
    });

});

module.exports = router;
