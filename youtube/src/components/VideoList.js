import React, { Component } from 'react';
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
import { Redirect } from 'react-router'

export default class VideoList extends Component { 

  constructor(props) {
    super(props)
    this.addLike = this.addLike.bind(this)
    this.share = this.share.bind(this)
    this.getUserDetailsById = this.getUserDetailsById.bind(this)
    this.logout = this.logout.bind(this)
    this.getLastVideos = this.getLastVideos.bind(this)
    this.addComment = this.addComment.bind(this)
    // TO DO: da gestire this.props.location.state in caso undefined
    if (this.props.location.state) {
      const { idUser, token } = this.props.location.state
      this.state = {
        logout: false,
        lastVideos: [],
        userInfo: null,
        idUser,
        token,
      };
    } else {
      this.state = {}
    }
  }

  getUserDetailsById() {
    fetch('http://127.0.0.1:3000/getUserDetailsById', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": this.state.token
      },
      body: JSON.stringify({
        idUser: this.state.idUser
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ ...this.state, userInfo: data })
    });
  }
  getLastVideos(){
    fetch('http://127.0.0.1:3000/getLastVideos', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": this.state.token
      },
    })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, lastVideos: data }));
  }
  componentDidMount(){
    this.getLastVideos()
    this.getUserDetailsById()
  }
  addLike(idVideo){
    fetch("http://127.0.0.1:3000/addLike", {
      body: JSON.stringify({
        idUser: this.state.idUser,
        idVideo: idVideo
      }),
      headers: {
        "Content-Type": "application/json",
        "token": this.state.token
      },
      method: "POST",
    })
      .then(response => response.json())
      .then(data => {
        console.log("liked: ", data)
        this.getUserDetailsById()
      });
  }
  share(idVideo){
    fetch("http://127.0.0.1:3000/share", {
      body: JSON.stringify({
        idUser: this.state.idUser,
        idVideo: idVideo
      }),  
      headers: {
        "Content-Type": "application/json",
        "token": this.state.token
      },
      method: "POST",
    })
      .then(response => response.json())
      .then(data => {
        console.log("shared: ", data)
        this.getUserDetailsById()
      });
  }
  addComment(idVideo) {
    fetch("http://127.0.0.1:3000/addComment", {
      body: JSON.stringify({
        idUser: this.state.idUser,
        idVideo: idVideo
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": this.state.token
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("commented: ", data)
        this.getUserDetailsById()
      });
  }
  logout(){
    this.setState({logout:true})
  }
  render () {

    return ( 
      <>
        <Typography onClick={this.logout} variant="h4" className="forceToLogout">
            Logout
        </Typography>
        {this.state.logout && (
          <Redirect to={{
            pathname: '/login'
          }} />
        )}
        {this.state.lastVideos && this.state.lastVideos.map((element, index) => {
          return (
            <div key={index}>
              <Card key={index} className="cardVideo">
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe" className=''>
                      c
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
                  lastname='example'
                  image="example"
                  title="example"
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
                          <FavoriteIcon color={this.state.userInfo.likedVideos.includes(element.id) ? 'error' : 'inherit' } />
                        </Badge>
                      </IconButton>
                      <IconButton aria-label="share" onClick={() => this.share(element.id)}>
                        <Badge badgeContent={element.share} color="primary">
                          <ShareIcon color={this.state.userInfo.sharedVideos.includes(element.id) ? 'error' : 'inherit' } />
                        </Badge>
                      </IconButton>
                      <IconButton aria-label="add comment" onClick={() => this.addComment(element.id)}>
                        <Badge badgeContent={element.comments} color="primary">
                          <CommentIcon color={this.state.userInfo.commentedVideos.includes(element.id) ? 'error' : 'inherit' } />
                        </Badge>
                      </IconButton>
                    </CardActions>
                  )}
              </Card>
              <br />
            </div>
          )
        })}
      </>
    )
  }
}