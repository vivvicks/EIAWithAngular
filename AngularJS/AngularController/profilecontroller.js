UserMgmtapp.controller("profileController", function ($scope, profileMgmtService, profileMgmtAddService, ProfileMgmtRemoveService,ShareData, $http, $cookies, $location, $window, cfpLoadingBar)
{
    var arr = [];
    $scope.removedisable = false;
    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

    GetAllprofiles();

    function GetAllprofiles() {

        var getData = profileMgmtService.getprofiles();

        getData.then(function (data, status, headers, config) {
            $scope.start();            
            $scope.ProfilesList = data.data;      
            $scope.viewby = 10;
            $scope.totalItems = $scope.ProfilesList.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.complete();
        }, function (data, status, header, config) {
            alert(data.data);
        });
    }

    $scope.$watch("form1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });

    $scope.SearchProfiles = function (profile) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            var SearchProfiles = profileMgmtService.SearchProfile(profile);

            SearchProfiles.then(function (data, status, headers, config) {
                $scope.start();
                $scope.ProfilesList = data.data;
                $scope.viewby = 10;
                $scope.totalItems = $scope.ProfilesList.length;
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

    $scope.SaveProfile = function (profile) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            profileMgmtAddService.CreateProfile(profile).then(function (d) {
                alert("Profile Added Successfully");
                $location.path('/ProfileCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

    //console.log($scope.Remove);

    $scope.getIndex = function (ProfileID, isTrue) {
        if (isTrue)
            arr.push(ProfileID);

        else {
            var index = arr.indexOf(ProfileID);
            arr.splice(index, 1);
        }

        if(arr.length > 0)
        {
            $scope.removedisable = true;
        }
        else
        {
            $scope.removedisable = false;
        }

        //console.log($scope.Remove);
    };
    
    $scope.Remove = function () {
        if ($window.confirm("Do you want to remove profiles?")) {
            ProfileMgmtRemoveService.Remove(arr).then(function (d) {
                alert("profile removed Successfully");
                $location.path('/UserRoleMap');
            }, function (e) {
                alert(e);
            });
        };
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

    $scope.start = function () {
        cfpLoadingBar.start();
    };

    $scope.complete = function () {
        cfpLoadingBar.complete();
    }

    $scope.EditProfile = function (Profile) {
        ShareData.value = Profile;
        $location.path('/EditProfile');
    };

});

UserMgmtapp.service("profileMgmtService", function ($http, $cookies) {

    this.getprofiles = function () {
        var response =
           $http({
               method: "GET",
               url: "/api/ProfileData",
               headers: { 'RequestVerificationToken': $cookies.get('Token') }
           });
        return response;
    };

    this.SearchProfile = function (profile) {
        var response =
           $http({
               method: "Post",
               data : JSON.stringify(profile),
               url: "/api/ProfileData",
               headers: { 'RequestVerificationToken': $cookies.get('Token'), 'Content-Type': 'application / json' }
           });
        return response;
    };

    this.getProfilebyID = function (ProfileID) {
        var response =
            $http({
                method: "GET",
                url: "/api/ProfileData/" + ProfileID,
                headers: { 'RequestVerificationToken': $cookies.get('Token') }
            });
        return response;
    }
});

UserMgmtapp.factory('profileMgmtAddService', function ($http, $q) {

    var fac = {};
    fac.CreateProfile = function (profile) {

        //console.log(profile.profilename);
        var formdata = new FormData();
        formdata.append("ProfileName", profile.profilename);
        formdata.append("PwdExpDays", profile.PwdExpDays);
        formdata.append("PwdRetryCount", profile.PwdRetryCount);
        formdata.append("PwdGracePeriod", profile.PwdGracePeriod);
        formdata.append("NoofSessions", profile.NoofSessions);
        var defer = $q.defer();

        $http.post("/Profile/CreateProfile", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Profile Save failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.factory('profileMgmtEditService', function ($http, $q) {

    var fac = {};
    fac.updateRole = function (profile) {


        var formdata = new FormData();
        formdata.append("ProfileID", ShareData.value.ProfileID);
        formdata.append("ProfileName", profile.profilename);
        formdata.append("PwdExpDays", profile.PwdExpDays);
        formdata.append("PwdRetryCount", profile.PwdRetryCount);
        formdata.append("PwdGracePeriod", profile.PwdGracePeriod);
        formdata.append("NoofSessions", profile.NoofSessions);
        var defer = $q.defer();

        $http.post("/Profile/UpdateProfile", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Profile update failed! Please try again");
        });

        return defer.promise;
    }

    return fac;
});

UserMgmtapp.controller("ProfileMgmtEditController", function ($scope, ShareData, profileMgmtService,profileMgmtEditService,ShareData, $http, $cookies, $location, $window, cfpLoadingBar)
{
    var favoriteCookie = $cookies.get('Token');
    var config =
    {
        headers:
        {
            'RequestVerificationToken': favoriteCookie
        }
    };

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

    LoadingProfileData();

    function LoadingProfileData() {

        //console.log(ShareData.value.ProfileID);
        var response = profileMgmtService.getProfilebyID(ShareData.value.ProfileID);

        response.then(function (data) {

            $scope.start();
            $scope.profile = {};
            var Profiledata = data.data;

            $scope.profile.ProfileID = Profiledata.ProfileID;
            $scope.profile.profilename = Profiledata.ProfileName;
            $scope.profile.PwdExpDays = Profiledata.PwdExpDays;
            $scope.profile.PwdRetryCount = Profiledata.PwdRetryCount;
            $scope.profile.PwdGracePeriod = Profiledata.PwdGracePeriod;
            $scope.profile.NoofSessions = Profiledata.NoofSessions;

            $scope.complete();
        }, function () {
            $location.path('/UserCreation');
        });
    }

    $scope.UpdateProfile = function (profile) {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";

        if ($scope.IsFormValid) {
            profileMgmtEditService.updateRole(profile).then(function (d) {
                alert("Profile Updated Successfully");
                $location.path('/ProfileCreation');
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };

});

UserMgmtapp.factory('ProfileMgmtRemoveService', function ($http, $q) {
    var fac = {};
    fac.Remove = function (ids) {
        //console.log(ids);
        var formdata = new FormData();

        formdata.append("ids", ids);

        var defer = $q.defer();

        $http.post("/Profile/Remove", formdata,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
        .success(function (d) {
            defer.resolve(d);
        })
        .error(function () {
            defer.reject("Profile remove failed! Please try again");
        });

        return defer.promise;
    }
    return fac;
});

UserMgmtapp.factory("ShareData", function () {
    return { value: 0 }
});
