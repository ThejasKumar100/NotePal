import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import logo from './notepal_logo.png'
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import { ring } from 'ldrs'
import { motion } from 'framer-motion'
import { bouncy } from 'ldrs'

ring.register("loading-ring")
bouncy.register('loading-bounce')

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 150,
});

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const CustomPaper = ({ children }) => {
  return (
    <Paper className="paper" style={{ background: "#FCE8C6", border: "2px #C67143 solid", boxShadow: "0px 0px 5px rgba(198,113,67, 0.8)" }} sx={{
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

function CardResult(props) {
  let [image, setImage] = useState();
  let [loaded, setLoaded] = useState(false);
  let [focused, setFocused] = useState(false);
  let [report, setReport] = useState(false);
  let [flagType, setFlagType] = useState("");
  function escFunction(event) {
    if (event.key === "Escape") {
      setFocused(false);
    }
  }
  function submitReport() {
    if(flagType != ""){
      console.log(props.uploadID)
      fetch(`https://node.asharalvany.com/flag/${props.uploadID}/${flagType}`)
      .then(response => response.json())
      .then((message)=>{
        console.log(message)
        props.setNotification(true)
        props.setMessageValue(message == "Success" ? "Note Reported" : message)
        setFlagType("")
        setReport(false)
      })
    }
  }
  function flag(string) {
    if (flagType == string) {
      setFlagType("")
    }
    else {
      setFlagType(string)
    }
  }
  useEffect(() => {
    if (!report) {
      setFlagType("");
    }
  }, [report])
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    fetch(`https://node.asharalvany.com/getFile/${props.uploadID}`)
      .then(response => response.blob())
      .then((data) => {
        setImage(URL.createObjectURL(data));
        setLoaded(true);
      })
  }, [])
  return (
    <div onClick={() => {
      setFocused(true)
    }} className='sr-card'>
      <div className='sr-info'>
        <div className='sr-infoTitle'>
          {props.title}
        </div>
        <div className='sr-infoTag'>
          <b>Tags:</b> {props.tag}
        </div>
      </div>
      {loaded ?
        <div className='sr-thumbnailCont'>
          <img className='sr-thumbnail' src={image} />
        </div>
        :
        <div className='sr-thumbnailCont'>
          <loading-ring color="#3B1910"></loading-ring>
        </div>
      }
      {
        focused && loaded ?
          // onClick={(e) => { e.stopPropagation(); setFocused(false) }} 
          <div className='sr-fullScreenContainer'>
            <img className='sr-fullScreenImage' src={image} />
            <div className='sr-closeContainer'>
              <CloseRoundedIcon onClick={(e) => { e.stopPropagation(); setFocused(false) }} sx={{ color: "#C67143", fontSize: "3rem", cursor: "pointer" }} />
            </div>
            <div className='sr-flagContainer'>
              <OutlinedFlagRoundedIcon sx={{ color: "#C67143", fontSize: "3rem", cursor: "pointer" }} onClick={() => {
                setReport(!report);
              }} />
            </div>
            {report ?
              <div className="sr-reportDropDown">
                <div onClick={() => { flag("Spam") }} className={"sr-DropDownContent " + (flagType == "Spam" ? "sr-selected" : "")}>Spam</div>
                <div onClick={() => { flag("Irrelevant") }} className={"sr-DropDownContent " + (flagType == "Irrelevant" ? "sr-selected" : "")}>Irrelevant Content</div>
                <div onClick={() => { flag("Misinformation") }} className={"sr-DropDownContent " + (flagType == "Misinformation" ? "sr-selected" : "")}>Misinformation</div>
                <div onClick={() => { flag("Sexual") }} className={"sr-DropDownContent " + (flagType == "Sexual" ? "sr-selected" : "")}>Sexual or Repulsive Content</div>
                <div onClick={() => { submitReport() }} className={"sr-DropDownSubmit"}>Submit</div>
              </div>
              :
              null}
          </div> :
          null
      }

    </div>
  );
}

function SearchResults(props) {
  let inputRef = useRef();
  let [searchValue, setSearchValue] = useState(props.submitValue);
  const [messageValue, setMessageValue] = useState();
  const [notification, setNotification] = useState(false);
  let [classes, setClasses] = useState(false);
  let [uploadArray, setUploadArray] = useState([]);
  let [activeUploads, setActiveUploads] = useState([]);
  let [numberOfPages, setNumberOfPages] = useState();
  let [cardPerPage, setCardPerPage] = useState(getWindowDimensions().width < 768 ? 4 : 12);
  let [activePage, setActivePage] = useState(1);
  let [cardArray, setCardArray] = useState([]);
  let [placeholder, setPlaceholder] = useState();
  let [loading, setLoading] = useState(false);
  let [data, setData] = useState([]);
  useEffect(() => {
    fetch('https://node.asharalvany.com/searchFormat')
      .then((response) => response.json())
      .then((data) => {
        setClasses(data);
        setPlaceholder(data[Math.floor(Math.random() * data.length)]['label'])
      })
      .catch(error => console.log(error))
  }, [])
  useEffect(() => {
    console.log("active page: ", activePage, " of ", uploadArray.length)
    if (uploadArray.length > 0) {
      setActiveUploads((numberOfPages > activePage ? (uploadArray.slice(cardPerPage * (activePage - 1), (cardPerPage * (activePage - 1)) + cardPerPage)) : (uploadArray.slice(cardPerPage * (activePage - 1), uploadArray.length))));
    }
    else{
      setData([])
      setLoading(false);
    }
  }, [activePage, uploadArray, cardPerPage])
  useEffect(() => {
    fetch(`https://node.asharalvany.com/getFileInfo/${JSON.stringify(activeUploads)}`)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
  }, [activeUploads])
  useEffect(() => {
    let temp = [];
    data.forEach(element => {
      temp.push(<CardResult setMessageValue = {setMessageValue} setNotification={setNotification} key={element["key"]} uploadID={element["key"]} title={element["class_name"]} tag={element["tags"]} />)
    });
    setCardArray(temp);
    setLoading(false);
  }, [data])
  useEffect(() => {
    console.log(`Search Value: ${searchValue}`);
    setLoading(true)
    setCardArray([])
    setData([])
    if (searchValue != null) {
      fetch(`https://node.asharalvany.com/getUploadID/${searchValue["label"]}`)
        .then((response) => response.json())
        .then((data) => {
          setUploadArray(data);
          setNumberOfPages(Math.ceil(data.length / cardPerPage));
        })
    }
    else {
      setLoading(false)
      setUploadArray([])
      setNumberOfPages(0)
    }
  }, [searchValue])
  useEffect(() => {
    console.log(loading)
  }, [loading])
  function handleLeftIcon() {
    if (1 < activePage) {
      setActivePage(activePage - 1);
    }
  }
  function handleRightIcon() {
    if (numberOfPages > activePage) {
      setActivePage(activePage + 1);
    }
  }

  return (
    <div className="sr-app">
      <div className="sr-header">
        <div className='sr-imageContainer' onClick={() => { props.setSearchPage(false) }}>
          <img className='sr-logo' src={logo} alt='NotePal Logo' />
          <p className='sr-name'>NOTEPAL</p>
        </div>
        <div className='sr-inputContainer'>
          <div className="sr-searchIconCont" onClick={() => { inputRef.focus(); }}>
            <SearchIcon className='sr-searchIcon' />
          </div>
          {
            classes === false ?
              <Autocomplete
                filterOptions={filterOptions}
                sx={{
                  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                    padding: "0 0 0 0",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    border: "0",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                  },
                }}
                value={searchValue}
                className='sr-input'
                disablePortal
                options={[{ "label": "loading" }]}
                // ref={inputRef}
                renderInput={(params) => <TextField {...params} placeholder={"Fetching Data..."} inputRef={input => { inputRef = input }} />}
                // ListboxProps={{background: 'black'}}
                PaperComponent={CustomPaper}
              />
              :
              <Autocomplete
                filterOptions={filterOptions}
                sx={{
                  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                    padding: "0 0 0 0",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    border: "0",
                  },
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                  },
                }}
                className='sr-input'
                value={searchValue}
                disablePortal
                onChange={(e, v, r) => setSearchValue(v)}
                options={classes}
                renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => { inputRef = input }} />}
                PaperComponent={CustomPaper}
              />
          }
        </div>
        <div className='sr-headerFiller'>
          <KeyboardArrowLeftIcon onClick={handleLeftIcon} style={{ fontSize: getWindowDimensions().width > 620 ? "4rem" : "2rem" }} className={`sr-icon ${activePage > 1 ? null : "sr-disabled"}`} />
          <KeyboardArrowRightIcon onClick={handleRightIcon} style={{ fontSize: getWindowDimensions().width > 620 ? "4rem" : "2rem" }} className={`sr-icon ${numberOfPages > activePage ? null : "sr-disabled"}`} />
        </div>
      </div>
      <div className="sr-sep"></div>
      <div className="sr-body">
        {/* load 15 at a time only */}
        {/* <CreateCardResults searchValue={searchValue}/> */}
        {loading ?
          <loading-bounce style={{ transform: "translateY(-15vh)" }} size="60"></loading-bounce>
          :
          data.length > 0 ?
            <div className="sr-cardContainer">
              {cardArray}
            </div>
            :
            <div style={{ transform: "translateY(-15vh)", fontSize: "1.5rem", fontFamily: "Lato" }}>No notes found!</div>
        }
      </div>
      {
        notification ?
          <motion.div animate={{ opacity: [0, 1, 1, 0], top: ["-5%", "5%", "5%", "-5%"] }} transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: ["easeIn", "easeIn", "easeOut"] }} onAnimationComplete={() => setNotification(false)} className="notif">
            {messageValue === "SUCCESS" ? "Successfully Uploaded!" : messageValue}
          </motion.div>
          :
          null
      }
    </div>
  );
}

export default SearchResults;