
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notebook = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const response = await axios.get('http://localhost:8000/notes/');
        setNotes(response.data);
    };

    const handleCreate = async () => {
        await axios.post('http://localhost:8000/notes/', { title, content });
        fetchNotes();
        setTitle('');
        setContent('');
    };

    // const handleUpdate = async (id) => {
    //     await axios.put(`http://localhost:8000/notes/${id}`, { title, content });
    //     fetchNotes();
    //     setTitle('');
    //     setContent('');
    // };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/notes/${id}`);
        fetchNotes();
    };

    return (
        <div className="notebook">
            <h1>Notebook</h1>
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
                        <button onClick={() => { setTitle(note.title); setContent(note.content); navigate('/edit', { state: { id: note._id } })}}>Edit</button>
                        <button onClick={() => handleDelete(note._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notebook;
