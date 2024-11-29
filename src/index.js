import './styles.css'

const API_KEY = 'NGKVSPFRAZBZ64P2U2L56JK25'

const BASE =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

// Form and container references
const form = document.getElementById('weather-form')
const container = document.getElementById('weather-info')

// Create a loading element
const loading = document.createElement('div')
loading.id = 'loading'
loading.textContent = 'Loading...'
document.body.append(loading) // Add it to the body or another container

// State to track temperature scale
let isCelsius = false // Default scale is Fahrenheit

// Create a toggle button (move it outside the render function)
const toggleButton = document.createElement('button')
toggleButton.textContent = 'Switch to Celsius'
toggleButton.addEventListener('click', () => {
  isCelsius = !isCelsius
  toggleButton.textContent = isCelsius
    ? 'Switch to Fahrenheit'
    : 'Switch to Celsius'
  renderWeatherData(currentData) // Re-render data with updated scale
})

// Keep a reference to the current weather data
let currentData = null

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

  // Show loading component
  showLoading()

  // Fetch weather for the provided location
  fetchWeather(locationInput)
})

// Fetch weather data
function fetchWeather(location) {
  const apiHit = `${BASE}${encodeURIComponent(location)}?key=${API_KEY}`
  console.log('API Request URL:', apiHit) // Log the exact URL being called

  fetch(apiHit)
    .then((res) => {
      console.log('Response status:', res.status) // Log the response status
      if (!res.ok) {
        return res.text().then((errorText) => {
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorText}`
          )
        })
      }
      return res.json()
    })
    .then((data) => processWeatherData(data))
    .then((processedData) => {
      renderWeatherData(processedData)
    })
    .catch((err) => {
      console.error('Detailed error fetching weather data:', err)
      alert(`Could not fetch weather data. Error: ${err.message}`)
    })
    .finally(() => {
      hideLoading() // Hide loading component after the request finishes
    })
}

// Function to process the API response
function processWeatherData(data) {
  const { address, currentConditions, days } = data

  return {
    location: address,
    current: {
      temperature: currentConditions.temp, // Fahrenheit by default
      feelslike: currentConditions.feelslike, // Fahrenheit by default
      humidity: currentConditions.humidity,
      description: currentConditions.conditions,
      icon: currentConditions.icon,
      uvIndex: currentConditions.uvindex,
    },
    forecast: days.map((day) => ({
      date: day.datetime,
      maxTemp: day.tempmax, // Fahrenheit by default
      minTemp: day.tempmin, // Fahrenheit by default
      condition: day.conditions,
      uvIndex: day.uvindex,
      icon: day.icon,
    })),
  }
}

// Function to convert temperature
function convertTemperature(temp, toCelsius) {
  // Convert only when switching scales
  return toCelsius
    ? Math.round(((temp - 32) * 5) / 9) // Fahrenheit to Celsius
    : Math.round(temp) // Keep Fahrenheit values unchanged
}

// Function to render weather data in the DOM
function renderWeatherData(data) {
  currentData = data // Store the data for re-renders
  container.innerHTML = '' // Clear previous content

  // Render location
  const locationHTML = `<h1>Weather Report for ${data.location}</h1>`

  // Render current weather
  const currentWeatherHTML = `
    <div class="current-weather">
      <h2>Current Weather</h2>
      <div id="current-icon"></div>
      <p>Temperature: ${convertTemperature(
        data.current.temperature,
        isCelsius
      )}°${isCelsius ? 'C' : 'F'}</p>
      <p>Feels-like: ${convertTemperature(
        data.current.feelslike,
        isCelsius
      )}°${isCelsius ? 'C' : 'F'}</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Description: ${data.current.description}</p>
      <p>UV Index: ${data.current.uvIndex}</p>
    </div>
  `

  // Render forecast
  const forecastHTML = `
    <div class="forecast">
      <h2>Forecast</h2>
      <div id="forecast-days">
        ${data.forecast
          .map(
            (day, index) => `
          <div class="forecast-day" id="forecast-icon-${index}">
            <p>Date: ${day.date}</p>
            <div></div>
            <p>Max Temp: ${convertTemperature(
              day.maxTemp,
              isCelsius
            )}°${isCelsius ? 'C' : 'F'}</p>
            <p>Min Temp: ${convertTemperature(
              day.minTemp,
              isCelsius
            )}°${isCelsius ? 'C' : 'F'}</p>
            <p>Condition: ${day.condition}</p>
            <p>UV Index: ${day.uvIndex}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `

  const weatherHeader = document.createElement('div')
  weatherHeader.id = 'header'
  weatherHeader.innerHTML = locationHTML
  weatherHeader.append(toggleButton) // Append the toggle button only once

  const weatherContainer = document.createElement('div')
  weatherContainer.id = 'info-container'
  weatherContainer.innerHTML = currentWeatherHTML + forecastHTML

  // Combine and insert into the container
  container.append(weatherHeader)
  container.append(weatherContainer)

  // Dynamically load icons
  import(`./media/${data.current.icon}.svg`)
    .then((iconModule) => {
      const currentIconDiv = document.getElementById('current-icon')
      currentIconDiv.innerHTML = `<img src="${iconModule.default}" alt="Current weather icon">`
    })
    .catch((err) => console.error('Error loading current icon:', err))

  // Load forecast icons
  data.forecast.forEach((day, index) => {
    import(`./media/${day.icon}.svg`)
      .then((iconModule) => {
        const forecastIconDiv = document.querySelector(
          `#forecast-icon-${index} div`
        )
        forecastIconDiv.innerHTML = `<img src="${iconModule.default}" alt="Forecast weather icon">`
      })
      .catch((err) =>
        console.error(`Error loading forecast icon ${index}:`, err)
      )
  })

  container.style.opacity = '1'
  container.style.transition = '300ms'
}

// Show the loading spinner
function showLoading() {
  loading.style.display = 'block'
}

// Hide the loading spinner
function hideLoading() {
  loading.style.display = 'none'
}
