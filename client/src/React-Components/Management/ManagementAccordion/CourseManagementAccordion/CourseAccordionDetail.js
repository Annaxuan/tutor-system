import "./index.css"
import {useState} from "react";
import FileUploadAccordion from "../../../Profile/ProfileAccordion/FileUploadAccordion";
import TextFieldAccordion from "../../../Profile/ProfileAccordion/TextFieldAccordion";
import {useFetchAccount} from "../../../../api/account";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../redux/slices/authSlice";

import { DeleteButton } from "../../ManagementAccordion";

import { AccordionDetails} from "@mui/material";

import config from "../../../../config";


function CourseAccordionDetail({course, setCourseData}) {



    const courseID = course.id

    const url= `${config.api_host}/api/course/${courseID}`;

	const accessToken = useSelector(selectToken);

	const [expanded, setExpanded] = useState("");

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};


	async function DeleteCourse() {
		const url_requir = `${config.api_host}/api/course/${courseID}`;
		fetch(url_requir, {
			method: "delete",
			cachePolicy: 'no-cache',
			headers: {"authorization": 'Bearer ' + accessToken}
		}).then(response => {
			if (!response.ok) {
				const message = 'Error with Status Code: ' + response.status;
				throw new Error(message);
			}
			return response
		})
		.then(data => setCourseData(data))
		.catch(error =>
			console.log(error)
		);
}

	const NameAccordion = () => {

		const {loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message] = useState("Update Course Name")

		const changeName = (name) => {


            try{
                fetch(url, {
                method: 'PUT',
				cachePolicy: 'no-cache',
                headers: {
                  'Content-Type': 'application/json',
				  "authorization": 'Bearer ' + accessToken
                },
                body: JSON.stringify(
                  {
                    courseName: name
                  }
                )
              })
                  .then(res => res.json())
				  .then(data => setCourseData(data))
              }
              catch (error){
                console.log(error)
              }
            
			setCommitted(true)
		}

		return (
			<TextFieldAccordion
				defaultValue={course.courseName}
				label={"couseName"}
				onTextSubmit={changeName}
				title={"Course Name"} subtitle={"Change the Course Name"}
				expanded={expanded === 'email'} onChange={handleAccordionChange('email')}
				commitButtonText={message}
				loading={loading} error={error} committed={committed}
			/>
		)
	}


    const NumAccordion = () => {

		const {patch, response, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message] = useState("Update Course Number")

		const changeNum = (num) => {
            try{
                fetch(url, {
                method: 'PUT',
				cachePolicy: 'no-cache',
                headers: {
                  'Content-Type': 'application/json',
				  "authorization": 'Bearer ' + accessToken
                },
                body: JSON.stringify(
                  {
                    courseNum: num
                  }
                )
              })
                  .then(res => res.json())
				  .then(data => setCourseData(data))
              }
              catch (error){
                console.log(error)
              }
            
			setCommitted(true)
		}

		return (
			<TextFieldAccordion
				defaultValue={course.courseNum}
				label={"couseNum"}
				onTextSubmit={changeNum}
				title={"Course Number"} subtitle={"Change the Course Number"}
				expanded={expanded === 'number'} onChange={handleAccordionChange('number')}
				commitButtonText={message}
				loading={loading} error={error} committed={committed}
			/>
		)
	}


    const InfoAccordion = () => {

		const {loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message] = useState("Update Course Info")

		const changeInfo = (info) => {
            try{
                fetch(url, {
                method: 'PUT',
				cachePolicy: 'no-cache',
                headers: {
                  'Content-Type': 'application/json',
				  "authorization": 'Bearer ' + accessToken
                },
                body: JSON.stringify(
                  {
                    courseInfo: info
                  }
                )
              })
                  .then(res => res.json())
				  .then(data => setCourseData(data))
              }
              catch (error){
                console.log(error)
              }
            
			setCommitted(true)
		}

		return (
			<TextFieldAccordion multiline rows={4}
				defaultValue={course.courseInfo}
				label={"couseInfo"}
				onTextSubmit={changeInfo}
				title={"Course Info"} subtitle={"Change the Course Info"}
				expanded={expanded === 'info'} onChange={handleAccordionChange('info')}
				commitButtonText={message}
				loading={loading} error={error} committed={committed}
			/>
		)
	}

	const PictureAccordion = () => {

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Upload Course Picture")

		const changeCoursePicture = (coursePicture) => {
			const form = new FormData();
			form.set("coursePicture", coursePicture, coursePicture.name)
			try{fetch(`${config.api_host}/api/course/coursePic/${courseID}`, {
                method: 'POST',
				cachePolicy: 'no-cache',
                headers: {
				  "authorization": 'Bearer ' + accessToken
                },
                body: form
              })
				  .then(data => setCourseData(data))
              }
              catch (error){
                console.log(error)
              }
			setCommitted(true)
		}

		return (
			<FileUploadAccordion
				accept={"image/*"}
				uploadText={message}
				onFileUpload={changeCoursePicture}
				title={"Course Picture"} subtitle={"Upload a New Course Picture"}
				expanded={expanded === 'course-picture'} onChange={handleAccordionChange('course-picture')}
				committed={committed}
			/>
		)
	}

	return (
		<AccordionDetails>
			<br></br>
            <div>
			{NameAccordion()}
			</div>
			<div>
            {NumAccordion()}
			</div>
			<div>
            {InfoAccordion()}
			</div>
			<div>
			{PictureAccordion()}
			</div>
			<DeleteButton onCommit={() => DeleteCourse()} commitButtonText={"Delete this Course"}/>
		</AccordionDetails>
		
	);
}

export default CourseAccordionDetail;