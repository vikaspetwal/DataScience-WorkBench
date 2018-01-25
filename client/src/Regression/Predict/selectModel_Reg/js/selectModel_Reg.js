var app = angular.module('MachineLearning');
app.controller('machineController_Reg', function ($scope, $state, $http, $rootScope, $localStorage, $location) {
	
	//$scope.started = false;
	$rootScope.predctTabColor_Reg.selectModal_Reg = "selectModalU_Reg";

	$scope.loader=true;
	$scope.selectedModel={};
	$scope.user={};
	
	$http({

		url: '/dsw/getTrainedModels',
		dataType: 'json',
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	}).then(function (response) {
		  $scope.loader=false;
		if (response.data.status == true) {
			console.log(response.data.models);
			$scope.modelDetails = response.data.models;
			
		} else {
			toastr.options.timeOut = 8000;
			toastr.error(response.data.msg);
		}

		//    console.log(response.data.models[0]);
		//    console.log($scope.modelDetails);

	}, function (err) {
		 $scope.loader=false;
		toastr.options.timeOut = 8000;
		toastr.error(err);
		console.log(err); // *****************************************************************************
	});

	$scope.nextDisable = true;
	$scope.IsHidden = true;
	$scope.IsHiddenPanel = false;
	/*$scope.ShowHide = function () {
		$scope.IsHidden = false;
	}*/
	$scope.PanelShowHide = function () {

	}

	$scope.deleteModel =  function(model){

		$scope.selectedModel=model;

	}

	$scope.removeModel =  function(id){

		$scope.loader=true;
		console.log(id);
		$scope.user.name=$scope.selectedModel.name;
		$http({

		url: '/dsw/remove?id='+id,
		method: 'POST',
		data:$scope.user,
		headers: { 'Content-Type': 'application/json' }
	}).then(function (response) {
		  $scope.loader=false;
		if (response.data.status == true) {
			toastr.options.timeOut = 8000;
			toastr.success("Model deleted successfully!!");
			setTimeout(function () {
				 location.reload();
    		}, 1000);
                   
               
			
		} else {
			toastr.options.timeOut = 8000;
			toastr.error(response.data.msg);
		}

		//    console.log(response.data.models[0]);
		//    console.log($scope.modelDetails);

	}, function (err) {
		 $scope.loader=false;
		toastr.options.timeOut = 8000;
		toastr.error(err.data);
		console.log(err); // *****************************************************************************
	});

	}

	$scope.applyCss = function (index,  modelID) {
		$scope.id = index;
		$scope.trainModalDisable = false;
		$scope.IsHiddenPanel = true;
		$scope.nextDisable = false;
		$scope.IsHidden = false;
		$scope.resArray = [];
		var modelStruct = $scope.modelDetails;
		for (var model in modelStruct) {
			if (modelID === modelStruct[model]._id) {
				$scope.resArray.push(modelStruct[model]);
				break;
			}
		}
		console.log("here");
		console.log($scope.resArray);
	};

	$scope.goNext = function () {

		$localStorage.modelId = $scope.resArray[0]._id;
		$rootScope.predctTabColor_Reg.predictModal_Reg = "predictModalU_Reg"
		$rootScope.predctTabColor_Reg.selectModal_Reg = "selectModal_Reg";
		$state.go('regPredict.predictModel_Reg');
	}

});