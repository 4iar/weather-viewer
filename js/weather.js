"use strict"
var app = angular.module("weatherApp", []);
var $http = angular.injector(["ng"]).get("$http");

app.controller("weatherController", function($scope) {

    getUserLocation()
        .then(function(coords) {
            return requestWeatherJSON(coords);
        })
        .then(function(json) {
            $scope.weather = parseWeatherFromJSON(json);
            $scope.$apply();
        });

    $scope.units = "c"

    $scope.toFarenheit = function() {
        $scope.units = "f";
    }

    $scope.toCelsius = function() {
        $scope.units = "c";
    }
});

function getUserLocation() {
    return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                resolve({
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude,
                });
            });
        };
    })
};

function requestWeatherJSON(coords) {
    return new Promise(function(resolve, reject) {
        // TODO: check if there is an api option to get degF or degC directly
        // this would cut out the need for two conversions (i.e. K->degC & degF vs degC->degF)
        var api_url = sprintf("https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=3ce6d91c31783161e36ac9d63fe94e49", coords.latitude, coords.longitude);
        $http.get(api_url).success(function(json) {
            resolve(json);
        });
    });
};

function parseWeatherFromJSON(json) {
    var weather = {};
    weather.temperature = {
        "variance": {
            "c": roundTo(Math.abs(json.main.temp_min - json.main.temp_max), 2),
            "f": roundTo(Math.abs(kelvinToFarenheit(json.main.temp_min) - kelvinToFarenheit(json.main.temp_max)), 2),
        },
        "value": {
            "c": roundTo(kelvinToCelsius(json.main.temp), 1),
            "f": roundTo(kelvinToFarenheit(json.main.temp), 1),
        }
    };
    weather.description = json.weather[0].description;
    weather.id = json.weather[0].id;
    weather.iconCode = "wi-owm-" + weather.id;
    weather.location_name = json.name;

    return weather;
};

function kelvinToCelsius(value) {
    return value - 273.15;
}

function kelvinToFarenheit(value) {
    return value * 9 / 5 - 459.67;
}

function roundTo(num, decimalPlaces) {
    return +(Math.round(num + "e+" + decimalPlaces) + "e-" + decimalPlaces);
}
