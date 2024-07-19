import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { setToken, fetchToken } from './Auth.js';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (username.length === 0) {
            alert("Username has left Blank!");
        } else if (password.length === 0) {
            alert("Password has left Blank!");
        } else {
            console.log('axios');
            axios.post('http://localhost:8000/login', {
                username: username,
                password: password
            })
            .then(function (response) {
                console.log(response);
                console.log(response.data);
                alert(response.data["message"]);
                if (response.data["message"] === "Loginfail") {
                    alert("Login failed");
                } else { 
                    if (response.data.token) {
                        setToken(response.data.token);
                        alert("Login successful");
                        navigate("/profile");
                    }
                }
            })
            .catch(function (error) {
                console.log(error, 'error');
            });
        }
    };

    return (
        <div>
            <div className='nav'>
                <p><Link to="/" className="but but-success but-lg">Login</Link> | <Link to="/Register" className="but but-success but-lg">Sign-up</Link> </p>
            </div>
            <div className='a'>
                <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                <div className="card">
                                    <div className="card-body p-5">
                                        {fetchToken() ? (
                                            <p>You are logged in!</p>
                                        ) : (
                                            <p>Login Account!</p>
                                        )}
                                        <form>
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Your User Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="username"
                                                    id="username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Your Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control form-control-lg"
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                            <div className="d-flex justify-content-center">
                                                <input
                                                    type="button"
                                                    className="btn btn-success btn-lg"
                                                    name="submit"
                                                    id="submit"
                                                    value="Login"
                                                    onClick={handleSubmit}
                                                />
                                            </div>
                                            <br></br>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
