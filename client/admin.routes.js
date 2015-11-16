angular.module('admin').config(function($stateProvider, $urlRouterProvider) {
    'use strict';

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('admin', {
            url: '',
            templateUrl: 'navigation.html',
            abstract: true
        })
        .state('admin.home', {
            url: '/home',
            controller: 'HomeCtrl',
            controllerAs: 'vm',
            templateUrl: 'apps/home/home.html'
        })
        .state('admin.metrics', {
            url: '/metrics',
            templateUrl: 'apps/metrics/metrics.html'
        });
});