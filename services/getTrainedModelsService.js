const mongoose = require('mongoose');
module.exports = {
    getTrainedModels: (req, res) => {
        
       
        var trainedModels = require('../models/trainedModel.js');
        var TrainedModel = mongoose.model('trainedmodels', trainedModels);
        var info={};
        TrainedModel.find({}, (err, docs) => {
            if (err) {
              
                info = {
                    status: false,
                    msg: err
                }

            } else {
              
                info = {
                    status: true,
                    models:docs
                }
           
            };
            res.send(info);
            res.end();
        });
    }
}