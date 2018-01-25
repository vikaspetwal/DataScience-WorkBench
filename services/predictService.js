var mongoose = require('mongoose');
var urls = require('./urls');
var fetch = require('node-fetch');
var encode = require('hashcode').hashCode;
module.exports = {

    predict: (req, res) => {


        var info = {};
        var users = require('../models/user.js');
        var User = mongoose.model('users', users);
        var authorization = req.headers['authorization'];
        var hash = encode().value(authorization);

        User.findOne({ secret: hash, status: 'active' }, (err, doc) => {
            if (err) {

                info = {
                    status: false,
                    msg: err
                }
                res.send(info);
                res.end();

            } else {

                if (doc != null) {

                    var trainedModels = require('../models/trainedModel.js');
                    var TrainedModel = mongoose.model('trainedmodels', trainedModels);

                    TrainedModel.findOne({ name: req.query.modelName }, (err, docs) => {
                        if (err) {

                            info = {
                                status: false,
                                msg: err
                            }

                            res.send(info);
                            res.end();

                        } else {

                            if (docs != null) {

                                var columnData = docs.columnData;
                                var rowData = [];
                                for (var index = 0; index < columnData.length; index++) {
                                    if (columnData[index] == "Result") {
                                        continue;
                                    } else {
                                        rowData.push(req.body[columnData[index]]);
                                    }
                                }

                                var predictBody = {
                                    "rowData": rowData,
                                    "Classification": docs.classification,
                                    "Precision": docs.precision
                                }

                                var options = {
                                    method: 'POST',
                                    headers: {},        // request header. format {a:'1'} or {b:['1','2','3']}
                                    redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
                                    follow: 20,        // maximum redirect count. 0 to not follow redirect
                                    timeout: 0,        // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
                                    compress: true,    // support gzip/deflate content encoding. false to disable
                                    size: 0,         // maximum response body size in bytes. 0 to disable
                                    body: JSON.stringify(predictBody),       // request body. can be a string, buffer, readable stream
                                    agent: null       // http.Agent instance, allows custom proxy, certificate etc.
                                }
                                var statusCode;
                                fetch(urls.url + '/dsw/predict?modelName=' + req.query.modelName, options)
                                    .then(function (res) {
                                        statusCode = res.status;
                                        return res.text();
                                    }).then(function (body) {

                                        if (statusCode == 200) {
                                            var jsonString = {};
                                            try {
                                                jsonString = JSON.stringify(eval('(' + body + ')'));
                                                jsonString = JSON.parse(jsonString);

                                                info = {
                                                    status: true,
                                                    body: jsonString
                                                }
                                            }
                                            catch (error) {

                                                info = {
                                                    status: true,
                                                    body: body
                                                }
                                            }


                                        } else {

                                            info = {
                                                status: false,
                                                msg: body
                                            }
                                        }
                                        res.send(info);
                                        res.end();

                                    }).catch(function (err) {
                                        info = {
                                            status: false,
                                            msg: err
                                        }
                                        res.send(info);
                                        res.end();
                                    });

                            }

                        };

                    });


                } else {
                    res.sendStatus(401);
                }

            };

        });

    }
}