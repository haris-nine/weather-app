export const convertTemperature = (temp, toCelsius) => {
  return toCelsius
    ? Math.round(((temp - 32) * 5) / 9) // Fahrenheit to Celsius
    : Math.round(temp) // Fahrenheit remains the same
}
