import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Scores } from './scores/scores';
import { About } from './about/about';
import { Quiz } from './quiz/quiz';
import { Edit } from './edit/edit';
import { Create } from './create/create';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const mainElement = document.querySelector('main');
        mainElement.style.backgroundColor = theme === 'dark' ? 'DarkSlateGrey' : 'LightGrey';
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <BrowserRouter>
            <div className="app" data-bs-theme={theme}>
                <header className={`container-fluid ${theme}`}>
                    <nav className="navbar fixed-top">
                        <div className="navbar-brand">Quiz Maker<sup>&reg;</sup></div>
                        <div id="navControls">
                            <menu className="navbar-nav">
                            <li className="nav-item"><NavLink className="nav-link" to="">Login</NavLink></li>
                                {authState === AuthState.Authenticated && (
                                    <li className="nav-item"><NavLink className="nav-link" to="dashboard">Quiz</NavLink></li>
                                )}
                                {authState === AuthState.Authenticated && (
                                    <li className="nav-item"><NavLink className="nav-link" to="scores">Scores</NavLink></li>
                                )}
                                <li className="nav-item"><NavLink className="nav-link" to="about">About</NavLink></li>
                            </menu>
                        </div>
                        <div className="form-check form-switch ms-auto">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                onChange={handleThemeToggle}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                        </div>
                    </nav>
                </header>

                <main className={`container-fluid text-center ${theme}`}>
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <Login
                                    userName={userName}
                                    authState={authState}
                                    onAuthChange={(userName, authState) => {
                                        setAuthState(authState);
                                        setUserName(userName);
                                    }}
                                />
                            }
                            exact
                        />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/scores' element={<Scores />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/quiz' element={<Quiz />} />
                        <Route path='/edit' element={<Edit />} />
                        <Route path='/create' element={<Create />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </main>



                <footer className={`container-fluid ${theme}`}>
                    <div>
                        <span className="text-reset">Lehi Alcantara</span>
                        <NavLink className="text-reset" to="https://github.com/ylehilds/startup">GitHub</NavLink>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    )
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}
