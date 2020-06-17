import React from 'react';
import './styles.css';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}


export default function Breadcrumbs() {
    return (
        <div id='Breadcrumb' aria-label="breadcrumb">
            <p id='DashboardText'color="textPrimary">Dashboard Geral</p>
        </div>
    );
}