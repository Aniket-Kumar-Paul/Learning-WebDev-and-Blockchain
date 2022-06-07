// import logo from './logo.svg';
import './App.css';
import Header from './MyComponents/Header'; // if used default function then no need for curly brackets {Header}
import { AddTodos } from './MyComponents/AddTodos';
import { Todos } from './MyComponents/Todos';
import { Footer } from './MyComponents/Footer';
import { About } from './MyComponents/About';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  let initTodo;
  if (localStorage.getItem("todos") === null) {
    initTodo = [];
  }
  else {
    initTodo = JSON.parse(localStorage.getItem("todos"));
  }

  const onDelete = (todo) => {
    // setTodos([list of all todo objects except the one passed in the function])
    setTodos(todos.filter((e) => {
      return e !== todo;
    }));
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  const addTodo = (title, desc) => {
    let sno;
    if (todos.length == 0) {
      sno = 1;
    }
    else {
      sno = todos[todos.length - 1].sno + 1;
    }
    const myTodo = {
      sno: sno,
      title: title,
      desc: desc
    }
    setTodos([...todos, myTodo]);
  }

  // todos is the list of objects
  // setTodos replaces this list with the list inside it when called
  const [todos, setTodos] = useState(initTodo);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]) // If there is any change in todos, run the given callback function

  return (
    <>
      <Router>
        {/* Components */}
        <Header title="Todos-List" searchBar={true} />

        <Switch>
          {/* Homepage */}
          <Route exact path="/" render={() => {
            return (
              <>
                <AddTodos addTodo={addTodo} />
                <Todos todos={todos} onDelete={onDelete} />
              </>
            )
          }}>
          </Route>

          {/* About Page */}
          <Route exact path="/about" render={() => {
            return <About />
          }}>
          </Route>
        </Switch>


        <Footer />
      </Router>
    </>
  );
}

export default App;