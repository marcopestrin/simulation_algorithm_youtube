import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'

export default class Login extends Component { 

    constructor(props) {
        super(props);
        this.logIn = this.logIn.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.state = {
            redirectToVideoList: false,
            error: false
        }
    }
    handleClose() {
        this.setState({
            ...this.state,
            error: false,
            comment: ''
        })
    }
    logIn(e) {
        e.preventDefault()
        fetch('http://127.0.0.1:3000/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: e.target.password.value,
                email: e.target.email.value
            })
        })
        .then(response => response.json())
        .then(res => {
            if (res.valid) {
                console.log(res.result)
                this.setState({
                    ...this.state,
                    redirectToVideoList: true,
                    idUser: res.result.idUser,
                    token: res.result.token
                })
                // redirect to lista video
            } else {
                this.setState({
                    ...this.state,
                    error: true
                })
            }
        })
    }


  render () {
    console.log(this.state.redirectToVideoList)
    if (this.state.redirectToVideoList) {
        // cambio pagina
        return <Redirect to={{
            pathname: '/video',
            state: {
                token: this.state.token,
                idUser: this.state.idUser
            }
        }} />;
    } else {
        // rimani in questa pagina
        return ( 
            <>
                <Typography variant="h1">
                    Login
                </Typography>
                { this.state.error && (
                    <Snackbar
                        open={this.state.error}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                    >
                        <MuiAlert
                            severity="error"
                            elevation={6}
                            variant="filled"
                        >
                            {'Wrong credentials'}
                        </MuiAlert>
                    </Snackbar>
                )}
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={this.logIn}
                >
                    <TextField
                        id="email"
                        label="Email"
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                    />
                    <Button
                        type="submit"
                        variant="outlined">
                        Log In
                    </Button>

                </form>
            
            </>
        )
    }
  }
}