import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Img from "./p3.jpeg"
import styled from 'styled-components'

const responsive = {
  superLargeDesktop: {
   
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
const Blur = styled.img`
width: 300px;
filter:blur(4px);
`;
function SwipeCard() {
  return(
<Carousel responsive={responsive}>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
  <div><Blur src={Img} /></div>
</Carousel>
  )};
export default SwipeCard;  
