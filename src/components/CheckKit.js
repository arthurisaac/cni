import React from 'react';
import socketIOClient from "socket.io-client";
import Header from "./Header";
import Connected from "./Connected";
import onScan from "onscan.js";
const socket = socketIOClient("http://localhost:4000");

class CheckKit extends React.Component {

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
        kitNumber: 0,
        started: null,
        type: null,
        ENDPOINT: "http://localhost:4000/"
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

        const type = sessionStorage.getItem('type');
        this.setState({ type : type });

        socket.on("new-kit-number", () => {
            window.location.reload();
        });
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
    }

    checkItem(code) {
        const {elementKit, validCount, type} = this.state;
        const element = elementKit.find(e => e.code === code);
        if (element && element.code === type) {
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
            }

            socket.emit('scanned-kit-item', element);
        }
    }

    render() {
        const status = sessionStorage.getItem("type");
        const {elementKit} = this.state;

        return (

            <div>
                <Header />
                <div className="container">
                    <Connected/>
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
                            (e.code === status) ?
                                (
                                    <tr key={i}>
                                        <td style={{color: e.color, textAlign: "left"}}>{e.item}</td>
                                        <td style={{color: e.color}}>{e.qteValidee}</td>
                                        <td style={{color: e.color}}>{e.qteTotale}</td>
                                    </tr>
                                ) : <></>
                        ))
                    }
                    </tbody>
                </table>
                </div>
            </div>
        )
    }

}

export default CheckKit;

