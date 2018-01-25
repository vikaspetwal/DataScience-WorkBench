var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var modelSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    totalNumberOfRows:{
        type:Number
    },
    numberOfAttributesUsed:{
        type: Number
    },
    totalNumberOfAttributes:{
        type: Number
    },
    columnData:{
        type:[String]
    },
    predictData:{
        type:String
    },
    accuracy:{
        type:String
    },
    regression:{
        type:String
    }
});

module.exports = modelSchema;