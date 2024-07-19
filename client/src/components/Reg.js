import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Correct import statement

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = () => {
        if (username.length === 0 || email.length === 0 || password.length === 0) {
            alert("Please fill in all required fields!");
        } else {
            axios.post('http://localhost:8000/register', {
                username: username,
                email: email,
                password: password,
                full_name: fullName
            })
            .then(function (response) {
                console.log(response);
                alert(response.data["message"]);
                if (response.data["message"] === "Registration successful") {
                    navigate("/login");
                }
            })
            .catch(function (error) {
                console.log(error, 'error');
            });
        }
    };

    return (
        <div>
            <div className='a'>
            <p>Register Account!</p>
                <form>
                    <div className="form-outline mb-4">
                        <label className="form-label">Your User Name</label>
                        <input type="text" className="form-control form-control-lg" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div><br></br>
                    <div className="form-outline mb-4">
                        <label className="form-label">Your Email</label>
                        <input type="email" className="form-control form-control-lg" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div><br></br>
                    <div className="form-outline mb-4">
                        <label className="form-label">Your Password</label>
                        <input type="password" className="form-control form-control-lg" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div><br></br>
                    <div className="form-outline mb-4">
                        <label className="form-label">Full Name (optional)</label>
                        <input type="text" className="form-control form-control-lg" name="full_name" id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div><br></br>
                    <div className="d-flex justify-content-center">
                        <input type="button" className="btn btn-success btn-lg" name="submit" id="submit" value="Register" onClick={handleSubmit} />
                    </div><br></br>
                </form>
                </div>    
        </div>
                            
        
    );
}
