import React from 'react';	
import CardTwo from './CardTwo';
import InfiniteScroll from './InfiniteScroll';



const CardPageTwo = () =>{
	
	const getUrl = (page) => {
		return `https://jsonplaceholder.typicode.com/albums/${page}/photos`
	}
	
    return(
		<InfiniteScroll Component={CardTwo} getUrl={getUrl} height="90vh"/>
    )
}

export default CardPageTwo;
