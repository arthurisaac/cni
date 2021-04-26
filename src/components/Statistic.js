import React, {useEffect, useState} from 'react';
import axios from "axios";
import base from "./constants";

const user = JSON.parse(sessionStorage.getItem('user'));
const Statistic = () => {
    const [username, setUsername] = useState("invité");

    const [historiques, setHistorique] = useState([]);
    const getHistories = () => {
        axios.get(base() + "history")
            .then((response) => {
                setHistorique(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getHistories();
        if (sessionStorage.getItem("user")) {
            setUsername(user.username);
        }
    }, []);

    return (
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
            <div className="container">
                <p className="home-connected" onClick={() => {
                    sessionStorage.clear();
                    window.history.go('/');
                }}>Connecté en tant que {username}</p><br/>
                <br/>
                <br/>
                <br/>
                <pre>{JSON.stringify(historiques)}</pre>
            </div>
        </div>
    )
};

export default Statistic;