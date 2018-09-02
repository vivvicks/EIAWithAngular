UserMgmtapp.controller("UserMgmtController", function ($scope, ShareData, UserMgmtService, UserMgmtAddService, UserMgmtActDeActService, $http, $cookies, $location, $window, cfpLoadingBar) {

    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.UserMgmt = { loginid: "", username: "", ActiveNonActive: "", LockUnlock:"" };

    $scope.LockUnlock =
        [{
            id: '1',
            name: 'Lock'
        },
        {
            id: '2',
            name: 'UnLock'
        }];

    $scope.ActiveNonActive =
        [{
            id: '1',
            name: 'Active'
        },
        {
            id: '2',
            name: 'NonActive'
        }];

    $scope.Gender =
        [{
            id: 'M',
            name: 'Male'
        },
        {
            id: 'F',
            name: 'Female'
        }];

    $scope.profileID =
        [{
            id: '1',
            name: 'UserProfile'
        },
        {
            id: '2',
            name: 'Profile'
        }];

    $scope.TermicalCodes =
        [{
            id: 'BOM',
            name: 'Banglore'
        },
        {
            id: 'DEL',
            name: 'Delhi'
        },
        {
            id: 'BLR',
            name: 'Mumbai'
        }];

    $scope.selectDate = function (dt) {
        //console.log(dt);
        $scope.DOB = dt;
    }

    BindAirlineDropdown();

    $scope.sesson = "";

    //debugger;
    GetSession("TerminalCode");

    function GetSession(Sessionname) {
        var sessionValue = UserMgmtService.getSessions(Sessionname);

        sessionValue.then(function (data, status, headers, config) {
            $scope.sesson = data.data;
            GetAllUsers($scope.sesson);
        }, function (data, status, header, config) {
            alert(status);
        });
    }

    //console.log($scope.sesson);

    //GetAllUsers();

    function GetAllUsers(TermincalCode) {

        var getData = UserMgmtService.getUsers(TermincalCode);
        
        getData.then(function (data, status, headers, config) {
            $scope.start();
            $scope.UsersList = data.data;
            $scope.viewby = 10;
            $scope.totalItems = $scope.UsersList.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.complete();
        }, function (data, status, header, config) {
            alert(status);
        });
    }

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    //$scope.pageChanged = function () {
    //    console.log('Page changed to: ' + $scope.currentPage);
    //};

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1;
    }

    $scope.Message = "";
    $scope.IsFormSubmitted = false;
    $scope.IsFormValid = false;

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });
    
    $scope.start = function () {
        cfpLoadingBar.start();
    };

    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

    $scope.SearchUser = function (UserMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";
        
        if ($scope.IsFormValid) {
            console.log(UserMgmt);
            var SearchUsers = UserMgmtService.SearchUsers(UserMgmt);

            SearchUsers.then(function (data, status, headers, config) {
                $scope.start();
                $scope.UsersList = data.data;
                $scope.viewby = 10;
                $scope.totalItems = $scope.UsersList.length;
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

    $scope.Clear = function () {
        $window.location.reload();
    }

    function BindAirlineDropdown() {
        var response = UserMgmtService.getAirlineList();
        response.then(function (data) {
            $scope.AirlineList = data.data;
        }, function () {

        });

    }

    $scope.SaveUser = function (UserMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";
       
        if ($scope.IsFormValid) {
            UserMgmtAddService.createUser(UserMgmt).then(function (d) {
                alert("User Added Successfully");
                $location.path('/UserCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.EditUser = function (UserMgmt) {
        ShareData.value = UserMgmt;
        $location.path('/EditUser');
    };

    $scope.clicked = false;

    $scope.chekedornot = function (UsersList)
    {
        $scope.CheckedId = "";
        angular.forEach(UsersList, function (value, key) {
            if (value.checkedornot) {
                if ($scope.CheckedId.length == 0) {
                    $scope.CheckedId = value.UserMstID;
                }
                else {
                    $scope.CheckedId += ", " + value.UserMstID;
                }
            }
        });

        if ($scope.CheckedId != "")
        {
            $scope.clicked = true;
        }
        else
        {
            $scope.clicked = false;
        }
    }

    $scope.ActivateDeactivate = function (UsersList, ActivateDeactivate) {

        $scope.CheckedId = "";
        if (ActivateDeactivate == "Unlock")
        {
            angular.forEach(UsersList, function (value, key) {
                if (value.checkedornot) {
                    if (value.LockStatus == "Yes")
                    {
                        if ($scope.CheckedId.length == 0) {
                            $scope.CheckedId = value.UserMstID;
                        }
                        else {
                            $scope.CheckedId += ", " + value.UserMstID;
                        }
                    }
                }
            });

            if ($scope.CheckedId == "") {
                alert("Not able to unlock user");
                return false;
            }
            else {
                return true;
            }
        }

        if ($window.confirm("Do you want to " + ActivateDeactivate + "users ?")) {
            //$scope.spn = false;
            angular.forEach(UsersList, function (value, key) {
                //console.log(value.checkedornot); 
                if (value.checkedornot) {
                    //UserMstIDArray.push(+value.UserMstID);
                    //$scope.spn = true;
                    if ($scope.CheckedId.length == 0) {
                        $scope.CheckedId = value.UserMstID;
                    }
                    else {
                        $scope.CheckedId += ", " + value.UserMstID;
                    }
                    //console.log($scope.CheckedId);
                }
            });
        };

        if ($scope.IsFormValid) {
            //console.log("hi1");
            //console.log(UserMstIDArray);
            UserMgmtActDeActService.ActivateDeactivate($scope.CheckedId, ActivateDeactivate).then(function (d) {
                alert("User " + ActivateDeactivate + " Successfully");
                $location.path('/UserCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    }   
});

UserMgmtapp.factory('UserMgmtActDeActService', function ($http, $q) {
    var fac = {};
    fac.ActivateDeactivate = function (ids, ActivateDeactivate) {
        console.log(ids);
        var formdata = new FormData();

        formdata.append("ids", ids);
        formdata.append("ActivateDeactivate", ActivateDeactivate);

        var defer = $q.defer();

        $http.post("/UserCRUD/ActivateDeactivate", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Unlocking failed! Please try again");
        });

        return defer.promise;
    }
    return fac;
});

UserMgmtapp.factory('UserMgmtAddService', function ($http, $q) {

    function OnPasswordChange(password) {
        if (password != null) {
            var password = password;
            if (password != "") {
                var hash = calcMD5(password).toUpperCase();
                return hash.toUpperCase();
            }
        }
    }

    var fac = {};
    fac.createUser = function (UserMgmt)
    {
        var formdata = new FormData();
        formdata.append("firstName", UserMgmt.firstName);
        formdata.append("middleName", UserMgmt.middleName);
        formdata.append("LastName", UserMgmt.LastName);
        formdata.append("fatherName", UserMgmt.fatherName);
        formdata.append("Password", OnPasswordChange('path1234'));
        formdata.append("DOB", DOB.value);
        formdata.append("Gender", UserMgmt.Gender.id);
        formdata.append("contactno", UserMgmt.contactno);
        formdata.append("Address1", UserMgmt.Address1);
        formdata.append("Address2", UserMgmt.Address2);
        formdata.append("Address3", UserMgmt.Address3);
        formdata.append("LoginID", UserMgmt.LoginID);
        formdata.append("Email", UserMgmt.EmailID);
        formdata.append("Status", UserMgmt.Activated);
        formdata.append("ProfileId", UserMgmt.profileID.id);
        formdata.append("P1", UserMgmt.TermicalCodes.id);
        formdata.append("AirlineList", UserMgmt.AirlineList.AirlineId);

        var defer = $q.defer();

        $http.post("/UserCRUD/CreateUser", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("User Save failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.factory('UserMgmtEditService', function ($http, $q) {


    var fac = {};
    fac.UpdateUser = function (UserMgmt) {
        var formdata = new FormData();

        formdata.append("UserMstID", UserMgmt.UserMstID);
        formdata.append("LoginMId", UserMgmt.LoginMId);
        formdata.append("FirstName", UserMgmt.FirstName);
        formdata.append("MiddleName", UserMgmt.MiddleName);
        formdata.append("LastName", UserMgmt.LastName);
        formdata.append("FatherName", UserMgmt.fatherName);
        formdata.append("DOB", DOB.value);
        formdata.append("Gender", UserMgmt.selectedGender);
        formdata.append("contactno", UserMgmt.contactno);
        formdata.append("Address1", UserMgmt.Address1);
        formdata.append("Address2", UserMgmt.Address2);
        formdata.append("Address3", UserMgmt.Address3);
        formdata.append("LoginID", UserMgmt.LoginID);
        formdata.append("Email", UserMgmt.EmailID);
        formdata.append("Status", UserMgmt.Activated);
        formdata.append("ProfileId", UserMgmt.selectedprofileID);
        formdata.append("P1", UserMgmt.selectedTermicalCode);
        formdata.append("AirlineList", UserMgmt.AirlineList.AirlineId);

        var defer = $q.defer();

        $http.post("/UserCRUD/UpdateUser", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("User Save failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.controller("UserMgmtEditController", function ($scope, ShareData, UserMgmtService, UserMgmtEditService,$http, $cookies, $location, $window, cfpLoadingBar)
{
    $scope.Message = "";
    $scope.IsFormSubmitted = false;
    $scope.IsFormValid = false;
    
    $scope.LockUnlock =
        [{
            id: '1',
            name: 'Lock'
        },
        {
            id: '2',
            name: 'UnLock'
        }];

    $scope.ActiveNonActive =
        [{
            id: '1',
            name: 'Active'
        },
        {
            id: '2',
            name: 'NonActive'
        }];

    $scope.profileID =
        [{
            id: '1',
            name: 'UserProfile'
        },
        {
            id: '2',
            name: 'Profile'
        }];

    $scope.Gender =
       [{
           id: 'M',
           name: 'Male'
       },
       {
           id: 'F',
           name: 'Female'
       }];

    $scope.TermicalCodes =
        [{
            id: 'BOM',
            name: 'Banglore'
        },
        {
            id: 'DEL',
            name: 'Delhi'
        },
        {
            id: 'BLR',
            name: 'Mumbai'
        }];   

    $scope.selectDate = function (dt) {
        $scope.DOB = dt;
    }

    BindAirlineDropdown();

    LoadingUserData();

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    function BindAirlineDropdown() {
        var response = UserMgmtService.getAirlineList();
        response.then(function (data) {
            $scope.AirlineList = data.data;
        }, function () {

        });

    }

    function LoadingUserData()
    {
        var response = UserMgmtService.getUserbyID(ShareData.value.UserMstID);
        response.then(function (data) {

            $scope.start();
            $scope.UserMgmt = {};
            var Userdata = data.data;        

            $scope.UserMgmt.UserMstID = Userdata.UserMstID;
            $scope.UserMgmt.LoginMId = Userdata.LoginMId
            $scope.UserMgmt.FirstName = Userdata.FirstName;
            $scope.UserMgmt.LastName = Userdata.LastName;
            $scope.UserMgmt.fatherName = Userdata.FatherName;
            $scope.UserMgmt.DOB = Userdata.DOB;
            $scope.UserMgmt.selectedGender = Userdata.Gender;
            $scope.UserMgmt.contactno = Userdata.ContactNo;
            $scope.UserMgmt.Address1 = Userdata.Address1;
            $scope.UserMgmt.Address2 = Userdata.Address2;
            $scope.UserMgmt.Address3 = Userdata.Address3;
            $scope.UserMgmt.LoginID = Userdata.LoginID;
            $scope.UserMgmt.EmailID = Userdata.Email;
            $scope.UserMgmt.Activated = Userdata.ActiveStatus;
            $scope.UserMgmt.selectedprofileID = Userdata.ProfileId;
            $scope.UserMgmt.selectedTermicalCode = Userdata.P1;

            $scope.complete();
        }, function () {
            $location.path('/UserCreation');
        });
    }

    $scope.UpdateUser = function (UserMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            UserMgmtEditService.UpdateUser(UserMgmt).then(function (d) {
                alert("User Updated Successfully");
                $location.path('/UserCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.start = function () {
        cfpLoadingBar.start();
    };

    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

});

UserMgmtapp.service("UserMgmtService", function ($http, $cookies) {

    this.getUsers = function (TermicalCode) {
        var response =
           $http({
               method: "GET",
               url: "/api/UserDetails?TerminalCode=" + TermicalCode,
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.SearchUsers = function (UserMgmt) {
        console.log(UserMgmt.ActiveNonActive);
        var ActiveStaus;
        var LockStatus;


        if (UserMgmt.loginid == "" && UserMgmt.username == "" && UserMgmt.ActiveNonActive == "" && UserMgmt.LockUnlock == "")
        {
            ActiveStaus = ["A", "D"];
            LockStatus = ["Yes", "No"];
        }
        else
        {
            if (UserMgmt.ActiveNonActive != "") {

                if (UserMgmt.ActiveNonActive != null) {
                    if (UserMgmt.ActiveNonActive.name == "Active") {
                        ActiveStaus = "Y";
                    }
                }
                else
                    if (UserMgmt.ActiveNonActive != null) {
                        if (UserMgmt.ActiveNonActive.name == "NonActive") {
                            ActiveStaus = "N";
                        }
                    }
            }
            else {
                ActiveStaus = "";
            }

            if (UserMgmt.LockUnlock != "") {
                if (UserMgmt.LockUnlock != null){
                    if (UserMgmt.LockUnlock.name == "Lock") {
                        LockStatus = "No";
                    }
                }
                else
                    if (UserMgmt.LockUnlock != null) {
                        if (UserMgmt.LockUnlock.name == "UnLock") {
                            LockStatus = "Yes";
                        }
                    }
            }
            else {
                LockStatus = "";
            }
        }

        //if (UserMgmt.loginid == undefined)
        //{
        //    UserMgmt.loginid = "";
        //}

        //if (UserMgmt.username == undefined)
        //{
        //    UserMgmt.username = "";
        //}

        //if (UserMgmt.ActiveNonActive == undefined || UserMgmt.ActiveNonActive == "") {
        //    ActiveStaus = ["A","D"];
        //}
        //else if(UserMgmt.ActiveNonActive != "") {
        //    if (UserMgmt.ActiveNonActive.name == "Active") {
        //        ActiveStaus = "Y";
        //    }
        //    else if (UserMgmt.ActiveNonActive.name == "NonActive") {
        //        ActiveStaus = "N";
        //    }
        //}

        //if (UserMgmt.LockUnlock == undefined || UserMgmt.LockUnlock == "") {
        //    LockStatus = ["Yes", "No"];
        //}
        //else if (UserMgmt.LockUnlock != "") {
        //    if (UserMgmt.LockUnlock.name == "Lock") {
        //        LockStatus = "No";
        //    }
        //    else if (UserMgmt.LockUnlock.name == "UnLock") {
        //        LockStatus = "Yes";
        //    }
        //}

        var response =
           $http({
               method: "GET",
               url: "/api/UserDetails?ActiveStaus=" + ActiveStaus + "&LockStatus=" + LockStatus + "&LoginID=" + UserMgmt.loginid + "&UserName=" + UserMgmt.username  ,
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.getSessions = function (Sessionname) {
        var response =
           $http({
               method: "GET",
               url: "/Login/GetSession?Sessionname=" + Sessionname,
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.getAirlineList = function () {
        var response =
            $http({
                method: "GET",
                url: "/api/UserDetails",
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

    this.getUserbyID = function(UserMstID)
    {
        var response =
            $http({
                method: "GET",
                url: "/api/UserDetails/" + UserMstID,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }
});

UserMgmtapp.factory("ShareData", function () {
    return { value: 0 }
});