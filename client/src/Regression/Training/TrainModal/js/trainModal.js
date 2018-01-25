var app = angular.module('MachineLearning');

app.controller('TrainModalCtrl', ['$scope', '$rootScope', '$state', '$http', '$localStorage', function ($scope, $rootScope, $state, $http, $localStorage) {


    $scope.linearflag = false;
    $scope.nlinearflag = false;
    $scope.loader = true;
    $scope.goBack = function () {
        alert([linear.body.graphData[0].originalData[0],linear.body.graphData[0].originalData[1]]);
        $rootScope.tabColor.trainModel = "";
        $rootScope.tabColor.selectAttribute = "attributeSelectionU";
        $state.go('regTraining.attReg');
    }

 
    
$scope.degreeArray= ['1', '2', '3', '4','5'];

    $scope.modelName = '';
    $scope.message = true;
    $scope.message1 = false;
    $scope.selectedDegree=1;


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


    $scope.showScatterGraph = function (){
        if($scope.id == 0)
            {
            $scope.linearflag = true;
            $scope.nlinearflag = false;
            }
        else
            {
            $scope.nlinearflag = true;
            $scope.linearflag = false;    
            }
    }

    $scope.selectDegree = function (a) {

        console.log(a);

        $scope.selectedDegree=a;

        console.log($scope.selectedDegree);
    }

    $http({
        method: "GET",
        url: "/regression/getRegTypes"
    }).then(function (response) {
        //console.log(response.data);
        $scope.loader = false;
        if (response.data.status == true) {
            $scope.classifiers = response.data.regtypes;
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

            url: '/regression/getTrainedModels',
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
            url: "/regression/trainModel?regressionType=" + selectedClassifierName + "&userId=" + $localStorage.userId

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
            url: "/regression/save?modelName=" + $scope.modelName + '&userId=' + $localStorage.userId,
            data: $scope.trainedModel,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            //console.log(response.data);
            $scope.loader = false;
            if (response.data.status == true) {
                 $state.go('regPredict.selectModel_Reg');
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
                    if ($scope.modelName === $scope.existedModels[index].name) {
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


    var degreeDataJson = {
        "status": true,
        "body": {
            "totalNumberOfAttributes": 4,
            "rowData": [
                10,
                199.8,
                2.6,
                21.2,
                10.6
            ],
            "totalNumberOfRows": 10,
            "numberOfAttributesUsed": 4,
            "regression": "Nonlinear",
            "columnData": [
                "Index",
                "TV",
                "radio",
                "newspaper",
                "Result"
            ],
            "Filename": "Advertisingsmall.csv",
            "graphData": [{
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "originalData": [
                        [
                            1,
                            22.1
                        ],
                        [
                            2,
                            10.4
                        ],
                        [
                            3,
                            9.3
                        ],
                        [
                            4,
                            18.5
                        ],
                        [
                            5,
                            12.9
                        ],
                        [
                            6,
                            7.2
                        ],
                        [
                            7,
                            11.8
                        ],
                        [
                            8,
                            13.2
                        ],
                        [
                            9,
                            4.8
                        ],
                        [
                            10,
                            10.6
                        ]
                    ],
                    "originalcolor": "rgba(0,0,255,.5)",
                    "name": "Index",
                    "predictedData": [{
                            "degreeData": [
                                [
                                    1,
                                    21.628573619301225
                                ],
                                [
                                    2,
                                    12.521403151008474
                                ],
                                [
                                    3,
                                    9.471547566531175
                                ],
                                [
                                    4,
                                    16.993239462657904
                                ],
                                [
                                    5,
                                    12.358255604515369
                                ],
                                [
                                    6,
                                    7.435325221745103
                                ],
                                [
                                    7,
                                    11.313852269274324
                                ],
                                [
                                    8,
                                    13.034408180366825
                                ],
                                [
                                    9,
                                    3.4683903984415316
                                ],
                                [
                                    10,
                                    12.575004526158041
                                ]
                            ],
                            "degree": 1,
                            "Accuracy": 94.29237903036477
                        },
                        {
                            "degreeData": [
                                [
                                    1,
                                    22.099999999999913
                                ],
                                [
                                    2,
                                    10.400000000000038
                                ],
                                [
                                    3,
                                    9.30000000000005
                                ],
                                [
                                    4,
                                    18.500000000000007
                                ],
                                [
                                    5,
                                    12.899999999999878
                                ],
                                [
                                    6,
                                    7.200000000000055
                                ],
                                [
                                    7,
                                    11.800000000000045
                                ],
                                [
                                    8,
                                    13.200000000000035
                                ],
                                [
                                    9,
                                    4.800000000000019
                                ],
                                [
                                    10,
                                    10.599999999999943
                                ]
                            ],
                            "degree": 2,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    1,
                                    22.099999999999902
                                ],
                                [
                                    2,
                                    10.400000000000036
                                ],
                                [
                                    3,
                                    9.300000000000036
                                ],
                                [
                                    4,
                                    18.499999999999993
                                ],
                                [
                                    5,
                                    12.899999999999974
                                ],
                                [
                                    6,
                                    7.200000000000035
                                ],
                                [
                                    7,
                                    11.80000000000004
                                ],
                                [
                                    8,
                                    13.200000000000017
                                ],
                                [
                                    9,
                                    4.800000000000042
                                ],
                                [
                                    10,
                                    10.599999999999948
                                ]
                            ],
                            "degree": 3,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    1,
                                    22.100000000000023
                                ],
                                [
                                    2,
                                    10.400000000000011
                                ],
                                [
                                    3,
                                    9.30000000000002
                                ],
                                [
                                    4,
                                    18.5
                                ],
                                [
                                    5,
                                    12.900000000000036
                                ],
                                [
                                    6,
                                    7.200000000000012
                                ],
                                [
                                    7,
                                    11.800000000000018
                                ],
                                [
                                    8,
                                    13.200000000000015
                                ],
                                [
                                    9,
                                    4.800000000000024
                                ],
                                [
                                    10,
                                    10.600000000000025
                                ]
                            ],
                            "degree": 4,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    1,
                                    22.100000000000207
                                ],
                                [
                                    2,
                                    10.399999999999892
                                ],
                                [
                                    3,
                                    9.299999999999889
                                ],
                                [
                                    4,
                                    18.500000000000014
                                ],
                                [
                                    5,
                                    12.90000000000005
                                ],
                                [
                                    6,
                                    7.199999999999889
                                ],
                                [
                                    7,
                                    11.799999999999882
                                ],
                                [
                                    8,
                                    13.19999999999994
                                ],
                                [
                                    9,
                                    4.799999999999886
                                ],
                                [
                                    10,
                                    10.600000000000039
                                ]
                            ],
                            "degree": 5,
                            "Accuracy": 100
                        }
                    ]
                },
                {
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "originalData": [
                        [
                            230.1,
                            22.1
                        ],
                        [
                            44.5,
                            10.4
                        ],
                        [
                            17.2,
                            9.3
                        ],
                        [
                            151.5,
                            18.5
                        ],
                        [
                            180.8,
                            12.9
                        ],
                        [
                            8.7,
                            7.2
                        ],
                        [
                            57.5,
                            11.8
                        ],
                        [
                            120.2,
                            13.2
                        ],
                        [
                            8.6,
                            4.8
                        ],
                        [
                            199.8,
                            10.6
                        ]
                    ],
                    "originalcolor": "rgba(0,0,255,.5)",
                    "name": "TV",
                    "predictedData": [{
                            "degreeData": [
                                [
                                    230.1,
                                    21.628573619301225
                                ],
                                [
                                    44.5,
                                    12.521403151008474
                                ],
                                [
                                    17.2,
                                    9.471547566531175
                                ],
                                [
                                    151.5,
                                    16.993239462657904
                                ],
                                [
                                    180.8,
                                    12.358255604515369
                                ],
                                [
                                    8.7,
                                    7.435325221745103
                                ],
                                [
                                    57.5,
                                    11.313852269274324
                                ],
                                [
                                    120.2,
                                    13.034408180366825
                                ],
                                [
                                    8.6,
                                    3.4683903984415316
                                ],
                                [
                                    199.8,
                                    12.575004526158041
                                ]
                            ],
                            "degree": 1,
                            "Accuracy": 94.29237903036477
                        },
                        {
                            "degreeData": [
                                [
                                    230.1,
                                    22.099999999999913
                                ],
                                [
                                    44.5,
                                    10.400000000000038
                                ],
                                [
                                    17.2,
                                    9.30000000000005
                                ],
                                [
                                    151.5,
                                    18.500000000000007
                                ],
                                [
                                    180.8,
                                    12.899999999999878
                                ],
                                [
                                    8.7,
                                    7.200000000000055
                                ],
                                [
                                    57.5,
                                    11.800000000000045
                                ],
                                [
                                    120.2,
                                    13.200000000000035
                                ],
                                [
                                    8.6,
                                    4.800000000000019
                                ],
                                [
                                    199.8,
                                    10.599999999999943
                                ]
                            ],
                            "degree": 2,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    230.1,
                                    22.099999999999902
                                ],
                                [
                                    44.5,
                                    10.400000000000036
                                ],
                                [
                                    17.2,
                                    9.300000000000036
                                ],
                                [
                                    151.5,
                                    18.499999999999993
                                ],
                                [
                                    180.8,
                                    12.899999999999974
                                ],
                                [
                                    8.7,
                                    7.200000000000035
                                ],
                                [
                                    57.5,
                                    11.80000000000004
                                ],
                                [
                                    120.2,
                                    13.200000000000017
                                ],
                                [
                                    8.6,
                                    4.800000000000042
                                ],
                                [
                                    199.8,
                                    10.599999999999948
                                ]
                            ],
                            "degree": 3,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    230.1,
                                    22.100000000000023
                                ],
                                [
                                    44.5,
                                    10.400000000000011
                                ],
                                [
                                    17.2,
                                    9.30000000000002
                                ],
                                [
                                    151.5,
                                    18.5
                                ],
                                [
                                    180.8,
                                    12.900000000000036
                                ],
                                [
                                    8.7,
                                    7.200000000000012
                                ],
                                [
                                    57.5,
                                    11.800000000000018
                                ],
                                [
                                    120.2,
                                    13.200000000000015
                                ],
                                [
                                    8.6,
                                    4.800000000000024
                                ],
                                [
                                    199.8,
                                    10.600000000000025
                                ]
                            ],
                            "degree": 4,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    230.1,
                                    22.100000000000207
                                ],
                                [
                                    44.5,
                                    10.399999999999892
                                ],
                                [
                                    17.2,
                                    9.299999999999889
                                ],
                                [
                                    151.5,
                                    18.500000000000014
                                ],
                                [
                                    180.8,
                                    12.90000000000005
                                ],
                                [
                                    8.7,
                                    7.199999999999889
                                ],
                                [
                                    57.5,
                                    11.799999999999882
                                ],
                                [
                                    120.2,
                                    13.19999999999994
                                ],
                                [
                                    8.6,
                                    4.799999999999886
                                ],
                                [
                                    199.8,
                                    10.600000000000039
                                ]
                            ],
                            "degree": 5,
                            "Accuracy": 100
                        }
                    ]
                },
                {
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "originalData": [
                        [
                            37.8,
                            22.1
                        ],
                        [
                            39.3,
                            10.4
                        ],
                        [
                            45.9,
                            9.3
                        ],
                        [
                            41.3,
                            18.5
                        ],
                        [
                            10.8,
                            12.9
                        ],
                        [
                            48.9,
                            7.2
                        ],
                        [
                            32.8,
                            11.8
                        ],
                        [
                            19.6,
                            13.2
                        ],
                        [
                            2.1,
                            4.8
                        ],
                        [
                            2.6,
                            10.6
                        ]
                    ],
                    "originalcolor": "rgba(0,0,255,.5)",
                    "name": "radio",
                    "predictedData": [{
                            "degreeData": [
                                [
                                    37.8,
                                    21.628573619301225
                                ],
                                [
                                    39.3,
                                    12.521403151008474
                                ],
                                [
                                    45.9,
                                    9.471547566531175
                                ],
                                [
                                    41.3,
                                    16.993239462657904
                                ],
                                [
                                    10.8,
                                    12.358255604515369
                                ],
                                [
                                    48.9,
                                    7.435325221745103
                                ],
                                [
                                    32.8,
                                    11.313852269274324
                                ],
                                [
                                    19.6,
                                    13.034408180366825
                                ],
                                [
                                    2.1,
                                    3.4683903984415316
                                ],
                                [
                                    2.6,
                                    12.575004526158041
                                ]
                            ],
                            "degree": 1,
                            "Accuracy": 94.29237903036477
                        },
                        {
                            "degreeData": [
                                [
                                    37.8,
                                    22.099999999999913
                                ],
                                [
                                    39.3,
                                    10.400000000000038
                                ],
                                [
                                    45.9,
                                    9.30000000000005
                                ],
                                [
                                    41.3,
                                    18.500000000000007
                                ],
                                [
                                    10.8,
                                    12.899999999999878
                                ],
                                [
                                    48.9,
                                    7.200000000000055
                                ],
                                [
                                    32.8,
                                    11.800000000000045
                                ],
                                [
                                    19.6,
                                    13.200000000000035
                                ],
                                [
                                    2.1,
                                    4.800000000000019
                                ],
                                [
                                    2.6,
                                    10.599999999999943
                                ]
                            ],
                            "degree": 2,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    37.8,
                                    22.099999999999902
                                ],
                                [
                                    39.3,
                                    10.400000000000036
                                ],
                                [
                                    45.9,
                                    9.300000000000036
                                ],
                                [
                                    41.3,
                                    18.499999999999993
                                ],
                                [
                                    10.8,
                                    12.899999999999974
                                ],
                                [
                                    48.9,
                                    7.200000000000035
                                ],
                                [
                                    32.8,
                                    11.80000000000004
                                ],
                                [
                                    19.6,
                                    13.200000000000017
                                ],
                                [
                                    2.1,
                                    4.800000000000042
                                ],
                                [
                                    2.6,
                                    10.599999999999948
                                ]
                            ],
                            "degree": 3,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    37.8,
                                    22.100000000000023
                                ],
                                [
                                    39.3,
                                    10.400000000000011
                                ],
                                [
                                    45.9,
                                    9.30000000000002
                                ],
                                [
                                    41.3,
                                    18.5
                                ],
                                [
                                    10.8,
                                    12.900000000000036
                                ],
                                [
                                    48.9,
                                    7.200000000000012
                                ],
                                [
                                    32.8,
                                    11.800000000000018
                                ],
                                [
                                    19.6,
                                    13.200000000000015
                                ],
                                [
                                    2.1,
                                    4.800000000000024
                                ],
                                [
                                    2.6,
                                    10.600000000000025
                                ]
                            ],
                            "degree": 4,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    37.8,
                                    22.100000000000207
                                ],
                                [
                                    39.3,
                                    10.399999999999892
                                ],
                                [
                                    45.9,
                                    9.299999999999889
                                ],
                                [
                                    41.3,
                                    18.500000000000014
                                ],
                                [
                                    10.8,
                                    12.90000000000005
                                ],
                                [
                                    48.9,
                                    7.199999999999889
                                ],
                                [
                                    32.8,
                                    11.799999999999882
                                ],
                                [
                                    19.6,
                                    13.19999999999994
                                ],
                                [
                                    2.1,
                                    4.799999999999886
                                ],
                                [
                                    2.6,
                                    10.600000000000039
                                ]
                            ],
                            "degree": 5,
                            "Accuracy": 100
                        }
                    ]
                },
                {
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "originalData": [
                        [
                            69.2,
                            22.1
                        ],
                        [
                            45.1,
                            10.4
                        ],
                        [
                            69.3,
                            9.3
                        ],
                        [
                            58.5,
                            18.5
                        ],
                        [
                            58.4,
                            12.9
                        ],
                        [
                            75,
                            7.2
                        ],
                        [
                            23.5,
                            11.8
                        ],
                        [
                            11.6,
                            13.2
                        ],
                        [
                            1,
                            4.8
                        ],
                        [
                            21.2,
                            10.6
                        ]
                    ],
                    "originalcolor": "rgba(0,0,255,.5)",
                    "name": "newspaper",
                    "predictedData": [{
                            "degreeData": [
                                [
                                    69.2,
                                    21.628573619301225
                                ],
                                [
                                    45.1,
                                    12.521403151008474
                                ],
                                [
                                    69.3,
                                    9.471547566531175
                                ],
                                [
                                    58.5,
                                    16.993239462657904
                                ],
                                [
                                    58.4,
                                    12.358255604515369
                                ],
                                [
                                    75,
                                    7.435325221745103
                                ],
                                [
                                    23.5,
                                    11.313852269274324
                                ],
                                [
                                    11.6,
                                    13.034408180366825
                                ],
                                [
                                    1,
                                    3.4683903984415316
                                ],
                                [
                                    21.2,
                                    12.575004526158041
                                ]
                            ],
                            "degree": 1,
                            "Accuracy": 94.29237903036477
                        },
                        {
                            "degreeData": [
                                [
                                    69.2,
                                    22.099999999999913
                                ],
                                [
                                    45.1,
                                    10.400000000000038
                                ],
                                [
                                    69.3,
                                    9.30000000000005
                                ],
                                [
                                    58.5,
                                    18.500000000000007
                                ],
                                [
                                    58.4,
                                    12.899999999999878
                                ],
                                [
                                    75,
                                    7.200000000000055
                                ],
                                [
                                    23.5,
                                    11.800000000000045
                                ],
                                [
                                    11.6,
                                    13.200000000000035
                                ],
                                [
                                    1,
                                    4.800000000000019
                                ],
                                [
                                    21.2,
                                    10.599999999999943
                                ]
                            ],
                            "degree": 2,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    69.2,
                                    22.099999999999902
                                ],
                                [
                                    45.1,
                                    10.400000000000036
                                ],
                                [
                                    69.3,
                                    9.300000000000036
                                ],
                                [
                                    58.5,
                                    18.499999999999993
                                ],
                                [
                                    58.4,
                                    12.899999999999974
                                ],
                                [
                                    75,
                                    7.200000000000035
                                ],
                                [
                                    23.5,
                                    11.80000000000004
                                ],
                                [
                                    11.6,
                                    13.200000000000017
                                ],
                                [
                                    1,
                                    4.800000000000042
                                ],
                                [
                                    21.2,
                                    10.599999999999948
                                ]
                            ],
                            "degree": 3,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    69.2,
                                    22.100000000000023
                                ],
                                [
                                    45.1,
                                    10.400000000000011
                                ],
                                [
                                    69.3,
                                    9.30000000000002
                                ],
                                [
                                    58.5,
                                    18.5
                                ],
                                [
                                    58.4,
                                    12.900000000000036
                                ],
                                [
                                    75,
                                    7.200000000000012
                                ],
                                [
                                    23.5,
                                    11.800000000000018
                                ],
                                [
                                    11.6,
                                    13.200000000000015
                                ],
                                [
                                    1,
                                    4.800000000000024
                                ],
                                [
                                    21.2,
                                    10.600000000000025
                                ]
                            ],
                            "degree": 4,
                            "Accuracy": 100
                        },
                        {
                            "degreeData": [
                                [
                                    69.2,
                                    22.100000000000207
                                ],
                                [
                                    45.1,
                                    10.399999999999892
                                ],
                                [
                                    69.3,
                                    9.299999999999889
                                ],
                                [
                                    58.5,
                                    18.500000000000014
                                ],
                                [
                                    58.4,
                                    12.90000000000005
                                ],
                                [
                                    75,
                                    7.199999999999889
                                ],
                                [
                                    23.5,
                                    11.799999999999882
                                ],
                                [
                                    11.6,
                                    13.19999999999994
                                ],
                                [
                                    1,
                                    4.799999999999886
                                ],
                                [
                                    21.2,
                                    10.600000000000039
                                ]
                            ],
                            "degree": 5,
                            "Accuracy": 100
                        }
                    ]
                }
            ],
            "accuracy": 100,
            "predictData": {
                "Index": 10,
                "TV": 199.8,
                "radio": 2.6,
                "newspaper": 21.2,
                "Result": 10.6
            }
        }
    }


    



    var linear = {
        "status": true,
        "body": {
            "totalNumberOfAttributes": 4,
            "rowData": [
                10,
                199.8,
                2.6,
                21.2,
                10.6
            ],
            "totalNumberOfRows": 10,
            "numberOfAttributesUsed": 4,
            "regression": "Linear",
            "columnData": [
                "Index",
                "TV",
                "radio",
                "newspaper",
                "Result"
            ],
            "Filename": "Advertisingsmall.csv",
            "graphData": [
                {
                    "originalData": [
                        [
                            1,
                            22.1
                        ],
                        [
                            2,
                            10.4
                        ],
                        [
                            3,
                            9.3
                        ],
                        [
                            4,
                            18.5
                        ],
                        [
                            5,
                            12.9
                        ],
                        [
                            6,
                            7.2
                        ],
                        [
                            7,
                            11.8
                        ],
                        [
                            8,
                            13.2
                        ],
                        [
                            9,
                            4.8
                        ],
                        [
                            10,
                            10.6
                        ]
                    ],
                    "name": "Index",
                    "originalcolor": "rgba(0,0,255,.5)",
                    "failureXData": [
                        [
                            0
                        ],
                        [
                            1
                        ],
                        [
                            2
                        ],
                        [
                            3
                        ],
                        [
                            4
                        ],
                        [
                            5
                        ],
                        [
                            6
                        ],
                        [
                            7
                        ],
                        [
                            8
                        ],
                        [
                            9
                        ]
                    ],
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "predictedData": [
                        [
                            1,
                            21.628573619301225
                        ],
                        [
                            2,
                            12.521403151008474
                        ],
                        [
                            3,
                            9.471547566531175
                        ],
                        [
                            4,
                            16.993239462657904
                        ],
                        [
                            5,
                            12.358255604515369
                        ],
                        [
                            6,
                            7.435325221745103
                        ],
                        [
                            7,
                            11.313852269274324
                        ],
                        [
                            8,
                            13.034408180366825
                        ],
                        [
                            9,
                            3.4683903984415316
                        ],
                        [
                            10,
                            12.575004526158041
                        ]
                    ]
                },
                {
                    "originalData": [
                        [
                            230.1,
                            22.1
                        ],
                        [
                            44.5,
                            10.4
                        ],
                        [
                            17.2,
                            9.3
                        ],
                        [
                            151.5,
                            18.5
                        ],
                        [
                            180.8,
                            12.9
                        ],
                        [
                            8.7,
                            7.2
                        ],
                        [
                            57.5,
                            11.8
                        ],
                        [
                            120.2,
                            13.2
                        ],
                        [
                            8.6,
                            4.8
                        ],
                        [
                            199.8,
                            10.6
                        ]
                    ],
                    "name": "TV",
                    "originalcolor": "rgba(0,0,255,.5)",
                    "failureXData": [
                        [
                            0
                        ],
                        [
                            1
                        ],
                        [
                            2
                        ],
                        [
                            3
                        ],
                        [
                            4
                        ],
                        [
                            5
                        ],
                        [
                            6
                        ],
                        [
                            7
                        ],
                        [
                            8
                        ],
                        [
                            9
                        ]
                    ],
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "predictedData": [
                        [
                            230.1,
                            21.628573619301225
                        ],
                        [
                            44.5,
                            12.521403151008474
                        ],
                        [
                            17.2,
                            9.471547566531175
                        ],
                        [
                            151.5,
                            16.993239462657904
                        ],
                        [
                            180.8,
                            12.358255604515369
                        ],
                        [
                            8.7,
                            7.435325221745103
                        ],
                        [
                            57.5,
                            11.313852269274324
                        ],
                        [
                            120.2,
                            13.034408180366825
                        ],
                        [
                            8.6,
                            3.4683903984415316
                        ],
                        [
                            199.8,
                            12.575004526158041
                        ]
                    ]
                },
                {
                    "originalData": [
                        [
                            37.8,
                            22.1
                        ],
                        [
                            39.3,
                            10.4
                        ],
                        [
                            45.9,
                            9.3
                        ],
                        [
                            41.3,
                            18.5
                        ],
                        [
                            10.8,
                            12.9
                        ],
                        [
                            48.9,
                            7.2
                        ],
                        [
                            32.8,
                            11.8
                        ],
                        [
                            19.6,
                            13.2
                        ],
                        [
                            2.1,
                            4.8
                        ],
                        [
                            2.6,
                            10.6
                        ]
                    ],
                    "name": "radio",
                    "originalcolor": "rgba(0,0,255,.5)",
                    "failureXData": [
                        [
                            0
                        ],
                        [
                            1
                        ],
                        [
                            2
                        ],
                        [
                            3
                        ],
                        [
                            4
                        ],
                        [
                            5
                        ],
                        [
                            6
                        ],
                        [
                            7
                        ],
                        [
                            8
                        ],
                        [
                            9
                        ]
                    ],
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "predictedData": [
                        [
                            37.8,
                            21.628573619301225
                        ],
                        [
                            39.3,
                            12.521403151008474
                        ],
                        [
                            45.9,
                            9.471547566531175
                        ],
                        [
                            41.3,
                            16.993239462657904
                        ],
                        [
                            10.8,
                            12.358255604515369
                        ],
                        [
                            48.9,
                            7.435325221745103
                        ],
                        [
                            32.8,
                            11.313852269274324
                        ],
                        [
                            19.6,
                            13.034408180366825
                        ],
                        [
                            2.1,
                            3.4683903984415316
                        ],
                        [
                            2.6,
                            12.575004526158041
                        ]
                    ]
                },
                {
                    "originalData": [
                        [
                            69.2,
                            22.1
                        ],
                        [
                            45.1,
                            10.4
                        ],
                        [
                            69.3,
                            9.3
                        ],
                        [
                            58.5,
                            18.5
                        ],
                        [
                            58.4,
                            12.9
                        ],
                        [
                            75,
                            7.2
                        ],
                        [
                            23.5,
                            11.8
                        ],
                        [
                            11.6,
                            13.2
                        ],
                        [
                            1,
                            4.8
                        ],
                        [
                            21.2,
                            10.6
                        ]
                    ],
                    "name": "newspaper",
                    "originalcolor": "rgba(0,0,255,.5)",
                    "failureXData": [
                        [
                            0
                        ],
                        [
                            1
                        ],
                        [
                            2
                        ],
                        [
                            3
                        ],
                        [
                            4
                        ],
                        [
                            5
                        ],
                        [
                            6
                        ],
                        [
                            7
                        ],
                        [
                            8
                        ],
                        [
                            9
                        ]
                    ],
                    "predictedcolor": "rgba(255,0,0,.5)",
                    "predictedData": [
                        [
                            69.2,
                            21.628573619301225
                        ],
                        [
                            45.1,
                            12.521403151008474
                        ],
                        [
                            69.3,
                            9.471547566531175
                        ],
                        [
                            58.5,
                            16.993239462657904
                        ],
                        [
                            58.4,
                            12.358255604515369
                        ],
                        [
                            75,
                            7.435325221745103
                        ],
                        [
                            23.5,
                            11.313852269274324
                        ],
                        [
                            11.6,
                            13.034408180366825
                        ],
                        [
                            1,
                            3.4683903984415316
                        ],
                        [
                            21.2,
                            12.575004526158041
                        ]
                    ]
                }
            ],
            "accuracy": 94.29237903036477,
            "predictData": {
                "Index": 10,
                "TV": 199.8,
                "radio": 2.6,
                "newspaper": 21.2,
                "Result": 10.6
            }
        }
    }
    
    
    var sample = [{
        name: null,
        color: 'rgba(119,136,153, .5)',
        data: linear.body.graphData[0].originalData
         //data: [[37.8, 22.100000000000001], [39.3, 10.4], [45.9, 9.3000000000000007], [41.3, 18.5], [10.8, 12.9], [48.9, 7.2000000000000002], [32.8, 11.800000000000001], [19.6, 13.199999999999999], [2.1, 4.7999999999999998], [2.6, 10.6], [5.8, 8.5999999999999996], [24.0, 17.399999999999999], [35.1, 9.1999999999999993], [7.6, 9.6999999999999993], [32.9, 19.0], [47.7, 22.399999999999999], [36.6, 12.5], [39.6, 24.399999999999999], [20.5, 11.300000000000001], [23.9, 14.6], [27.7, 18.0], [5.1, 12.5], [15.9, 5.5999999999999996], [16.9, 15.5], [12.6, 9.6999999999999993], [3.5, 12.0], [29.3, 15.0], [16.7, 15.9], [27.1, 18.899999999999999], [16.0, 10.5], [28.3, 21.399999999999999], [17.4, 11.9], [1.5, 9.5999999999999996], [20.0, 17.399999999999999], [1.4, 9.5], [4.1, 12.800000000000001], [43.8, 25.399999999999999], [49.4, 14.699999999999999], [26.7, 10.1], [37.7, 21.5], [22.3, 16.600000000000001], [33.4, 17.100000000000001], [27.7, 20.699999999999999], [8.4, 12.9], [25.7, 8.5], [22.5, 14.9], [9.9, 10.6], [41.5, 23.199999999999999], [15.8, 14.800000000000001], [11.7, 9.6999999999999993], [3.1, 11.4], [9.6, 10.699999999999999], [41.7, 22.600000000000001], [46.2, 21.199999999999999], [28.8, 20.199999999999999], [49.4, 23.699999999999999], [28.1, 5.5], [19.2, 13.199999999999999], [49.6, 23.800000000000001], [29.5, 18.399999999999999], [2.0, 8.0999999999999996], [42.7, 24.199999999999999], [15.5, 15.699999999999999], [29.6, 14.0], [42.8, 18.0], [9.3, 9.3000000000000007], [24.6, 9.5], [14.5, 13.4], [27.5, 18.899999999999999], [43.9, 22.300000000000001], [30.6, 18.300000000000001], [14.3, 12.4], [33.0, 8.8000000000000007], [5.7, 11.0], [24.6, 17.0], [43.7, 8.6999999999999993], [1.6, 6.9000000000000004], [28.5, 14.199999999999999], [29.9, 5.2999999999999998], [7.7, 11.0], [26.7, 11.800000000000001], [4.1, 12.300000000000001], [20.3, 11.300000000000001], [44.5, 13.6], [43.0, 21.699999999999999], [18.4, 15.199999999999999], [27.5, 12.0], [40.6, 16.0], [25.5, 12.9], [47.8, 16.699999999999999], [4.9, 11.199999999999999], [1.5, 7.2999999999999998], [33.5, 19.399999999999999], [36.5, 22.199999999999999], [14.0, 11.5], [31.6, 16.899999999999999], [3.5, 11.699999999999999], [21.0, 15.5], [42.3, 25.399999999999999], [41.7, 17.199999999999999], [4.3, 11.699999999999999], [36.3, 23.800000000000001], [10.1, 14.800000000000001], [17.2, 14.699999999999999], [34.3, 20.699999999999999], [46.4, 19.199999999999999], [11.0, 7.2000000000000002], [0.3, 8.6999999999999993], [0.4, 5.2999999999999998], [26.9, 19.800000000000001], [8.2, 13.4], [38.0, 21.800000000000001], [15.4, 14.1], [20.6, 15.9], [46.8, 14.6], [35.0, 12.6], [14.3, 12.199999999999999], [0.8, 9.4000000000000004], [36.9, 15.9], [16.0, 6.5999999999999996], [26.8, 15.5], [21.7, 7.0], [2.4, 11.6], [34.6, 15.199999999999999], [32.3, 19.699999999999999], [11.8, 10.6], [38.9, 6.5999999999999996], [0.0, 8.8000000000000007], [49.0, 24.699999999999999], [12.0, 9.6999999999999993], [39.6, 1.6000000000000001], [2.9, 12.699999999999999], [27.2, 5.7000000000000002], [33.5, 19.600000000000001], [38.6, 10.800000000000001], [47.0, 11.6], [39.0, 9.5], [28.9, 20.800000000000001], [25.9, 9.5999999999999996], [43.9, 20.699999999999999], [17.0, 10.9], [35.4, 19.199999999999999], [33.2, 20.100000000000001], [5.7, 10.4], [14.8, 11.4], [1.9, 10.300000000000001], [7.3, 13.199999999999999], [49.0, 25.399999999999999], [40.3, 10.9], [25.8, 10.1], [13.9, 16.100000000000001], [8.4, 11.6], [23.3, 16.600000000000001], [39.7, 19.0], [21.1, 15.6], [11.6, 3.2000000000000002], [43.5, 15.300000000000001], [1.3, 10.1], [36.9, 7.2999999999999998], [18.4, 12.9], [18.1, 14.4], [35.8, 13.300000000000001], [18.1, 14.9], [36.8, 18.0], [14.7, 11.9], [3.4, 11.9], [37.6, 8.0], [5.2, 12.199999999999999], [23.6, 17.100000000000001], [10.6, 15.0], [11.6, 8.4000000000000004], [20.9, 14.5], [20.1, 7.5999999999999996], [7.1, 11.699999999999999], [3.4, 11.5], [48.9, 27.0], [30.2, 20.199999999999999], [7.8, 11.699999999999999], [2.3, 11.800000000000001], [10.0, 12.6], [2.6, 10.5], [5.4, 12.199999999999999], [5.7, 8.6999999999999993], [43.0, 26.199999999999999], [21.3, 17.600000000000001], [45.1, 22.600000000000001], [2.1, 10.300000000000001], [28.7, 17.300000000000001], [13.9, 15.9], [12.1, 6.7000000000000002], [41.1, 10.800000000000001], [10.8, 9.9000000000000004], [4.1, 5.9000000000000004], [42.0, 19.600000000000001], [35.6, 17.300000000000001], [3.7, 7.5999999999999996], [4.9, 9.6999999999999993], [9.3, 12.800000000000001], [42.0, 25.5], [8.6, 13.4]]
    }, {
        name: null,
        color: 'rgba(0, 100, 0, .5)',
        data: linear.body.graphData[0].predictedData
        //data: [[37.8, 16.965978707392502], [39.3, 17.269722382481163], [45.9, 18.606194552871266], [41.3, 17.674713949266042], [10.8, 11.498592555796632], [48.9, 19.213681903048581], [32.8, 15.953499790430303], [19.6, 13.280555449650102], [2.1, 9.7368792402824074], [2.6, 9.8381271319786272], [5.8, 10.486113638834434], [24.0, 14.171536896576836], [35.1, 16.419240092232918], [7.6, 10.850606048940826], [32.9, 15.973749368769548], [47.7, 18.970686962977659], [36.6, 16.722983767321576], [39.6, 17.330471117498895], [20.5, 13.462801654703297], [23.9, 14.151287318237591], [27.7, 14.920771295128862], [5.1, 10.344366590459725], [15.9, 12.531321051098075], [16.9, 12.733816834490513], [12.6, 11.863084965903024], [3.5, 10.020373337031822], [29.3, 15.244764548556766], [16.7, 12.693317677812026], [27.1, 14.799273825093399], [16.0, 12.551570629437318], [28.3, 15.042268765164327], [17.4, 12.835064726186733], [1.5, 9.6153817702469428], [20.0, 13.361553763007077], [1.4, 9.5951321919076982], [4.1, 10.141870807067287], [43.8, 18.18095340774714], [49.4, 19.314929794744803], [26.7, 14.718275511736422], [37.7, 16.945729129053259], [22.3, 13.827294064809688], [33.4, 16.074997260465768], [27.7, 14.920771295128862], [8.4, 11.012602675654776], [25.7, 14.515779728343983], [22.5, 13.867793221488176], [9.9, 11.316346350743437], [41.5, 17.715213105944528], [15.8, 12.511071472758831], [11.7, 11.680838760849827], [3.1, 9.939375023674847], [9.6, 11.255597615725705], [41.7, 17.755712262623021], [46.2, 18.666943287888998], [28.8, 15.143516656860546], [49.4, 19.314929794744803], [28.1, 15.001769608485839], [19.2, 13.199557136293125], [49.6, 19.355428951423292], [29.5, 15.285263705235254], [2.0, 9.7166296619431627], [42.7, 17.958208046015457], [15.5, 12.450322737741098], [29.6, 15.305513283574498], [42.8, 17.9784576243547], [9.3, 11.194848880707973], [24.6, 14.2930343666123], [14.5, 12.247826954348659], [27.5, 14.880272138450374], [43.9, 18.201202986086386], [30.6, 15.508009066966938], [14.3, 12.207327797670171], [33.0, 15.993998947108793], [5.7, 10.465864060495189], [24.6, 14.2930343666123], [43.7, 18.1607038294079], [1.6, 9.6356313485861875], [28.5, 15.082767921842814], [29.9, 15.366262018592229], [7.7, 10.870855627280068], [26.7, 14.718275511736422], [4.1, 10.141870807067287], [20.3, 13.422302498024809], [44.5, 18.322700456121851], [43.0, 18.018956781033189], [18.4, 13.037560509579173], [27.5, 14.880272138450374], [40.6, 17.532966900891335], [25.5, 14.475280571665495], [47.8, 18.990936541316898], [4.9, 10.303867433781237], [1.5, 9.6153817702469428], [33.5, 16.095246838805011], [36.5, 16.702734188982333], [14.0, 12.146579062652439], [31.6, 15.710504850359378], [3.5, 10.020373337031822], [21.0, 13.564049546399517], [42.3, 17.877209732658478], [41.7, 17.755712262623021], [4.3, 10.182369963745774], [36.3, 16.662235032303844], [10.1, 11.356845507421923], [17.2, 12.794565569508245], [34.3, 16.257243465518965], [46.4, 18.707442444567484], [11.0, 11.53909171247512], [0.3, 9.3723868301760156], [0.4, 9.3926364085152585], [26.9, 14.75877466841491], [8.2, 10.972103518976288], [38.0, 17.006477864070991], [15.4, 12.430073159401854], [20.6, 13.483051233042541], [46.8, 18.788440757924459], [35.0, 16.398990513893672], [14.3, 12.207327797670171], [0.8, 9.4736347218722354], [36.9, 16.783732502339305], [16.0, 12.551570629437318], [26.8, 14.738525090075667], [21.7, 13.705796594774224], [2.4, 9.7976279753001378], [34.6, 16.317992200536697], [32.3, 15.852251898734085], [11.8, 11.701088339189072], [38.9, 17.188724069124184], [0.0, 9.3116380951582833], [49.0, 19.233931481387827], [12.0, 11.741587495867559], [39.6, 17.330471117498895], [2.9, 9.8988758669963577], [27.2, 14.819523403432642], [33.5, 16.095246838805011], [38.6, 17.127975334106456], [47.0, 18.828939914602948], [39.0, 17.208973647463431], [28.9, 15.163766235199789], [25.9, 14.55627888502247], [43.9, 18.201202986086386], [17.0, 12.754066412829758], [35.4, 16.479988827250647], [33.2, 16.034498103787282], [5.7, 10.465864060495189], [14.8, 12.308575689366391], [1.9, 9.696380083603918], [7.3, 10.789857313923093], [49.0, 19.233931481387827], [40.3, 17.472218165873599], [25.8, 14.536029306683227], [13.9, 12.126329484313196], [8.4, 11.012602675654776], [23.3, 14.029789848202128], [39.7, 17.350720695838142], [21.1, 13.584299124738761], [11.6, 11.660589182510584], [43.5, 18.120204672729407], [1.3, 9.5748826135684553], [36.9, 16.783732502339305], [18.4, 13.037560509579173], [18.1, 12.976811774561442], [35.8, 16.560987140607622], [18.1, 12.976811774561442], [36.8, 16.763482924000062], [14.7, 12.288326111027146], [3.4, 10.000123758692578], [37.6, 16.925479550714016], [5.2, 10.364616168798969], [23.6, 14.09053858321986], [10.6, 11.458093399118145], [11.6, 11.660589182510584], [20.9, 13.543799968060272], [20.1, 13.381803341346322], [7.1, 10.749358157244604], [3.4, 10.000123758692578], [48.9, 19.213681903048581], [30.2, 15.427010753609961], [7.8, 10.891105205619313], [2.3, 9.7773783969608949], [10.0, 11.33659592908268], [2.6, 9.8381271319786272], [5.4, 10.405115325477457], [5.7, 10.465864060495189], [43.0, 18.018956781033189], [21.3, 13.624798281417249], [45.1, 18.444197926157315], [2.1, 9.7368792402824074], [28.7, 15.123267078521302], [13.9, 12.126329484313196], [12.1, 11.761837074206802], [41.1, 17.634214792587557], [10.8, 11.498592555796632], [4.1, 10.141870807067287], [42.0, 17.81646099764075], [35.6, 16.520487983929137], [3.7, 10.06087249371031], [4.9, 10.303867433781237], [9.3, 11.194848880707973], [42.0, 17.81646099764075], [8.6, 11.053101832333265]]
    }]


    Highcharts.chart('container5', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            title: {
                enabled: true,
                text: null
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: null
            }
        },
       plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: null,
                    pointFormat: '{point.x} , {point.y} '
                }
            }
        },
        series: [{
            name: null,
            color: 'rgba(119,136,153, .5)',
            data: degreeDataJson.body.graphData[0].originalData
            //data: [[37.8, 22.100000000000001], [39.3, 10.4], [45.9, 9.3000000000000007], [41.3, 18.5], [10.8, 12.9], [48.9, 7.2000000000000002], [32.8, 11.800000000000001], [19.6, 13.199999999999999], [2.1, 4.7999999999999998], [2.6, 10.6], [5.8, 8.5999999999999996], [24.0, 17.399999999999999], [35.1, 9.1999999999999993], [7.6, 9.6999999999999993], [32.9, 19.0], [47.7, 22.399999999999999], [36.6, 12.5], [39.6, 24.399999999999999], [20.5, 11.300000000000001], [23.9, 14.6], [27.7, 18.0], [5.1, 12.5], [15.9, 5.5999999999999996], [16.9, 15.5], [12.6, 9.6999999999999993], [3.5, 12.0], [29.3, 15.0], [16.7, 15.9], [27.1, 18.899999999999999], [16.0, 10.5], [28.3, 21.399999999999999], [17.4, 11.9], [1.5, 9.5999999999999996], [20.0, 17.399999999999999], [1.4, 9.5], [4.1, 12.800000000000001], [43.8, 25.399999999999999], [49.4, 14.699999999999999], [26.7, 10.1], [37.7, 21.5], [22.3, 16.600000000000001], [33.4, 17.100000000000001], [27.7, 20.699999999999999], [8.4, 12.9], [25.7, 8.5], [22.5, 14.9], [9.9, 10.6], [41.5, 23.199999999999999], [15.8, 14.800000000000001], [11.7, 9.6999999999999993], [3.1, 11.4], [9.6, 10.699999999999999], [41.7, 22.600000000000001], [46.2, 21.199999999999999], [28.8, 20.199999999999999], [49.4, 23.699999999999999], [28.1, 5.5], [19.2, 13.199999999999999], [49.6, 23.800000000000001], [29.5, 18.399999999999999], [2.0, 8.0999999999999996], [42.7, 24.199999999999999], [15.5, 15.699999999999999], [29.6, 14.0], [42.8, 18.0], [9.3, 9.3000000000000007], [24.6, 9.5], [14.5, 13.4], [27.5, 18.899999999999999], [43.9, 22.300000000000001], [30.6, 18.300000000000001], [14.3, 12.4], [33.0, 8.8000000000000007], [5.7, 11.0], [24.6, 17.0], [43.7, 8.6999999999999993], [1.6, 6.9000000000000004], [28.5, 14.199999999999999], [29.9, 5.2999999999999998], [7.7, 11.0], [26.7, 11.800000000000001], [4.1, 12.300000000000001], [20.3, 11.300000000000001], [44.5, 13.6], [43.0, 21.699999999999999], [18.4, 15.199999999999999], [27.5, 12.0], [40.6, 16.0], [25.5, 12.9], [47.8, 16.699999999999999], [4.9, 11.199999999999999], [1.5, 7.2999999999999998], [33.5, 19.399999999999999], [36.5, 22.199999999999999], [14.0, 11.5], [31.6, 16.899999999999999], [3.5, 11.699999999999999], [21.0, 15.5], [42.3, 25.399999999999999], [41.7, 17.199999999999999], [4.3, 11.699999999999999], [36.3, 23.800000000000001], [10.1, 14.800000000000001], [17.2, 14.699999999999999], [34.3, 20.699999999999999], [46.4, 19.199999999999999], [11.0, 7.2000000000000002], [0.3, 8.6999999999999993], [0.4, 5.2999999999999998], [26.9, 19.800000000000001], [8.2, 13.4], [38.0, 21.800000000000001], [15.4, 14.1], [20.6, 15.9], [46.8, 14.6], [35.0, 12.6], [14.3, 12.199999999999999], [0.8, 9.4000000000000004], [36.9, 15.9], [16.0, 6.5999999999999996], [26.8, 15.5], [21.7, 7.0], [2.4, 11.6], [34.6, 15.199999999999999], [32.3, 19.699999999999999], [11.8, 10.6], [38.9, 6.5999999999999996], [0.0, 8.8000000000000007], [49.0, 24.699999999999999], [12.0, 9.6999999999999993], [39.6, 1.6000000000000001], [2.9, 12.699999999999999], [27.2, 5.7000000000000002], [33.5, 19.600000000000001], [38.6, 10.800000000000001], [47.0, 11.6], [39.0, 9.5], [28.9, 20.800000000000001], [25.9, 9.5999999999999996], [43.9, 20.699999999999999], [17.0, 10.9], [35.4, 19.199999999999999], [33.2, 20.100000000000001], [5.7, 10.4], [14.8, 11.4], [1.9, 10.300000000000001], [7.3, 13.199999999999999], [49.0, 25.399999999999999], [40.3, 10.9], [25.8, 10.1], [13.9, 16.100000000000001], [8.4, 11.6], [23.3, 16.600000000000001], [39.7, 19.0], [21.1, 15.6], [11.6, 3.2000000000000002], [43.5, 15.300000000000001], [1.3, 10.1], [36.9, 7.2999999999999998], [18.4, 12.9], [18.1, 14.4], [35.8, 13.300000000000001], [18.1, 14.9], [36.8, 18.0], [14.7, 11.9], [3.4, 11.9], [37.6, 8.0], [5.2, 12.199999999999999], [23.6, 17.100000000000001], [10.6, 15.0], [11.6, 8.4000000000000004], [20.9, 14.5], [20.1, 7.5999999999999996], [7.1, 11.699999999999999], [3.4, 11.5], [48.9, 27.0], [30.2, 20.199999999999999], [7.8, 11.699999999999999], [2.3, 11.800000000000001], [10.0, 12.6], [2.6, 10.5], [5.4, 12.199999999999999], [5.7, 8.6999999999999993], [43.0, 26.199999999999999], [21.3, 17.600000000000001], [45.1, 22.600000000000001], [2.1, 10.300000000000001], [28.7, 17.300000000000001], [13.9, 15.9], [12.1, 6.7000000000000002], [41.1, 10.800000000000001], [10.8, 9.9000000000000004], [4.1, 5.9000000000000004], [42.0, 19.600000000000001], [35.6, 17.300000000000001], [3.7, 7.5999999999999996], [4.9, 9.6999999999999993], [9.3, 12.800000000000001], [42.0, 25.5], [8.6, 13.4]]
            
        }, {
            name: null,
            color: 'rgba(0, 100, 0, .5)',
            data: degreeDataJson.body.graphData[0].predictedData[0].degreeData
            //data: [[37.8, 16.710671325404114], [39.3, 16.927207214698633], [45.9, 18.578347343017903], [41.3, 17.260410361646159], [10.8, 11.636914745352268], [48.9, 20.312009198546768], [32.8, 15.965896327921641], [19.6, 13.132579219367518], [2.1, 9.6617648411503474], [2.6, 9.8693122677745393], [5.8, 10.817167534836358], [24.0, 14.126063539645155], [35.1, 16.327901562722772], [7.6, 11.161214976846708], [32.9, 15.982696041240253], [47.7, 19.499241816629784], [36.6, 16.542945250307845], [39.6, 16.972909137420508], [20.5, 13.327165636816135], [23.9, 14.10278739031212], [27.7, 14.970312924952569], [5.1, 10.654648801466973], [15.9, 12.413311471780789], [16.9, 12.593506568055602], [12.6, 11.890623550478086], [3.5, 10.195821764307922], [29.3, 15.310352791480419], [16.7, 12.556592813556998], [27.1, 14.837672876522237], [16.0, 12.430839406557197], [28.3, 15.100342224675309], [17.4, 12.687691201050896], [1.5, 9.3846775163329017], [20.0, 13.218275187321513], [1.4, 9.3352968191319334], [4.1, 10.384156419888511], [43.8, 17.839088279637032], [49.4, 20.707158904542972], [26.7, 14.747979546070656], [37.7, 16.696653124679337], [22.3, 13.732281643751215], [33.4, 16.065144683835534], [27.7, 14.970312924952569], [8.4, 11.290366699022128], [25.7, 14.520186284318235], [22.5, 13.778249198841017], [9.9, 11.51098110630141], [41.5, 17.298519317939871], [15.8, 12.395892133506608], [11.7, 11.762496875865459], [3.1, 10.057689363538154], [9.6, 11.468331799976006], [41.7, 17.337771850064492], [46.2, 18.71058929099609], [28.8, 15.206459616372314], [49.4, 20.707158904542972], [28.1, 15.057310948640321], [19.2, 13.048245564327241], [49.6, 20.875452253876567], [29.5, 15.351252301533904], [2.0, 9.6177868076489723], [42.7, 17.55388314781198], [15.5, 12.344281844878026], [29.6, 15.371556601993277], [42.8, 17.57755512837543], [9.3, 11.425107046952084], [24.6, 14.2656698740211], [14.5, 12.179075351129553], [27.5, 14.926371824449863], [43.9, 17.86798033392548], [30.6, 15.569041990594222], [14.3, 12.147241261113862], [33.0, 15.999391286721306], [5.7, 10.79512455628403], [24.6, 14.2656698740211], [43.7, 17.810730362644613], [1.6, 9.4331164148437718], [28.5, 15.143045370682138], [29.9, 15.431875492579756], [7.7, 11.177975813938275], [26.7, 14.747979546070656], [4.1, 10.384156419888511], [20.3, 13.283384415060526], [44.5, 18.053260033549712], [43.0, 17.626161526028817], [18.4, 12.884001298269734], [27.5, 14.926371824449863], [40.6, 17.135002384193733], [25.5, 14.474143679073784], [47.8, 19.560250899569063], [4.9, 10.604431843784692], [1.5, 9.3846775163329017], [33.5, 16.081331003824488], [36.5, 16.528905756280061], [14.0, 12.100199670067205], [31.6, 15.755946627047919], [3.5, 10.195821764307922], [21.0, 13.437833822664098], [42.3, 17.463150222944982], [41.7, 17.337771850064492], [4.3, 10.442328145684055], [36.3, 16.500739153014329], [10.1, 11.53916777806559], [17.2, 12.649693225881439], [34.3, 16.207382450130552], [46.4, 18.803107242193725], [11.0, 11.664740435555812], [0.3, 8.7249854027531626], [0.4, 8.7858811243868722], [26.9, 14.792943225771662], [8.2, 11.259061254817505], [38.0, 16.738794981595284], [15.4, 12.327292728442572], [20.6, 13.349163828598293], [46.8, 18.999189339513627], [35.0, 16.31310581174705], [14.3, 12.147241261113862], [0.8, 9.0182746895041568], [36.9, 16.584933004872646], [16.0, 12.430839406557197], [26.8, 14.770489709810033], [21.7, 13.595336764110193], [2.4, 9.7886995839871442], [34.6, 16.253175083186754], [32.3, 15.880307186039943], [11.8, 11.776560556494898], [38.9, 16.867825733706091], [0.0, 8.5352839463310417], [49.0, 20.388201451565088], [12.0, 11.804797899280349], [39.6, 16.972909137420508], [2.9, 9.9845195989531366], [27.2, 14.859945346448214], [33.5, 16.081331003824488], [38.6, 16.824234490846656], [47.0, 19.103023182864852], [39.0, 16.88252383463432], [28.9, 15.227421406128538], [25.9, 14.566089135645033], [43.9, 17.86798033392548], [17.0, 12.612126925042912], [35.4, 16.371877730585702], [33.2, 16.032471658119029], [5.7, 10.79512455628403], [14.8, 12.22756247690989], [1.9, 9.5729491291880038], [7.3, 11.109703954082821], [49.0, 20.388201451565088], [40.3, 17.084543439403582], [25.8, 14.543156205765975], [13.9, 12.084702406101041], [8.4, 11.290366699022128], [23.3, 13.963276167500855], [39.7, 16.988400502560999], [21.1, 13.460161810623562], [11.6, 11.748465224880778], [43.5, 17.755567674057865], [1.3, 9.2849573897029494], [36.9, 16.584933004872646], [18.4, 12.884001298269734], [18.1, 12.824023819411552], [35.8, 16.42965036080966], [18.1, 12.824023819411552], [36.8, 16.570955048528056], [14.7, 12.211300373709847], [3.4, 10.16227942398098], [37.6, 16.682657493941683], [5.2, 10.679093614632281], [23.6, 14.032987643522581], [10.6, 11.609074239175238], [11.6, 11.748465224880778], [20.9, 13.415568242886533], [20.1, 13.239901100368478], [7.1, 11.074257785571573], [3.4, 10.16227942398098], [48.9, 20.312009198546768], [30.2, 15.491284026822221], [7.8, 11.194545159413114], [2.3, 9.747205541919298], [10.0, 11.525095511885569], [2.6, 9.8693122677745393], [5.4, 10.726711877985675], [5.7, 10.79512455628403], [43.0, 17.626161526028817], [21.3, 13.504997700121955], [45.1, 18.261048153546021], [2.1, 9.6617648411503474], [28.7, 15.185408786892452], [13.9, 12.084702406101041], [12.1, 11.818978279529446], [41.1, 17.223372195121804], [10.8, 11.636914745352268], [4.1, 10.384156419888511], [42.0, 17.398959216334269], [35.6, 16.400878146890228], [3.7, 10.261007380242496], [4.9, 10.604431843784692], [9.3, 11.425107046952084], [42.0, 17.398959216334269], [8.6, 11.321113585914011]]
        }
       ]
    });
    


    Highcharts.chart('container1', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            title: {
                enabled: true,
                text: null
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: null
            }
        },
       plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: null,
                    pointFormat: '{point.x} , {point.y} '
                }
            }
        },
        series: sample
    });
    
    




//sample














}]);