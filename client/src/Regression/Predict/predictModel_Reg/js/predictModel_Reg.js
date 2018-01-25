var app = angular.module('MachineLearning');
app.controller('DynamicFormController_Reg', function ($scope, $log, $state, $rootScope, $http, $localStorage) {

    $scope.keys = [];
    $scope.values = {};
    $scope.chartkeys = [];
    $scope.chartvalues = [];
    $scope.key = [];
    $scope.toPredict=true;
    $scope.result = [];
    $scope.failFlag=false;
    $scope.attributes = {};
    $scope.data = {};
    $scope.predict = {};
    var modelName = "";
    // $scope.chartLikelyData = [];
    // $scope.chartClassifyData = [];
    $scope.result = [];

    $scope.loader = true;

    $scope.finalPredict = function (){

        $scope.toPredict=true;
        $scope.failFlag = false;
    }

    $scope.finalFail = function (){
        
                $scope.toPredict=false;
                $scope.flag = false;
            }


    $scope.showFail_Reg = function (){

        $scope.failFlag = true;


    }





    $scope.goBack_Reg = function () {
        $rootScope.predctTabColor_Reg.selectModal_Reg = "selectModalU_Reg";
        $rootScope.predctTabColor_Reg.predictModal_Reg = ""
        $state.go('regPredict.selectModel_Reg');
    }

    $http({
        url: '/dsw/getModel?model_id=' + $localStorage.modelId,
        method: 'GET'
    }).then(function (response) {
        //$scope.data = response.data.model.predictData;
        console.log(response.data);
        $scope.loader = false;
        if (response.data.status == true) {

            var jsonString = {};
            jsonString = JSON.stringify(eval('(' + response.data.model.predictData + ')'));
            jsonString = JSON.parse(jsonString);
            $scope.model = response.data.model;
            modelName = $scope.model.name;//response.data.model.name;
            console.log(jsonString);
            $scope.data = jsonString;

            $scope.display();
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


    $scope.hidePrediction = function (){

        $scope.flag=false;
    
    }




    $scope.display = function () {
        console.log("display called");
        for (var keys in $scope.data) {
            if (keys === "Result") {
                continue;
            } else {
                $scope.attributes = {
                    keys: keys,
                    values: $scope.data[keys]
                }
                $scope.result.push($scope.attributes);
            }


        }
    }

    $scope.flag = false;

    $scope.submitForm = function () {
        var predictBody = {}
        console.log("(((((())))))");
        console.log($scope.result);
        for (var index = 0; index < $scope.result.length; index++) {
            predictBody[$scope.result[index].keys] = $scope.result[index].values;
        }
        $scope.loader = true;
        // $scope.chartLikelyData = [];
        // $scope.chartClassifyData = [];
        console.log($scope.data);
        $http({
            url: '/dsw/predict?modelName=' + $scope.model.name,
            method: 'POST',
            data: predictBody,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic c3BhbmRhbmFiOnNwYW5kYW5hYg==' }
        }).then(function (response) {
            $scope.loader = false;
            console.log(response.data.status);
            if (response.data.status) {
                $scope.predict = response.data.body;
                $scope.highchart();

                console.log($scope.predict);
                // for (var i = 0; i < response.data.body.Likely.length; i++) {

                //     $scope.chartLikelyData.push(response.data.body.Likely[i].LikelyResult);
                //     $scope.chartClassifyData.push(response.data.body.Likely[i].classification);
                //     console.log($scope.chartLikelyData);
                //     console.log($scope.chartClassifyData);
                //     $scope.highchart();

                // }

                $scope.flag = true;
            }
            else {
                toastr.options.timeOut = 8000;
                toastr.error(response.data.msg);
                console.log(response.data.msg);
            }
        }, function (err) {
            $scope.loader = false;
            toastr.options.timeOut = 8000;
            toastr.error(err.data);
            console.log(err); // *****************************************************************************
        });
    }

    // console.log($scope.chartLikelyData);
    // console.log($scope.chartClassifyData);
    $scope.highchart = function () {
        // console.log($scope.chartLikelyData);
        Highcharts.chart('container1', {

            credits: {
                enabled: false
            },

            exporting: {
                enabled: false
            },

            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: null
            },
            title: {
                text: 'Prediction:<br> '+$scope.predict.Result,
                align: 'center',
                verticalAlign: 'middle',
                y: 10
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -130,
                    endAngle: 130,
                    center: ['50%', '50%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Precision Percentage',
                innerSize: '50%',
                data: [
                    ['True', $scope.predict.precision_true],
                    ['False', $scope.predict.precision_false],
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.01,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        })

    }




    $(document).ready(function() {
        var title = {
           text: null   
        };
        var subtitle = {
           text: null
        };
        var xAxis = {
           categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        var yAxis = {
           title: {
              text: null
           },
           plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
           }]
        };   
        var tooltip = {
           valueSuffix: '\xB0C'
        }
        var legend = {
           layout: 'vertical',
           align: 'right',
           verticalAlign: 'middle',
           borderWidth: 0
        };
        var series =  [{
              name: null,
              data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,
                 26.5, 23.3, 18.3, 13.9, 9.6]
           }
        ];

        var json = {};
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;
        
        $('#container').highcharts(json);
     });























});