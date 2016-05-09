var app = angular.module("weatherApp", []);

app.controller("weatherController", function($scope) {
    $scope.title = "bonk"
    $scope.weather = parse_weather_from_api();
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
        "variance": roundToTwo(Math.abs(json.main.temp_min - json.main.temp_max)),
        "value": json.main.temp
    };
    weather.description = json.weather[0].description;
    weather.id = json.weather[0].id;
    weather.iconCode = "wi-owm-" + weather.id;

    return weather;
};

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
