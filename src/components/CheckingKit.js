import React from 'react';
import {withRouter} from "react-router-dom";
import onScan from 'onscan.js';
// import { db } from "../services/firestore";
import axios from 'axios';
import socketIOClient from "socket.io-client";
import Header from "./Header";
import Connected from "./Connected";

const elements = [
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
];

const socket = socketIOClient("http://localhost:4000");

class CheckingKit extends React.Component {

    state = {
        elementKit: elements,
        validButton: false,
        kitNumber: 0,
        redirect: false,
        started: null,
        ENDPOINT: "http://localhost:4000/"
    };

    componentDidMount() {
        const {elementKit} = this.state;
        onScan.attachTo(document, {
            suffixKeyCodes: [13], // enter-key expected at the end of a scan
            reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
            onScan: (sCode, iQty) => { // Alternative to document.addEventListener('scan')
                console.log('Scanned: ' + iQty + 'x ' + sCode);
                this.checkItem(sCode);
            },
        });

        this.getHistoriesLength();

        socket.on("new-kit-number", data => {
            console.log("new-kit-number", data);
        });

        socket.on("scanned-kit-item", data => {
            // console.log("new-kit-number", data);

            elementKit.forEach(e => {
                if (e.code === data.code) {
                    e.item = data.item;
                    e.code = data.code;
                    e.qteValidee = data.qteValidee;
                    e.qteTotale = data.qteTotale;
                    e.color = data.color;
                }
            });

            this.setState({
                elementKit: elementKit
            });

            this.checkValidButton(elementKit);
        });

        const type = sessionStorage.getItem("type");
        if (type !== "master") {
            window.location = '/checkkit';
        }

        /*db.collection("historique")
            .get()
            .then(querySnapshot => {
                this.setState({
                    kitNumber: querySnapshot.size
                });
            });*/

    }

    getHistoriesLength() {
        axios.get(`${this.state.ENDPOINT}historiques`)
            .then(
                res => this.setState({kitNumber: res.data.length}),
                err => console.log(err));
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
    }

    handleKitChange() {
        this.setState({
            redirect: true,
            started: new Date().getTime()
        });
        socket.emit("new-kit-number", {kitNumber: this.state.kitNumber});
    }

    handleValidClick() {

        const data = {
            uid: new Date().getTime(),
            debut: this.state.started,
            fin: new Date().getTime(),
            kit: this.state.kitNumber,
            elementKit: this.state.elementKit
        };

        axios.post(`${this.state.ENDPOINT}historiques`, data)
            .then(
                res => console.log(res.data),
                err => console.log(err));

        this.setState({
            redirect: false,
            elementKit: elements,
            validButton: false,
            started: null,
            kitNumber: this.state.kitNumber + 1
        });
    }

    checkItem(code) {
        const {elementKit} = this.state;
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
            this.checkValidButton(elementKit);

            socket.emit('scanned-kit-item', element);
        }
    }

    checkValidButton(elementKit) {
        let valid = 0;
        elementKit.forEach(e => {
            if (e.qteValidee >= e.qteTotale) {
                valid++;
            }
        });

        if (valid === 11) {
            this.setState({
                validButton: true
            });
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
                    // disabled={!validButton}
                    className="btn btn-success"
                    onClick={() => {
                        this.handleValidClick()
                    }}>Valider
                </button>
            </div>
        )
    }

    renderKitNumero() {
        return (
            <form onSubmit={this.handleKitChange.bind()}>
                <div className="checking-container">
                    <p>Scanner le kit :</p><br/>
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
                            onClick={() => this.handleKitChange()}>SUIVANT
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
                <Header/>
                <div className="container">
                    <Connected/>
                    {this.renderKitChecking()}
                </div>
                <br/>
            </div>
        )
    }
}

export default withRouter(CheckingKit);

