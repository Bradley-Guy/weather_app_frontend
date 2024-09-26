import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 12
  },
  palette: {
    primary: {
      main: '#AA1131',
    },
  },
});

const WeatherList = ({ weatherData }) => {
  const [tempUnit, setTempUnit] = useState('F');
  const [pressureUnit, setPressureUnit] = useState('bar');
  const [windUnit, setWindUnit] = useState('mph');
  const latest = weatherData[1];
  const date = latest ? new Date(latest.time) : null;

  const handleConvertToFahrenheit = () => setTempUnit('F');
  const handleConvertToCelsius = () => setTempUnit('C');
  const handleConvertToBar = () => setPressureUnit('bar');
  const handleConvertToATM = () => setPressureUnit('atm');
  const handleConvertToMmHg = () => setPressureUnit('mmHg');
  const handleConvertToMph = () => setWindUnit('mph');
  const handleConvertToKph = () => setWindUnit('kph');

  let temperature = latest?.temperature;
  let windSpeed = latest?.wind_speed_mph;
  let pressure = latest?.pressure_bar;

  if (tempUnit === 'C') {
    temperature = (((temperature - 32) * 5) / 9).toFixed(2);
  }

  if (pressureUnit === 'atm') {
    pressure = (pressure * 0.986923).toFixed(3);
  } else if (pressureUnit === 'mmHg') {
    pressure = (pressure * 750.062).toFixed(3);
  }

  if (windUnit === 'kph') {
    windSpeed = (windSpeed * 1.609344).toFixed(2);
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
      <h3>Current Weather</h3>
        {date && <div>Time: {date.toString()}</div>}
        <div>Temperature: {temperature} {tempUnit}</div>
        
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToFahrenheit}>Convert to Fahrenheit</Button>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToCelsius}>Convert to Celsius</Button>
        
        <div>Pressure: {pressure} {pressureUnit}</div>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToBar}>Convert to Bar</Button>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToATM}>Convert to ATM</Button>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToMmHg}>Convert to mmHg</Button>
        
        <div>Wind Speed: {windSpeed} {windUnit}</div>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToMph}>Convert to Mph</Button>
        <Button size="small" color="primary" variant="contained" onClick={handleConvertToKph}>Convert to KpH</Button>
        
        <div>Light: {latest?.light} lux</div>
        <div>Soil Moisture: {latest?.soil_moisture} % </div>
        <div>Humidity: {latest?.humidity} %RH</div>
        <div>Wind Direction: {latest?.wind_direction}° </div>
        <div>Precipitation: {latest?.precipitation} mL</div>
      </div>
    </ThemeProvider>
  );
};

export default WeatherList;

