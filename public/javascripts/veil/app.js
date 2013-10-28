'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('veilApp', ['veilApp.controllers', 'veilApp.services', 'dropstore-ng', 'recordWrapper']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {templateUrl: '/partials/home_template', controller: 'homeCtrl'});
        $routeProvider.when('/list', {templateUrl: '/partials/list_template', controller: 'listCtrl'});
        $routeProvider.when('/masterKey', {templateUrl: '/partials/master_key_template', controller: 'masterKeyCtrl'});

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true);
    }])