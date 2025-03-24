import React from 'react';
import { createRoot } from 'react-dom/client';
import UserInfo from '../components/UserInfo';
import { getUserProfile } from '../lib/api';

document.addEventListener('DOMContentLoaded', function() {

    const root = createRoot(document.querySelector('#react-content'));

    async function renderPage() {

        const user = await getUserProfile(Number(sessionStorage.getItem("current_user_id")));

        root.render(
            <>
                <UserInfo user={user} />
            </>
        )

    }

    renderPage();

})