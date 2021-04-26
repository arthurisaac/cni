import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import '../index.css';
import axios from "axios";
import base from "./constants";

const Home = () => {

    const history = useHistory();

    const [historiques, setHistorique] = useState([]);
    const [username, setUsername] = useState("invité");

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (sessionStorage.getItem("user")) {
            /*if (user.role === "admin" || user.role === "master") {
                //console.log("authorize");
                setUsername("Administrateur");
            } else {
                history.push("/checkingkit");
            }*/
            setUsername(user.username);
        }
        getHistories();
        /*db.collection("historique")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                // this.setState({ users: data });
                setHistorique([...data]);
            });*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getHistories = () => {
        axios.get(base() + "history")
            .then((response) => {
                setHistorique(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
                <div className="home-big-button">
                    <div className="home-big-button--item" style={{backgroundColor: "#05A9AF"}}>
                        <Link to="/checkingkit">Vérifier un kit</Link>
                    </div>
                    <div className="home-big-button--item" style={{backgroundColor: "#7FBB0B"}}>
                        <Link to="/history">Consulter l'historique complet</Link>
                    </div>
                    <div className="home-big-button--item" style={{backgroundColor: "#006DCB"}}>
                        <Link to="/statistics">Statistiques</Link>
                    </div>
                </div>
                <br/>
                <br/>
                <h1 className="home-check-title">Historique de vérification</h1><br/>
                <table className="table table-bordered home-table">
                    <thead>
                    <tr style={{background: "#1F94FE", color: "#fff"}}>
                        <td>Numéro de kit</td>
                        <td>Date heure démarrage</td>
                        <td>Date heure de clôture</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        historiques.map((historique, i) => (
                            <tr key={i}>
                                <td>KIT N° {historique.kit}</td>
                                <td>
                                    {new Date(historique.debut).getDate()}/{new Date(historique.debut).getMonth() + 1}/{new Date(historique.debut).getFullYear()} à {new Date(historique.debut).getHours()}h:{new Date(historique.debut).getMinutes()}
                                </td>
                                <td>
                                    {new Date(historique.fin).getDate()}/{new Date(historique.fin).getMonth() + 1}/{new Date(historique.fin).getFullYear()} à {new Date(historique.fin).getHours()}h:{new Date(historique.fin).getMinutes()}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )

};

export default Home;

