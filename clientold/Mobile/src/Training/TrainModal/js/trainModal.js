var app = angular.module('MachineLearning');

app.controller('TrainModalCtrl', ['$scope', '$rootScope', '$state', '$http', '$localStorage', function ($scope, $rootScope, $state, $http, $localStorage) {

    $scope.loader = true;
    $scope.goBack = function () {
        $rootScope.tabColor.trainModel = "";
        $rootScope.tabColor.selectAttribute = "attributeSelectionU";
        $state.go('training.selectAttribute');
    }

    $scope.modelName = '';
    $scope.message = true;
    $scope.message1 = false;


    var selectedClassifierName = "";
    $scope.disabledModel = true;
    $scope.trainModalDisable = true;
    $scope.showAccuracy = true;
    $scope.cancelButton = false;

    $scope.applyCss = function (index, classifierName) {
        $scope.id = index;
        $scope.trainModalDisable = false;
        selectedClassifierName = classifierName;
    };

    $scope.cancelTraining = function () {
        $scope.showAccuracy = true;
        $scope.id = -999;
        $scope.cancelButton = false;

    }

    $http({
        method: "GET",
        url: "/dataset/getClassifiers"
    }).then(function (response) {
        //console.log(response.data);
        $scope.loader = false;
        if (response.data.status == true) {
            $scope.classifiers = response.data.classifiers;
            //console.log("HIIIIII" + $scope.attributeData);
            //$scope.showGraph();
            //console.log("This is the variable  " + $scope.attributeData);

        } else {

            toastr.options.timeOut = 8000;
            toastr.error(response.data.msg);
        }


    }, function (err) {
        $scope.loader = false;
        toastr.options.timeOut = 8000;
        toastr.error(err.data);
        console.log(err);
    });

    $scope.getModels = function () {
        $scope.loader = true;
        $http({

            url: '/dsw/getTrainedModels',
            dataType: 'json',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            $scope.loader = false;
            if (response.data.status == true) {
                console.log(response.data.models);
                $scope.existedModels = response.data.models;

            } else {
                toastr.options.timeOut = 8000;
                toastr.error(response.data.msg);
            }

            //    console.log(response.data.models[0]);
            //    console.log($scope.modelDetails);

        }, function (err) {
            $scope.loader = false;
            toastr.options.timeOut = 8000;
            toastr.error(err);
            console.log(err); // *****************************************************************************
        });
    }

    $scope.trainModel = function () {
        $scope.loader = true;
        $scope.disabledModel = true;
        $scope.trainModalDisable = true;
        $scope.cancelButton = true;

        $http({
            method: "GET",
            url: "/dataset/trainModel?classifier=" + selectedClassifierName + "&userId=" + $localStorage.userId

        }).then(function (response) {
            $scope.loader = false;
            //console.log(response.data);
            if (response.data.status == true) {
                $scope.trainedModel = response.data.body;
                console.log("%%%%%%%%");
                console.log($scope.trainedModel);

                $scope.showAccuracy = false;
                $scope.getModels();
                //console.log("HIIIIII" + $scope.attributeData);
                //$scope.showGraph();
                //console.log("This is the variable  " + $scope.attributeData);

            } else {
                $scope.showAccuracy = true;
                toastr.options.timeOut = 8000;
                toastr.error(response.data.msg);
            }


        }, function (err) {
            $scope.loader = false;
            $scope.showAccuracy = true;
            toastr.options.timeOut = 8000;
            toastr.error(err.data);
            console.log(err);
        });
    }

    $scope.saveModel = function () {

        $scope.loader = true;
        $http({
            method: "POST",
            url: "/dataset/save?modelName=" + $scope.modelName + '&userId=' + $localStorage.userId,
            data: $scope.trainedModel,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            //console.log(response.data);
            $scope.loader = false;
            if (response.data.status == true) {
                 $state.go('predict.selectModal');
                toastr.options.timeOut = 8000;
                toastr.success("Model saved successfully");


            } else {

                $scope.modelName = '';
                toastr.options.timeOut = 8000;
                toastr.error(response.data.msg);
            }


        }, function (err) {
            $scope.loader = false;
            toastr.options.timeOut = 8000;
            toastr.error(err.data);
            console.log(err);
        });



    }


    $scope.checkModel = function () {

        if ($scope.existedModels.length == 0) {
            $scope.message = false;
        } else {
            for (var index = 0; index < $scope.existedModels.length; index++) {
                if ($scope.modelName == '') {
                    $scope.message = true;
                    break;
                } else {
                    if ($scope.modelName.toLowerCase() === $scope.existedModels[index].name.toLowerCase()) {
                        $scope.message = true;
                        $scope.message1 = true;
                        break;
                    } else {
                        $scope.message = false;
                        $scope.message1 = false;
                    }
                }


            }
        }



    }

}]);