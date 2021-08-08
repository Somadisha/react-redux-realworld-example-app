import React, { useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

function Decks() {
    let history = useHistory();
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/Gayathri-p32/DeckData/main/Data.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                }
            );
    });
    const DeckView = styled.div`
        width:200px;
        height:200px;
        background:#D3D3D3;
        border-radius:32px;
        border:1px solid black;
        box-shadow: -5px 0px #808080,
                    -6px 0px #000000,
                    -10px 0px #A9A9A9,
                    -11px 0px #000000,
                    -15px 0px #D3D3D3,
                    -16px 0px #000000;
        }
    `
    const Deck = styled.div`
        object-fit:contain;
        width:100%;
        height:210px;
        margin:10px;
        padding:5px;
        text-align:center; 
    `
    const DeckName = styled.div`
        color:black;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        margin : 10px;
    `
    return (
        <>
            {data.map(deck => (
                <Deck onClick={() => { history.push("/Cards",{ deckId: deck.id })}}>
                    <DeckView></DeckView>
                    <DeckName>{deck.name}</DeckName>
                </Deck>
            ))}
        </>
    )
}

export default Decks;
