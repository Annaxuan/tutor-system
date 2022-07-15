import {React, useEffect, useState} from "react";
import {GridContainer,FullWidthContent} from "../GridContainer"
import CourseCard from "./CourseCard/CourseCard";
import {Link} from 'react-router-dom';

import config from "../../config";

import {Container} from '@mui/material';

import './index.css';



const CourseView = (props) => {
	
	const [courseList, setCourses] = useState([]);

	const url = `${config.api_host}/api/course`;


	useEffect(() => {

		fetch(url)
		.then(res => res.json())
		.then(data => setCourses(data))
		.catch(error => console.log(error))

	},[])


	return (
      	<GridContainer>
			<FullWidthContent>
				<Container sx={{marginY:5}}>
					<div className="courseGrid">
						{courseList.map(function(object, i){
							return (
							<div key={i}>
								<Link to ={"/course/"+object.id}>
									<CourseCard courseNum = {object.courseNum}
									courseName = {object.courseName}
									courseID = {object.id}
									/>
								</Link>
								<br/>
							</div>
							)
						})}
					</div>
				</Container>
			</FullWidthContent>
		</GridContainer>
  )
}

export default CourseView;