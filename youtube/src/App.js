import React from 'react';
import logo from './logo.svg';
import './App.css';
import VideoList from './components/VideoList'
import Container from '@material-ui/core/Container';


function App() {
  return (
    <Container maxWidth="sm">
      <VideoList />
    </Container>
  );
}

export default App;
