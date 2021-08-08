import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import styled from 'styled-components';

function BackButton() {
    const IconBack = styled.div`
        width:40px;
        height:40px;
        background:transparent;
        text-align:center;
        position:relative;
        padding:3px;
        &:hover{
            border-radius:50%;
            background: #D3D3D3 radial-gradient(circle, transparent 1%, #D3D3D3 1%) center/15000%;
            background-position: center;
            transition: background 0.5s;
        }
    `
    return (
        <IconBack>
            <ArrowBackIcon fontSize="large"/>
        </IconBack>
    )
}

export default BackButton
