import React from 'react'
import "./App.css"
import { useSelector, useDispatch } from 'react-redux';
import { incNumber, decNumber } from "./actions/index";

const App = () => {
  const myState = useSelector((state) => state.changeTheNumber);
  const dispatch = useDispatch();
  
  return (
    <>
      <div className="container">
        <h1>Increment/Decrement Counter</h1>
        <h4>using React & Redux</h4>

        <div className="quantity">
          <a title='Decrement' className="quantity__minus" onClick={ () => dispatch(decNumber(5)) }><span>-</span></a>
          <input type="text" name='quantity' className="quantity__input" value={myState} />
          <a title='Increment' className="quantity__plus" onClick={ () => dispatch(incNumber(5)) }><span>+</span></a>
        </div>

      </div>
    </>
  )
}

export default App;