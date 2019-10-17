import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CssBaseline from '@material-ui/core/CssBaseline';

import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'

import {
  useHistory,
} from "react-router-dom"

import ChartWrapper from '../containers/chart-wrapper'
import Chart from '../containers/chart'

import { genEnergyDensityDataSet } from '../utilities/formula'

const DEFAULT_TEMPERATURE = 3600

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper:{
    marginBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
  },  
}))

const getSelectedSpectrum = state => {
  const {
    selected,
    data,    
  } = state.chart.spectrum

  return selected ? data[selected] : {}
}

const spectralType = {
  O: '> 25,000K',
  B: '10,000-25,000K',
  A: '7,500-10,000K',
  F: '6,000-7,500K',
  G: '5,000-6,000K',
  K: '3,500-5,000K',
  M: '< 3,500K',
  C: '< 3,500K',
}

const GalaxySpectrum = () => {
  const classes = useStyles()
  const spectrumData = useSelector(getSelectedSpectrum)

  const history = useHistory()

  const [temperature, setTemperature] = React.useState(DEFAULT_TEMPERATURE)
  const [planckData, setPlanckData] = React.useState(genEnergyDensityDataSet(DEFAULT_TEMPERATURE))
  const [open, setOpen] = React.useState(false)

  const handleSliderChange = (e, val) => {
    setTemperature(val)
    setPlanckData(genEnergyDensityDataSet(val))
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return(
    <>
      <CssBaseline/>
      <AppBar position="static" color="default">
        <Toolbar variant="dense">
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="home"
            onClick={()=>{
              history.push('/')
            }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            恆星的等效溫度
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.paper}>
            <ChartWrapper>
              <Chart planckData={planckData} />
            </ChartWrapper>
          </Paper>
          <Typography variant="h6" align="center" gutterBottom>絕對溫度: {temperature}</Typography>
          <Slider
            defaultValue={DEFAULT_TEMPERATURE}
            step={10}
            max={8000}
            onChange={handleSliderChange}
          />
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Typography align="left" color="textSecondary">
              調整溫度滑桿改變黑體輻射頻譜，找出恆星的等效溫度
            </Typography>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
              解答
            </Button>
          </Grid>
        </Container>
      </main>
      {
        spectrumData.subClass && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              恆星的光譜分類為：{spectrumData.subClass}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                表面溫度為：{spectralType[spectrumData.subClass[0]]}<br/>
                Each spectral type is divided into 10 subclasses, A0, A1, A2, ...A9 etc. The spectral types and sub-classes represent a temperature sequence, from hotter (O stars) to cooler (M stars), and from hotter (subclass 0) to cooler (subclass 9).
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                關閉
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </>
  )
}

export default GalaxySpectrum