import React from 'react';
import PropTypes from "prop-types"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home';
import NotFound from './NotFound';
import Acesso from './Acesso';
import Cadastrar from './Cadastrar';

const RotaPrivada = ({ children }) => {
    if (!localStorage.getItem("access-token")) {
        return <Navigate to="/acesso" />
    }
    return children;
}

RotaPrivada.propTypes = {
    children: PropTypes.node,
}

const RotaPublica = ({ children }) => {
    if (localStorage.getItem("access-token")) {
        return <Navigate to="/" />
    }
    return children;
}

RotaPublica.propTypes = {
    children: PropTypes.node
}

export const Rotas = ({ app }) => (
    <Router>
        <Routes>
            <Route
                path='/'
                element={
                    <RotaPrivada>
                        <Home app={app}/>
                    </RotaPrivada>
                }
            />
            <Route path='/*' element={<NotFound />} />
            <Route
                path='/acesso'
                element={
                    <RotaPublica>
                        <Acesso />
                    </RotaPublica>
                }
            />
            <Route
                path='/cadastrar'
                element={
                    <RotaPublica>
                        <Cadastrar />
                    </RotaPublica>
                }
            />
        </Routes>
    </Router>
)

Rotas.propTypes = {
    app: PropTypes.any.isRequired,
}