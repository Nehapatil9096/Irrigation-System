import React, { useState } from 'react';

function IrrigationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    numPlots: 4,
    numMotors: 2,
    startTime: '060000',
    endTime: '190000',
    motorRuntime: 5,
    cycleInterval: 20
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="irrigation-form">
      <div className="form-group">
        <label>
          Number of Plots:
          <input
            type="number"
            name="numPlots"
            value={formData.numPlots}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>
      
      <div className="form-group">
        <label>
          Number of Motors:
          <input
            type="number"
            name="numMotors"
            value={formData.numMotors}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>
      
      <div className="form-group">
        <label>
          Start Time (HHMMSS):
          <input
            type="text"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            pattern="\d{6}"
            required
          />
        </label>
      </div>
      
      <div className="form-group">
        <label>
          End Time (HHMMSS):
          <input
            type="text"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            pattern="\d{6}"
            required
          />
        </label>
      </div>
      
      <div className="form-group">
        <label>
          Motor Runtime (minutes):
          <input
            type="number"
            name="motorRuntime"
            value={formData.motorRuntime}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>
      
      <div className="form-group">
        <label>
          Irrigation Cycle Interval (minutes):
          <input
            type="number"
            name="cycleInterval"
            value={formData.cycleInterval}
            onChange={handleChange}
            min="0"
            required
          />
        </label>
      </div>
      
      <button type="submit">Generate Schedule</button>
    </form>
  );
}

export default IrrigationForm;