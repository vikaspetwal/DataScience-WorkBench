var fetch = require("node-fetch");
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var request = require('request');

var ext;
var uploadedFileName;
var accJson;
var predictJson;


var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './Uploads')
    },
    filename: function (req, file, callback) {
        var rand = Math.floor(Math.random() * (1000 - 2 + 1)) + 2;
        uploadedFileName = (file.fieldname + '-' + Date.now() + rand + path.extname(file.originalname));
        callback(null, uploadedFileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)

        if (ext == '.csv') {
            callback(null, true);
        } else {
            return callback('Only CSV file is allowed', null);
        }

    }
}).single("uploadedFile");


module.exports = {

    upload: (req, res) => {
        var info = {};
        var srcPath = '';
        var to = path.join(__dirname, "../Uploads");
        if (req.query['sampleFileFlag']) {
            if (req.query['sampleFileName'] == 'creditCard') {
                srcPath = path.join(__dirname, "../python/Files/creditcard_dataset.csv");
            }
            else if (req.query['sampleFileName'] == 'spamData') {
                srcPath = path.join(__dirname, "../python/Files/spambaseDataset.csv");
            } else {
                srcPath = path.join(__dirname, "../python/Files/IrisDataset.csv");
            }

            var copyFile = (file, dir2) => {
                var rand = Math.floor(Math.random() * (1000 - 5 + 1)) + 5;
                var fileName = "copiedfile-" + Date.now() + rand + ".csv";
                var source = fs.createReadStream(file);
                var dest = fs.createWriteStream(path.resolve(dir2, fileName));

                source.pipe(dest);
                source.on('end', function () {
                    console.log('Succesfully copied');
                    res.send({ status: true, filename: fileName });
                    res.end();
                });
                source.on('error', function (err) {
                    console.log(err);
                    res.json({ status: false, err_desc: err });
                    res.end();
                });
            };

            copyFile(srcPath, to);

        } else {
            upload(req, res, function (err) {
                if (err) {

                    res.json({ status: false, err_desc: err });
                    res.end();

                }
                /** Multer gives us file info in req.file object */
                else if (!req.file) {

                    res.json({ status: false, err_desc: "No file passed" });
                    res.end();

                } else {

                    res.send({ status: true, filename: uploadedFileName });
                    res.end();

                }
            })
        }


    }
}