const API_KEY = 'NGKVSPFRAZBZ64P2U2L56JK25'
const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

// Fetch weather data
export const fetchWeather = async (location) => {
  const apiUrl = `${BASE_URL}${encodeURIComponent(location)}?key=${API_KEY}`

  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const data = await response.json()
    return processWeatherData(data)
  } catch (err) {
    console.error('Error in fetchWeather:', err)
    throw err
  }
}

// Process weather data
const processWeatherData = (data) => {
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
