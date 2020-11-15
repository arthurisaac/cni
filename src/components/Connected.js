import React from 'react';
import {Link} from "react-router-dom";

const Connected = () => {
    return (
        <div>
            <div className="checking-navigation">
                <Link to="/" style={{marginLeft: 10}}>Accueil</Link>
                <p className="home-connected">Connecté en tant que invité</p><br/>
            </div>
            <h1 className="checking-title">Vérifier un kit</h1>
            <br/>
            <br/>
        </div>
    )
};

export default Connected;
