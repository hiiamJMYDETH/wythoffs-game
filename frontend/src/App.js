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
    <svg className="Marble" width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#000000"/>
    </svg>
  )
}

function Game() {
  return (
    <div className="Board">
      <Ball>1</Ball>
    </div>
  )
}

export default Game;
