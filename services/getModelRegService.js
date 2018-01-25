const mongoose = require('mongoose');
module.exports = {
    getModel: (req, res) => {
     
        var trainedModels = require('../models/regTrainedModel.js');
        var TrainedModel = mongoose.model('regtrainedmodels', trainedModels);
        var info={};
        TrainedModel.findOne({_id:req.query.model_id}, (err, doc) => {
            if (err) {
               
                info = {
                    status: false,
                    msg: err
                }

            } else {
               
                info = {
                    status: true,
                    model:doc
                }
        
            };
            res.send(info);
            res.end();
        });
    }
}