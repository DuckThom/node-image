const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const readChunk = require('read-chunk');

router.get('/:image', function(req, res, next) {
    const imagesPath = path.join(__dirname, '../public/images/');
    const fileName = req.params.image;
    const filePath = path.join(imagesPath, path.basename(fileName));

    if (!fs.existsSync(filePath)) {
        res.status(404).end("Image not found");

        return;
    }

    const contentType = fileType(readChunk.sync(filePath, 0, 4100));

    let options = {
        root: imagesPath,
        dotfiles: 'deny',
        headers: {
            'Content-Disposition': 'inline',
            'Content-Type': contentType.mime,
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        }
    });
});

module.exports = router;
