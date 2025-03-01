import React from 'react';
import { createRoot } from 'react-dom/client';
import InfoCard from '../components/infoCard';

const root: React = createRoot(document.querySelector('#react-content'));
const aboutCalorieTracker = "This is a web app project intended to be a fullstack learning opportunity."
root.render(
    <>
    <InfoCard title="About calorie-tracker" content={aboutCalorieTracker} />
    </>
)
