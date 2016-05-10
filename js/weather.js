"use strict"

angular.module('weatherApp', [])
    .controller("weatherController", function($scope, $http) {

        // put this in a function + handle refresh

        showWeatherForUserLocation();

        function showWeatherForUserLocation() {
            getUserLocation()
                .then(function(coords) {
                    var url = getWeatherApiURL(coords)
                    return $http.get(url);
                })
                .then(function(response) {
                    $scope.weather = parseWeatherFromJSON(response.data);
                    $scope.$apply();
                })
                .catch(function(response) {
                    console.log("request failed - handle me)")
                });
        };

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


function getWeatherApiURL(coords) {
    return sprintf("https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=3ce6d91c31783161e36ac9d63fe94e49", coords.latitude, coords.longitude);
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
