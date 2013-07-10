'use strict';

angular.module('pogsUiApp', ['ui', 'ui.bootstrap', 'ngResource', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pog/:id', {
        templateUrl: 'views/pog.html',
        controller: 'PogCtrl'
      })
      .when('/mart/:id/:type/:dataset', {
        templateUrl: 'views/mart.html',
        controller: 'MartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
