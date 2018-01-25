var app = angular.module('MachineLearning');

app.controller('HomeController', ['$scope', '$http', '$rootScope', '$localStorage',
    '$sessionStorage', function ($scope, $http, $rootScope, $localStorage,
        $sessionStorage) {

        $scope.test = "TEST";
        $localStorage.templateURL = { "state": "" };

        $scope.predict = function () {
            $localStorage.templateURL.state = "Predict";
            console.log($localStorage);
            window.location = "indexM";

        }

        $scope.training = function () {
            $localStorage.templateURL.state = "Training";
            console.log($localStorage);
            window.location = "indexM";
        }
    }])