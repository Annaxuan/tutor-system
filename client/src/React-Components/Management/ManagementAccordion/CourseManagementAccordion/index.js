import "./index.css";
import {Accordion, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useEffect, useState} from "react";
import CourseAccordionDetail from "./CourseAccordionDetail";

import config from "../../../../config";



function CourseManagementAccordion({course, expanded, handleAccordionChange, refreshCourseResult, ...others}) {


	const [coursePictureSrc, setCoursePictureSrc] = useState("")

	useEffect(() => {
		fetch(`${config.api_host}/api/course/coursePic/${course.id}`, {
		}).then(res => {
			if (res.status !== 200) {
				alert(`Error: ${res.status}, Cannot load course picture`)
				throw new Error(`request failed, ${res.status}`);
			}else {
				return res
			}
		})
			.then(async res => {
				setCoursePictureSrc(URL.createObjectURL(await res.blob()))
			})
			.catch(error => {
				console.log(error);
			});
}, [])

	const setCourseData = (data) => {
		refreshCourseResult()
	}


	return (
		<Accordion expanded={expanded} onChange={handleAccordionChange} disableGutters className={"managementCourse"} {...others}>
					<AccordionSummary expandIcon={<ExpandMoreIcon/>} className={"managementAccordionSummary"}>
						<div className={"gridBox"}>
							{/* Need to upload picture from aws!!! */}
							<div className={"entry icon"}>
								<img className={"coursePicture"} src={coursePictureSrc} alt={"Icon"}/>
							</div>
							<div className={"entry"}>
								<h4>ID</h4>
								<p>{course.id}</p>
							</div>
							<div className={"entry"}>
								<h4>Course Number</h4>
								<p>{course.courseNum}</p>
							</div>
							<div className={"entry"}>
								<h4>Course Name</h4>
								<p>{course.courseName}</p>
							</div>
							<div className={"entry"}>
								<h4>Campus</h4>
								<p>{course.campus}</p>
							</div>
						</div>
					</AccordionSummary>

					<CourseAccordionDetail setCourseData={setCourseData} course = {course} key = {course.id}/>

					</Accordion>	
	);
}

export {CourseManagementAccordion};
