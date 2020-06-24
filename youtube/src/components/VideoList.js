import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
export default class VideoList extends Component { 

  constructor(props) {
    super(props);
    this.state = {
      lastVideos: null,
      userInfo: null,
    };
  }

  componentDidMount(){
    fetch('http://127.0.0.1:3000/getLastVideos')
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, lastVideos: data }));
    fetch('http://127.0.0.1:3000/getUserDetailsById', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUser: 3
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ ...this.state, userInfo: data })
        console.log(data)
    });
  }

  addLike(idVideo){
    fetch("http://127.0.0.1:3000/addLike", {
      body: JSON.stringify({
        idUser: 3,
        idVideo: idVideo
      }),
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      method: "POST",
    })
      .then(response => response.json())
      .then(data => console.log("liked: ", data));
  }
  

  share(idVideo){
    let params = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        idUser: 3,
        idVideo: idVideo
      }),
    }
    console.log("oppete: ",params)
    fetch("http://127.0.0.1:3000/share", params )
      .then(response => response.json())
      .then(data => console.log("shared: ", data));
  }

  addComment(idVideo) {
    fetch("http://127.0.0.1:3000/addComment", {
      body: JSON.stringify({
        idUser: 3,
        idVideo: idVideo
      }),
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      method: "POST",
    })
      .then(response => response.json())
      .then(data => console.log("commented: ", data));
  }
  render () {

    return ( 
      <>
        {this.state.lastVideos && this.state.lastVideos.map((element, index) => {
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
                {this.state.userInfo && (
                  <CardActions disableSpacing> 
                <IconButton aria-label="add to favorites" onClick={() => this.addLike(element.id)}>
                  <Badge badgeContent={element.like} color="primary">
                    <FavoriteIcon color={this.state.userInfo.likedVideos.includes(element.id) ? 'error' : '' } />
                  </Badge>
                </IconButton>
                <IconButton aria-label="share" onClick={() => this.share(element.id)}>
                  <Badge badgeContent={element.share} color="primary">
                    <ShareIcon color={this.state.userInfo.sharedVideos.includes(element.id) ? 'error' : '' } />
                  </Badge>
                </IconButton>
                <IconButton aria-label="add comment" onClick={() => this.addComment(element.id)}>
                  <Badge badgeContent={element.comments} color="primary">
                    <CommentIcon color={this.state.userInfo.commentedVideos.includes(element.id) ? 'error' : '' } />
                  </Badge>
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
                )}
            </Card>
          )
        })}
      </>
    )
  }
}