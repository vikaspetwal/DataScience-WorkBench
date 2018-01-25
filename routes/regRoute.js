var express = require("express");
var router = express.Router();

var uploadService = require('../services/uploadService');

var getAttributesRegService = require('../services/getAttributesRegService');

var sendAttributesRegService = require('../services/sendAttributesRegService');

var getRegTypesService = require('../services/getRegTypesService');

var trainModelRegService = require('../services/trainModelRegService');

var saveService = require('../services/saveService');



var getTrainedModelsRegService = require('../services/getTrainedModelsRegService');

var removeRegService = require('../services/removeRegService');

var getModelRegService = require('../services/getModelRegService');

var predictRegService = require('../services/predictRegService');

var regFailureService = require('../services/regFailureService');

var regSaveDegreeService = require('../services/regSaveDegreeService');



router.get("/getTrainedModels", getTrainedModelsRegService.getTrainedModels);

router.post("/remove", removeRegService.remove);

router.get("/getModel", getModelRegService.getModel);

router.post("/predict", predictRegService.predict);

router.post("/failure", regFailureService.failure);

router.post("/saveDegree", regSaveDegreeService.saveDegree);



router.post("/upload", uploadService.upload);


router.get("/getAttributes", getAttributesRegService.getAttributes);

router.post("/sendAttributes", sendAttributesRegService.sendAttributes);

router.get("/getRegTypes", getRegTypesService.getRegTypes);

router.get("/trainModel", trainModelRegService.trainModel);

router.post("/save", saveService.save);


module.exports = router;
