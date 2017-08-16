UserMgmtapp.controller("ImportController", function ($scope, $http, $uibModal, ImportService, UserMgmtService, Form1CreateService, $cookies, $location, $window, $filter, cfpLoadingBar) {
 
    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.form1 = { Form1Details: [], TerminalCode: "", UserName:""};
    $scope.Form1Details = [];
    $scope.IGMDetails = [];
    var arr = [];
    $scope.IsFormValid = false;        
    $scope.disable = false;   
    $scope.disableSave = false;
    $scope.disableAdd = true;
  
    $scope.$watch("formImport.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    setCurrentDate();

    function setCurrentDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        };
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        };

        $scope.form1.DateOfArrival = year + "-" + month + "-" + day;
        $scope.form1.IgmDate = year + "-" + month + "-" + day;
    }

    
    //$(document).ready(function () {
        $("#divCourierCompanyName").hide();
        //Define variable and assign text object and dropdown object to be used in binding
        var $txtCourierCo = $('input[id$=txtCourierCompanyName]');
        var $ddlCourierCo = $('select[id$=ddlCourierCompanyName]');
        var $itemsCourierCo = $('select[id$=ddlCourierCompanyName] option');

        $("#divFlightNumber").hide();
        //Define variable and assign text object and dropdown object to be used in binding
        var $txtFlightNo = $('input[id$=txtFlightNumber]');
        var $ddlFlightNo = $('select[id$=ddlFlightNumber]');
        var $itemsFlightNo = $('select[id$=ddlFlightNumber] option');

        $(document).click(function (event) {
            //  debugger;
            //console.log("click");
            var v = event.target.id;                 
            //console.log(v);
            //console.log(event.target.parentElement.id);

            if (v === "")
            {
                v = event.target.parentElement.id;
            }

            if (v === 'txtFlightNumber') {
                $("#divFlightNumber").show();
                $("#divCourierCompanyName").hide();
                return;
            }

            if (v === 'ddlFlightNumber') {
                //console.log("Hi1");
                //   debugger;
                selectAndHide('txtFlightNumber', 'ddlFlightNumber', 'divFlightNumber');
                //write code for selectedindex change
                //console.log("Hi2");
                getFlightDetails();
                //$('#ctl00_CHDHMenu_txtDateOfArrival').focus();
                document.getElementById("txtDateOfArrival").focus();
                return;
            }

            if (v === 'txtCourierCompanyName') {
                $("#divCourierCompanyName").show();
                $("#divFlightNumber").hide();
                return;
            }

            if (v === 'ddlCourierCompanyName') {
                selectAndHide('txtCourierCompanyName', 'ddlCourierCompanyName', 'divCourierCompanyName');
                //$("#ctl00_CHDHMenu_txtNumberOfPackages").focus(); 
                document.getElementById("txtNumberOfPackages").focus();
                return;
            }

            $("#divFlightNumber").hide();
            $("#divCourierCompanyName").hide();
        });

        $(document).keyup(function (event) {
            //console.log("keyup");
            var v = event.target.id;

            if (v === "") {
                v = event.target.parentElement.id;
            }
            
            //console.log(v);
            var keyCode = event.keyCode;
            //console.log(keyCode);
            if (v === 'txtFlightNumber') {
                searchDdl($txtFlightNo, $ddlFlightNo, $itemsFlightNo, 'divFlightNumber');
                $("#divCourierCompanyName").hide();
                return;
            }

            if (v === 'ddlFlightNumber') {
                if (event.keyCode === 13) {
                    selectAndHide('txtFlightNumber', 'ddlFlightNumber', 'divFlightNumber');
                    //write code for selectedindex change
                    getFlightDetails();
                    //$("#ctl00_CHDHMenu_txtDateOfArrival").focus();
                    document.getElementById("txtDateOfArrival").focus();
                    return;
                }
                if (event.keyCode === 40 || event.keyCode === 38) { return; }
            }

            if (v === 'txtCourierCompanyName') {
                searchDdl($txtCourierCo, $ddlCourierCo, $itemsCourierCo, 'divCourierCompanyName');
                $("#divFlightNumber").hide();
                return;
            }

            if (v === 'ddlCourierCompanyName') {
                if (event.keyCode === 13) {
                    selectAndHide('txtCourierCompanyName', 'ddlCourierCompanyName', 'divCourierCompanyName');
                    document.getElementById("txtNumberOfPackages").focus();
                    return;
                }
                if (event.keyCode === 40 || event.keyCode === 38) { return; }
            }

            $("#divFlightNumber").hide();
            $("#divCourierCompanyName").hide();

        });

    //});

    GetSession("");
    $scope.sesson = "";

    $scope.selectDate = function (dt) {
        //console.log(dt);
        $scope.form1.DateOfArrival = dt;
        $scope.form1.IgmDate = dt;
    }

    $scope.addItem = function (form1) {       
        //console.log(form1);
        $scope.Form1Details.push({MAWBNo: form1.MAWBNo, CourierCoName: form1.courierList.CourierCoName, CourierCoId: form1.courierList.CourierCoId,
                                    NoOfPackages: form1.NoOfPackages, Weight: form1.Weight, ActualNoOfPackages: form1.ActualNoOfPackages,
                                    ActualWeight: form1.ActualWeight, Coloader: form1.Coloader, UldNo: form1.UldNo
        });
        $scope.form1 = {};
        GetSession("");
        setCurrentDate();
    };

    $scope.modifyItem = function (list) {
        //console.log($scope.values[0]);
        //console.log(list);
        $scope.form1 = $filter('filter')(list, { MAWBNo: arr[0] })[0];
        //console.log($scope.form1);
    };

    $scope.deleteItem = function (list) {
        $scope.Form1Details = $filter('filter')(list, { MAWBNo: ('!' + arr[0]) });
        $scope.form1 = {};
        GetSession("");
        setCurrentDate();
    };

    $scope.getIndex = function (MAWBNo, isTrue) {
        arr = [];
        if (isTrue)
            arr.push(MAWBNo);

        else {
            arr = [];
            $scope.form1 = {};
            setCurrentDate();
        }

        if (arr.length > 0) {
            $scope.disable = true;
        }
        else {
            $scope.disable = false;
        }

        //console.log(arr);
    };

    //$scope.updateValues = function () {        
    //    $scope.values = $scope.values.filter(function (v) {
    //        return v;
    //    });
    //}

    //$scope.$watch('values', $scope.updateValues, true);

    $scope.validateInput = function () {

        //console.log($scope.form1.igmnumber);
        //console.log($scope.Items.length)

        if (!(angular.isUndefined($scope.form1.IgmNumber)) && $scope.Form1Details.length > 0)
        {
            $scope.disableSave = true;
            $scope.disableAdd = false;
        }
        else
        {
            $scope.disableSave = false;
            $scope.disableAdd = true;
        }

        //$scope.$watch($scope.formImport.IGMNo.$valid, function () {
        //    if ($scope.formImport.IGMNo.$valid && arr.length > 0) {
        //        $scope.disableSave = true;
        //        return true;
        //    }
        //    else {
        //        $scope.disableSave = false;
        //        return false;
        //    }
        //});
    };

    $scope.start = function () {
        cfpLoadingBar.start();
    };
     
    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

    $scope.Clear = function () {
        $window.location.reload();
    }


    function GetSession(Sessionname) {
        var sessionValue = UserMgmtService.getSessions(Sessionname);

        sessionValue.then(function (data, status, headers, config) {
            $scope.sesson = data.data;
            $scope.form1.TerminalCode = $scope.sesson.TerminalCode;
            $scope.form1.UserName = $scope.sesson.LoginID;
            BindDropdown($scope.sesson.TerminalCode);
        }, function (data, status, header, config) {
            alert(status);
        });
    }

    function BindDropdown(TerminalCode) {
        
        var response = ImportService.getFlightlst(TerminalCode);
        response.then(function (data) {
            $scope.FlightList = data.data;
        }, function () {

        });

        response = ImportService.getCourierlst(TerminalCode);

        response.then(function (data) {
            $scope.courierList = data.data;
            //console.log($scope.courierList);
        }, function () {

        });
    }

    function getFlightDetails() {
        var e = document.getElementById("ddlFlightNumber");
        var strUser = e.options[e.selectedIndex].value;
        //console.log($scope.form1.TerminalCode);
        var response = ImportService.getFlightDetails(strUser, $scope.form1.TerminalCode);
        response.then(function (data) {
            //console.log(data.data);
            $scope.form1 = data.data;
            $scope.form1.ETAHrs = data.data.ETA.substring(0, 2);
            $scope.form1.ETAMin = data.data.ETA.substring(2, 4);
            GetSession("");
            setCurrentDate();
            //console.log(data.data.ETA);
        }, function () {

        });
    }

    $scope.Save = function (obj, Form1Details) {        
        obj.Form1Details = Form1Details;
        
        //console.log(obj);
        Form1CreateService.create(obj).then(function (d) {
            alert("Form1 Added Successfully");
            $location.path('/Form1');
        }, function (e) {
            alert(e);
        });
    }

    $scope.open = function (size) {

        var response = ImportService.getIGMDetails($scope.form1.IgmNumber, $scope.form1.MAWBNo, $scope.form1.TerminalCode);
        response.then(function (data) {
            $scope.IGMDetails = data.data;
            //console.log($scope.IGMDetails);

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'IGMDetails.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    IGMDetails: function () {
                        return $scope.IGMDetails;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });

        }, function () {

        });
    };
});
UserMgmtapp.service("ImportService", function ($http, $cookies) {

    this.getFlightlst = function (TerminalCode) {
        var response =
            $http({
                method: "GET",
                url: "/api/Form1?TerminalCode=" + TerminalCode + "&AirlineCode=" + "" + "&FlightType=" + 'E',
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.getCourierlst = function (TerminalCode) {
        var response =
            $http({
                method: "GET",
                url: "/api/Form1?TerminalCode=" + TerminalCode,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.getFlightDetails = function (FlightNumber,TerminalCode) {
        var response =
            $http({
                method: "GET",
                url: "/api/Form1?FlightNumber=" + FlightNumber + "&TerminalCode=" + TerminalCode,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.getIGMDetails = function (IGMNumber, MAWBNumber, TerminalCode) {
        var response =
            $http({
                method: "GET",
                url: "/api/Form1/GetIGMDetails?IGMNumber=" + IGMNumber + "&MAWBNumber=" + MAWBNumber + "&TerminalCode=" + TerminalCode,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

});
UserMgmtapp.factory('Form1CreateService', function ($http, $q, $cookies) {

    var fac = {};
    fac.create = function (form1) {

        var defer = $q.defer();

        $http.post("/api/Form1/Post", JSON.stringify(form1),
            {
                withCredentials: true,
                headers: { 'RequestVerificationToken': $cookies.get('Token') },
            })
            .success(function (d) {
                defer.resolve(d);
            })
            .error(function () {
                defer.reject("Save failed! Please try again");
            });

        return defer.promise;
    }

    return fac;
});
UserMgmtapp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, IGMDetails) {

    //console.log(IGMDetails);
    $scope.IGMDetails = IGMDetails;
    $scope.selected = {
        IGMDetails: $scope.IGMDetails
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});