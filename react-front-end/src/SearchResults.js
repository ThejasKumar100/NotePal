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

function SearchResults(props){
    let inputRef = useRef();
    let [classes, setClasses] = useState(false);
    let [placeholder, setPlaceholder] = useState();
    useEffect(() =>{
        fetch('http://localhost:4545/searchFormat')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setClasses(data);
          setPlaceholder(data[Math.floor(Math.random()* data.length)]['label'])
        })
        .catch(error => console.log(error))
    }, [])
    return(
        <div className="sr-app">
          <div className="sr-header">
            <div className='sr-imageContainer'>
              <img className='sr-logo' src={logo} alt='NotePal Logo'/>
                {/* NOTEPAL */}
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
                    className='sr-input'
                    disablePortal
                    onChange={(e, v, r) => console.log(v)}
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
                    disablePortal
                    onChange={(e, v, r) => console.log(v)}
                    options={classes}
                    // ref={inputRef}
                    renderInput={(params) => <TextField {...params} placeholder={placeholder} inputRef={input => {inputRef = input}}/>}
                    // ListboxProps={{background: 'black'}}
                    PaperComponent={CustomPaper}
                />
              }
            </div>
          </div>
          <div className="sr-sep"></div>
          <div className="sr-body">
            <div className='sr-cardContainer'>
              {/* load 15 at a time only */}
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>
              <div className="sr-card">
              </div>

            </div>
          </div>
        </div>
    );
}

export default SearchResults;