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
  const [pressureUnit, setPressureUnit] = useState('bar');
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
      if (prevUnit === 'bar') return 'atm';
      if (prevUnit === 'atm') return 'mmHg';
      return 'bar';
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
  // let light = latest?.light;
  // let precipitation = latest?.precipitation;

  // Temperature conversion
  if (tempUnit === 'C') {
    temperature = (((temperature - 32) * 5) / 9).toFixed(2);
  }

  // Pressure conversion
  if (pressureUnit === 'atm') {
    pressure = (pressure * 0.986923).toFixed(3);
  } else if (pressureUnit === 'mmHg') {
    pressure = (pressure * 750.062).toFixed(3);
  }

  // // Wind speed conversion
  // if (windUnit === 'kph') {
  //   windSpeed = (windSpeed * 1.609344).toFixed(2);
  // }

  // // Light conversion
  // if (lightUnit === 'fc') {
  //   light = (light * 0.092903).toFixed(2);
  // }

  // // Precipitation conversion
  // if (precipitationUnit === 'in') {
  //   precipitation = (precipitation * 0.0393701).toFixed(3);
  // }

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

        {/* <div>Wind Speed: {windSpeed} {windUnit}</div>
        {windUnit !== 'mph' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToMph}>
            Convert to Mph
          </Button>
        )}
        {windUnit !== 'kph' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToKph}>
            Convert to KpH
          </Button>
        )}
{/* 
        <div>Light: {light} {lightUnit}</div>
        {lightUnit !== 'lux' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToLux}>
            Convert to Lux
          </Button>
        )}
        {lightUnit !== 'fc' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToFootCandles}>
            Convert to Foot-Candles
          </Button>
        )} */} 

        {/* <div>Precipitation: {precipitation} {precipitationUnit}</div>
        {precipitationUnit !== 'mL' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToMl}>
            Convert to mL
          </Button>
        )}
        {precipitationUnit !== 'in' && (
          <Button size="small" color="primary" variant="contained" onClick={handleConvertToInches}>
            Convert to Inches
          </Button>
        )} */}

        {/* <div>Soil Moisture: {latest?.soil_moisture} %</div> */}
        <div>Humidity: {latest?.humidity} %RH</div>
        {/* <div>Wind Direction: {latest?.wind_direction}°</div> */}
      </div>
    </ThemeProvider>
  );
};

export default WeatherList;
