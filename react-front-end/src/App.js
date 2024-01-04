import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import logo from './notepal_logo.png'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageIcon from '@mui/icons-material/Image';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

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

function UploadInput(props) {
  let inputRef = useRef();
  const [options, setOptions] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:4545/generalInformation/${props.url}`)
    .then((response) => response.json())
    .then((data) => {
    console.log(data);
    setOptions(data);
  })
  .catch(error => console.log(error))
  }, [props.url])
  return(
  <div className='inputContainer2'>
    <div className="searchIconCont2" onClick={() => {inputRef.focus();console.log('clicked');}}>
      <SearchIcon className='searchIcon2'/>
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
      className='input2'
      freeSolo
      // onChange={setPlaceholder(classes[Math.floor(Math.random(classes.length))]['label'])}
      options={options}
      // ref={inputRef}
      renderInput={(params) => <TextField {...params} placeholder={props.placeholder} inputRef={input => {inputRef = input}}/>}
      // ListboxProps={{background: 'black'}}
      PaperComponent={CustomPaper}
    />
  </div>
  );
}

function App() {
  let inputRef = useRef();
  let uploadRef = useRef();
  const [fileReceived, setFileReceived] = useState(false);
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
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const {files} = e.dataTransfer;
    if (files && files.length) {
      console.log(files);
      setFileReceived(true);
    }
  }
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
          <div className="searchIconCont" onClick={() => {inputRef.focus();}}>
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
          <div className="formHeader">
            <div className="formHeaderTitle">
                Note Upload
            </div>
            <div className='xContainer' onClick={() => setUploadButton(!uploadButtonPressed)}>
              <CloseRoundedIcon className='xIcon' style={{fontSize:'42px', color:'#3B1910'}}/>
            </div>
          </div>
          <div className="uploadInformation">
            <div className="uploadCriteriaInput course_prefix"><UploadInput url={'course_prefix'} placeholder={"Course Prefix"}/></div>
            <div className="uploadCriteriaInput class_number"><UploadInput url={'class_number'} placeholder={"Course Number"}/></div>
            <div className="uploadCriteriaInput section"><UploadInput url={'section'} placeholder={"Section Number"}/></div>
            <div className="uploadCriteriaInput instructor"><UploadInput url={'instructor'} placeholder={"Instructor(s)"}/></div>
            <div className="uploadCriteriaInput term"><UploadInput url={'term'} placeholder={"Term"}/></div>
            <div className="uploadCriteriaInput tags"><UploadInput url={'tags'} placeholder={"Tags separated by commas"}/></div>
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="fileDrop">
              <input onInput={() => {setFileReceived(true);console.log("CHANGED")}} ref={input => uploadRef = input} hidden type='file'/>
              <div className="callDrop">{fileReceived ? "Thank You!" : "Drop Files Here"}</div>
              <div className="imageIconContainer">
                {fileReceived ? 
                  <CheckRoundedIcon style={{fontSize:'126px', color:'#3B1910'}}/>
                  :
                  <ImageIcon style={{fontSize:'126px', color:'#3B1910'}}/>
                }
              </div>
              <div style={{opacity: fileReceived ? 0 : 1 }} className="inputButton" onClick={()=>{uploadRef.click()}}>Search for Notes</div>
            </div>
          </div>
        </div>

      </div>
      : null}
    </div>
  );
}

export default App;
