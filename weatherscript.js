function Weather(){
    const urlParams = new URLSearchParams(window.location.search);
    var zipcode = urlParams.get('zip');

    if(zipcode == null) {
        //Default to Fargo, ND!
        zipcode = "58104";
    }
    
    //If you are self hosting make sure to change this URL to your own
    $.getJSON( "https://nicksneeze.azurewebsites.net/api/weather2?zip=" + zipcode + "&code=qX3FhEvo0mEyDE5bDqdeA7EUKaTjgTXxaDV2w8lLv/RKUo84s/CeJw==", 
    function( json ) {
        document.title = "Weather - " + json.location;
        $('#location').text(json.location);

        $('#currentcondition').text(json.currently.summary);
        $('#currentconditionicon').addClass(ChooseIcon(json.currently.icon));
        $('#currentfeelslike').text(Math.round(json.currently.apparentTemperature));
        $('#currenttemp').text(Math.round(json.currently.temperature));
        $('#currentwind').text(Math.round(json.currently.windSpeed) + ' mph');

        var laterdate = new Date(json.hourly.data[2].time * 1000);
        var options = { hour: 'numeric' };
        $('#latertime').text(laterdate.toLocaleTimeString('en-US', options));
        $('#latercondition').text(json.hourly.data[2].summary);
        $('#laterconditionicon').addClass(ChooseIcon(json.hourly.data[2].icon));
        $('#latertemp').text(Math.round(json.hourly.data[2].temperature));
        $('#laterwind').text(Math.round(json.hourly.data[2].windSpeed) + ' mph');
        $('#laterfeelslike').text(Math.round(json.hourly.data[2].apparentTemperature));

        $('#tomorrowcondition').text(json.daily.data[1].summary.replace(' throughout the day.', ''));
        $('#tomorrowconditionicon').addClass(ChooseIcon(json.daily.data[1].icon));
        $('#tomorrowhightemp').text(Math.round(json.daily.data[1].temperatureHigh));
        $('#tomorrowlowtemp').text(Math.round(json.daily.data[1].temperatureLow));
        $('#tomorrowwind').text(Math.round(json.daily.data[1].windSpeed) + ' mph');
        $('#tomorrowfeelslike').text(Math.round(json.daily.data[1].apparentTemperatureHigh));
        
        var nextdaydate = new Date(json.daily.data[2].time * 1000);
        $('#nextdayday').text(getDayString(nextdaydate.getDay()));
        $('#nextdaycondition').text(json.daily.data[2].summary.replace(' throughout the day.', ''));
        $('#nextdayconditionicon').addClass(ChooseIcon(json.daily.data[2].icon));
        $('#nextdayhightemp').text(Math.round(json.daily.data[2].temperatureHigh));
        $('#nextdaylowtemp').text(Math.round(json.daily.data[2].temperatureLow));
        $('#nextdaywind').text(Math.round(json.daily.data[2].windSpeed) + ' mph');
        $('#nextdayfeelslike').text(Math.round(json.daily.data[2].apparentTemperatureHigh));
        
        var alerts = '';
        $.each(json.alerts, function(index, value){
            alerts = alerts + '<div class="alert alert-dark" role="alert"><h3>' + value.title + '</h3><p>' + shredAlert(value.description) + '</p></div>';
        });
        $('#weatheralerts').html(alerts);
    });
    
}  

function shredAlert(alerttext){
    var split = alerttext.split('...');
    return split[1];
}

function ChooseIcon(weather){
    switch(weather) {
        case 'clear-day':
            return 'typcn-weather-sunny';
        case 'clear-night':
            return 'typcn-weather-night';
        case 'partly-cloudy-day':
            return 'typcn-weather-partly-sunny';
        case 'partly-cloudy-night':
        case 'cloudy':
            return 'typcn-weather-cloudy';
        case 'rain':
            return 'typcn-weather-shower';
        case 'thunderstorm':
            return 'typcn-weather-stormy';
        case 'snow':
        case 'sleet':
            return 'typcn-weather-snow';
        case 'fog':
            return 'typcn-waves';
        case 'wind':
            return 'typcn-weather-windy';
        default:
            return 'typcn-weather-partly-sunny';
    }
}

function getDayString(daynum){
    var day = '';
    switch (daynum) {
        case 0:
          day = "Sunday";
          break;
        case 1:
          day = "Monday";
          break;
        case 2:
           day = "Tuesday";
          break;
        case 3:
          day = "Wednesday";
          break;
        case 4:
          day = "Thursday";
          break;
        case 5:
          day = "Friday";
          break;
        case 6:
          day = "Saturday";
      }
    return day;
}

$( document ).ready(function() {
    Weather();
});
