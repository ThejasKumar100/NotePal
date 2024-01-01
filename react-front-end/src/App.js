import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import logo from './notepal_logo.png'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const CustomPaper = ({children}) => {
  return(
    <Paper className="paper"  sx={{
      "& ::-webkit-scrollbar": {
        display: 'none'
      },
      "& .MuiAutocomplete-listbox": {
        background: "#F8F6EA",
        border: "2px #C67143 solid",
        boxShadow: "0px 0px 5px rgba(198,113,67, 0.8)",
      },
      "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
        background: "#C67143",
      }
    }}>
      {children}
    </Paper>
  );
};

function App() {
  let inputRef = useRef();
  const [uploadButtonPressed, setUploadButton] = useState(false);
  const [classes, setClasses] = useState([]);
  const [placeholder, setPlaceholder] = useState();
  useEffect(() => {
    fetch('http://localhost:4545/searchFormat')
    .then((response) => response.json())
    .then((data) => {
    console.log(data);
    setClasses(data);
    setPlaceholder(data[Math.floor(Math.random()* data.length)]['label'])
  })
  .catch(error => console.log(error))
  }, [])
  useEffect(() =>{
    console.log(uploadButtonPressed)
  }, [uploadButtonPressed])
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
            <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
              <SearchIcon className='searchIcon'/>
            </div>
          <Autocomplete
            sx={{
              '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                padding: "0 0 0 0",
            },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                border: "0",
            },
            "& .MuiOutlinedInput-root":{
              padding: 0,
          },
            }}
            className='input'
            freeSolo
            // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
            options={classes}
            // ref={inputRef}
            renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
            // ListboxProps={{background: 'black'}}
            PaperComponent={CustomPaper}
          />
        </div>
      </div>
      <div className="credits">
        Made with the keyboards and mice of <b>ΘTA</b>, a UTD Professional Engineering Organization <br/>
        Powered by The Mercury <br/>
        Built by Ashar Alvany, Thejas Kumar, Neel Neupane, ...
      </div>
      <div className="uploadButton" onClick={() => {setUploadButton(!uploadButtonPressed)}}>
            <AddRoundedIcon style={{fontSize:'42px', color:'#3B1910'}}/>
      </div>
      {uploadButtonPressed ? 
      <div className="blackGlass" onClick={() => {setUploadButton(!uploadButtonPressed)}}>
        <div className="formContainer" onClick={(e) => {e.stopPropagation();}}>
            <div className='xContainer'>

            </div>
            <div className="Title">

            </div>
            <div className="uploadInformation">
              <div className="uploadDropdowns">
                <div className='inputContainer'>
              <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
                <SearchIcon className='searchIcon'/>
              </div>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                  padding: "0 0 0 0",
              },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                  border: "0",
              },
              "& .MuiOutlinedInput-root":{
                padding: 0,
            },
              }}
              className='input'
              freeSolo
              // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
              options={classes}
              // ref={inputRef}
              renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
              // ListboxProps={{background: 'black'}}
              PaperComponent={CustomPaper}
            />
                </div>
                <div className='inputContainer'>
              <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
                <SearchIcon className='searchIcon'/>
              </div>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                  padding: "0 0 0 0",
              },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                  border: "0",
              },
              "& .MuiOutlinedInput-root":{
                padding: 0,
            },
              }}
              className='input'
              freeSolo
              // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
              options={classes}
              // ref={inputRef}
              renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
              // ListboxProps={{background: 'black'}}
              PaperComponent={CustomPaper}
            />
                </div>
                <div className='inputContainer'>
              <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
                <SearchIcon className='searchIcon'/>
              </div>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                  padding: "0 0 0 0",
              },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                  border: "0",
              },
              "& .MuiOutlinedInput-root":{
                padding: 0,
            },
              }}
              className='input'
              freeSolo
              // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
              options={classes}
              // ref={inputRef}
              renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
              // ListboxProps={{background: 'black'}}
              PaperComponent={CustomPaper}
            />
                </div>
                <div className='inputContainer'>
              <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
                <SearchIcon className='searchIcon'/>
              </div>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                  padding: "0 0 0 0",
              },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                  border: "0",
              },
              "& .MuiOutlinedInput-root":{
                padding: 0,
            },
              }}
              className='input'
              freeSolo
              // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
              options={classes}
              // ref={inputRef}
              renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
              // ListboxProps={{background: 'black'}}
              PaperComponent={CustomPaper}
            />
                </div>
                <div className='inputContainer'>
              <div className="searchIconCont" onClick={() => {inputRef.focus();console.log('clicked');}}>
                <SearchIcon className='searchIcon'/>
              </div>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                  padding: "0 0 0 0",
              },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                  border: "0",
              },
              "& .MuiOutlinedInput-root":{
                padding: 0,
            },
              }}
              className='input'
              freeSolo
              // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
              options={classes}
              // ref={inputRef}
              renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
              // ListboxProps={{background: 'black'}}
              PaperComponent={CustomPaper}
            />
                </div>
              </div>
              <div className="fileDrop">

              </div>
            </div>
        </div>

      </div>
      : null}
    </div>
  );
}

export default App;
