UserMgmtapp.controller("MastersController", function ($scope, ShareData, MastersService, UserMgmtService, MastersAddService, RemoveService, $http, $cookies, $location, $window, $filter, cfpLoadingBar) {

    var arr = [];
    var favoriteCookie = $cookies.get('Token');
    $scope.removedisable = false;
    $scope.Message = "";
    $scope.IsFormSubmitted = false;
    $scope.IsFormValid = false;
    $scope.couriercomp = {
        CourierCoName: "",
        CourierCoCode: ""
    };

    $scope.flight = {
        FlightNumber: ""       
    };
    

    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.selectDate = function (dt) {
        //console.log(dt);
        $scope.CourierCoRegistrationExpiryDt = dt;
    }

    //console.log($location.path());

    BindDropdown();

    GetSession("");

    function GetSession(Sessionname) {
        var sessionValue = UserMgmtService.getSessions(Sessionname);

        sessionValue.then(function (data, status, headers, config) {
            $scope.SessionVariable = data.data;
            $scope.couriercomp.TerminalCode = $scope.SessionVariable.TerminalCode;
            $scope.flight.TerminalCode = $scope.SessionVariable.TerminalCode;
            //console.log($scope.SessionVariable);
        }, function (data, status, header, config) {
            alert(status);
        });
    }

    function BindDropdown() {
        var response = MastersService.getCouriertype();
        response.then(function (data) {
            $scope.mastertype = data.data;
            $scope.mastertype1 = data.data;
        }, function () {

        });

        response = UserMgmtService.getAirlineList();
        response.then(function (data) {
            $scope.AirlineList = data.data;
        }, function () {

        });

        //console.log($location.path() == "/AddFlight");

        if($location.path() == "/AddFlight")
        {
            response = MastersService.getAirportMst();
            response.then(function (data) {
                $scope.AirportofDeparture = data.data;
                $scope.AirportofDestination = data.data;
            }, function () {

            });
        }
    }

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    $scope.SearchCourier = function (courier) {
        
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            if (courier.mastertype == undefined) {
                $scope.couriercomp.MemberTypeId = "";
            }
            else {
                $scope.couriercomp.MemberTypeId = courier.mastertype.MasterDesc;
            }
            
            if (courier.mastertype1 == undefined) {
                $scope.couriercomp.CourierType = "";
            }
            else{
                $scope.couriercomp.CourierType = courier.mastertype1.MasterDesc;
            }

            var SearchCourier = MastersService.SearchCourier(courier);

            SearchCourier.then(function (data, status, headers, config) {
                $scope.start();
                $scope.CouriersList = data.data;
                $scope.viewby = 10;
                $scope.totalItems = $scope.CouriersList.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 5;
                $scope.complete();
            }, function (data, status, header, config) {
                alert(status);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.SearchFlight = function (flight) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            if (flight.mastertype == undefined) {
                $scope.flight.FlightType = "";
            }
            else {
                $scope.flight.FlightType = flight.mastertype.MasterDesc.charAt(0);
            }

            if (flight.AirlineList == undefined) {
                $scope.flight.AirlineCode = "";
            }
            else {
                $scope.flight.AirlineCode = flight.AirlineList.AirlineCode;
            }

            var SearchFlight = MastersService.SearchFlight(flight);
            //console.log(flight);
            SearchFlight.then(function (data, status, headers, config) {
                $scope.start();
                $scope.FlightsList = data.data;
                $scope.viewby = 10;
                $scope.totalItems = $scope.FlightsList.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 5;
                $scope.complete();
            }, function (data, status, header, config) {
                alert(status);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.Save = function (obj, name) {
        $scope.Message = "";
        //console.log(courier);
        //console.log(CourierCoRegistrationExpiryDt);

        if ($scope.IsFormValid) {
            if (name == 'couriermaster')
            {

                if (obj.mastertype == undefined) {
                    $scope.couriercomp.MemberTypeId = "0";
                }
                else {
                    $scope.couriercomp.MemberTypeId = obj.mastertype.MasterId;
                }

                if (obj.mastertype1 == undefined) {
                    $scope.couriercomp.CourierType = "0";
                }
                else {
                    $scope.couriercomp.CourierType = obj.mastertype1.MasterId;
                }

                $scope.couriercomp.CourierCoRegistrationExpiryDt = $filter('date')(CourierCoRegistrationExpiryDt.value, 'yyyy-MM-dd HH:mm:ss'); //CourierCoRegistrationExpiryDt.value;
                $scope.couriercomp.Status = "A";
                $scope.couriercomp.MC_Status = "A";
                if ($scope.couriercomp.CourierCoId > 0)
                {
                    $scope.couriercomp.LastUpDtBy = $scope.SessionVariable.LoginID;
                }
                $scope.couriercomp.CreatedBy = $scope.SessionVariable.LoginID;
                //console.log($filter('date')(new Date(CourierCoRegistrationExpiryDt.value), 'yyyy-MM-dd HH:mm:ss'));
                //console.log($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'));
                //console.log(courier);
            }
            if (name == 'flightmaster')
            {
                $scope.flight.Status = "A";
                $scope.flight.MC_Status = "A";
                $scope.flight.CreatedBy = $scope.SessionVariable.LoginID;
            }

            MastersAddService.create(obj, name).then(function (d) {
                alert(name + " Added Successfully");
                $location.path('/' + name + '');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1;
    }  

    $scope.start = function () {
        cfpLoadingBar.start();
    };

    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

    $scope.Clear = function () {
        $window.location.reload();
    }

    $scope.Edit = function (data,route) {
        //console.log(data);
        ShareData.value = data;
        $location.path('/' + route + '');
    };

    $scope.getIndex = function (Ids, isTrue) {
        if (isTrue)
            arr.push(Ids);

        else {
            var index = arr.indexOf(Ids);
            arr.splice(index, 1);
        }

        if (arr.length > 0) {
            $scope.removedisable = true;
        }
        else {
            $scope.removedisable = false;
        }
    };

    $scope.Remove = function (MasterName) {
        if ($window.confirm("Do you want to remove selected records?")) {
            //var CreatedBy;
            //if (MasterName == 'couriermaster')
            //{
            //    CreatedBy = $scope.couriercomp.CreatedBy;
            //}
            //else if (MasterName == 'flightmaster')
            //{
            //    CreatedBy = $scope.flight.CreatedBy;
            //}
            RemoveService.Remove(arr, $scope.SessionVariable.LoginID, MasterName).then(function (d) {
                alert(MasterName + " removed Successfully");
                $location.path('/' + MasterName + '');
            }, function (e) {
                alert(e);
            });
        };
    };   
});

UserMgmtapp.service("MastersService", function ($http, $cookies) {

    this.getCouriertype = function () {
        var response =
            $http({
                method: "GET",
                url: "/api/MastersDetail",
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.SearchCourier = function (courier) {
        var response =
           $http({
               method: "Post",
               data: JSON.stringify(courier),
               url: "/api/MastersDetail",
               headers: { 'RequestVerificationToken': $cookies.get('Token'), 'Content-Type': 'application / json' }
           });
        return response;
    };

    this.getCourierbyID = function (CourierID) {
        var response =
            $http({
                method: "GET",
                url: "/api/MastersDetail/" + CourierID,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.SearchFlight = function (flight) {
        var response =
           $http({
               method: "Post",
               data:JSON.stringify(flight),
               url: "/api/MastersDetail/FlightSearch",
               headers: { 'RequestVerificationToken': $cookies.get('Token'), 'Content-Type': 'application / json' }
           });
        return response;
    };

    this.getAirportMst = function () {
        var response =
            $http({
                method: "GET",
                url: "/api/MastersDetail/AirportSearch",
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }
});

UserMgmtapp.factory('MastersAddService', function ($http, $q, $cookies) {

    var fac = {};
    fac.create = function (objmaster,Name) {
        
        var defer = $q.defer();

        $http.post("/api/MastersDetail/Post", JSON.stringify({ obj: objmaster, MasterName: Name }),
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

UserMgmtapp.controller("MastersEditController", function ($scope, ShareData, UserMgmtService, MastersAddService, MastersService, $http, $cookies, $location, $window, cfpLoadingBar, $filter) {

    var favoriteCookie = $cookies.get('Token');
    $scope.Message = "";
    $scope.IsFormSubmitted = false;
    $scope.IsFormValid = false;
    $scope.couriercomp = {};

    var config =
   {
       headers:
       {
           'RequestVerificationToken': favoriteCookie
       }
   };

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    $scope.selectDate = function (dt) {
        $scope.CourierCoRegistrationExpiryDt = dt;
    }

    BindDropdown();
    GetDetailsByID();
    GetSession("");

    function GetSession(Sessionname) {
        var sessionValue = UserMgmtService.getSessions(Sessionname);

        sessionValue.then(function (data, status, headers, config) {
            $scope.SessionVariable = data.data;
            $scope.couriercomp.TerminalCode = $scope.SessionVariable.TerminalCode;
            $scope.couriercomp.CreatedBy = $scope.SessionVariable.LoginID;
            //console.log($scope.SessionVariable);
        }, function (data, status, header, config) {
            alert(status);
        });
    }

    function GetDetailsByID()
    {
        if (!(angular.isUndefined(ShareData.value.CourierCoId)))
        {
            var response = MastersService.getCourierbyID(ShareData.value.CourierCoId);
            response.then(function (data) {

                $scope.start();
                $scope.couriercomp = {};
                var Courierdata = data.data;

                console.log(Courierdata);
                $scope.couriercomp.CourierCoId = Courierdata.CourierCoId;
                $scope.couriercomp.CourierCoCode = Courierdata.CourierCoCode;
                $scope.couriercomp.CourierCoRegistrationNumber = Courierdata.CourierCoRegistrationNumber
                $scope.couriercomp.CourierCoName = Courierdata.CourierCoName;
                $scope.couriercomp.CourierCoTallyName = Courierdata.CourierCoTallyName;
                $scope.couriercomp.ContactPerson = Courierdata.ContactPerson;
                $scope.couriercomp.CourierEmail = Courierdata.CourierEmail;
                $scope.couriercomp.CourierContact = Courierdata.CourierContact;
                $scope.couriercomp.CourierCoAddr1 = Courierdata.CourierCoAddr1;
                $scope.couriercomp.CourierCoAddr2 = Courierdata.CourierCoAddr2;
                $scope.couriercomp.CourierCoState = Courierdata.CourierCoState;
                $scope.couriercomp.CourierCoCity = Courierdata.CourierCoCity;
                $scope.couriercomp.CourierCoPinCode = Courierdata.CourierCoPinCode;
                $scope.couriercomp.selectedmastertype = Courierdata.MemberTypeId;
                $scope.couriercomp.selectedmastertype1 = Courierdata.CourierType;
                $scope.couriercomp.CourierCoRegistrationExpiryDt = $filter('date')(Courierdata.CourierCoRegistrationExpiryDt, 'yyyy-MM-dd'); //Courierdata.CourierCoRegistrationExpiryDt;
                $scope.couriercomp.CreatedBy = Courierdata.CreatedBy;
                $scope.couriercomp.CreatedOn = Courierdata.CreatedOn;
                $scope.couriercomp.TerminalCode = Courierdata.TerminalCode;

                $scope.complete();
            }, function () {
                $location.path('/couriermaster');
            });
        }
        if (!(angular.isUndefined(ShareData.value.FlightNumber)))
        {
            $scope.flight = {};
            $scope.flight = ShareData.value;
            //if (ShareData.value.FlightType == "I")
            //{
            //    $scope.flight.FlightType = "Import";
            //}
            //else
            //{
            //    $scope.flight.FlightType = "Export";
            //}
            //console.log($scope.flight);
            //console.log($scope.flight.FlightType);
        }
    }

    function BindDropdown() {

        if (!(angular.isUndefined(ShareData.value.CourierCoId))) {
            var response = MastersService.getCouriertype();
            response.then(function (data) {
                $scope.mastertype = data.data;
                $scope.mastertype1 = data.data;
            }, function () {

            });
        }

        else if(!(angular.isUndefined(ShareData.value.FlightNumber))) {

            var response = MastersService.getAirportMst();
            response.then(function (data) {
                $scope.AirportofDeparture = data.data;
                $scope.AirportofDestination = data.data;               
            }, function () {

            });

            response = UserMgmtService.getAirlineList();
            response.then(function (data) {
                $scope.AirlineList = data.data;
                //console.log($scope.AirlineList);
            }, function () {

            });

            response = MastersService.getCouriertype();
            response.then(function (data) {
                $scope.mastertype = data.data;               
            }, function () {

            });
        }

    }

    $scope.start = function () {
        cfpLoadingBar.start();
    };

    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

    $scope.Clear = function () {
        $window.location.reload();
    }

    $scope.Save = function (obj,name) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";
        //console.log(courier);
        //console.log($scope.IsFormValid);

        if ($scope.IsFormValid) {
            if (name == 'couriermaster') {
                if (obj.selectedmastertype == undefined) {
                    $scope.couriercomp.MemberTypeId = "0";
                }
                else {
                    $scope.couriercomp.MemberTypeId = obj.selectedmastertype;
                }

                if (obj.selectedmastertype1 == undefined) {
                    $scope.couriercomp.CourierType = "0";
                }
                else {
                    $scope.couriercomp.CourierType = obj.selectedmastertype1;
                }

                $scope.couriercomp.CourierCoRegistrationExpiryDt = $filter('date')(CourierCoRegistrationExpiryDt.value, 'yyyy-MM-dd HH:mm:ss');
                $scope.couriercomp.Status = "A";
                $scope.couriercomp.MC_Status = "A";
                if ($scope.couriercomp.CourierCoId > 0) {
                    $scope.couriercomp.LastUpDtBy = $scope.SessionVariable.LoginID;
                }
                //console.log(courier);
            }
            MastersAddService.create(obj, name).then(function (d) {
                alert(name + " updated Successfully");
                $location.path('/' + name + '');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

});

UserMgmtapp.factory('RemoveService', function ($http, $q, $cookies) {
    var fac = {};
    fac.Remove = function (ids, loginid, Name) {
        
        var defer = $q.defer();

        $http.post("/api/MastersDetail/Remove", JSON.stringify({ ids: ids, loginid: loginid, MasterName: Name }),
            {
                withCredentials: true,
                headers: { 'RequestVerificationToken': $cookies.get('Token'), 'Content-Type': 'application / json' },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Remove failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.factory("ShareData", function () {
    return { value: 0 }
});