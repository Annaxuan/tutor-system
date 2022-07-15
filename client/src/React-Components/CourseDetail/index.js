import {React, useEffect, useState} from "react";
import {Grid, Container} from '@mui/material';
import {GridContainer, Sidebar, SidebarContent} from "../GridContainer"
import TutorCard from "./TutorCard";
import './index.css';
import {useNavigate, useParams} from "react-router-dom";
import WarningPopUpDialog from "../PopUp/WarningPopUp";

import {selectUser} from "../../redux/slices/userSlice";
import {selectAuth, selectToken} from "../../redux/slices/authSlice";
import {useSelector} from "react-redux";

import config from "../../config";
import {useFetchAccountConnection, useFetchAddConnection} from "../../api/connection";


const CourseDetail = (props) => {

	let initialTutor = { // default values
		"userTutor": [],
		"tutorAdmin": []
    }

	const [courseList, setCourses] = useState([]);
	const [tutorList, setTutors] = useState(initialTutor);
	const navigate = useNavigate();
	let {id} = useParams() // course id
	const courseID = parseInt(id);

	const api_url_course = `${config.api_host}/api/course/${courseID}`;
	const api_url_tutor = `${config.api_host}/api/connection/course/${courseID}`;


	useEffect(() => {
		
		fetch(api_url_course)
		.then(res => res.json())
		.then(data => setCourses(data))
		.catch(error => console.log(error))


		fetch(api_url_tutor)
		.then(res => res.json())
		.then(data => setTutors(data))
		.catch(error => console.log(error))

	}, [])


	const user = useSelector(selectUser);
	const isAuth = useSelector(selectAuth);
	const accessToken = useSelector(selectToken);
	const {get: getAccountConnection} = useFetchAccountConnection(accessToken);
	const {post: addConnection} = useFetchAddConnection(accessToken, {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json"
	});

	// If current user is a student, pass the tutor id of the target to connect
	// If current user is a tutor, pass nothing here, admin will be selected by the server
	// If current user is an admin, we should not reach here
	const establishConnection = async (tutorID=null) => {
		if (!isAuth){
			return;
		}

		let targetTAC, tutorId, accountId;

		if (!tutorID){
			tutorId = user.id; // No tutor specified, then the current user is the tutor
			accountId = undefined; // Tutor make connection with admins, so we do not need to provide an account id
		}else {
			tutorId = tutorID;
			accountId = user.id;
		}

		const allConnections = await getAccountConnection(`${user.id}`);

		let neededConnections = (user.role === 'tutor') ? allConnections.tutorAdmin : allConnections.tutorStudent;

		// We first find if the connection already exist
		targetTAC = neededConnections.find((tac) => {
			if (!accountId){ // current user is tutor case
				return tac.CourseId === courseID; // the tutor is already chatting to someone about this course
			}else {
				// The current user is already connecting with the selected tutor about the course
				return tac.TargetId === tutorID && tac.CourseId === courseID;
			}

		});

		if (targetTAC === undefined) {
			// Array.find return undefined means the connection did not exist, so we make a new one
			targetTAC = {
				accountId,
				tutorId,
				courseId: courseID
			};
			targetTAC = (await addConnection(targetTAC)); // post the new connection to server
		}
		navigate(`/dashboard/${targetTAC.id}`);
	}


    return (
        <GridContainer>
				<Sidebar>
					<Container sx={{marginY:3}}>
					{(user && user.role === "tutor") ?
					<div>
						<WarningPopUpDialog buttonContent = "Apply To Be a Tutor Now!!!"
						title = "Do you want to apply to become a tutor for this course?"
						content = "If yes, please chat with the admin to arrange an interview."
						className = 'tutorApplyButton'
						onConfirm={establishConnection}
						/>
						<br/>
						</div>:
						<></>}
					<div className="courseDetailTitle">
						{courseList.courseNum}
					</div>
					<div className="courseName">
						{courseList.courseName}
					</div>
					<div className = "content">
							{courseList.courseInfo}
					</div>
					</Container>
				</Sidebar>
				<SidebarContent>
					<Container sx={{marginY:3}} className="tutorCardFormat">
						<div className="courseDetailTitle">
							{"Tutor List"}
						</div>
						<Grid container spacing = {3}>
							{
								tutorList.tutorAdmin.map(function(object, i){
									return (
										<div key={i}>
											<TutorCard
											key = {i}
											name={object.TutorUsername}
											intro={object.TutorInfo}
											tutorID={object.TutorId}
											hasButton={user && user.role === 'student'}
											establishConnection={() => establishConnection(object.TutorId)}
											/>
									</div>
								)})
							}
						</Grid>
					</Container>
				</SidebarContent>
			</GridContainer>
  )
}

export default CourseDetail;