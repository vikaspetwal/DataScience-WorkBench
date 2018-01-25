
var app = angular.module('MachineLearning');

app.controller('FileUploadCtrlReg', ['$scope', '$http', '$state', '$rootScope', '$localStorage', function ($scope, $http, $state, $rootScope, $localStorage) {

    var file = "";

    $scope.slider = { 
        value: 80, 
        options: {
            floor: 0,
            ceil: 100,
             showSelectionBar: true, 
           
           }
         };
        
         $scope.testing=100-$scope.slider.value;

    $scope.$watch('slider.value', function (newValue, oldValue) {
        if(newValue>100)
            {
             newValue=80;
            } 
        $scope.testing=100-newValue;

    });

    $scope.$watch('testing', function (newValue, oldValue) {
        if(newValue>100)
        {
         
           newValue=80;
          }  
        $scope.slider.value=100-newValue;

    });

    $scope.showSlider = false;

    $scope.blurId = false;
    $rootScope.tabColor.uploadData = "uploadDataSetU";

    $scope.sliderFilterData = { "training": "", "testing": ""};




    $scope.blurDiv = function () {

        $scope.blurId = true;
    
    }


    $scope.unblurDiv = function () {

        $scope.blurId = false;
    }

    

    $scope.files = [];


    $scope.removeFile = function () {

        $scope.files.splice(0, 1);


    }




    //============== DRAG & DROP =============
    // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/

    $scope.flag = false;
    var dropbox = document.getElementById("dropbox")
    $scope.dropText = '(Upload Maximum 1 document at a time)'

    // init event handlers
    function dragEnterLeave(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        $scope.$apply(function () {
            $scope.dropText = "(Upload Maximum 1 document at a time)"
            $scope.dropClass = ''
        })
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false)
    dropbox.addEventListener("dragleave", dragEnterLeave, false)
    dropbox.addEventListener("dragover", function (evt) {
        evt.stopPropagation()
        evt.preventDefault()
        var clazz = 'not-available'
        var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0 && evt.dataTransfer.types.indexOf('Files') <= 1
        $scope.$apply(function () {
            $scope.dropText = ok ? '(Upload Maximum 1 document at a time)' : 'Only files are allowed!'
            $scope.dropClass = ok ? 'over' : 'not-available'
        })
    }, false)
    dropbox.addEventListener("drop", function (evt) {
        $scope.showSlider = true;
        console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
        evt.stopPropagation()
        evt.preventDefault()
        $scope.$apply(function () {
            $scope.dropText = '(Upload Maximum 1 document at a time)'
            $scope.dropClass = ''
        })
        var files = evt.dataTransfer.files
        if (files.length == 1 && $scope.files.length<1) {
            $scope.$apply(function () {

            //     if(element.files.length>1){
            //     $scope.files.push(element.files[0]);
            // }
                for (var i = 0; i < files.length; i++) {
                    $scope.files.push(files[i])
                }
            })
        }else{
            
        }
    }, false)
    //============== DRAG & DROP =============

    $scope.setFiles = function (element) {
        $scope.$apply(function ($scope) {
            console.log('files:', element.files);
            // Turn the FileList object into an Array
            // if(element.files.length>1){
            //     $scope.files.push(element.files[0]);
            // }
            
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i])
            }
            $scope.progressVisible = false
        });
    };


    $scope.uploadFile = function () {
        console.log("Now Here")
        $scope.sliderFilterData.training=$scope.slider.value;
        $scope.sliderFilterData.testing=$scope.testing;
        $scope.loader = true;
        $scope.showSlider = true;
        var fd = new FormData()
        console.log("%%%%%%%%");
        console.log($scope.files[0]);
        fd.append("uploadedFile", $scope.files[0])
        console.log("Inside Controller")
        $http.post("/dataset/upload", fd, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function (response) {
            $scope.loader = false;
            if (response.data.status == true) {
                
                file = response.data.filename;
                $localStorage.file = file;
                console.log("*********");
                console.log(file);
                toastr.options.timeOut = 8000;
                toastr.success("Uploaded successfully");
                $localStorage.sliderFilterData = $scope.sliderFilterData;
                $rootScope.tabColor.uploadData = "uploadDataSet";

                $rootScope.tabColor.selectAttribute = "attributeSelectionU";
                $state.go('regTraining.attReg');

            } else {
               
                toastr.options.timeOut = 8000;
                toastr.error(response.data.err_desc);
            }
            console.log("Inside Angular controller")
            console.log(response.data)
            // flag = false;
        }).catch(function (err) {
            $scope.loader = false;
            toastr.options.timeOut = 8000;
            toastr.error(err);
            console.log(err);
        });
    }

    $scope.goNextReg = function () {
        $scope.uploadFile();
        //$scope.sendData();


    }


    function uploadProgress(evt) {
        $scope.$apply(function () {
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("Check console for file details")
        //alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        $scope.$apply(function () {
            $scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }




}])