UserMgmtapp.directive('mydatepickerreg', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (date) {
                    scope.DOB = date;
                    scope.CourierCoRegistrationExpiryDt = date;
                    scope.$apply();
                }
            });
        }
    };
});


UserMgmtapp.directive('mydatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (date) {
                    scope.DOB = date;
                    scope.CourierCoRegistrationExpiryDt = date;
                    scope.DateOfArrival = date;
                    scope.IgmDate = date;
                    scope.$apply();
                }
            });
        }
    };
});



var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};

UserMgmtapp.directive("compareTo", compareTo);


UserMgmtapp.directive('onlyAlphabets', function () {
    debugger;
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            ngModel.$parsers.unshift(function (inputValue) {
                var alphabets = inputValue.split('').filter(function (s) {
                    return (isALetter(s));
                }).join('');
                ngModel.$viewValue = alphabets;
                ngModel.$render();
                return alphabets;
            });
        }
    };

    function isALetter(charVal) {
        if (charVal.toUpperCase() != charVal.toLowerCase()) {
            return true;
        }
        else {
            return false;
        }
    }
});

UserMgmtapp.directive('usernameAvailable', function ($timeout, $q) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, elm, attr, model) {
            model.$asyncValidators.usernameExists = function () {

                //here you should access the backend, to check if username exists
                //and return a promise
                //here we're using $q and $timeout to mimic a backend call 
                //that will resolve after 1 sec

                var defer = $q.defer();
                $timeout(function () {
                    model.$setValidity('usernameExists', false);
                    defer.resolve;
                }, 1000);
                return defer.promise;
            };
        }
    }
});



