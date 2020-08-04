import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'

export default class Registration extends Component { 

    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.goToLogin = this.goToLogin.bind(this)
        this.state = {
            redirectToLogin: false,
            error: false,
        }
    }
    handleClose() {
        this.setState({
            ...this.state,
            error: false,
            comment: ''
        })
    }
    goToLogin() {
        this.setState({
            ...this.state,
            redirectToLogin: true,
        })
    }
    signUp(e) {
        e.preventDefault()
        fetch('http://127.0.0.1:3000/registration', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: e.target.password.value,
                email: e.target.email.value,
                id: Math.floor(Math.random() * 1001)
            })
        })
        .then(response => response.json())
        .then(res => {
            if (res.valid) {
                // registrazione avvenuta con successo
                console.log(res.result)
                this.setState({
                    ...this.state,
                    redirectToLogin: true
                })
            } else {
                this.setState({
                    ...this.state,
                    error: true,
                    comment: res.comment
                }) 
            }
        })
    }



    render () {
        if (this.state.redirectToLogin) {
            // vai in pagina login
            return <Redirect to='/login'/>;
        } else {
            // rimani in questa pagina
            return ( 
                <>
                    <Typography variant="h4" className="titlePage">
                        Registration
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
                                {this.state.comment}
                            </MuiAlert>
                        </Snackbar>
                    )}
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={this.signUp}
                    >
                    <div className="itemForm">
                        <TextField
                            id="email"
                            label="Email"
                        />
                    </div>
                    <div className="itemForm">
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                        />
                    </div>
                    <div className="itemForm">
                        <Button
                            className="submitButton"
                            type="submit"
                            variant="outlined">
                            Sign Up
                        </Button>
                    </div>
                    </form>
                    <Typography variant="h5" onClick={this.goToLogin} className="changePage">
                        Already registered? Login now!
                    </Typography>
                </>
            )
        }
    }
}