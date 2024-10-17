import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WeatherList from './components/WeatherList'; // Import WeatherList component
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Make sure this import is present
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TimeScale } from 'chart.js';
import { ReactComponent as MyLogo } from './AHWS_Logo.svg';
import './App.css'; // Import the CSS file for styling




ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, TimeScale);

const fetchData = async () => {
  try {
    const response = await fetch('https://ahws-backend.azurewebsites.net/data_get');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array on error
  }
};

const App = () => {
  const [weatherData, setWeatherData] = React.useState([]);
  const [latestWeatherData, setLatestWeatherData] = React.useState({});
  const [temperatureArray, setTemperatureArray] = React.useState([]);
  const [pressureArray, setPressureArray] = React.useState([]);
  const [lightArray, setLightArray] = React.useState([]);
  const [precipitationArray, setPrecipitationArray] = React.useState([]);
  const [humidityArray, setHumidityArray] = React.useState([]);
  const [windDirectionArray, setWindDirectionArray] = React.useState([]);
  //const [timeArray, settimeArray] = React.useState([]);
  const [soilMoistureArray, setSoilMoistureArray] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [timestampsArray, setTimestampsArray] = React.useState([]);


  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchData();
      setWeatherData(data);
      setLatestWeatherData(data[0] || {});

      setTemperatureArray(data.map(d => d.temperature || 0));
      setPressureArray(data.map(d => d.pressure_bar || 0));
      setLightArray(data.map(d => d.light || 0));
      setPrecipitationArray(data.map(d => d.precipitation || 0));
      setHumidityArray(data.map(d => d.humidity || 0));
      setWindDirectionArray(data.map(d => d.wind_direction || 0));
      //settimeArray(data.map(d => d.time || ''));
      setSoilMoistureArray(data.map(d => d.soil_moisture || 0));
      
      // Extract timestamps in ISO format
      const timestamps = data.map(d => d.time || '');
      setTimestampsArray(timestamps);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <MyLogo className="logo" />
          <div className="sidebar-content">
            <nav>
              <ul>
                <li><Link to="/">Current Weather</Link></li>
                <li>
                  <button>Weather Graphs</button>
                  <ul className="dropdown">
                    <li><Link to="/temperature">Temperature</Link></li>
                    <li><Link to="/pressure">Pressure</Link></li>
                    <li><Link to="/light">Light</Link></li>
                    <li><Link to="/precipitation">Precipitation</Link></li>
                    <li><Link to="/humidity">Humidity</Link></li>
                    <li><Link to="/wind-direction">Wind Direction</Link></li>
                    <li><Link to="/soil-moisture">Soil Moisture</Link></li>
                  </ul>
                </li>
                {/* <li><Link to="/">Error Reports</Link></li> */}
              </ul>
            </nav>
          </div>
          <div className="credit-box">
            <p>Credit: Bradley Guy, Jin Lee, Scott Layman</p>
          </div>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<WeatherList weatherData={[weatherData, latestWeatherData]} />} />
            <Route path="/temperature" element={<LineGraph data={temperatureArray} label="Temperature" color="rgb(128, 0, 0)" timestamps={timestampsArray} unit="°F"/>} />
            <Route path="/pressure" element={<LineGraph data={pressureArray} label="Pressure" color="rgb(75, 192, 192)" timestamps={timestampsArray} unit="bar" />} />
            <Route path="/light" element={<LineGraph data={lightArray} label="Light" color="rgb(250, 223, 0)" timestamps={timestampsArray} unit="lux"  />} />
            <Route path="/precipitation" element={<LineGraph data={precipitationArray} label="Precipitation" color="rgb(0, 0, 102)" timestamps={timestampsArray} unit="mL" />} />
            <Route path="/humidity" element={<LineGraph data={humidityArray} label="Humidity" color="rgb(0, 153, 76)" timestamps={timestampsArray} unit="%RH"  />} />
            <Route path="/wind-direction" element={<LineGraph data={windDirectionArray} label="Wind Direction" color="rgb(204, 0, 0)" timestamps={timestampsArray}  unit="°" />} />
            <Route path="/soil-moisture" element={<LineGraph data={soilMoistureArray} label="Soil Moisture" color="rgb(118,85,43)" timestamps={timestampsArray}  unit="%" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// LineGraph Component
const LineGraph = ({ data, label, color, unit, timestamps }) => {
  const chartData = {
    labels: timestamps, // Assuming the x-axis represents the index of the data points
    datasets: [{
      label,
      data,
      fill: true,
      borderColor: color,
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      tooltip: {
        enabled: false, // Disable the default tooltip
        external: function(context) {
          let tooltipEl = document.getElementById('chartjs-tooltip');
      
          // Create tooltip element if it doesn't exist
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            tooltipEl.style.color = 'white';
            tooltipEl.style.padding = '8px';
            tooltipEl.style.borderRadius = '4px';
            tooltipEl.style.pointerEvents = 'none'; // Prevent mouse events
            document.body.appendChild(tooltipEl);
          }
      
          // Only show tooltip if hovering over a data point
          if (context.tooltip && context.tooltip.opacity !== 0) {
            const dataPoint = context.tooltip.dataPoints[0];
            const date = new Date(dataPoint.parsed.x);
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timeString = date.toLocaleTimeString('en-US', options);
            const valueString = `${dataPoint.dataset.label}: ${dataPoint.parsed.y} ${unit}`; // Include unit here
      
            tooltipEl.innerHTML = `${timeString}<br>${valueString}`;
            tooltipEl.style.left = context.tooltip.caretX + 215 + 'px'; // Add offset to the left
            tooltipEl.style.top = context.tooltip.caretY + 1 + 'px'; // Add offset upwards
            tooltipEl.style.opacity = 1; // Show tooltip
          } else if (tooltipEl) {
            tooltipEl.style.opacity = 0; // Hide tooltip
          }
        },
      }      
    },
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Time',
        },
        time: {
          unit: 'hour',
        },
      },
      y: {
        title: {
          display: true,
          text: `${label} (${unit})`,
        },
      },
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Title and Unit */}
      <h2 style={{ margin: '0', padding: '10px 0' }}>
        {label} ({unit})
      </h2>
      <Line options={options} data={chartData} />
    </div>
  );
};




export default App;
