import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import NavBar from './components/Navbar';
import Loader from './components/Loader'
import 'materialize-css';


function App() {
    // забрали из хука все данные для аутентификации, если token есть значит аутентиф. true
    const { login, logout, token, userId, ready } = useAuth()
    const isAuthentificated = !!token   //привели строку к булевому значению
    const routes = useRoutes(isAuthentificated)

    if (!ready) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{
            login, logout, token, userId, isAuthentificated
        }}>
            <Router>
                { isAuthentificated && <NavBar />}
                <div className="container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
