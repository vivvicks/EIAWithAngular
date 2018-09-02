UserMgmtapp.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('/', {
        url : '',
        templateUrl: '/Templates/Home.html',
        controller: ''
    })
    .state('UserCreation', {
        url : '/UserCreation',
        templateUrl: '/Templates/UserDetail.html',
        controller: 'UserMgmtController'
    })
    .state('AddUser', {
        url: '/AddUser',
        templateUrl: '/Templates/AddUser.html',
        controller: 'UserMgmtController'
    })
    .state('EditUser', {
        url : '/EditUser',
        templateUrl: '/Templates/EditUser.html',
        controller: 'UserMgmtEditController'
    })
    .state('RoleCreation', {
        url: '/RoleCreation',
        templateUrl: '/Templates/RoleDetail.html',
        controller: 'RoleMgmtController'
    })
    .state('AddRole', {
        url: '/AddRole',
        templateUrl: '/Templates/AddRole.html',
        controller: 'RoleMgmtController'
    })
    .state('EditRole', {
        url: '/EditRole',
        templateUrl: '/Templates/EditRole.html',
        controller: 'RoleMgmtEditController'
    })
    .state('UserRoleMap', {
        url: '/UserRoleMap',
        templateUrl: '/Templates/RoleMap.html',
        controller: 'UserRoleMapController'
    })
    .state('ProfileCreation', {
        url : '/ProfileCreation',
        templateUrl: '/Templates/Profile.html',
        controller: 'profileController'
    })
    .state('AddProfile', {
        url : '/AddProfile',
        templateUrl: '/Templates/AddProfile.html',
        controller: 'profileController'
    })
    .state('EditProfile', {
        url : '/EditProfile',
        templateUrl: '/Templates/EditProfile.html',
        controller: 'ProfileMgmtEditController'
    })
    .state('couriermaster', {
        url: '/couriermaster',
        templateUrl: '/Templates/CourierDetails.html',
        controller: 'MastersController'
    })
    .state('AddCourier', {
        url: '/AddCourier',
        templateUrl: '/Templates/AddCourier.html',
        controller: 'MastersController'
    })
    .state('EditCourier', {
        url: '/EditCourier',
        templateUrl: '/Templates/EditCourier.html',
        controller: 'MastersEditController'
    })
    .state('flightmaster', {
        url: '/flightmaster',
        templateUrl: '/Templates/FlightDetails.html',
        controller: 'MastersController'
    })
    .state('EditFlight', {
        url: '/EditFlight',
        templateUrl: '/Templates/AddEditFlightdetail.html',
        controller: 'MastersEditController'
    })
    .state('AddFlight', {
        url: '/AddFlight',
        templateUrl: '/Templates/AddEditFlightdetail.html',
        controller: 'MastersController'
    })
    .state('Form1', {
        url : '/Form1',
        templateUrl: '/Templates/Form1.html',
        controller: 'ImportController'
    })
     .state('Form1Search', {
         url: '/Form1Search',
         templateUrl: '/Templates/Form1Search.html',
         controller: 'FormISearchController'
     })

    $urlRouterProvider.otherwise('/Login/Login');
});
