import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import base from "./constants";

const UserManagement = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [success, setSuccess] = useState(false);

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        axios.post(base() + 'users', {
            username: username,
            password: password,
            role: role,
        }, {})
            .then(function (response) {
                setSuccess(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            <div className="home">
                <div className="home-header">
                    <h3>Plateforme de vérification de kit électoral</h3>
                    <img src={'./assets/logo.png'} alt="logo"/>
                </div>
                <div>
                    <div className="home-header--bande-rouge"/>
                    <div className="home-header--bande-verte"/>
                </div>
                <br/>
            </div>
            <div className="container">

                <h1>Gestion des utilisateurs</h1>
                <br/>

                    { success ? <div className="alert alert-success" role="alert">
                        Success
                    </div> : <div></div>}

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
                    <Form.Group controlId="role">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            type="password"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={!validateForm()}>
                        Enregistrer
                    </Button>
                </form>
            </div>
        </div>

    );
};

export default UserManagement;