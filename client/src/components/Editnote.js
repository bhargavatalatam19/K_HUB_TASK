
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "./EditNote.css"
const EditNote = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [note, setNote] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchNote = async () => {
            const response = await axios.get(`http://localhost:8000/notes/`);
            const note = response.data.find((n) => n._id === location.state.id);
            setNote({
                title: note.title,
                content: note.content
            });
        };

        fetchNote();
    }, [location.state.id]);

    const handleUpdate = async () => {
        await axios.put(`http://localhost:8000/notes/${location.state.id}`, note);
        navigate('/');
    };

    return (
        <div className="edit-note">
            <h1>Edit Note</h1>
            <div className="form">
                <input
                    type="text"
                    placeholder="Title"
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
                <textarea
                    placeholder="Content"
                    value={note.content}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                ></textarea>
                <button onClick={handleUpdate}>Update Note</button>
            </div>
        </div>
    );
};

export default EditNote;
