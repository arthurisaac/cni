import React from 'react';

const Header = () => {
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
};

export default Header;
