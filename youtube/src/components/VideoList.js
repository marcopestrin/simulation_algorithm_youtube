import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
          return (
            <Card>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className=''>
                    aSS
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={element.title}
                subheader={new Date(element.dateAdded * 1000).toString()}
              />
              <CardMedia
                className=''
                image="/static/images/cards/paella.jpg"
                title="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {element.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  className={clsx({}, {
                    //[classes.expandOpen]: expanded,
                  })}
                  //onClick={handleExpandClick}
                  //aria-expanded={expanded}
                  aria-label="show more"
                >
                </IconButton>
              </CardActions>
            </Card>
          )
        })}
      </>
    )
  }
}