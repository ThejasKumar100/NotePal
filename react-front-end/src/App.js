import './App.css';
import React, { useState, useEffect } from 'react';
import logo from './notepal_logo.png'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from 'react-select'

function App() {
  const [loaded, setLoaded] = useState(false);
  const [classes, setClasses] = useState([]);
  const [placeholder, setPlaceholder] = useState();
  useEffect(() => {
    fetch('http://localhost:4545/searchFormat')
    .then((response) => response.json())
    .then((data) => {
    console.log(data);
    setLoaded(true);
    setClasses(data);
    setPlaceholder(data[Math.floor(Math.random()* data.length)]['label'])
  })
  .catch(error => console.log(error))
  }, [])
  return (
    <div className="app">
      <div className="container">
        <div className="imageContainer">
          <img className="logo" src={logo} alt='NotePal Logo'/>
        </div>
        <div className='motto'>
        Your Professor Doesn't Need to Know
        </div>
        <div className='inputContainer'>
          {/* <input className='input' placeholder='Oh what the future holds...'></input> 
           */}
          <Autocomplete
            sx={{
              '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                padding: 0,
            },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                border: "0",
            }
            }}
            className='input'
            freeSolo
            // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
            options={classes}
            renderInput={(params) => <TextField {...params} placeholder={placeholder}/>}
          />

        </div>
      </div>
      <div className="credits">
        Made with the keyboards and mice of <b>ΘTA</b>, a UTD Professional Engineering Organization <br/>
        Powered by The Mercury <br/>
        Built by Ashar Alvany, Thejas Kumar, Neel Neupane, ...
      </div>
    </div>
  );
}

export default App;
