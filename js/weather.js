var app = angular.module("weatherApp", []);

app.controller("weatherController", function($scope) {
    $scope.weather = parse_weather_from_api();
    $scope.units = "c"

    $scope.toFarenheit = function() {
        $scope.units = "f";
    }

    $scope.toCelsius = function() {
        $scope.units = "c";
    }
});

function parse_weather_from_api() { // TODO: add handling for coordinates
    //DONT STEAL MY SUNSHINE
    //http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=3ce6d91c31783161e36ac9d63fe94e49

    var json = { // for testing
        "coord": {
            "lon": 138.93,
            "lat": 34.97
        },
        "weather": [{
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }],
        "base": "stations",
        "main": {
            "temp": 292.76,
            "pressure": 1015,
            "humidity": 34,
            "temp_min": 292.59,
            "temp_max": 293.15
        },
        "wind": {
            "speed": 2.57,
            "deg": 170,
            "gust": 3.08
        },
        "rain": {
            "3h": 0.0225
        },
        "clouds": {
            "all": 92
        },
        "dt": 1462747535,
        "sys": {
            "type": 3,
            "id": 10354,
            "message": 0.0286,
            "country": "JP",
            "sunrise": 1462650352,
            "sunset": 1462700164
        },
        "id": 1851632,
        "name": "Shuzenji",
        "cod": 200
    }

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

    return weather;
};

function kelvinToCelsius(value) {
  return value - 273.15;
}

function kelvinToFarenheit(value) {
  return value * 9/5 - 459.67;
}

function roundTo(num, decimalPlaces) {
    return +(Math.round(num + "e+" + decimalPlaces) + "e-" + decimalPlaces);
}
