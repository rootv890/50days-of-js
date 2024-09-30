const baseURL = 'https://api.weatherbit.io/v2.0/current';
const API_KEY = '1e761d1c37b0432aa16b5bc5da7f8eb9';


// FetchWeather



function fetchWeather ( city )
{
  const url = baseURL + `?city=${city}` +
    `&key=${API_KEY}`;
  console.log( url );

  return fetch( url )
    .then( response =>
    {
      if ( !response.ok )
      {
        throw new Error( "Couldn't fetch data" );
      }
      return response.json();
    } )
    .then( data =>
    {
      // console.log( data );
      storeWeatherData( data );
      displayWeatherData( data );
    } )
    .catch( error =>
    {
      console.error( 'There was a problem with the fetch operation:', error );
    } );
  ;

};

function storeWeatherData ( data )
{
  const weatherData = {
    city: data.data[0].city_name,
    rain: data.data[0].precip,
    temperature: data.data[0].temp,
    countryCode: data.data[0].country_code,
    sunrise: convertToLocalTime( data.data[0].sunrise ),
    sunset: convertToLocalTime( data.data[0].sunset ),
    weatherDescription: data.data[0].weather.description,
    weatherIcon: data.data[0].weather.icon,
    weatherCode: data.data[0].weather.code,
    windSpeed: data.data[0].wind_spd,
  };
  localStorage.setItem( 'weather', JSON.stringify( weatherData ) );

};


function displayWeatherData ( data )
{
  const weatherInfo = JSON.parse( localStorage.getItem( 'weather', data ) );
  document.getElementById( 'weatherData' ).innerHTML = `
        <h2>Weather in ${weatherInfo.city}</h2>
        <p>Country Code: ${weatherInfo.countryCode}</p>
        <p>Temperature: ${weatherInfo.temperature} °C</p>
        <p>Description: ${weatherInfo.weatherDescription}</p>
        <p>Precipitation: ${weatherInfo.rain} %</p>
        <p>Wind Speed: ${weatherInfo.windSpeed} m/s</p>
        <p>SunRise: ${weatherInfo.sunrise}</p>
        <p>Sunset: ${weatherInfo.sunset}</p>
    `;

}



const searchWeather = document.querySelector( '.location-input' );
searchWeather.addEventListener( 'input', ( event ) =>
{
  const city = event.target.value;

  fetchWeather( city );

} );


const convertToLocalTime = ( utcTime ) =>
{
  const [hours, minutes] = utcTime.split( ':' ).map( Number );
  const date = new Date(); // Get current date
  date.setUTCHours( hours, minutes ); // Set UTC hours and minutes
  return date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } ); // Format to local time
};
