import React, { useState, useEffect } from 'react';
import plotIcon from '../assets/field.png';
import motorIcon from '../assets/motor.png';
import doneIcon from '../assets/done.png';
import inProgressIcon from '../assets/in-progress.png';
import pendingIcon from '../assets/wall-clock.png';

function IrrigationTable({ schedule }) {
  const [filterPlot, setFilterPlot] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second to ensure real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to determine irrigation status dynamically
  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = parseMilitaryTime(startTime);
    const end = parseMilitaryTime(endTime);

    if (now >= end) return "Done"; 
    if (now >= start && now < end) return "In Progress"; 
    return "Pending"; 
};







  // Function to convert military time string to Date object
  const parseMilitaryTime = (timeStr) => {
    const hours = parseInt(timeStr.slice(0, 2));
    const minutes = parseInt(timeStr.slice(2, 4));
    const seconds = parseInt(timeStr.slice(4, 6));
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  // Filter schedule based on selected plot and status
  const filteredSchedule = schedule.filter((entry) => {
    const status = getStatus(entry.startTime, entry.endTime);
    const matchesPlot = filterPlot ? entry.plot === filterPlot : true;
    const matchesStatus = filterStatus ? status === filterStatus : true;
    return matchesPlot && matchesStatus;
  });

  // Get unique plots for filtering options
  const uniquePlots = [...new Set(schedule.map((entry) => entry.plot))];

  // Function to get the correct status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return doneIcon;
      case 'In Progress':
        return inProgressIcon;
      case 'Pending':
        return pendingIcon;
      default:
        return null;
    }
  };

  return (
    <div className="irrigation-table">
      <h2>Irrigation Schedule</h2>
      <div className="filters">
        <div>
          <label>Filter by Plot:</label>
          <select onChange={(e) => setFilterPlot(e.target.value)} value={filterPlot}>
            <option value="">All</option>
            {uniquePlots.map((plot) => (
              <option key={plot} value={plot}>
                {plot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Status:</label>
          <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Plot</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Run By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedule.map((entry) => {
            const status = getStatus(entry.startTime, entry.endTime);
            return (
              <tr key={entry.index}>
                <td>{entry.index}</td>
                <td>
                  <img src={plotIcon} alt="Plot Icon" className="table-icon" />
                  {entry.plot}
                </td>
                <td>{entry.startTime}</td>
                <td>{entry.endTime}</td>
                <td>
                  <img src={motorIcon} alt="Motor Icon" className="table-icon" />
                  {entry.RunBy}
                </td>
                <td className={`status-${status.toLowerCase().replace(' ', '-')}`}>
                  <img src={getStatusIcon(status)} alt={`${status} Icon`} className="table-icon" />
                  {status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default IrrigationTable;
