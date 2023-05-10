import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';



// marks is an array of objects
const marks = (min, max, step, units) => {
  return Array.from({length: (max - min) / step + 1}, (_, i) => {
    const value = min + (i * step);
    return {
      value,
      label: `${value} ${units}`
    }
  });
};


function valuetext(value) {
  return `${value}°C`;
}

const FilterSlider = (props) => {
  const {onChange, units, limit, step} = props;

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => `${units} range`}
        defaultValue={[0, limit]}
        getAriaValueText={valuetext}
        step={step}
        valueLabelDisplay="auto"
        marks={marks(0, limit, step, units)}
        onChange={onChange}
        min={0}
        max={limit}
      />
    </Box>
  );
}

export default FilterSlider;