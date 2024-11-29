import './styles.css'

const API_KEY = 'NGKVSPFRAZBZ64P2U2L56JK25'

const BASE =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

// Form and container references
const form = document.getElementById('weather-form')
const container = document.getElementById('weather-info')

// Listen for form submission
form.addEventListener('submit', (event) => {
  event.preventDefault() // Prevent page reload on form submission

  // Get the input value (user's location)
  const locationInput = document.getElementById('location').value.trim()

  // Validate input
  if (locationInput === '') {
    alert('Please enter a location')
    return
  }

  // Fetch weather for the provided location
  fetchWeather(locationInput)
})

// Fetch weather data
function fetchWeather(location) {
  const apiHit = `${BASE}${location}?key=${API_KEY}`

  fetch(apiHit)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return res.json()
    })
    .then((data) => processWeatherData(data))
    .then((processedData) => {
      renderWeatherData(processedData) // Render weather in the DOM
    })
    .catch((err) => {
      console.error('Error fetching weather data:', err)
      alert(
        'Could not fetch weather data. Please check the location or try again later.'
      )
    })
}

// Function to process the API response
function processWeatherData(data) {
  const { address, currentConditions, days } = data

  return {
    location: address,
    current: {
      temperature: currentConditions.temp,
      feelslike: currentConditions.feelslike,
      humidity: currentConditions.humidity,
      description: currentConditions.conditions,
      icon: currentConditions.icon,
      uvIndex: currentConditions.uvindex,
    },
    forecast: days.map((day) => ({
      date: day.datetime,
      maxTemp: day.tempmax,
      minTemp: day.tempmin,
      condition: day.conditions,
      uvIndex: day.uvindex,
      icon: day.icon,
    })),
  }
}

// Function to render weather data in the DOM
function renderWeatherData(data) {
  // Clear previous content
  container.innerHTML = ''

  // Render location
  const locationHTML = `<h1>Weather Report for ${data.location}</h1>`

  // Render current weather
  const currentWeatherHTML = `
    <div class="current-weather">
      <h2>Current Weather</h2>
      <p>Temperature: ${data.current.temperature}°F</p>
      <p>Feels-like: ${data.current.feelslike}°F</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Description: ${data.current.description}</p>
      <div><img src="media/${data.current.icon}.svg"></div>
      <p>UV Index: ${data.current.uvIndex}</p>
    </div>
  `

  // Render forecast
  const forecastHTML = `
    <div class="forecast">
      <h2>Forecast</h2>
      ${data.forecast
        .map(
          (day) => `
        <div class="forecast-day">
          <p>Date: ${day.date}</p>
          <p>Max Temp: ${day.maxTemp}°F</p>
          <p>Min Temp: ${day.minTemp}°F</p>
          <p>Condition: ${day.condition}</p>
          <div><img src="media/${day.icon}.svg"></div>
          <p>UV Index: ${day.uvIndex}</p>
        </div>
      `
        )
        .join('')}
    </div>
  `

  // Combine and insert into the container
  container.innerHTML = locationHTML + currentWeatherHTML + forecastHTML
}
