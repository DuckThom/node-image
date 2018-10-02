const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const multer  = require('multer')

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const uploadPath = path.join(__dirname, '../public/images');
const allowedTypes = [
    'image/png',
    'image/jpeg',
    'video/mp4',
    'image/gif',
    'image/webp',
    'application/octet-stream'
];

function fileFilter (req, file, cb) {
    let accept = allowedTypes.includes(file.mimetype);

    if (
        file.mimetype === 'application/octet-stream' && 
        path.extname(file.originalname) !== '.mp4'
    ) {
        accept = false;
    }

    cb(null, accept);
}

const upload = multer({ dest: uploadPath, fileFilter: fileFilter });

function makeUrl() {
    let name = "";

    for (let i = 0; i < 6; i++) {
        name = name + chars.charAt(Math.floor(Math.random()*chars.length));
    }

    return name;
}

router.post('/', upload.single('image'), function(req, res, next) {
    let randomName = "";

    for (let i = 0; i < 5; i++) {
        if (randomName !== "" && !fs.exists(uploadPath + '/' + randomName)) {
            break;
        }

        randomName = makeUrl();
    }

    if (fs.exists(uploadPath + '/' + randomName)) {
        return res.status(500).send({
            message: "Filename generation failed to create a unique name... :(",
            code: 500
        });
    }

    try {
        fs.rename(req.file.path, path.join(uploadPath, randomName), function (err) {
            if (err) throw err;
        });
    } catch (ex) {
        return res.status(400).send({
            message: "File upload failed, file rejected by filter.",
            code: 400
        });
    }

    console.log('Saved uploaded file as: ' + randomName);

    var protocol = req.protocol;

    if (process.env.FORCE_HTTPS) {
        protocol = 'https';
    }

    return res.status(200).send({
        message: protocol + "://" + req.header('Host') + "/view/" + randomName,
        code: 200
    });
});

module.exports = router;
