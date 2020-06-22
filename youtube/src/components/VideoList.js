import React, { Component } from 'react';

export default class VideoList extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount(){
    fetch('http://127.0.0.1:3000/getLastVideos')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render () {

    return ( 
      <>
        {this.state.data && this.state.data.map((element, index) => {
          return <p>Durata del video: {element.videoDuration}</p>
        })}
      </>
    )
  }
}