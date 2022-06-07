import React, { useState } from 'react';

export const AddTodos = ({ addTodo }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const submit = (e) => {
        e.preventDefault(); //to avoid reloading page
        if (!title || !desc) {
            alert("Title and Description cannot be blank");
        } 
        else {
            addTodo(title, desc);
            // after submitting input fields should be empty
            setTitle("");
            setDesc("");
        }
    }

    return (
        <div className='container my-3'>
            <h3>Add a new toDo</h3>
            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="tilte" className="form-label">toDo Title</label>
                    {/* value=title => initially title will be the value of the input*/}
                    {/* use onChange to set the title according to the entered text */}
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" />
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">toDo Description</label>
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc" />
                </div>
                <button type="submit" className="btn btn-sm btn-success">Add toDo</button>
            </form>
        </div>
    );
};
