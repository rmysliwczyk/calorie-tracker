import React from 'react';

export default function ListItem({data, handleClick} : {data: ListItemData, handleClick: any}) {
    return (
        <div className="container mt-2" onClick={function() { handleClick(data.id) }}>
            <div className="row">
                <div className="col"><h5>{data.title}</h5></div>
            </div>
            <div className="row">
                <div className="col">{data.content}</div>
            </div>
        </div>
    )
}
