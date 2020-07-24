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
        this.state = {
            redirectToLogin: false,
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
            // cambio pagina
            return <Redirect to='/login'/>;
        } else {
            // rimani in questa pagina
            return ( 
                <>
                    <Typography variant="h1">
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
                            Sign Up
                        </Button>
                    </form>
                </>
            )
        }
    }
}