app.controller("LoginController", function ($scope, $http, $window, $cookies) {

    $scope.cuttext = false;
    $scope.copytext = false;
    $scope.pasttext = false;
    $scope.submitForm = function (Login) {

        var newval = hex_md5($scope.Login.password).toUpperCase() + $scope.Login.Username.toUpperCase();
        var newvalue = hex_md5(newval).toUpperCase() + String($scope.Login.key);

        //var hash = calcMD5(Login.password).toUpperCase();
        $scope.Login.password = hex_md5(newvalue);
    };

});