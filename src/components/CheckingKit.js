import React from 'react';
import {withRouter, Link} from "react-router-dom";
import onScan from 'onscan.js';
import axios from "axios";
import base from "./constants";
import socketIOClient from "socket.io-client";
// import { db } from "../services/firestore";
const REFRESH = "refresh";

/*"kit": [{
       "item": "Encre rigide",
       "code": "encre1",
       "qteValidee": 0,
       "qteTotale": 1,
       "color": "#D0021B"
   }, {
       "item": "Encre indélibile",
       "code": "encre2",
       "qteValidee": 0,
       "qteTotale": 1,
       "color": "#D0021B"
   }, {
       "item": "Scellé",
       "code": "scelle",
       "qteValidee": 0,
       "qteTotale": 12,
       "color": "#D0021B"
   }, {
       "item": "Cachet « annulé »",
       "code": "cachet1",
       "qteValidee": 0,
       "qteTotale": 1,
       "color": "#D0021B"
   }, {
       "item": "Cachet « président »",
       "code": "cachet2",
       "qteValidee": 0,
       "qteTotale": 1,
       "color": "#D0021B"
   }, {
       "item": "Sachet bulletin valide",
       "code": "sachet",
       "qteValidee": 0,
       "qteTotale": 1,
       "color": "#D0021B"
   }, {
       "item": "Enveloppes sécurisées",
       "code": "enveloppes",
       "qteValidee": 0,
       "qteTotale": 8,
       "require": true,
       "color": "#D0021B"
   }, {
       "item": "Stylos",
       "code": "stylos",
       "qteValidee": 0,
       "qteTotale": 0,
       "color": "#808080"
   }, {
       "item": "Gilets électoraux",
       "code": "gilets",
       "qteValidee": 0,
       "qteTotale": 0,
       "color": "#808080"
   }, {
       "item": "Bloc-notes",
       "code": "blocnotes",
       "qteValidee": 0,
       "qteTotale": 0,
       "color": "#808080"
   }, {
       "item": "Mouchoirs",
       "code": "mouchoirs",
       "qteValidee": 0,
       "qteTotale": 0,
       "color": "#808080"
   }]*/
//let socket = null;
class CheckingKit extends React.Component {

    state = {
        elementKit: [],
        validButton: false,
        validCount: 0,
        kitNumber: "",
        redirect: false,
        started: null,
        user: null,
        socket: socketIOClient(base())
    };

    componentDidMount() {
        const { socket } = this.state;

        /*socket.on("welcome", data => {
            console.log(data);
        });*/
        socket.on("message", (data) => {
            console.log(data);
            if (data.action === REFRESH) {
                window.location.reload(true);
            }
            if (data.action === 'numero') {
                this.setState({
                    kitNumber: data.numero,
                });
                this.handleKitCChange();
            }
        });

        if (sessionStorage.getItem('user')) {
            this.setState({
                user: JSON.parse(sessionStorage.getItem('user'))
            });
        }
        this.getKitElement();
        onScan.attachTo(document, {
            suffixKeyCodes: [13], // enter-key expected at the end of a scan
            reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
            onScan: (sCode, iQty) => { // Alternative to document.addEventListener('scan')
                console.log('Scanned: ' + iQty + 'x ' + sCode);
                // alert(sCode);
                this.checkItem(sCode);
            },
            /*onKeyDetect: function(iKeyCode){ // output all potentially relevant key events - great for debugging!
                console.log('Pressed: ' + iKeyCode);
            }*/
        });
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
    }

    async getKitElement() {
        try {
            const response = await axios.get(base() + 'kits');
            if (response.data != null) {
                this.setState({
                    elementKit: response.data['kit']
                });
            }
        } catch (e) {
            console.log(e);
        }

    }

    handleKitCChange() {
        this.setState({
            redirect: true,
            started: new Date().getTime()
        });
    }

