import React from 'react';
import ListItem from './ListItem';

export default function List({data} : {data: Array<ListItemData>}) {
    return (
        <>
            <ul className="list-group list-group-flush">
            {data.map(function(element, index) {
                return <li className="list-group-item" key={index}><ListItem data={element} /></li>
            })}
            </ul>
        </>
    )
}