import React from 'react';
import InfoCard from './infoCard';

function UserInfo({user} : {user: User} )  {
    return (
        <div className="react-user-info">
            <h2>Profile information for {user.username}</h2>
            <InfoCard title='Calorie goal' content={user.calorie_goal} />
        </div>
    )
}

export default UserInfo;