    async handleValidClick() {

        const data = {
            uid: new Date().getTime(),
            debut: this.state.started,
            fin: new Date().getTime(),
            kit: this.state.kitNumber,
            user: JSON.parse(sessionStorage.getItem("user"))
        };
        try {
            await axios.post(base() + 'history', data, {});
            //this.state.socket.emit('message', { action: REFRESH, from: this.state.user, numero: null});
            //this.props.history.push("/");
        } catch (e) {
            console.log(e);
        }
        this.state.socket.emit('message', { action: REFRESH, from: this.state.user._id, numero: null});

        /*db.collection("historique")
            .doc(data.uid.toString())
            .set(data)
            .then(() => {
                // window.location = "/";
            })
            .catch(error => {
                console.log(error);
                alert(JSON.stringify(error));
            });*/
    }

    checkItem(code) {
        const {elementKit, validCount} = this.state;
        const element = elementKit.find(e => e.code === code);
        if (element) {
            element.qteValidee = element.qteValidee + 1;
            if (element.qteTotale === element.qteValidee) {
                element.color = "#20d04a";
            }
            this.setState({
                elementKit: elementKit
            });
            // console.log(this.state.elementKit);
            elementKit.forEach(e => {
                if (
                    (e.color === "#20d04a" && e.code === "encre1") ||
                    (e.color === "#20d04a" || e.code === "encre2") ||
                    (e.color === "#20d04a" || e.code === "scelle") ||
                    (e.color === "#20d04a" || e.code === "enveloppes")
                ) {
                    this.setState({
                        validCount: validCount + 1
                    });
                }
            });
            if (this.state.validCount === 3) {
                this.setState({
                    validButton: true
                });
                console.log("Valid");
            }
        }
    }

    tableauKit() {
        const {elementKit, user} = this.state;
        let data = elementKit.filter( element => element.code === user.role);

        if (user.role === "admin" || user.role === "master") {
            data = elementKit;
        }
        return (
            <div>
                <table className="table table-bordered table-striped home-table">
                    <thead>
                    <tr style={{background: "#1F94FE", color: "#fff"}}>
                        <th>Item</th>
                        <th>Qté validée</th>
                        <th>Qté totale</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((e, i) => (
                            <tr key={i}>
                                <td style={{color: e.color, textAlign: "left"}}>{e.item}</td>
                                <td style={{color: e.color}}>{e.qteValidee}</td>
                                <td style={{color: e.color}}>{e.qteTotale}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <button
                    // disabled={!validButton}
                    className="btn btn-success"
                        onClick={() => { this.handleValidClick() }}>Valider
                </button>
            </div>

        )
    }

    static renderHeader() {
        return (
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
        )
    }

    renderKitNumero() {
        return (
            <div className="checking-container">
                <p>Scanner le kit :</p><br />
                <input type="text"
                       placeholder="KIT N° 001"
                       className="checking-container--input"
                       value={this.state.kitNumber}
                       name="kitNumber"
                       onChange={e => {
                           this.setState({kitNumber: e.target.value})
                       }}
                />
                <button className="btn btn-success btn-lg" style={{marginLeft: 80}}
                        onClick={() => {
                            this.handleKitCChange();
                            this.state.socket.emit('message', { action: "numero", numero: this.state.kitNumber, from: this.state.user._id});
                        }}>SUIVANT
                </button>
            </div>
        )
    }

    renderKitChecking() {
        const {redirect} = this.state;

        if (redirect)
            return this.tableauKit();
        else
            return this.renderKitNumero();

    }

    render() {
        const user =  JSON.parse(sessionStorage.getItem('user'));

        return (
            <div>
                {CheckingKit.renderHeader()}
                <div className="container">
                    <div className="checking-navigation">
                        <Link to="/" style={{marginLeft: 10}}>Accueil</Link>
                        <p className="home-connected" onClick={() => {
                            sessionStorage.clear();
                            window.history.go('/');
                        }}>Connecté en tant que {user.username}</p><br/>
                    </div>
                    <h1 className="checking-title">Vérifier un kit</h1>
                    <br/>
                    <br/>
                    {this.renderKitChecking()}
                </div>
                <br />
            </div>
        )
    }
}

export default withRouter(CheckingKit);

