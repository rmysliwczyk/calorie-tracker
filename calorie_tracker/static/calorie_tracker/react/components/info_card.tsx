import React from 'react';

function InfoCard({title, content} : {title: string, content: string})  {
    return (
        <div className="react-info-card">
            <h5>{title}</h5>
            <p>{content}</p>
        </div>
    )
}

export default InfoCard;