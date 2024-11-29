const container = document.getElementById('weather-info')
const loading = document.createElement('div')
loading.id = 'loading'
loading.textContent = 'Loading...'
document.body.append(loading)

// Toggle state for temperature units (Celsius or Fahrenheit)
let isCelsius = false // Default scale is Fahrenheit

// Create a toggle button (to switch temperature units)
const toggleButton = document.createElement('button')
toggleButton.textContent = 'Switch to Celsius'
toggleButton.addEventListener('click', () => {
  isCelsius = !isCelsius
  toggleButton.textContent = isCelsius
    ? 'Switch to Fahrenheit'
    : 'Switch to Celsius'
  if (currentData) {
    renderWeatherData(currentData) // Re-render data with updated scale
  }
})

// State for the current weather data
let currentData = null

// Function to render the weather data
function renderWeatherData(data) {
  currentData = data // Save data for re-renders
  container.innerHTML = '' // Clear any previous content

  const locationHTML = `<h1>Weather Report for ${data.location}</h1>`

  const currentWeatherHTML = `
    <div class="current-weather">
      <h2>Current Weather</h2>
      <div id="current-icon"></div>
      <p>Temperature: ${convertTemperature(data.current.temperature, isCelsius)}°${isCelsius ? 'C' : 'F'}</p>
      <p>Feels-like: ${convertTemperature(data.current.feelslike, isCelsius)}°${isCelsius ? 'C' : 'F'}</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Description: ${data.current.description}</p>
      <p>UV Index: ${data.current.uvIndex}</p>
    </div>
  `

  const forecastHTML = `
    <div class="forecast">
      <h2>Forecast</h2>
      <div id="forecast-days">
        ${data.forecast
          .map(
            (day, index) => `
          <div class="forecast-day" id="forecast-icon-${index}">
            <p class="date">Date: ${day.date}</p>
            <div></div>
            <p>Max Temp: ${convertTemperature(day.maxTemp, isCelsius)}°${isCelsius ? 'C' : 'F'}</p>
            <p>Min Temp: ${convertTemperature(day.minTemp, isCelsius)}°${isCelsius ? 'C' : 'F'}</p>
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

  container.append(weatherHeader)
  container.append(weatherContainer)

  // Dynamically load the current weather icon
  import(`./media/${data.current.icon}.svg`)
    .then((iconModule) => {
      const currentIconDiv = document.getElementById('current-icon')
      currentIconDiv.innerHTML = `<img src="${iconModule.default}" alt="Current weather icon">`
    })
    .catch((err) => console.error('Error loading current icon:', err))

  // Dynamically load the forecast weather icons
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

  // Apply opacity transition for smooth visibility change
  container.style.opacity = '0' // Initial opacity 0
  container.style.transition = 'opacity 300ms' // Smooth opacity transition
  setTimeout(() => {
    container.style.opacity = '1' // After a short delay, set opacity to 1
  }, 0)
}

function convertTemperature(temp, toCelsius) {
  return toCelsius ? Math.round(((temp - 32) * 5) / 9) : Math.round(temp)
}

// Show the loading component
function showLoading() {
  loading.style.display = 'block'
}

// Hide the loading component
function hideLoading() {
  loading.style.display = 'none'
}

export { renderWeatherData, showLoading, hideLoading }
