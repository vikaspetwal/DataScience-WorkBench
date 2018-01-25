var app = angular.module('MachineLearning');
app.controller('TrainingTabController', function ($scope, $window, $rootScope, $state, $localStorage) {

var userId="";
 $rootScope.activeMenu.class = "training";

  function onload() {
    userId=""+Math.floor(Math.random()*(10000-500+1)+500)+"-"+new Date().getTime();
    
    $localStorage.userId=userId;
    $state.go('training.uploadCSV');

  } onload();




  $rootScope.tabColor = { "uploadData": "", "selectAttribute": "", "trainModel": "" };

  $scope.changeTab = function (value) {

    if (value === 'uploadData') {

      $rootScope.tabColor.uploadData = "uploadDataSetU";
      $rootScope.tabColor.selectAttribute = "";
      $rootScope.tabColor.trainModel = "";

    }

    else if (value === 'selectAtrribute') {

      $rootScope.tabColor.uploadData = "uploadDataSet";
      $rootScope.tabColor.selectAttribute = "attributeSelectionU";
      $rootScope.tabColor.trainModel = "";

    }

    else if (value === 'trainModel') {

      $rootScope.tabColor.uploadData = "uploadDataSet";
      $rootScope.tabColor.selectAttribute = "attributeSelection";
      $rootScope.tabColor.trainModel = "trainModelU";

    }

  }

});