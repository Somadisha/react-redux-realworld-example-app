import React from 'react'
import styled from 'styled-components'
import AllCards from './AllCards'
import Decks from './Decks'

function MAinPage() {
    
    const Header = styled.div`
        display:flex;
        margin:10px;
        font-size:16px;
    `
    const RowAlign = styled.div`
        display: flex;
        margin-left:20px;
        overflow-x:scroll;
        overflow-y:hidden;
        &::-webkit-scrollbar {
            width: 0; 
            background: transparent;
    `
    return (
        <div>
            
            <div>
                <Header>
                    <h3>All Cards</h3>  
                </Header>
                <RowAlign>
                    <AllCards/>
                </RowAlign>
            </div>
            <div>
                <Header>
                    <h3>Deck View</h3>
                </Header>
                <RowAlign>
                    <Decks/>
                </RowAlign>
            </div>
        </div>
    )
}

export default MAinPage
