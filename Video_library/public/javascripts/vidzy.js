var app = angular.module('Vidzy', ['ngResource', 'ngRoute']);
app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',                 // HOME
            controller: 'HomeCtrl'
        })
        .when('/about', {
            templateUrl: 'partials/about.html'                 // NAV BAR LINK
        })
        .when('/contact', {
            templateUrl: 'partials/contact.html'               // NAV BAR LINK
        })
        .when('/add-video', {                                   // CREATE
            templateUrl: 'partials/video-create.html',
            controller: 'CreateVideoCtrl'
        })
        .when('/video/:id', {                                   // RETRIEVE
            templateUrl: 'partials/video-retrieve.html',
            controller: 'RetrieveVideoCtrl'
        })
        .when('/video/update/:id', {                            // UPDATE
            templateUrl: 'partials/video-update.html',
            controller: 'EditVideoCtrl'
        })
        .when('/video/delete/:id', {                            // DELETE
            templateUrl: 'partials/video-delete.html',
            controller: 'DeleteVideoCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);
    }]
);

// HOME
app.controller('HomeCtrl', function($scope, $resource, $location) {
    var keyword = $location.search().keyword;
    var genre = $location.search().genre_select;
    if (genre) { 
        var indexOfColon = genre.indexOf(":");
        genre = genre.substr(indexOfColon + 1);
    }
    var Videos = $resource('/api/videos', {search: keyword, genre: genre});

    Videos.query(function(videos) {
        $scope.videos = videos;
        var genres = [];
        $.each(videos, function () {
            genres.push($(this)[0]['genre']);
        });
        $scope.genres = genres;
    });
});

// CREATE
app.controller('CreateVideoCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Videos = $resource('/api/videos');
            Videos.save($scope.video, function(){
                $location.path('/');
            });
        };
    }]
);

// RETRIEVE
app.controller('RetrieveVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        })
    }]);

// UPDATE
app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){   
        var Videos = $resource('/api/videos/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        });

        $scope.save = function(){
            Videos.update($scope.video, function(){
                $location.path('/');
            });
        }
    }]);

// DELETE
app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        })

        $scope.delete = function(){
            Videos.delete({ id: $routeParams.id }, function(video){
                $location.path('/');
            });
        }
    }]);