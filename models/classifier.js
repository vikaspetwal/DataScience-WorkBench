var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var classifierSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    shortName:{
        type:String
    },
    description:{
        type:String,
        default:""
    }
});

module.exports = classifierSchema;