import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper'
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import logo from './notepal_logo.png'
import SearchIcon from '@mui/icons-material/Search';

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

function CardResult(props){
  let [image, setImage] = useState();
  useEffect(() =>{
    fetch(`http://localhost:4545/getFile/${props.uploadID}`)
    .then(response => response.blob())
    .then((data) =>{
      setImage(URL.createObjectURL(data));
    })
  }, [])
  return(
    <div className='sr-card'>
      <div className='sr-info'>
        <div className='sr-infoTitle'>
          {props.title}
        </div>
        <div className='sr-infoTag'>
          <b>Tags:</b> {props.tag}
        </div>
      </div>
      <div className='sr-thumbnailCont'>
        <img className='sr-thumbnail' src={image}/>
      </div>
    </div>);
}

function SearchResults(props){
    let inputRef = useRef();
    let [searchValue, setSearchValue] = useState(props.submitValue);
    let [classes, setClasses] = useState(false);
    let [cardArray, setCardArray] = useState([]);
    let [placeholder, setPlaceholder] = useState();
    useEffect(() =>{
      fetch('http://localhost:4545/searchFormat')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setClasses(data);
        setPlaceholder(data[Math.floor(Math.random()* data.length)]['label'])
      })
      .catch(error => console.log(error))
    }, [])
    useEffect(() =>{
      console.log(`Search Value: ${searchValue}`);
      if(searchValue != null){
        fetch(`http://localhost:4545/getUploadID/${searchValue["label"]}`)
        .then((response) => response.json())
        .then((data) =>{
          return data;
        })
        .then((uploadID) => fetch(`http://localhost:4545/getFileInfo/${JSON.stringify(uploadID)}`))
        .then((response)=> response.json())
        .then((data) =>{
          setCardArray([])
          data.forEach(element => {
            setCardArray((oldCards)=> [...oldCards, <CardResult key={element["key"]} uploadID={element["key"]} title={element["class_name"]} tag={element["tags"]}/>])
          });
        })
      }
      else{
        setCardArray([])
      }
    }, [searchValue])
    return(
        <div className="sr-app">
          <div className="sr-header">
            <div className='sr-imageContainer' onClick={() => {props.setSearchPage(false)}}>
              <img className='sr-logo' src={logo} alt='NotePal Logo'/>
                <p className='sr-name'>NOTEPAL</p>
            </div>
            <div className='sr-inputContainer'>
              <div className="sr-searchIconCont" onClick={() => {inputRef.focus();}}>
                  <SearchIcon className='sr-searchIcon'/>
              </div>
              {
                classes === false ?
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
                    value={searchValue}
                    className='sr-input'
                    disablePortal
                    options={[{"label": "loading"}]}
                    // ref={inputRef}
                    renderInput={(params) => <TextField {...params} placeholder={"Fetching Data..."} inputRef={input => {inputRef = input}}/>}
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
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{
                        border: "0",
                    },
                    "& .MuiOutlinedInput-root":{
                    padding: 0,
                },
                    }}
                    className='sr-input'
                    value={searchValue}
                    disablePortal
                    onChange={(e, v, r) => setSearchValue(v)}
                    options={classes}
                    renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
                    PaperComponent={CustomPaper}
                />
              }
            </div>
            <div className='sr-headerFiller'>

            </div>
          </div>
          <div className="sr-sep"></div>
          <div className="sr-body">
              {/* load 15 at a time only */}
              {/* <CreateCardResults searchValue={searchValue}/> */}
              <div className="sr-cardContainer">
                {cardArray}
              </div>
          </div>
        </div>
    );
}

export default SearchResults;