import React from 'react';

export default function SearchInput({placeholder, inputValue, onSearch} : {placeholder : string, inputValue: string, onSearch: any}) {
    return (
    <div className="input-group">
        <input type="text" id="search-input" className="form-control" placeholder={placeholder} value={inputValue} onInput={function(e) {onSearch((e.target as HTMLTextAreaElement).value)}}/>
    </div>
    )
}