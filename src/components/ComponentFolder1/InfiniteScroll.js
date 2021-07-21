import React, { useState, useEffect } from 'react';	
import Loader from 'react-loader-spinner';
import axios from 'axios';
import styled from 'styled-components';


const StyledDiv = styled.div`
    .loader{
        display: flex;
        justify-content: center;
    },
    .row{
        height: ${props=>props.height};
        overflow-y: auto;
    }
    
`

const InfiniteScroll = ({Component, getUrl, height}) =>{
    const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageNo,setPageNo] = useState(1);
   

	const getData = async(pageNo=1) => {
		setLoading(true)
		try{
			const res =	await axios.get(getUrl(pageNo));
			setData([...data, ...res.data])
		}
		catch(err){
			console.log(err)
		}
		finally{
			setLoading(false)
		}	
	}

    useEffect(()=>{
		getData();
	},[]);

	const firstEvent = (e) => {
		var bottom = e.target.scrollHeight - e.target.scrollTop < 2*e.target.clientHeight;
		if(bottom){
			let pg = pageNo + 1;
			setPageNo(pg);
			getData(pageNo);
		}
	}

    return(
       <StyledDiv className="container-fluid" height={height}>
            <div class="row" onScroll={firstEvent}>
            {data.map(item => {
						return(
							<Component key={item.id} item={item} />
						)
					})}
            {loading? <Loader
				type="Oval"
				color="#424242"
				height={50}
				width={50}
                className="loader"
			/>: null}
            </div>
       </StyledDiv>
        
    )
}

export default InfiniteScroll;
