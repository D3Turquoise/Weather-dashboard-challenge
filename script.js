// TODO: Style current HTML

const apiKey = (`576fa128ee8a36649e806e305a625c09`);
const history = JSON.parse(localStorage.getItem('history')) || [];
// TODO: Populate history list from local storage when page loads

$('#search-form').on('submit', function(event) {
    event.preventDefault();

    const userInput = $('#search-input').val();
    const queryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey;
    // TODO: put the search value on the history list container

    // Add the history to local storage
    history.push(userInput);
    localStorage.setItem('history', JSON.stringify(history));

    // Call Geocoding API when search form is submitted to find city lat and long value
    $.ajax({ url: queryUrl })
        .then(function(response) {
            const lat = response[0].lat;
            const lon = response[0].lon;

            const weatherQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

            // Call 5 day weather forecast API after we have city lat and lon value
            $.ajax({ url: weatherQueryUrl })
                .then(function(weatherResponse) {
                    console.log(weatherResponse)
                    // Put the response on the HTML page
                    const weatherList = weatherResponse.list;

                    const weathers = [];
                    for (let i = 0; i < weatherList.length; i += 8) {
                        // i = 0 + 8 ---> i = 8
                        // 
                        weathers.push(weatherList[i]);
                    }

                    console.log(weathers)

                    for(i = 0; i < weathers.length; i++) {
                        const cardDiv = $("<div class='card'>")
                        cardDiv.html(`
                                    <div class="card-header">
                                    <h4>${moment(weathers[i].dt*1000).format("DD/MM/YYYY")}</h4>
                                    <img class ="weather-icon" src=" https://openweathermap.org/img/wn/${weathers[i].weather[0].icon}@2x.png"/>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">Temp: ${weathers[i].main.temp}</li>
                                    <li class="list-group-item">Wind: ${weathers[i].wind.speed}</li>
                                    <li class="list-group-item">Humidity: ${weathers[i].main.humidity}</li>
                                </ul>
                        `)

                        $("#forecast").append(cardDiv)
                    }



                });
        });
});