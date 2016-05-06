// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.notestore', 'starter.services', 'starter.dataService'])

  .run(function ($ionicPlatform, $rootScope, $localstorage, Data) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault()
      }

      Data.initialize() // should load defaults

    })
  })

  // from http://stackoverflow.com/questions/16388562/angularjs-force-uppercase-in-textbox
  .directive('lowercased', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (input) {
          return input ? input.toLowerCase() : ''
        })
        element.css('text-transform', 'lowercase')
      }
    }
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'handbook': {
            templateUrl: 'templates/home.html',
            controller: 'ListController'
          }
        }
      })

      .state('app.clinical', {
        url: '/clinical',
        views: {
          'handbook': {
            templateUrl: 'templates/list.html',
            controller: 'ListController'
          }
        }
      })

      .state('app.detail', {
        url: '/clinical/:aId',
        views: {
          'handbook': {
            templateUrl: 'templates/detail.html',
            controller: 'ListController'
          }
        }
      })

      .state('app.department', {
        url: '/department',
        views: {
          'handbook': {
            templateUrl: 'templates/department.html',
            controller: 'ListController'
          }
        }
      })

      .state('app.info', {
        url: '/department/:aId',
        views: {
          'handbook': {
            templateUrl: 'templates/info.html',
            controller: 'ListController'
          }
        }
      })

      .state('app.todolist', {
        url: '/todo',
        views: {
          'handbook': {
            templateUrl: 'templates/todolist.html',
            controller: 'TodoListController'
          }
        }
      })

      .state('app.editTodo', {
        url: '/edit/:noteId',
        views: {
          'handbook': {
            templateUrl: 'templates/editTodo.html',
            controller: 'EditListController'
          }
        }
      })

      .state('app.addTodo', {
        url: '/add',
        views: {
          'handbook': {
            templateUrl: 'templates/editTodo.html',
            controller: 'AddListController'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'handbook': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsController',
            cached: false
          }
        }
      })

      .state('app.about', {
        url: '/about',
        views: {
          'handbook': {
            templateUrl: 'templates/about.html'

          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home')
  })
