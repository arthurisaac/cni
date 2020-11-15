import React from 'react';
import {Link} from 'react-router-dom';
// import { db } from "../services/firestore";
import axios from 'axios';
import '../index.css';

class Home extends React.Component {

    state = {
        historiques: [],
        ENDPOINT: "http://localhost:4000/"
    };

    componentDidMount() {
        /*db.collection("historique")
           .get()
           .then(querySnapshot => {
               const data = querySnapshot.docs.map(doc => doc.data());
               // this.setState({ users: data });
               setHistorique([...data]);
           });*/

        axios.get(`${this.state.ENDPOINT}historiques/limited`)
            .then(
                res => this.setState({historiques: [...res.data]}),
                err => console.log(err));
    }

    static changeStatus() {
        let response = prompt("Entrer type");
        if (response !== null) {
            sessionStorage.setItem("type", response);
        }
    }

    static goToChecking() {
        const type = sessionStorage.getItem("type");
        if (type === "master") {
            window.location = '/checkingkit';
        } else {
            window.location = '/checkkit';
        }
    }


    render() {
        const {historiques} = this.state;
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
                    <p className="home-connected">
                        Connecté en tant que invité
                        <img src={'./assets/edit.svg'} alt="" onClick={() => Home.changeStatus()}/>
                    </p>
                    <br/>
                    <div className="home-big-button">
                        <div className="home-big-button--item" style={{backgroundColor: "#05A9AF"}} onClick={() => Home.goToChecking()}>
                            <p>Vérifier un kit</p>
                        </div>
                        <div className="home-big-button--item" style={{backgroundColor: "#7FBB0B"}}>
                            <Link to="/history">Consulter l'historique complet</Link>
                        </div>
                        <div className="home-big-button--item" style={{backgroundColor: "#006DCB"}}>
                            <Link to="/">Statistiques</Link>
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
    }
}

export default Home;

