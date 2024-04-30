import React, { useEffect, useState } from 'react';
import App from './App';
import SearchResults from './SearchResults';

function Wrapper(){
    const [submitValue, setSubmitValue] = useState();
    const [searchPage, setSearchPage] = useState(false);
    useEffect(()=>{
        try {
            Object.keys(submitValue)[0] === "label" ? setSearchPage(true) : setSearchPage(false);
        } catch (error) {
        }
    }, [submitValue])
    return(
        <div className="app">
            {
                searchPage ?
                <SearchResults setSearchPage={setSearchPage} submitValue={submitValue}/> :
                <App setSubmitValue={setSubmitValue}/>
            }
        </div>
    );
}


export default Wrapper;
