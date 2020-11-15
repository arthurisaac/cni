import React  from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import CheckingKit from "./components/CheckingKit";
import CheckKit from "./components/CheckKit";
import History from "./components/History";

export default function Routes() {

    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path='/login'>
                <Login />
            </Route>
            <Route exact path='/checkingkit'>
                <CheckingKit />
            </Route>
            <Route exact path='/checkkit'>
                <CheckKit />
            </Route>
            <Route exact path='/history'>
                <History />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}
