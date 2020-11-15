import React, { useState } from "react";
import Routes from "./Routes";
import {
    BrowserRouter as Router
} from 'react-router-dom';
import {AppContext} from "./libs/contextLib";


function App() {

    const [isAuthenticated, userHasAuthenticated] = useState(false);

    return (
        <Router>
            <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
            </AppContext.Provider>
        </Router>
    );
}

export default App;
