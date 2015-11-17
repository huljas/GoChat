angular.module('admin').config(function($stateProvider, $urlRouterProvider) {
    'use strict';

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('chat', {
            url: '',
            templateUrl: 'navigation.html',
            abstract: true
        })
        .state('chat.home', {
            url: '/',
            controller: 'HomeCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'apps/home/home.html'
        });
});