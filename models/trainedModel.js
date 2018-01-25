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
    numberOfRowsForTraining: {
        type: Number
    },
    numberOfRowsForTesting: {
        type: Number
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
    classifier:{
        type:String
    },
    classification:{
        type:[String]
    },
    precision:{
        type:[Number]
    }
});

module.exports = modelSchema;