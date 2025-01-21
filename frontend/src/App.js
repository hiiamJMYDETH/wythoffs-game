// import logo from './logo.svg';
// import './App.css';
import './Game.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function Ball() {
  return (
    <div className="Marble">
    </div>
  )
}

function Game() {
  return (
    <div className="Board">
      <Ball>1</Ball>
      <Ball>2</Ball>
      <Ball>3</Ball>
    </div>
  )
}

export default Game;
