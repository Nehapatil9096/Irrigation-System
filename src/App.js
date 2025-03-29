import React, { useState, useEffect } from 'react';
import IrrigationForm from './components/IrrigationForm';
import IrrigationTable from './components/IrrigationTable';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}${minutes}${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateSchedule = (formData) => {
    setIsLoading(true);
    setMessage('');

    const { numPlots, numMotors, startTime, endTime, motorRuntime, cycleInterval } = formData;

    // Validate inputs
    if (numPlots <= 0 || numMotors <= 0 || motorRuntime <= 0 || cycleInterval < 0) {
      setMessage('Error: All values must be positive numbers');
      setIsLoading(false);
      return;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      setMessage('Error: Start time must be before end time');
      setIsLoading(false);
      return;
    }

    const plots = Array.from({ length: numPlots }, (_, i) => `D${i + 1}`);
    const motors = Array.from({ length: numMotors }, (_, i) => `M${i + 1}`);
    const newSchedule = [];
    let index = 0;
    let currentTime = startMinutes;

    // Main scheduling loop
    while (currentTime + motorRuntime <= endMinutes) {
      // Schedule all plots in batches
      for (let i = 0; i < plots.length; i += numMotors) {
        // Check if we have time remaining
        if (currentTime + motorRuntime > endMinutes) break;

        // Get current batch of plots
        const batch = plots.slice(i, i + numMotors);
        
        // Schedule each plot in batch
        batch.forEach((plot, batchIndex) => {
          const motor = motors[batchIndex % motors.length];
          const startTimeStr = minutesToTime(currentTime);
          const endTimeStr = minutesToTime(currentTime + motorRuntime);

          newSchedule.push({
            index: index++,
            plot,
            startTime: startTimeStr,
            endTime: endTimeStr,
            RunBy: motor
          });
        });

        // Move time forward by motor runtime
        currentTime += motorRuntime;

        // If this is the last batch in cycle, add interval
        if (i + numMotors >= plots.length) {
          currentTime += cycleInterval;
        }
      }
    }

    setSchedule(newSchedule);
    setMessage(newSchedule.length > 0 
      ? `Schedule generated with ${newSchedule.length} entries` 
      : 'No schedule generated - check your inputs');
    setIsLoading(false);
  };

  // Helper functions
  const timeToMinutes = (timeStr) => {
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = parseInt(timeStr.substring(2, 4), 10);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}${String(mins).padStart(2, '0')}00`;
  };

  const clearSchedule = () => {
    setSchedule([]);
    setMessage('Schedule cleared');
  };

  return (
    <div className="app">
      <h1>Smart Irrigation System</h1>
      <div className="current-time">Current Time: {currentTime || 'Loading...'}</div>

      <IrrigationForm onSubmit={generateSchedule} />
      
      {isLoading && <div className="loading">Generating schedule...</div>}
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : ''}`}>
          {message}
        </div>
      )}
      
      {schedule.length > 0 && (
        <>
          <button onClick={clearSchedule} className="clear-button">
            Clear Schedule
          </button>
          <IrrigationTable schedule={schedule} currentTime={currentTime} />
        </>
      )}
    </div>
  );
}

export default App;