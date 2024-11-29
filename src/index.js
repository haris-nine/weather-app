import './styles.css'
import { fetchWeather } from './api.js'
import { showLoading, hideLoading } from './loading.js'
import { renderWeatherData } from './dom.js'

const form = document.getElementById('weather-form')

// Application state
let currentData = null
let isCelsius = false // Fahrenheit is the default scale

// Toggle button
const toggleButton = document.createElement('button')
toggleButton.textContent = 'Switch to Celsius'
toggleButton.addEventListener('click', () => {
  isCelsius = !isCelsius
  toggleButton.textContent = isCelsius
    ? 'Switch to Fahrenheit'
    : 'Switch to Celsius'
  renderWeatherData(currentData, isCelsius) // Re-render with updated scale
})

// Listen for form submission
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const locationInput = document.getElementById('location').value.trim()

  if (!locationInput) {
    alert('Please enter a location')
    return
  }

  showLoading()

  fetchWeather(locationInput)
    .then((data) => {
      currentData = data // Store fetched data
      renderWeatherData(data, isCelsius, toggleButton)
    })
    .catch((err) => {
      console.error('Error fetching weather data:', err)
      alert(`Could not fetch weather data. Error: ${err.message}`)
    })
    .finally(() => {
      hideLoading()
    })
})
