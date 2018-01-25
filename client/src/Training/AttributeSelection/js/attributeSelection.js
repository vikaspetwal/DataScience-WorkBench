var app = angular.module('MachineLearning');

app.controller('AttributeSelection', ['$scope', '$http', '$state', '$rootScope', '$localStorage', function ($scope, $http, $state, $rootScope, $localStorage) {


    $scope.loader = true;
    $scope.goBack = function () {
        $rootScope.tabColor.trainModel = "";
        $rootScope.tabColor.selectAttribute = "";
        $state.go('training.uploadCSV');
    }


    $scope.goNext = function () {
        
        $scope.chartData = $scope.chartDataPercentage;
        
        // $scope.chartData = $scope.chartDataScatter;
        // console.log($scope.chartData);
        $scope.sendChartDetails();
    }

    $http({
        method: "GET",
        url: "/dataset/getAttributes?Training=" + $localStorage.sliderFilterData.training + "&Testing=" + $localStorage.sliderFilterData.testing + "&file=" + $localStorage.file + "&userId=" + $localStorage.userId,
    }).then(function (response) {
        $scope.loader = false;
        //console.log(response.data);
        if (response.data.status == true) {
            $scope.attributeData = response.data.body;
            

            $scope.showGraphPercentage();
            $scope.showGraphScatter();
           // $scope.showGraphHistogram();
            //$scope.showGraphPercentage();
            //console.log($scope.attributeData);

        } else {

            toastr.options.timeOut = 8000;
            toastr.error(response.data.msg);
        }


    }, function (err) {
        $scope.loader = false;
        toastr.options.timeOut = 8000;
        toastr.error(err.data);
       
    });

    $scope.showGraphScatter = function () {

        $scope.chartDataScatter = [];
        $scope.FinalData = [];

        angular.forEach($scope.attributeData.data, function (value, key) {

            
            $scope.highChartOptions = {
                attributeName: value.attributeName,
                relevance: value.Relevance,
                relevenceValue: value.RelevanceValue,
                 rank:value.Rank,

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
                    backgroundColor: null,
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {

                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: ''
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true
                },
                yAxis: {
                    title: {
                        text: ''
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
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x} , {point.y} '
                        }
                    }
                },
                series: value.attributeData
            }
            $scope.chartDataScatter.push($scope.highChartOptions);
        });


    }

    $scope.sendChartDetails = function () {

        $scope.loader = true;
        var significance = {}
        for (var index = 0; index < $scope.chartData.length; index++) {
            significance[$scope.chartData[index].attributeName] = $scope.chartData[index].relevance
        }
        // console.log($scope.chartData);
        //console.log(significance);
        $http({
            method: "POST",
            url: "/dataset/sendAttributes?userId=" + $localStorage.userId,
            data: significance,
            headers: { 'Content-Type': 'application/json' }
        }).then(function mySuccess(response) {
            $scope.loader = false;
            console.log(response.data);
            if (response.data.status == true) {

                $rootScope.tabColor.trainModel = "trainModelU";
                $rootScope.tabColor.selectAttribute = "attributeSelection";
                $state.go('training.trainModal');


            } else {
                //flag = true;

                toastr.options.timeOut = 8000;
                toastr.error(response.data.msg);
            }

        }, function myError(err) {
            $scope.loader = false;
            toastr.options.timeOut = 8000;
            toastr.error(err.data);
            
        });
    }

    $scope.showGraphPercentage = function () {
        
        $scope.chartDataPercentage = [];
        //$scope.attributeData = [83, 14, 44, 64];
        angular.forEach($scope.attributeData.data, function (value, key) {
           


            $scope.myFunction = {
                attributeName: value.attributeName,
                relevance: value.Relevance,
                relevenceValue: value.RelevanceValue,
                rank:value.Rank,

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
                    backgroundColor: null,

                    renderTo: 'container',
                    events: {
                        load: function callback() {
                            var chart = this,
                                series = chart.series[0],
                                shape = series.data[0].shapeArgs,
                                x = shape.x,
                                y = shape.y;

                            var max = 60;
                            var min = 15;

                            $.each(chart.series[0].data, function (i, data) {

                                if (data.y <= min) {
                                    data.graphic.attr({
                                        fill: 'red'
                                    });
                                }
                                else if (data.y >= max) {
                                    data.graphic.attr({
                                        fill: 'green'
                                    });
                                }
                                else {
                                    data.graphic.attr({
                                        fill: '#0b5494'
                                    });
                                }


                            });
                            chart.renderer.text(series.data[0].y + '<span style="vertical-align:super;font-size:40%">%</span>')
                                .attr({
                                    'y': 12,
                                    'stroke': '#303030',
                                    'align': 'center',
                                    'font-size': '30px',
                                    'letterspacing': '1px',
                                    'zIndex': 10
                                })
                                .css({
                                    color: 'rgb(0,0,0)',
                                })
                                .translate(x, y)
                                .add(series.group);

                            chart.renderer.circle(x, y).attr({
                                fill: '#FFFFFF'
                            }).add(series.group);

                        }
                    },
                    type: 'solidgauge'
                },

                credits: {
                    enabled: false
                },

                exporting: { enabled: false },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },

                tooltip: {
                    enabled: true
                },

                pane: {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{
                        outerRadius: '105%',
                        innerRadius: '80%',
                        backgroundColor: 'rgb(0,0,0)', //Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                        borderWidth: 2
                    }]
                },

                yAxis: {
                    min: 0,
                    max: 100,
                    lineWidth: 20,
                    tickPositions: []
                },

                plotOptions: {
                    solidgauge: {
                        borderWidth: '7px',
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false
                    }
                },

                series: [{
                    name: "chartData",
                    //borderColor: Highcharts.getOptions().colors[0],
                    //borderColor: '#008000',
                    data: [{
                        //color: Highcharts.getOptions().colors[0],
                        color: '#008000',
                        radius: '115%',
                        innerRadius: '84%',
                        y: Math.round(value.Importance * 100)
                    }]
                }]
            }

            $scope.chartDataPercentage.push($scope.myFunction);
        });

        // console.log($scope.chartData);
        console.log("data")
        console.log($scope.chartDataPercentage);

    }

/*    $scope.showGraphHistogram = function () {


        $scope.chartDataHistogram = [];


        angular.forEach($scope.attributeData.data, function (value, key) {
            console.log(value);
            console.log("Loop");


            $scope.myHistogramFunction = {
                attributeName: value.attributeName,
                relevance: value.Relevance,
                relevenceValue: value.RelevanceValue,
                 rank:value.Rank,



                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor: null,
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {

                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: [{
                    title: { text: 'Data' }
                }, {
                    title: { text: 'Bell curve' },
                    opposite: true
                }],

                yAxis: [{
                    title: { text: 'Data' }
                }, {
                    title: { text: 'Bell curve' },
                    opposite: true
                }],
                credits: {
                    enabled: false
                },

                exporting: {
                    enabled: false
                },

                series: [{
                    name: 'Bell curve',
                    type: 'bellcurve',
                    data: value.HistogramData[0].data,
                    marker: {
                        radius: 2
                    }
                }, {
                    name: 'Data',
                    type: 'bellcurve',
                    data: value.HistogramData[1].data,
                    marker: {
                        radius: 1.5
                    }
                }]
            }
            $scope.chartDataHistogram.push($scope.myHistogramFunction);
        });


    }*/

}]);

app.directive("highChart", function ($parse) {
    return {
        link: function (scope, element, attrs, ngModel) {
            var props = $parse(attrs.highChart)(scope);
            props.chart.renderTo = element[0];
            new Highcharts.Chart(props);
        }
    }
});

