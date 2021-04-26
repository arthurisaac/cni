import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import {
    BrowserRouter as Router
} from 'react-router-dom';
import {AppContext} from "./libs/contextLib";
import axios from "axios";
import {Button, Form} from "react-bootstrap";
import base from "./components/constants";


const App = () => {

    const [isAuthenticated, userHasAuthenticated] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState(false);

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorLogin(false);

        axios.post(base() + 'users/login', {
            username: username,
            password: password,
        }, {})
            .then(function (response) {
                //console.log(response);
                if (response != null && response.data != null) {
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    userHasAuthenticated(true);
                    //history.push("/");
                } else {
                    setErrorLogin(true);
                }
            })
            .catch(function (error) {
                console.log(error);
                setErrorLogin(true);
            });

        /*userHasAuthenticated(true);
        history.push("/");*/
    }

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            userHasAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            {isAuthenticated
                ? <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                    <Routes />
                </AppContext.Provider>
                : <div className="container">
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
                            <br/>
                                {errorLogin ? <div className="alert alert-danger" role="alert">
                                    Nom d'utlisateur ou mot de passe incorrect
                                </div> : <span></span>}
                        </form>
                    </div>
                </div>
            }
            {/*<AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
            </AppContext.Provider>*/}
        </Router>
    );
}
export default App;
