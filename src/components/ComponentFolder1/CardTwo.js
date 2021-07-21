import React, {useState} from 'react';
import styled from 'styled-components';




const StyledTitle = styled.h4`
    top: 0;
    font-size: 30px;
    font-weight: 600;
    margin: 0;
    padding: 15px;
    position: absolute;
    left: 0;
    transition: all 0.3s ease-out;
    color: #fff;
`

const StyledText = styled.p`
  bottom: 0;
  color: white;
  left: 0;
  opacity: 0;
  padding: 1.25em;
  position: absolute;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  transition: all .3s linear;
  width: 100%;
`

const StyledCard = styled.div`
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      border: 0;
      border-radius: 0;
      height: 60vh;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
      max-width: 300px;
      margin: 20px auto;
      @media  (max-width: 479px) {
          height: 90vh;
      }
      .card-img-overlay {
        background-color: rgba(0, 0, 0, 0.1);
        content: "";
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        transition: all 0.3s ease-in;
        width: 100%;
    }
    
`

const StyledCol = styled.div`
  .clicked ${StyledText} {
    opacity: 1;
  }
  .clicked .card-img-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  }
`

const CardTwo = ({item}) =>{
  const [click, setClick] = useState(false)
    return(
    <StyledCol className="col-lg-4 col-md-6 col-12" onClick={()=>setClick(!click)}>
      <StyledCard className={click?"card card-inverse clicked":"card card-inverse"} style={{backgroundImage:`url(${item.thumbnailUrl}})`}}>
        <div className="card-img-overlay">
          <StyledTitle className="card-title">{item.title}</StyledTitle>
          <StyledText className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quas, quia commodi cumque at ad sunt ab  </StyledText>
        </div>
      </StyledCard>
    </StyledCol>
    )
}

export default CardTwo;
