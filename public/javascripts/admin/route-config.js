var app = angular.module("spartAdmin", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/admin/userTab.html",
        controller  : 'admUserController'
    })
    .when("/organization", {
        templateUrl : "templates/admin/organizationTab.html",
        controller  : 'admOrgController'
    })
});