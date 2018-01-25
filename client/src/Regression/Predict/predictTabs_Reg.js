

var app = angular.module('MachineLearning');
app.controller('PredictTabController_Reg', function ($scope, $window, $rootScope, $state) {

 $rootScope.activeMenu.class = "regPredict";
    function onload() {
      $state.go('regPredict.selectModel_Reg');

    } onload();


    $rootScope.predctTabColor_Reg = {"selectModal_Reg":"", "predictModal_Reg":""};


      $scope.changeTab_Reg = function (value) {

    if (value === 'selectModal_Reg') {

      $rootScope.predctTabColor_Reg.selectModal_Reg = "selectModalU_Reg";
      $rootScope.predctTabColor_Reg.predictModal_Reg = "";
    

    }

    else if (value === 'predictModal_Reg') {

      $rootScope.predctTabColor_Reg.selectModal_Reg = "selectModal_Reg";
      $rootScope.predctTabColor_Reg.predictModal_Reg = "predictModalU_Reg";
    

    }

  }
    
 
});