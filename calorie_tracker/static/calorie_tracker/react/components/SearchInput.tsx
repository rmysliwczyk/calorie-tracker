import React from 'react';

export default function SearchInput({placeholder, inputValue, onSearch, onAdd, onScan} : {placeholder : string, inputValue: string, onSearch: any, onAdd: Function, onScan: Function}) {
    return (
    <div className="input-group">
        <input type="text" id="search-input" className="form-control" placeholder={placeholder} value={inputValue} onInput={function(e) {onSearch((e.target as HTMLTextAreaElement).value)}}/>
        <button className="btn btn-outline-secondary" type="button" onClick={function() {onAdd()}}>Add</button>
        <button className="btn btn-outline-secondary" type="button" onClick={function() {onScan()}}>Scan</button>
    </div>
    )
}