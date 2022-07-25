import logo from './logo.svg';
import './App.css';
import Box1 from './components/Box1/Box1';
import Box2 from './components/Box2/Box2';
import Box3 from './components/Box3/Box3';
import Box4 from './components/Box4/Box4';
import Box5 from './components/Box5/Box5';

function App() {
  return (
    <div className="App">
      {/* Rotating Box - location changing, opacity changing, rotation effect */}
      <Box1 />

      {/* Events & Drag */}
      <Box2 />

      {/* Variants & staggering child*/}
      <Box3 />

      {/* KeyFrames */}
      <Box4 />

      {/* useAnimation Hook */}
      <Box5 />
    </div>
  );
}

export default App;
