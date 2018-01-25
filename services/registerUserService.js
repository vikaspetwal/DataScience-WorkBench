var mongoose = require('mongoose');
var request = require('request');
var encode = require('hashcode').hashCode;

module.exports = {

    registerUser: (req, res) => {
     
        var baseUser=new Buffer(req.body.username+':'+req.body.password).toString('base64');
        var hash = encode().value('Basic '+baseUser); 
       
                var users = require('../models/user.js');
                var User = mongoose.model('users', users);

                var user = new User({
                   name: req.body.name,
                    status: req.body.status,
                    secret: hash,
                });

                user.save(function (err) {
                    if (err) {
                       
                        info = {
                            status: false,
                            msg: "failed to register user " + err
                        }
                    }
                    else {

                        info = {
                            status: true,
                            msg: "Successfully registered user"
                        }
                    }
                    res.send(info);
                    res.end();
                });

                
            }

}
    