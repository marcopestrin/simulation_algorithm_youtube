import React from 'react';
import VideoList from './components/VideoList'
import Registration from './components/Registration'
import Login from './components/Login'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { BrowserRouter as Router, Switch, Route } from  'react-router-dom'
import './styles.css'

function App() {
  return (
    <Router>
      <div className="background">
        <Switch>
          <Grid container className="gridContainerPage">
            <Grid item xs={2} >

            </Grid>
            <Grid item xs={8} className="containerPage">

              <Route path="/registration" component={Registration}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/video" component={VideoList}></Route>

            </Grid>
          </Grid>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
