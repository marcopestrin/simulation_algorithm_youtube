import React from 'react';
import VideoList from './components/VideoList'
import Registration from './components/Registration'
import Login from './components/Login'
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route } from  'react-router-dom'

function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Switch>
          <Route path="/registration" component={Registration}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/video" component={VideoList}></Route>
          <Route path="/" component={VideoList}></Route>
        </Switch>
      </Container>
    </Router>
    
  );
}

export default App;
