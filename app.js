var weatherapp = angular.module("weatherApp", ["ngRoute", "ngResource"]);

weatherapp.service("cityService", function() {
	this.city = 'London';
	this.days = '';
})

weatherapp.controller("homeController", ["$scope", "$routeParams", "$location", "cityService", function($scope, $routeParams, $location, cityService) {

	$scope.days = cityService.days;
	$scope.city = cityService.city;

	$scope.$watch('city', function(){ 
		cityService.city = $scope.city;
	})

	$scope.$watch('days', function(){
		cityService.days = $scope.days;
	})

	$scope.submit = function() {
		$location.path("/").url('/forecast/' + $scope.days);
	}

}])

weatherapp.controller("forecastController", ["$scope", "$routeParams", "$resource", "$location", "cityService", function($scope, $routeParams, $resource, $location, cityService) {

		$scope.days = '';

		// local scope variable = city variable from the cityService
		$scope.city = cityService.city;

		// route parameter day is equal to local scope variable for day - default parameter is set to 3 days.
		$scope.days = $routeParams.days || '3';

		// calling data from external API and declaring callback so we get a reply.
		var weatherdata = $resource('https://api.openweathermap.org/data/2.5/forecast/daily?appid=542ffd081e67f4512b705f89d2a611b2', {callback: "JSON_CALLBACK" }, {get: { method: "JSONP" }});

		// telling API what data is required and assigning to local scope variable.
		weatherdata.get({q: $scope.city, cnt: $scope.days}, function(result) {
			$scope.weatherresult = result;

		// assign resulting data from API above to weatherResult variable. 
		var weatherResult = $scope.weatherresult;

		// converting data from API to user readable data
		$scope.convertFarheinheit = function(kelvintemp) {
			return Math.round(1.8 * (kelvintemp - 273) + 32);
		}

		// converting date to readable format
		$scope.convertDate = function(dt) {
			return new Date(dt * 1000);
		}
	})
}])


weatherapp.config(function($routeProvider) {
	$routeProvider 
	.when("/", {
		templateUrl: 'pages/main.html',
		controller: 'homeController'
	})
	.when("/forecast", {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
	.when("/forecast/:days", {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
	.otherwise({
		redirectTo: "/"
	});
});

