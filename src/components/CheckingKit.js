import React from 'react';
import {withRouter, Link} from "react-router-dom";
import onScan from 'onscan.js';
// import { db } from "../services/firestore";
import axios from 'axios';

class CheckingKit extends React.Component {

    state = {
        elementKit: [
            {
                item: "Encre rigide",
                code: "encrerigide",
                qteValidee: 0,
                qteTotale: 2,
                color: "#D0021B"
            },
            {
                item: "Encre indélibile",
                code: "encreindel",
                qteValidee: 0,
                qteTotale: 1,
                color: "#D0021B"
            },
            {
                item: "Scellé",
                code: "scelle",
                qteValidee: 0,
                qteTotale: 10,
                color: "#D0021B"
            },
            {
                item: "Cachet « annulé »",
                code: "cachetannule",
                qteValidee: 0,
                qteTotale: 1,
                color: "#D0021B"
            },
            {
                item: "Cachet « président »",
                code: "cachetpresident",
                qteValidee: 0,
                qteTotale: 1,
                color: "#D0021B"
            },
            {
                item: "Sachet bulletin valide",
                code: "sachetbulletin",
                qteValidee: 0,
                qteTotale: 2,
                color: "#D0021B"
            },
            {
                item: "Enveloppes sécurisées",
                code: "enveloppes",
                qteValidee: 0,
                qteTotale: 8,
                require: true,
                color: "#D0021B"
            },
            {
                item: "Stylos",
                code: "stylos",
                qteValidee: 0,
                qteTotale: 0,
                color: "#808080"
            },
            {
                item: "Gilets électoraux",
                code: "gilets",
                qteValidee: 0,
                qteTotale: 0,
                color: "#808080"
            },
            {
                item: "Bloc-notes",
                code: "blocnotes",
                qteValidee: 0,
                qteTotale: 0,
                color: "#808080"
            },
            {
                item: "Mouchoirs",
                code: "mouchoirs",
                qteValidee: 0,
                qteTotale: 0,
                color: "#808080"
            }
        ],
        validButton: false,
        validCount: 0,
        kitNumber: 0,
        redirect: false,
        started: null,
    };

    componentDidMount() {
        onScan.attachTo(document, {
            suffixKeyCodes: [13], // enter-key expected at the end of a scan
            reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
            onScan: (sCode, iQty) => { // Alternative to document.addEventListener('scan')
                console.log('Scanned: ' + iQty + 'x ' + sCode);
                this.checkItem(sCode);
            },
        });

        /*db.collection("historique")
            .get()
            .then(querySnapshot => {
                this.setState({
                    kitNumber: querySnapshot.size
                });
            });*/

    }

    componentWillUnmount() {
        onScan.detachFrom(document);
    }

    handleKitCChange() {
        this.setState({
            redirect: true,
            started: new Date().getTime()
        })
    }

    handleValidClick() {

        const data = {
            uid: new Date().getTime(),
            debut: this.state.started,
            fin: new Date().getTime(),
            kit: this.state.kitNumber,
            elementKit: this.state.elementKit
        };

        axios.post("http://localhost:4000/historiques", data)
            .then(
                res => console.log(res),
                err => console.log(err));

        // db.collection("historique")
        //     .doc(data.uid.toString())
        //     .set(data)
        //     .then(() => {
        //         // window.location = "/";
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         alert(JSON.stringify(error));
        //     });
        //
        // db.collection("historique")
        //     .get()
        //     .then(querySnapshot => {
        //         this.setState({
        //             kitNumber: querySnapshot.size
        //         });
        //     });

        this.setState({
            redirect: false
        });
    }

    checkItem(code) {
        const {elementKit, validCount} = this.state;
        const element = elementKit.find(e => e.code === code);
        if (element) {
            element.qteValidee = element.qteValidee + 1;
            if (element.qteTotale === element.qteValidee) {
                element.color = "#20d04a";
            }
            if (element.qteValidee > element.qteTotale) {
                alert('Quantité validée atteinte');
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
                    (e.color === "#20d04a" || e.code === "cachet1") ||
                    (e.color === "#20d04a" || e.code === "scelle") ||
                    (e.color === "#20d04a" || e.code === "cachet2") ||
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
        const {elementKit, validButton} = this.state;
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
                        elementKit.map((e, i) => (
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
                    disabled={!validButton}
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
            <form onSubmit={this.handleKitCChange.bind()}>
                <div className="checking-container">
                    <p>Scanner le kit :</p><br />
                    <input type="text"
                           placeholder="KIT N° 001"
                           className="checking-container--input"
                           value={`KIT N° ${("00" + this.state.kitNumber).slice(-3)}`}
                           name="kitNumber"
                           autoFocus={true}
                           /*onChange={e => {
                               this.setState({kitNumber: e.target.value})
                           }}*/
                           readOnly={true}
                    />
                    <button className="btn btn-success btn-lg"
                            style={{marginLeft: 80}}
                            type="submit"
                            onClick={() => this.handleKitCChange()}>SUIVANT
                    </button>
                </div>
            </form>

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
        return (
            <div>
                {CheckingKit.renderHeader()}
                <div className="container">
                    <div className="checking-navigation">
                        <Link to="/" style={{marginLeft: 10}}>Accueil</Link>
                        <p className="home-connected">Connecté en tant que invité</p><br/>
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

