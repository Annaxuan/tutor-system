import TabPanel from "../../../TabPanel";
import AddCourseDialog from "../../../PopUp/InputPopUp";

import "./index.css"
import {useEffect, useState} from "react";
import {CourseManagementAccordion} from "../../ManagementAccordion/CourseManagementAccordion";




import config from "../../../../config";

const ManagementCourseTab = ({...others}) => {

	const [expanded, setExpanded] = useState(-1);
	const handleAccordionChange = (id) => (event, isExpanded) => {
		setExpanded(isExpanded ? id : false);
	};

	const [courses, setCourses] = useState([])





		// fetch user on load
		useEffect(() => {
			fetchCourseInfo();			
		}, [])

		const fetchCourseInfo = () => {
			fetch(`${config.api_host}/api/course`)
			
			.then(res => res.json())
			.then(data => setCourses(data))
			.catch(error => console.log(error))
		}
	

	const renderCourses = () => {
		if (courses.length === 0) {
			return <h2>Empty Result</h2>
		} else {
			return <>
				{courses.map(function(course, i)
				{return (
					<CourseManagementAccordion course={course} 
					expanded={expanded===course.id} 
					handleAccordionChange={handleAccordionChange(course.id)} 
					refreshCourseResult={fetchCourseInfo}
					key = {course.id}/>
				)}
				)}
			</>
		}
	}

	return (
		
		<TabPanel className={"accountCourseTab"} {...others}>
			<AddCourseDialog buttonContent="Add Course"
			    title="Do you want to add a course ?"
			    content="To add a course, please enter the course number and course name. For example:course number CSC309, course name Programing on the Web."
			    className='addCourseButton'
				fetchCourseInfo={fetchCourseInfo}
			/>
			<div>
				{renderCourses()}
			</div>
			
		</TabPanel>
	);
}

export default ManagementCourseTab;
