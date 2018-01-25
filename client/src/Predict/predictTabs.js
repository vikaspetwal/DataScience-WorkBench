var app = angular.module('MachineLearning');
app.controller('PredictTabController', function ($scope, $window, $rootScope, $state) {

 $rootScope.activeMenu.class = "predict";
    function onload() {
      $state.go('predict.selectModal');

    } onload();


    $rootScope.predctTabColor = {"selectModal":"", "predictModal":""};


      $scope.changeTab = function (value) {

    if (value === 'selectModal') {

      $rootScope.predctTabColor.selectModal = "selectModalU";
      $rootScope.predctTabColor.predictModal = "";
    

    }

    else if (value === 'predictModal') {

      $rootScope.predctTabColor.selectModal = "selectModal";
      $rootScope.predctTabColor.predictModal = "predictModalU";
    

    }

  }
    
 
});