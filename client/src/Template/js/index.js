

var app = angular.module('MachineLearning');

app.controller('TemplateController', ['$scope', '$http', '$rootScope', '$localStorage',
    '$sessionStorage','$state', function ($scope, $http, $rootScope, $localStorage,
        $sessionStorage, $state) {
 
        $rootScope.activeMenu = {"class":""};

        $scope.loadState = function () {

           
            if ($localStorage.templateURL.state === "Training") {
                 $state.go('training');
            }
            else if ($localStorage.templateURL.state === "Predict") {
                 $state.go('predict');
            }
            else {
                 $state.go('training');
            }

        }
    
    }])