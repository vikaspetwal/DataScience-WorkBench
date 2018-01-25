var app = angular.module('MachineLearning');
app.controller('machineController', function ($scope, $state, $http, $rootScope, $localStorage, $location) {
	
	//$scope.started = false;
	$rootScope.predctTabColor.selectModal = "selectModalU";

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
	});

	}

	$scope.applyCss = function (index,  modelID) {
		
		$scope.id = modelID;
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
	
	};

	$scope.goNext = function () {

		$localStorage.modelId = $scope.resArray[0]._id;
		$rootScope.predctTabColor.predictModal = "predictModalU"
		$rootScope.predctTabColor.selectModal = "selectModal";
		$state.go('predict.predictModal');
	}

});