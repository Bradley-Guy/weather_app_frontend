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
            <Route path="/temperature" element={<LineGraph data={temperatureArray} label="Temperature" color="rgb(128, 0, 0)" timestamps={timestampsArray}/>} />
            <Route path="/pressure" element={<LineGraph data={pressureArray} label="Pressure" color="rgb(75, 192, 192)" timestamps={timestampsArray}/>} />
            <Route path="/light" element={<LineGraph data={lightArray} label="Light" color="rgb(250, 223, 0)" timestamps={timestampsArray} />} />
            <Route path="/precipitation" element={<LineGraph data={precipitationArray} label="Precipitation" color="rgb(0, 0, 102)" timestamps={timestampsArray}/>} />
            <Route path="/humidity" element={<LineGraph data={humidityArray} label="Humidity" color="rgb(0, 153, 76)" timestamps={timestampsArray} />} />
            <Route path="/wind-direction" element={<LineGraph data={windDirectionArray} label="Wind Direction" color="rgb(204, 0, 0)" timestamps={timestampsArray} />} />
            <Route path="/soil-moisture" element={<LineGraph data={soilMoistureArray} label="Soil Moisture" color="rgb(118,85,43)" timestamps={timestampsArray} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const LineGraph = ({ data, label, color, timestamps }) => {
  const chartData = {
    labels: timestamps, // Use the time values for the x-axis
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
        position: 'top',
      },
      title: {
        display: true,
        text: `${label} Chart`,
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            // Use tooltipItems[0].parsed.x to get the x value (time)
            const date = new Date(tooltipItems[0].parsed.x);
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            return date.toLocaleTimeString('en-US', options); // e.g., "5:45 PM"
          },
          label: function(tooltipItem) {
            // Show the value corresponding to the data point
            return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y}`; // Customize the unit if needed
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Time',
        },
        time: {
          unit: 'minute',
        },
      },
      y: {
        title: {
          display: true,
          text: `${label}`,
        },
      },
    },
  };
  
  

  return <Line options={options} data={chartData} />;
};



export default App;
