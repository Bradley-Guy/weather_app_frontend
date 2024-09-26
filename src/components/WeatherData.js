import React from 'react';

const WeatherData = ({ label, value }) => {
  return (
    <div>
      <strong>{label}:</strong> {value}
    </div>
  );
};

export default WeatherData;
