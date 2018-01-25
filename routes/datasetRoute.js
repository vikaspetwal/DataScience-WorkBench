var express = require("express");
var router = express.Router();

var uploadService = require('../services/uploadService');

var getAttributesService = require('../services/getAttributesService');

var sendAttributesService = require('../services/sendAttributesService');

var getClassifiersService = require('../services/getClassifiersService');

var trainModelService = require('../services/trainModelService');

var saveService = require('../services/saveService');


router.post("/upload", uploadService.upload);


router.get("/getAttributes", getAttributesService.getAttributes);

router.post("/sendAttributes", sendAttributesService.sendAttributes);

router.get("/getClassifiers", getClassifiersService.getClassifiers);

router.get("/trainModel", trainModelService.trainModel);

router.post("/save", saveService.save);


module.exports = router;
