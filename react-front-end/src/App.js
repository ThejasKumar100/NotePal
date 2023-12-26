import './App.css';
import logo from './notepal_logo.png'

function App() {
  return (
    <div className="app">
      <div className="container">
        <div className="imageContainer">
          <img className="logo" src={logo} alt='NotePal Logo'/>
        </div>
        <div className='motto'>
        <b>NotePal</b> is love. <b>NotePal</b> is life.
        </div>
        <div className='inputContainer'>
          <input className='input' placeholder='Oh what the future holds...'></input> 
        </div>
      </div>
    </div>
  );
}

export default App;
