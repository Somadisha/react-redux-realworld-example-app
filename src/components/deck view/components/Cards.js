import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import {Alert} from 'react-alert'
import styled from 'styled-components'

function Cards(props) {
    const [data, setData] = useState([]);
    const location = useLocation();
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/Gayathri-p32/DeckData/main/CardData.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                }
            );
    });
    const CardList = styled.div`
        display:flex;
        flex-wrap : wrap;
        @media only screen and (max-width:480px){
            flex-direction:column;
        }
    `
    const Card = styled.div`
        width: 300px;
        height : 300px;
        text-align:center;
        background:gray;
        margin:20px;
        position:relative;
        @media only screen and (max-width:480px){
            width:100%;
            height:200px;
            margin:10px;
            overflow-y:scroll;
        }
    `
    const CardName = styled.h2`
        font-family:font-family: Arial, Helvetica, sans-serif;
        font-size:24px;
        position:absolute;
        top:30%;
        left:40%;
    `
    
    return (
        <>
            <div><h2>Cards</h2></div>
                <CardList>
                    {data.map(card => {
                        return location.state.deckId === card.D_id ?
                            <Card onClick={()=>alert(`Card ${card.id} is clicked!!`)}>
                                <CardName>{ card.id}</CardName>
                            </Card>
                            :null
                    }
                    )}
                </CardList>
            </>
        )
    
}

export default Cards
