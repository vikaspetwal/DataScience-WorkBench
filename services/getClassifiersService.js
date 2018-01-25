const mongoose = require('mongoose');
module.exports = {
    getClassifiers: (req, res) => {
       

        var classifiers = require('../models/classifier.js');
        var Classifier = mongoose.model('classifiers', classifiers);
        var info={};
       Classifier.find({}, (err, docs) => {
            if (err) {
               
                info = {
                    status: false,
                    msg: err
                }

            } else {
              
                info = {
                    status: true,
                    classifiers:docs
                }
             

            };
            res.send(info);
            res.end();
        });
    }
}