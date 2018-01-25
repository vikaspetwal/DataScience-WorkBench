var mongoose = require('mongoose');
var encode = require('hashcode').hashCode;
var fs = require('fs');
var path=require('path');
module.exports = {
    remove: (req, res) => {
        
        if (req.body.pin === '345678') {
            var trainedModels = require('../models/regTrainedModel.js');
            var TrainedModel = mongoose.model('regtrainedmodels', trainedModels);
            var info={};

            TrainedModel.remove({ _id: req.query.id }, (err, doc) => {
                if (err) {
                   
                    info = {
                        status: false,
                        msg: err
                    }

                } else {
                    try {
                        var joinPath=path.join(__dirname,"../python/Models/",req.body.name+".sav");
                        
                        fs.unlinkSync(joinPath);

                    } catch (e) {
                        console.log(e);
                        
                    }
                    finally {
                        info = {
                            status: true
                        }
                    }
                };
                res.send(info);
                res.end();
            });

        } else {
            res.sendStatus(401);
        }
    }
}