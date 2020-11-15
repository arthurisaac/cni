import React from 'react';
// import { db } from "../services/firestore";
import axios from 'axios';
import {Link} from "react-router-dom";

class History extends React.Component {

    state = {
        historiques: []
    }

    componentDidMount() {
        /*db.collection("historique")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                // this.setState({ users: data });
                setHistorique([...data]);
            });*/
        axios.get("http://localhost:4000/historiques")
            .then(
                res => this.setState({historiques:[...res.data]}),
                err => console.log(err));
    };

    render() {
        const { historiques } = this.state;

        return (
            <div>
                <div>
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
                    <div className="checking-navigation">
                        <Link to="/" style={{marginLeft: 10}}>Accueil</Link>
                        <p className="home-connected">Connecté en tant que invité</p><br/>
                    </div>
                    <h1 className="checking-title">Historique</h1>
                    <br />
                    <table className="table table-bordered home-table">
                        <thead>
                        <tr style={{ background: "#1F94FE", color: "#fff"}}>
                            <td>Numéro de kit</td>
                            <td>Date heure démarrage</td>
                            <td>Date heure de clôture</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            historiques.map( (historique, i) => (
                                <tr key={i}>
                                    <td>KIT N° {historique.kit}</td>
                                    <td>
                                        { new Date(historique.debut).getDate() }/{ new Date(historique.debut).getMonth() + 1 }/{ new Date(historique.debut).getFullYear() } à { new Date(historique.debut).getHours() }h:{ new Date(historique.debut).getMinutes() }
                                    </td>
                                    <td>
                                        { new Date(historique.fin).getDate() }/{ new Date(historique.fin).getMonth() + 1 }/{ new Date(historique.fin).getFullYear() } à { new Date(historique.fin).getHours() }h:{ new Date(historique.fin).getMinutes() }
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



};

export default History;

