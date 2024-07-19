import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import "./profile.css"
const Profile = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/notes/');
            setNotes(response.data);
        } catch (err) {
            setError('Failed to fetch notes. Please try again later.');
            console.error(err);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post('http://localhost:8000/notes/', { title, content });
            fetchNotes();
            setTitle('');
            setContent('');
        } catch (err) {
            setError('Failed to create note. Please try again later.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/notes/${id}`);
            fetchNotes();
        } catch (err) {
            setError('Failed to delete note. Please try again later.');
            console.error(err);
        }
    };

    const signOut = () => {
        localStorage.removeItem('cairocodersToken');
        navigate('/');
    };

    return (
        <div style={{ minHeight: 800, marginTop: 20 }}>
            {/* <h1>Profile Page</h1>
            <p>Hi, this is your profile</p> */}
            <div>
                <button type='button' className="btn btn-success btn-lg" onClick={signOut}>Sign Out</button>
            </div>
            
            {/* <p><Link to="/notes" className="but but-success but-lg">Notebook</Link></p> */}

            <div className="notebook">
                <h1>Notebook</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button onClick={handleCreate}>Create Note</button>
                </div>
                <div className="notes">
                    {notes.map((note) => (
                        <div key={note._id} className="note">
                            <h2>{note.title}</h2>
                            <p>{note.content}</p>
                            <button onClick={() => { setTitle(note.title); setContent(note.content); navigate('/edit', { state: { id: note._id } }) }}>Edit</button>
                            <button onClick={() => handleDelete(note._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
