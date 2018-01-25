var app = angular.module('MachineLearning');

app.controller('HomeController', ['$scope', '$http', '$rootScope', '$localStorage',
    '$sessionStorage', function ($scope, $http, $rootScope, $localStorage,
        $sessionStorage) {

        $scope.test = "TEST";
        $localStorage.templateURL = { "state": "" };

        $scope.predict = function () {
            $localStorage.templateURL.state = "Predict";
            
            window.location = "index";
        }

        $scope.training = function () {
            $localStorage.templateURL.state = "Training";
            
            window.location =  "index";
        }
    }])