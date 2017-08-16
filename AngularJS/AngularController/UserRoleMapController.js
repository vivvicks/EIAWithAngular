UserMgmtapp.controller("UserRoleMapController", function ($scope,RoleMgmtService,RoleMappedService,UserMgmtService,RoleMgmtActDeActService, $http, $cookies, $location, $window, cfpLoadingBar) {

    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    $scope.AllocatedORAvailable =
      [{
          id: '1',
          name: 'Allocated'
      },
      {
          id: '2',
          name: 'Available'
      }];

    $scope.IsFormSubmitted = false;
    $scope.IsFormValid = false;
    $scope.Allocate = false;
    $scope.DeAllocate = false;

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    BindAirlineDropdown();

    function BindAirlineDropdown() {
        var response = RoleMgmtService.getRoles();

        response.then(function (data) {
            $scope.roleslist = data.data;
        }, function () {

        });

    }

    $scope.Search = function (rolemap) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {

            var sessionValue = UserMgmtService.getSessions("");

            sessionValue.then(function (data, status, headers, config) {
                $scope.sesson = data.data;
                console.log($scope.sesson);
               
                var mappedUsers = RoleMappedService.SearchMappedandAvailableUsers(rolemap, $scope.sesson.TerminalCode);

                mappedUsers.then(function (data, status, headers, config) {
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
            }, function (data, status, header, config) {
                alert(status);
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

    $scope.chekedornot = function (UsersList, rolemap) {
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

        if ($scope.CheckedId != "" && rolemap.AllocatedORAvailable.name == "Allocated") {
            $scope.Allocate = false;
            $scope.DeAllocate = true;
        }
        else if ($scope.CheckedId != "" && rolemap.AllocatedORAvailable.name == "Available") {
            $scope.Allocate = true;
            $scope.DeAllocate = false;
        }
        else {
            $scope.Allocate = false;
            $scope.DeAllocate = false;
        }
    }

    $scope.AllocateDeAllocate = function (UsersList, rolemap, AllocateDeAllocate) {

        $scope.CheckedId = "";
        if ($window.confirm("Do you want to " + AllocateDeAllocate + "users ?")) {
            angular.forEach(UsersList, function (value, key) {
                if (value.checkedornot) {
                    if ($scope.CheckedId.length == 0) {
                        $scope.CheckedId = value.LoginMId;
                    }
                    else {
                        $scope.CheckedId += ", " + value.LoginMId;
                    }
                }
            });
        };

        if ($scope.IsFormValid) {
            RoleMgmtActDeActService.AllocateDeAllocate($scope.CheckedId, rolemap.roleslist.RoleId, AllocateDeAllocate).then(function (d) {
                alert("User " + AllocateDeAllocate + " Successfully");
                $location.path('/UserRoleMap');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    }

});

UserMgmtapp.service("RoleMappedService", function ($http, $cookies) {

    this.SearchMappedandAvailableUsers = function (rolemap, TerminalCode) {

        var response =
          $http({
              method: "GET",
              url: "/api/RoleData?roleID=" + rolemap.roleslist.RoleId + "&Status=" + rolemap.AllocatedORAvailable.name + "&TerminalCode=" + TerminalCode,
              headers: { 'RequestVerificationToken': $cookies.get('Token') }
          });
        return response;

        //$window.alert("Selected Value: " + rolemapId + "\nSelected Text: " + rolemapName);

    };

});


UserMgmtapp.factory('RoleMgmtActDeActService', function ($http, $q) {
    var fac = {};
    fac.AllocateDeAllocate = function (ids, RoleID, AllocateDeAllocate) {
        console.log(ids);
        var formdata = new FormData();

        formdata.append("ids", ids);
        formdata.append("RoleID", RoleID);
        formdata.append("AllocateDeAllocate", AllocateDeAllocate);

        var defer = $q.defer();

        $http.post("/RoleCRUD/AllocateDeAllocate", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("AllocationDeAllocation failed! Please try again");
        });

        return defer.promise;
    }
    return fac;
});