import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {

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
            <br />

            <div className="container">
                <p className="home-connected">Connecté en tant que ...</p><br />
                <div className="home-big-button">
                    <div className="home-big-button--item" style={{ backgroundColor: "#05A9AF" }}>
                        <Link to="/checkingkit">Vérifier un kit</Link>
                    </div>
                    <div className="home-big-button--item" style={{ backgroundColor: "#7FBB0B" }}>
                        <Link to="/">Consulter l'historique complet</Link>
                    </div>
                    <div className="home-big-button--item" style={{ backgroundColor: "#006DCB" }}>
                        <Link to="/">Statistiques</Link>
                    </div>
                </div>
                <br />
                <br />
                <h1 className="home-check-title">Historique de vérification</h1><br />
                <table className="table table-bordered home-table">
                    <thead>
                    <tr style={{ background: "#1F94FE", color: "#fff"}}>
                        <td>Numéro de kit</td>
                        <td>Date heure démarrage</td>
                        <td>Date heure de clôture</td>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )

};

export default Home;

