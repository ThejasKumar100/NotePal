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

const CustomPaper = ({children}) => {
  return(
    <Paper className="paper"  style={{background:"#F8F6EA", border:"2px #C67143 solid", boxShadow: "0px 0px 5px rgba(198,113,67, 0.8)"}} sx={{
      "& ::-webkit-scrollbar": {
        display: 'none'
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
  <div className='inputContainer2' >
    <div className="searchIconCont2" onClick={() => {inputRef.focus();console.log('clicked');}}>
      <SearchIcon className='searchIcon2'/>
    </div>
    <Autocomplete
      onChange={(e, v)=>{
        // props.url === "tags" ?
        props.setContent(JSON.stringify(v))
        // :
        // props.setContent(JSON.stringify(v["label"]))
      }}
      limitTags={0}
      disabled={props.disabled ? true : null}
      getLimitTagsText={(more) => `...${more}`}
      disablePortal
      multiple={props.url === "tags" ? true : null}
      freeSolo={props.url === "tags" ? true : null}
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
  const [file, setFile] = useState();
  const [rawFile, setRawFile] = useState();
  const [coursePrefix, setCoursePrefix] = useState()
  const [classNumber, setClassNumber] = useState()
  const [section, setSection] = useState()
  const [instructor, setInstructor] = useState()
  const [term, setTerm] = useState()
  const [tags, setTags] = useState()
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
      setFile(URL.createObjectURL(files[0]))
      setRawFile(files[0]);
    }
  }
  let uploadInfo = () =>{
    var data = new FormData()
    data.append('file', rawFile)
    fetch(`http://localhost:4545/uploadSearchParameters/${coursePrefix};${classNumber};${section};${instructor};${term};${tags}`, {
      method: 'POST',
      body: data
    });
    console.log(`http://localhost:4545/uploadSearchParameters/${coursePrefix}-${classNumber}-${section}-${instructor}-${term}-${tags}`)
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
        Built by the NotePal Team
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
            <div className="uploadCriteriaInput course_prefix"><UploadInput setContent={setCoursePrefix} url={'course_prefix'} placeholder={"Course Prefix"}/></div>
            <div className="uploadCriteriaInput class_number"><UploadInput clearValue={coursePrefix == null ? true : false} disabled={coursePrefix == null ? true : false} setContent={setClassNumber} url={'class_number'} placeholder={"Course Number"}/></div>
            <div className="uploadCriteriaInput section"><UploadInput disabled={coursePrefix == null || classNumber == null ? true : false} setContent={setSection} url={'section'} placeholder={"Section Number"}/></div>
            <div className="uploadCriteriaInput instructor"><UploadInput setContent={setInstructor} url={'instructor'} placeholder={"Instructor(s)"}/></div>
            <div className="uploadCriteriaInput term"><UploadInput disabled={coursePrefix == null || classNumber == null || section == null ? true : false} setContent={setTerm} url={'term'} placeholder={"Term"}/></div>
            <div className="uploadCriteriaInput tags"><UploadInput setContent={setTags} url={'tags'} placeholder={"Tags"}/></div>
            <div onClick={uploadInfo} className="submit">Upload!</div>
              {/*This next portion will probably need to be changed to accept multiple files but for now the logic only permits the storage of one file at a time. The SQL database depends on their only being one file. We may have to have the backend collate the files or ask the user to do it instead. For now the path is to force the user to collate it themselves. */}
              {fileReceived ?
              <div onDrop={handleDrop} onDragOver={handleDragOver} className="fileDrop">
                <img className="previewImage" alt="" src={file}/>
              </div>
              : 
              <div onDrop={handleDrop} onDragOver={handleDragOver} className="fileDrop">
                <input onInput={(e) => {setFileReceived(true);setFile(URL.createObjectURL(e.target.files[0]));setRawFile(e.target.files[0]);}} ref={input => uploadRef = input} hidden type='file'/>
                <div className="callDrop">Drop Files Here</div>
                <div className="imageIconContainer">
                    <ImageIcon style={{fontSize:'126px', color:'#3B1910'}}/>
                </div>
                <div className="inputButton" onClick={()=>{uploadRef.click()}}>Search for Notes</div>
              </div>
              }
          </div>
        </div>

      </div>
      : null}
    </div>
  );
}

export default App;
