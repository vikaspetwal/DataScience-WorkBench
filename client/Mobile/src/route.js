var app = angular.module('MachineLearning');

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    /*$urlRouterProvider.otherwise("/training");*/

    $stateProvider
        .state('training', {
            url: "/training",
            templateUrl: "../../../Mobile/src/Training/trainingTabs.html"
        })
        .state('training.uploadCSV', {
            url: "/uploadCSV",
            templateUrl: "../../../Mobile/src/Training/UploadFile/views/uploadCSV.html"


        })
        .state('training.selectAttribute', {
            url: "/selectAttribute",
            templateUrl: "../../../Mobile/src/Training/AttributeSelection/views/attributeSelector.html"

        })
        .state('training.trainModal', {
            url: "/trainModal",
            templateUrl: "../../../Mobile/src/Training/TrainModal/views/trainModal.html"
        })





        .state('predict', {
            url: "/predict",
            templateUrl: "../../../Mobile/src/Predict/predictTabs.html"
        })
        .state('predict.selectModal', {
            url: "/selectModal",
            templateUrl: "../../../Mobile/src/Predict/selectModal/views/selectModal.html"


        })
        .state('predict.predictModal', {
            url: "/predictModal",
            templateUrl: "../../../Mobile/src/Predict/predictModal/views/predictModal.html"


        })

}]);

