var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");

var routeRouter = require("./routes/route.js");
var datasetRouter = require("./routes/datasetRoute.js");
var dswRouter = require("./routes/dswRoute.js");
var regRouter = require("./routes/regRoute.js");

var app = express();
var port = process.env.PORT || 9990;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


mongoose.connect("mongodb://localhost/MLDB").then(() => {
    // mongoose.connect("mongodb://127.0.0.1:27017/MLDB").then(() => {
    var db = mongoose.connection.db;
    console.log("database connected to " + db.databaseName);
}, (err) => {
    console.log(err);
});

 
app.use(bodyParser.json({limit: '250mb'}));
app.use(bodyParser.urlencoded({limit: '250mb'}));

app.use("/", routeRouter);
app.use("/dataset", datasetRouter);
app.use("/dsw", dswRouter);
app.use("/regression", regRouter);

app.set("views", __dirname);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname+ '/client' ));


app.listen(port,'0.0.0.0', () => {
    console.log("sever running on port " + port);
});

app.use(function(err,req,res,next){
    res.status(err.status||500);
    res.send(err.message);
})
module.exports = app; 