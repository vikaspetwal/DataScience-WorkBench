

var app = angular.module('MachineLearning');

app.filter('underscoreless', function () {
    return function (input) {
        return input.replace(/_/g, ' ');
    };
  });

app.controller('TemplateController', ['$scope', '$http', '$rootScope', '$localStorage',
    '$sessionStorage','$state', function ($scope, $http, $rootScope, $localStorage,
        $sessionStorage, $state) {
 /*           $scope.sidebar=true;
           
            $scope.sidebarfn= function() {
            
             $scope.sidebar=false;
            }

            $scope.sidebarfn2= function() {
            
                 $scope.sidebar=true;
                }*/

        $rootScope.activeMenu = {"class":""};

        $scope.loadState = function () {

            console.log($localStorage);
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