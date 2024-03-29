import React, {useState} from 'react';
import {Form, Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {useAppContext} from "../libs/contextLib";
import '../index.css';
import axios from "axios";

function Login() {
    const history = useHistory();
    const {userHasAuthenticated} = useAppContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState(false);

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorLogin(false);

        axios.post('http://localhost:4000/users/login', {
            username: username,
            password: password,
        }, {})
            .then(function (response) {
                //console.log(response);
                if (response.data != null) {
                    sessionStorage.setItem('user', JSON.stringify(response.data))
                    userHasAuthenticated(true);
                    history.push("/");
                }
            })
            .catch(function (error) {
                console.log(error);
                setErrorLogin(true);
            });

        /*userHasAuthenticated(true);
        history.push("/");*/
    }

    return (
        <div className="container">
            <div className="login-card login-form">
                <h1>Authetification</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control
                            autoFocus
                            type="texte"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                        />
                    </Form.Group>
                    <br/>
                    <Button variant="success" type="submit" disabled={!validateForm()}>
                        Se connecter
                    </Button>
                    <br/>
                    <div className="errorLogin">
                        {errorLogin ? <h6>Nom d'utilisateur ou mot de passe incorrect</h6> : <span></span>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;

