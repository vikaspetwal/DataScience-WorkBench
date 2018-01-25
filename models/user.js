var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    status:{
        type: String
    },
   secret:{
        type:String
    }
});

module.exports = userSchema;