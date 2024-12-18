import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 10,
  },
  palette: {
    primary: {
      main: '#AA1131',
    },
  },
});

const WeatherList = ({ weatherData }) => {
  const [tempUnit, setTempUnit] = useState('F');
  const [pressureUnit, setPressureUnit] = useState('mbar');
  // const [windUnit, setWindUnit] = useState('mph');
  // const [lightUnit, setLightUnit] = useState('lux');
  // const [precipitationUnit, setPrecipitationUnit] = useState('mL');

  const latest = weatherData[1];
  const date = latest ? new Date(latest.time) : null;

  const handleConvertToFahrenheit = () => setTempUnit('F');
  const handleConvertToCelsius = () => setTempUnit('C');
  
  // Function to cycle through pressure units
  const cyclePressureUnit = () => {
    setPressureUnit(prevUnit => {
      if (prevUnit === 'mbar') return 'atm';
      if (prevUnit === 'atm') return 'mmHg';
      return 'mbar';
    });
  };

  // const handleConvertToMph = () => setWindUnit('mph');
  // const handleConvertToKph = () => setWindUnit('kph');
  
  // const handleConvertToLux = () => setLightUnit('lux');
  // const handleConvertToFootCandles = () => setLightUnit('fc');
  
  // const handleConvertToMl = () => setPrecipitationUnit('mL');
  // const handleConvertToInches = () => setPrecipitationUnit('in');

  let temperature = latest?.temperature;
  // let windSpeed = latest?.wind_speed_mph;
  let pressure = latest?.pressure_bar;
  let humidity = latest?.humidity;
  // let light = latest?.light;
  // let precipitation = latest?.precipitation;

  // Temperature conversion
  if (tempUnit === 'C') {
    temperature = (((temperature - 32) * 5) / 9).toFixed(2);
  } else {
    temperature = temperature.toFixed(2);
  }

  // Pressure conversion
  if (pressureUnit === 'atm') {
    pressure = (pressure / 1013).toFixed(3);
  } else if (pressureUnit === 'mmHg') {
    pressure = (pressure / 1.333).toFixed(3);
  } else {
    pressure = pressure.toFixed(3);
  }

  humidity = humidity.toFixed(2);


  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1>Current Weather</h1>
        {date && <div>Time: {date.toLocaleTimeString()} </div>}
        <div>Temperature: {temperature} °{tempUnit}</div>
        {tempUnit !== 'F' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToFahrenheit}>
            Convert to Fahrenheit
          </Button>
        )}
        {tempUnit !== 'C' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToCelsius}>
            Convert to Celsius
          </Button>
        )}

        <div>Pressure: {pressure} {pressureUnit}</div>
        <Button size="small" color="primary" variant="contained" onClick={cyclePressureUnit}>
          Cycle Pressure Unit
        </Button>

        <div>Humidity: {humidity} %RH</div>
      </div>
    </ThemeProvider>
  );
};

export default WeatherList;
