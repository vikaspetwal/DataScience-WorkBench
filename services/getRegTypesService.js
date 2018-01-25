const mongoose = require('mongoose');
module.exports = {
    getRegTypes: (req, res) => {
       

        var regtypes = require('../models/classifier.js');
        var Regtype = mongoose.model('regtypes', regtypes);
        var info={};
       Regtype.find({}, (err, docs) => {
            if (err) {
               
                info = {
                    status: false,
                    msg: err
                }

            } else {
              
                info = {
                    status: true,
                    regtypes:docs
                }
             

            };
            res.send(info);
            res.end();
        });
    }
}