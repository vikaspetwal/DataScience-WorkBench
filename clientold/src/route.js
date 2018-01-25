var app = angular.module('MachineLearning');

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    /*$urlRouterProvider.otherwise("/training");*/
    
    $stateProvider
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

