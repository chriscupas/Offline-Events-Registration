// @author : chriscupas <chriscupas@yahoo.com>

    var app = angular.module('myapp', ["ngRoute"]);

    app.config(function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })
            .when('/register', {
                templateUrl : 'pages/register.html',
                controller  : 'registerController'
            })
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            })
            .otherwise({
                redirectTo: "wow.html"
            })
    });

        // create the controller and inject Angular's $scope
    app.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    app.controller('registerController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    app.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });
