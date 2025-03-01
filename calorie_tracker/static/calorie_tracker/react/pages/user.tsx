import React from 'react';
import { createRoot } from 'react-dom/client';
import UserInfo from '../components/userInfo';

const root: React = createRoot(document.querySelector('#react-content'));

const user: User = {
    username: "TEST",
    calorie_goal: 100
}

root.render(
    <>
        <UserInfo user={user} />
    </>
)
