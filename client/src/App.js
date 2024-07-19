
import React, { } from 'react';
import './App.css'; 
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login.js';
import Profile from './components/Profile.js';
import {RequireToken} from './components/Auth.js';
import Register from './components/Reg.js';
// import Notebook from './components/Notebook';
import EditNote from './components/Editnote.js';
 
function App() {
  return (
    <div className="vh-100 gradient-custom">
    <div className="container">
      <BrowserRouter>
      {/* <div className='nav'>
        <p><Link to="/" className="but but-success but-lg">Login</Link> | <Link to="/Register" className="but but-success but-lg">Sign-up</Link> </p>
        </div> */}
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register/>}/>
            {/* <Route path="/notes" element={<Notebook />} /> */}
            <Route path="/edit" element={<EditNote />} />
            <Route
              path="/Profile"
              element={
                <RequireToken>
                  <Profile />
                </RequireToken>
              }
            />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}
  
export default App;