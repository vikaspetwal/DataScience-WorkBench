var mongoose = require('mongoose');
var urls = require('./urls');
var fetch = require('node-fetch');

module.exports = {

    save: (req, res) => {

        var regTrainedModels = require('../models/regTrainedModel.js');
        var RegTrainedModel = mongoose.model('regtrainedmodels', regTrainedModels);
        var modelName = req.query.modelName;
        var info = {};
        RegTrainedModel.findOne({ name: modelName }, (err, docs) => {

            if (err) {

                info = {
                    status: false,
                    msg: err.data
                }
                res.send(info);
                res.end();

            } else {

                if (docs != null) {
                    info = {
                        status: false,
                        msg: "Model name already exist, Try with another name!!"
                    }
                    res.send(info);
                    res.end();
                } else {

                    var options = {
                        method: 'GET',
                        headers: {},        // request header. format {a:'1'} or {b:['1','2','3']}
                        redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
                        follow: 20,        // maximum redirect count. 0 to not follow redirect
                        timeout: 0,        // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
                        compress: true,    // support gzip/deflate content encoding. false to disable
                        size: 0,         // maximum response body size in bytes. 0 to disable
                        body: null,       // request body. can be a string, buffer, readable stream
                        agent: null       // http.Agent instance, allows custom proxy, certificate etc.
                    }
                    var statusCode;
                    fetch(urls.url + '/save?modelName=' + req.query.modelName + '&userId=' + req.query.userId, options)
                        .then(function (res) {
                            statusCode = res.status;
                            return res.text();
                        }).then(function (body) {

                            if (statusCode == 200) {


                                var trainedModel = new RegTrainedModel({
                                    name: modelName,
                                    totalNumberOfRows: req.body.totalNumberOfRows,
                                    numberOfAttributesUsed: req.body.numberOfAttributesUsed,
                                    totalNumberOfAttributes: req.body.totalNumberOfAttributes,
                                    columnData: req.body.columnData,
                                    accuracy: req.body.accuracy,
                                    regression: req.body.regression,
                                    predictData: JSON.stringify(req.body.predictData)
                                });

                                trainedModel.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        info = {
                                            status: false,
                                            msg: "failed to save model "
                                        }
                                    }
                                    else {

                                        info = {
                                            status: true,
                                            msg: "Successfully saved the model"
                                        }
                                    }
                                    res.send(info);
                                    res.end();
                                });
                            } else {

                                info = {
                                    status: false,
                                    msg: body
                                }
                                res.send(info);
                                res.end();
                            }


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

    }
}
