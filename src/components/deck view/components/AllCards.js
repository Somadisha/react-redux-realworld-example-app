import React, { useState,useEffect } from 'react'
import styled from 'styled-components';

const AllCards = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/Gayathri-p32/DeckData/main/CardData.json")
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                }
            );
    });
    
    const Card = styled.div`
        width:400px;
        height: 150px;
        margin:10px;
        padding:20px;
        background:#353935;
        border-radius:16px;
        align-item:center;
    `
    const CardId = styled.h2`
        width:200px;
        font-size:48px;
        color:white;
        text-align:center;
    `

        return (
            <>
                {data.map(card=> (
                    <Card>
                        <CardId>{card.D_id}{card.id}</CardId>
                    </Card>
                ))}
            </>
        )
    
}
export default AllCards;