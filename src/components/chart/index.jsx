import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'

import {
  ComposedChart,
  Bar,
  Area,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts'

const useStyles = makeStyles(theme => ({
  chart: {
    height: '480px',
  },
}))

const light = [
 { Wavelength: 3800, energyDensity: 100 },
 { Wavelength: 7400, energyDensity: 100 },
]

const dataLimitCheck = (type, data=[]) => {
  const dataLength = data.length
  return (
    type === 'temperature'
    ? { min: 0, max:  20000}
    : {
      min: (data && dataLength > 0) ? data[0].Wavelength : 'dataMin',
      max: (data && dataLength > 0) ? data[dataLength - 2].Wavelength : 'dataMax',
    })
}

const Chart = props => {
  const {
    type,
    spectrumData,
    elementData = [],
    planckData,
    t,
  } = props;

  const classes = useStyles()
  const [dataLimit, setDataLimit] = useState(dataLimitCheck(type))
  const [elementLimit, setElementLimit] = useState([0, 'dataMax'])

  useEffect(() => {
  }, [elementData])

  return (
    <div className={classes.chart}>
    {
      spectrumData && (
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="Wavelength"
              type="number"
              allowDecimals={false}
              allowDataOverflow={true}
              domain={[dataLimit.min, dataLimit.max]}
            />
            <YAxis 
              yAxisId="left"
              type="number"
              tick={false}
              domain={[0, 'dataMax']}
              label={{ value: 'Energy Density', angle: -90}}
              allowDataOverflow={true}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax']}
              yAxisId="right" 
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax']}
              yAxisId="light" 
            />
            <YAxis 
              hide={true}
              yAxisId="element"
              type="number"
              allowDataOverflow={true}
              domain={[0, 'dataMax']}
            />
            <Bar 
              yAxisId="element"
              dataKey="energyDensity"
              barSize={1} 
              fill="#0f0" 
            />
            <Line 
              yAxisId="element" 
              type="monotone" 
              data={elementData} 
              dataKey="energyDensity" 
              dot={false} 
              activeDot={false}
              isAnimationActive={false}
              stroke="#82ca9d"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              data={spectrumData.data} 
              dataKey="BestFit" 
              dot={false} 
              isAnimationActive={false}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              data={planckData} 
              dataKey="energyDensity" 
              dot={false} 
              activeDot={false}
              isAnimationActive={false}
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )
    }
    </div>
  )
}

export default Chart;