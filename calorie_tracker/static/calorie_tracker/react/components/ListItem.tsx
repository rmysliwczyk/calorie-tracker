import React from 'react';

export default function ListItem({data} : {data: ListItemData}) {
    return (
        <div className="container mt-2">
            <div className="row">
                <div className="col"><h5>{data.title}</h5></div>
            </div>
            <div className="row">
                <div className="col">{data.content}</div>
            </div>
        </div>
    )
}