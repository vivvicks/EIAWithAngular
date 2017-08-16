UserMgmtapp.controller("RoleMgmtController", function ($scope, RoleMgmtService, RoleMgmtAddService, ShareData, $http, $cookies, $location, $window, cfpLoadingBar) {

    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.EnableDisable =
        [{
            id: 'A',
            name: 'Enable'
        },
        {
            id: 'D',
            name: 'Disable'
        }];

    GetAllRoles();

    function GetAllRoles() {

        var getData = RoleMgmtService.getRoles();

        getData.then(function (data, status, headers, config) {
            $scope.start();
            $scope.RolesList = data.data;
            $scope.viewby = 10;
            $scope.totalItems = $scope.RolesList.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.complete();
        }, function (data, status, header, config) {
            alert(data.data);
        });
    }

    $scope.SearchRoles = function (RoleMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            var SearchRoles = RoleMgmtService.SearchRoles(RoleMgmt);

            SearchRoles.then(function (data, status, headers, config) {
                $scope.start();
                $scope.RolesList = data.data;
                $scope.viewby = 10;
                $scope.totalItems = $scope.RolesList.length;
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

    $scope.SaveRole = function (RoleMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            RoleMgmtAddService.createRole(RoleMgmt).then(function (d) {
                alert("Role Added Successfully");
                $location.path('/RoleCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    $scope.Clear = function () {
        $window.location.reload();
    }

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

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

    $scope.EditRole = function (RoleMgmt) {
        ShareData.value = RoleMgmt;
        $location.path('/EditRole');
    };
});

UserMgmtapp.controller("RoleMgmtEditController", function ($scope, ShareData, RoleMgmtService,RoleMgmtEditService, $http, $cookies, $location, $window, cfpLoadingBar)
{
    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.EnableDisable =
       [{
           id: 'A',
           name: 'Enable'
       },
       {
           id: 'D',
           name: 'Disable'
       }];

    LoadingRoleData();

    function LoadingRoleData() {

        var response = RoleMgmtService.getRolebyID(ShareData.value.RoleId);

        response.then(function (data) {

            $scope.start();
            $scope.RoleMgmt = {};
            var Roledata = data.data;

            $scope.RoleMgmt.RoleId = Roledata.RoleId;
            $scope.RoleMgmt.RoleSName = Roledata.RoleSName;
            $scope.RoleMgmt.DisplayName = Roledata.DisplayName;
            $scope.RoleMgmt.selectedStatus = Roledata.Status;

            $scope.complete();
        }, function () {
            $location.path('/UserCreation');
        });
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

    $scope.UpdateRole = function (RoleMgmt) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            RoleMgmtEditService.updateRole(RoleMgmt).then(function (d) {
                alert("Role Updated Successfully");
                $location.path('/RoleCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };
});

UserMgmtapp.service("RoleMgmtService", function ($http, $cookies) {

    this.getRoles = function () {
        var response =
           $http({
               method: "GET",
               url: "/api/RoleData",
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.SearchRoles = function (RoleMgmt) {

        var Status;

        if (RoleMgmt.EnableDisable == undefined) {
            Status = "";
        }
        else {
            if (RoleMgmt.EnableDisable.name == "Enable") {
                Status = "A";
            }
            else {
                Status = "D";
            }
        }

        var response =
           $http({
               method: "GET",
               url: "/api/RoleData?RoleSName=" + RoleMgmt.RoleSName + "&DisplayName=" + RoleMgmt.DisplayName + "&Status=" + Status,
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.getRolebyID = function (RoleID) {
        var response =
            $http({
                method: "GET",
                url: "/api/RoleData/" + RoleID,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }

});

UserMgmtapp.factory('RoleMgmtAddService', function ($http, $q) {

    var fac = {};
    fac.createRole = function (RoleMgmt) {


        var formdata = new FormData();
        formdata.append("RoleSName", RoleMgmt.RoleSName);
        formdata.append("DisplayName", RoleMgmt.DisplayName);
        var defer = $q.defer();

        $http.post("/RoleCRUD/CreateRole", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Role Save failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.factory('RoleMgmtEditService', function ($http, $q) {

    var fac = {};
    fac.updateRole = function (RoleMgmt) {


        var formdata = new FormData();
        formdata.append("RoleId", RoleMgmt.RoleId);
        formdata.append("RoleSName", RoleMgmt.RoleSName);
        formdata.append("DisplayName", RoleMgmt.DisplayName);
        formdata.append("Status", RoleMgmt.selectedStatus);
        var defer = $q.defer();

        $http.post("/RoleCRUD/UpdateRole", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Role update failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.factory("ShareData", function () {
    return { value: 0 }
});