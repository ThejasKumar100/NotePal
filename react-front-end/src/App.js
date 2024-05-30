import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import logo from './notepal_logo.png'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageIcon from '@mui/icons-material/Image';
import { motion } from 'framer-motion'
import { bouncy } from 'ldrs'

bouncy.register('loading-bounce')

// Default values shown


const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 150,
});

const CustomPaper = ({children}) => {
  return(
    <Paper className="paper"  style={{background:"#FCE8C6", border:"2px #C67143 solid", boxShadow: "0px 0px 5px rgba(198,113,67, 0.8)"}} sx={{
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
    fetch(`http://72.182.168.47:4545/generalInformation/${props.url}`)
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
      filterOptions={filterOptions}
      key={props.rerender}
      value={props.content}
      onChange={(e, v)=>{
        props.setContent(JSON.stringify(v))
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

function App(props) {
  let inputRef = useRef();
  let uploadRef = useRef();
  const [rerender, setRerender] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [messageValue, setMessageValue] = useState();
  const [notification, setNotification] = useState(false);
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
  function clearUploads(){
    setUploadButton(false);
    setFile();
    setRawFile();
    setCoursePrefix();
    setClassNumber();
    setSection();
    setInstructor();
    setTerm();
    setTags();
    setRawFile();
    setFile();
    setFileReceived(false);
  }
  useEffect(() => {
    document.addEventListener("keydown", (event) =>{
      if(event.key == "Escape"){
        setUploadButton(!uploadButtonPressed);
        clearUploads();
      }
    })
    fetch('http://72.182.168.47:4545/searchFormat')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setClasses(data);
      setPlaceholder(data[Math.floor(Math.random()* data.length)]['label'])
    })
    .catch(error => console.log(error))
  }, [])
  // useEffect(() =>{
  //   setTimeout(()=>{
  //   }, 4000)
  // }, [notification])
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
// filename.split('.').pop()

    const {files} = e.dataTransfer;
    console.log(files[0]["name"].split('.').pop().toLowerCase());
    let file_ext = files[0]["name"].split('.').pop().toLowerCase();
    if (files && files.length == 1 && (file_ext === "png" || file_ext === "jpg")) {
      setFileReceived(true);
      setFile(URL.createObjectURL(files[0]))
      setRawFile(files[0]);
    }
    else{
      setNotification(true);
      setMessageValue("Only one file of type PNG/JPG can be uploaded!");
    }
  }
  let clearForm = () =>{
    setCoursePrefix();
    setClassNumber();
    setSection();
    setInstructor();
    setTerm();
    setTags();
    setRawFile();
    setFile();
    setFileReceived(false);
    setRerender(!rerender);
  }
  let uploadInfo = () =>{
    if (!rawFile){
      setNotification(true);
      setMessageValue("Please attach a file!")
      return
    }
    if (!rawFile){
      setNotification(true);
      setMessageValue("Please attach a file!")
      return
    }
    if (!rawFile){
      setNotification(true);
      setMessageValue("Please attach a file!")
      return
    }
    setLoading(true);
    var data = new FormData();
    data.append('file', rawFile)
    console.log(instructor)
    fetch(`http://72.182.168.47:4545/uploadSearchParameters/${coursePrefix};${classNumber};${section};${instructor.replaceAll(';', '%3B')};${term};${tags}`, {
      method: 'POST',
      body: data
    }).then((response) =>{
      return response.json();
    }).then((data) =>{
      setNotification(true);
      setMessageValue(data);
      if(data === "SUCCESS"){
        clearForm();
      }
    }).catch((error) =>{
      console.log(`http://72.182.168.47:4545/uploadSearchParameters/${coursePrefix}-${classNumber}-${section}-${instructor}-${term}-${tags}`)
    }).finally(() => setLoading(false))
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
  {classes == null ?
    // Rendering Autocomplete with loading state
    <Autocomplete
      filterOptions={filterOptions}
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
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      disablePortal
      onChange={(e, v) => console.log(v)}
      options={[{"label": "loading"}]}
      renderInput={(params) => <TextField {...params} placeholder={"Fetching Data..."} inputRef={input => {inputRef = input}}/>}
      PaperComponent={CustomPaper}
    />
  :
    // Rendering Autocomplete with fetched data
    <Autocomplete
      filterOptions={filterOptions}
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
      disablePortal
      onChange={(e, v, r) => props.setSubmitValue(v)}
      options={classes}
      renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
      PaperComponent={CustomPaper}
    />
  }
</div>
      </div>
      <div className="credits">
        Made with the keyboards and mice of <b>ΘTA</b>, a UTD Professional Engineering Organization <br/>
        Powered by <a href="https://www.utdnebula.com/" target='_blank'>Nebula Labs</a> <br/>
        Built by the NotePal Team
      </div>

      
      <div className="uploadButton" onClick={() => {setUploadButton(!uploadButtonPressed)}}>
            <AddRoundedIcon style={{fontSize:'42px', color:'#3B1910'}}/>
      </div>
      {uploadButtonPressed ? 
      <div className="blackGlass" onClick={() => {setUploadButton(!uploadButtonPressed);clearUploads();}}>
        <div className="formContainer" onClick={(e) => {e.stopPropagation();}}>
          <div className="formHeader">
            <div className="formHeaderTitle">
                <b>Upload</b>
            </div>
            <div className='xContainer' onClick={() => {setUploadButton(!uploadButtonPressed);clearUploads();}}>
              <CloseRoundedIcon className='xIcon' style={{fontSize:'42px', color:'#3B1910'}}/>
            </div>
          </div>
          <div className="uploadInformation">
            <div className="uploadCriteriaInput course_prefix"><UploadInput content={coursePrefix} setContent={setCoursePrefix} rerender={rerender} url={'course_prefix'} placeholder={"Course Prefix"}/></div>
            <div className="uploadCriteriaInput class_number"><UploadInput clearValue={coursePrefix == null ? true : false} disabled={coursePrefix == null ? true : false} content={classNumber} setContent={setClassNumber} rerender={rerender} url={'class_number'} placeholder={"Course Number"}/></div>
            <div className="uploadCriteriaInput instructor"><UploadInput content={instructor} setContent={setInstructor} rerender={rerender} url={'instructor'} placeholder={"Instructor(s)"}/></div>
           
           
            <div class="tags" className="uploadCriteriaInput tags"><UploadInput content={tags} setContent={setTags} rerender={rerender} url={'tags'} placeholder={"Tags"}/></div>
            
            {
              isLoading ?
              <div className="submit loading">{<loading-bounce size="40"></loading-bounce>}</div> :
              <div onClick={uploadInfo} className="submit">Upload!</div>
            }
              {/*This next portion will probably need to be changed to accept multiple files but for now the logic only permits the storage of one file at a time. The SQL database depends on their only being one file. We may have to have the backend collate the files or ask the user to do it instead. For now the path is to force the user to collate it themselves. */}
              {fileReceived ?
              <div onDrop={handleDrop} onDragOver={handleDragOver} className="fileDrop">
                <img className="previewImage" alt="" src={file}/>
              </div>
              : 
              <div onDrop={handleDrop} onDragOver={handleDragOver} className="fileDrop">
                <input accept="image/png, image/jpg, image/jpeg" onInput={(e) => {setFileReceived(true);setFile(URL.createObjectURL(e.target.files[0]));setRawFile(e.target.files[0]);console.log(e.target.files[0])}} ref={input => uploadRef = input} hidden type='file'/>
                <div className="callDrop">Drop Your Files Here</div>
                <div className="imageIconContainer">
                    <ImageIcon style={{fontSize:'98px', color:'#3B1910'}}/>
                </div>
                <div className="inputButton" onClick={()=>{uploadRef.click()}}>Open Files</div>
              </div>
              }
              {
                notification ?
                <motion.div animate={{opacity: [0, 1, 1, 0], top: ["-5%", "5%", "5%", "-5%"]}} transition={{duration: 4, times: [0, 0.2, 0.8, 1], ease: ["easeIn", "easeIn", "easeOut"]}} onAnimationComplete={() => setNotification(false)} className="notif">
                    {messageValue === "SUCCESS" ? "Successfully Uploaded!" : messageValue}
                </motion.div>
                :
                null
              }
          </div>
        </div>
      </div>
      : null}
    </div>
  );
}

export default App;
