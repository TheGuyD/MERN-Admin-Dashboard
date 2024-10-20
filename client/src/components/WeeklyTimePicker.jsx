import React, { useState, useEffect } from 'react';
import { Grid, useTheme, Checkbox, FormControlLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AutoFillAwareTextField from 'components/AutoFillAwareTextField';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WeeklyTimePicker = ({ initialTimes, onTimesChange }) => {
  const theme = useTheme();
  const [times, setTimes] = useState({});

  useEffect(() => {
    if (initialTimes) {
      // Initialize the times state with 'enabled' property
      const initialTimesWithEnabled = {};
      daysOfWeek.forEach((day) => {
        initialTimesWithEnabled[day] = {
          startingAt: initialTimes[day]?.startingAt || null,
          endingAt: initialTimes[day]?.endingAt || null,
          enabled: initialTimes[day]?.enabled || false,
        };
      });
      setTimes(initialTimesWithEnabled);
    } else {
      // Initialize with all days disabled
      const initialTimesWithEnabled = {};
      daysOfWeek.forEach((day) => {
        initialTimesWithEnabled[day] = {
          startingAt: null,
          endingAt: null,
          enabled: false,
        };
      });
      setTimes(initialTimesWithEnabled);
    }
  }, [initialTimes]);

  const handleTimeChange = (day, type, value) => {
    setTimes((prevTimes) => {
      const updatedDayTimes = {
        ...prevTimes[day],
        [type]: value,
      };
      const updatedTimes = {
        ...prevTimes,
        [day]: updatedDayTimes,
      };
      onTimesChange(updatedTimes);
      return updatedTimes;
    });
  };

  const handleCheckboxChange = (day) => {
    setTimes((prevTimes) => {
      const updatedDayTimes = {
        ...prevTimes[day],
        enabled: !prevTimes[day].enabled,
      };
      const updatedTimes = {
        ...prevTimes,
        [day]: updatedDayTimes,
      };
      onTimesChange(updatedTimes);
      return updatedTimes;
    });
  };

  return (
    <Grid container spacing={2.75} alignItems="center">
      {daysOfWeek.map((day) => (
        <React.Fragment key={day}>
          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={times[day]?.enabled || false}
                      onChange={() => handleCheckboxChange(day)}
                    />
                  }
                  label=""
                />
              </Grid>
              <Grid item xs={5}>
                <TimePicker
                  label={`${day} Start Time`}
                  value={times[day]?.startingAt || null}
                  onChange={(value) => handleTimeChange(day, 'startingAt', value)}
                  disabled={!times[day]?.enabled}
                  renderInput={(params) => (
                    <AutoFillAwareTextField
                      {...params}
                      fullWidth
                      required={times[day]?.enabled}
                      InputLabelProps={{
                        style: {
                          fontSize: '0.9rem',
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <TimePicker
                  label={`${day} End Time`}
                  value={times[day]?.endingAt || null}
                  onChange={(value) => handleTimeChange(day, 'endingAt', value)}
                  disabled={!times[day]?.enabled}
                  renderInput={(params) => (
                    <AutoFillAwareTextField
                      {...params}
                      fullWidth
                      required={times[day]?.enabled}
                      InputLabelProps={{
                        style: {
                          fontSize: '0.9rem',
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default WeeklyTimePicker;
