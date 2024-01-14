import { useEffect } from 'react';
import './SearchResults.css';


function SearchResults(props){
    useEffect(() =>{
        fetch(`http://localhost:4545/getUploads`)
        .then(response =>{
            console.log(response)
        })
    })
    return(
        <div className="app"></div>
    );
}

export default SearchResults;