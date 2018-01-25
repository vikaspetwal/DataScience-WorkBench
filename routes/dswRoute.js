var express = require("express");
var router = express.Router();

var getTrainedModelsService = require('../services/getTrainedModelsService');

var removeService = require('../services/removeService');

var getModelService = require('../services/getModelService');

var predictService = require('../services/predictService');



router.get("/getTrainedModels", getTrainedModelsService.getTrainedModels);

router.post("/remove", removeService.remove);

router.get("/getModel", getModelService.getModel);

router.post("/predict", predictService.predict);

module.exports = router;
