import React, {useState} from 'react';
import {Form, Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {useAppContext} from "../libs/contextLib";
import '../index.css';

function Login() {
    const history = useHistory();
    const {userHasAuthenticated} = useAppContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        userHasAuthenticated(true);
        history.push("/");
    }

    return (
        <div className="container">
            <div className="login-card login-header">
                <img src={'./assets/logo.png'} alt="logo"/>

                <div className="login-header--welcome">
                    <h1>Bienvenue</h1>
                    <p>Vous êtes sur la plateforme de vérification de kit électoral de la Direction de la Logistique et
                        du
                        Matériel de la CENI.</p>
                </div>
            </div>

            <br/>
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
                    <Button variant="success" type="submit" disabled={!validateForm()}>
                        VALIDER
                    </Button>
                </form>
            </div>

        </div>
    )
}

export default Login;

