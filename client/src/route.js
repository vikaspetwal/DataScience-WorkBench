var app = angular.module('MachineLearning');

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    /*$urlRouterProvider.otherwise("/training");*/

    $stateProvider

         .state('regTraining', {
            url: "/regTraining",
            templateUrl: "../../../src/Regression/Training/trainingTabsReg.html"
        })

        .state('regTraining.uploadCSVReg', {
            url: "/uploadCSVReg",
            templateUrl: "../../../src/Regression/Training/UploadFile/views/uploadCSVReg.html"
        })

        .state('regTraining.attReg', {
            url: "/attReg",
            templateUrl: "../../../src/Regression/Training/AttributeSelection/views/attributeSelectorReg.html"
        })

        .state('regTraining.trainReg', {
            url: "/trainReg",
            templateUrl: "../../../src/Regression/Training/TrainModal/views/trainModelReg.html"
        })
        

        // .state('regTraining', {
        //     url: "/regTraining",
        //     templateUrl: "../../../src/Regression/Training/trainingTabs.html"
        // })
        .state('regPredict', {
            url: "/regPredict",
            templateUrl: "../../../src/Regression/Predict/predictTabs_Reg.html"
        })
        .state('regPredict.selectModel_Reg', {
            url: "/selectModel_Reg",
            templateUrl: "../../../src/Regression/Predict/selectModel_Reg/views/selectModel_Reg.html"
        })
        .state('regPredict.predictModel_Reg', {
            url: "/predictModel_Reg",
            templateUrl: "../../../src/Regression/Predict/predictModel_Reg/views/predictModel_Reg.html"
        })












        .state('training', {
            url: "/training",
            templateUrl: "../../../src/Training/trainingTabs.html"
        })
        .state('training.uploadCSV', {
            url: "/uploadCSV",
            templateUrl: "../../../src/Training/UploadFile/views/uploadCSV.html"


        })
        .state('training.selectAttribute', {
            url: "/selectAttribute",
            templateUrl: "../../../src/Training/AttributeSelection/views/attributeSelector.html"

        })
        .state('training.trainModal', {
            url: "/trainModal",
            templateUrl: "../../../src/Training/TrainModal/views/trainModal.html"
        })

        .state('predict', {
            url: "/predict",
            templateUrl: "../../../src/Predict/predictTabs.html"
        })
        .state('predict.selectModal', {
            url: "/selectModal",
            templateUrl: "../../../src/Predict/selectModal/views/selectModal.html"


        })
        .state('predict.predictModal', {
            url: "/predictModal",
            templateUrl: "../../../src/Predict/predictModal/views/predictModal.html"


        })

}]);