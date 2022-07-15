import {TagContainer} from "../../../../TagContainer";
import ConnectionTag from "../../ConnectionTag";
import {AccordionDetails, Button} from "@mui/material";
import {useFetchAccountConnection} from "../../../../../api/connection";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../../redux/slices/authSlice";
import {DeleteButton} from "../../index";
import {useFetchAccount} from "../../../../../api/account";

const TutorAccordionDetail = ({id, expanded, updateAccountResult}) => {

	const accessToken = useSelector(selectToken);

	const [tutorAdmin, setTutorAdmin] = useState([])
	const [tutorStudent, setTutorStudent] = useState([])

	const {get: getAccountConnection, loading: loadingConnection, error: errorConnection} = useFetchAccountConnection(accessToken);

	useEffect(() => {
		if(expanded) {
			getAccountConnection(`${id}`).then(result => {
				setTutorAdmin(result.tutorAdmin)
				setTutorStudent(result.tutorStudent)
			})
		}
	}, [expanded])

	const {delete: deleteAccount, loading: deletingAccount, error: deleteAccountError} = useFetchAccount(accessToken);

	const deleteAccountHandler = () => {
		deleteAccount(`${id}`).then(() => {
			updateAccountResult(true)
		})
	}

	if (errorConnection || deleteAccountError) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			{errorConnection && errorConnection.message}
			{deleteAccountError && errorConnection.message}
		</AccordionDetails>
	} else if (loadingConnection || deletingAccount) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			<p className={"processing"}>Processing ...</p>
		</AccordionDetails>
	} else {
		return (
			<AccordionDetails className={"managementAccordionDetails"}>
				<div className={"flexBox"}>
					<div className={"column"}>
						<h4>Courses (Unapproved appears red):</h4>
						<TagContainer>
							{tutorAdmin.map(c => {
								return {id: c.id, status: c.status, field1: `${c.courseNum} at ${c.campus}`, field2: c.TargetUsername}
							}).map(c => <ConnectionTag key={c.id} connection={c}/>)}
						</TagContainer>
					</div>
					<div className={"column"}>
						<h4>Student Connections (Unregistered appears red):</h4>
						<TagContainer>
							{tutorStudent.map(c => {
								return {id: c.id, status: c.status, field1: c.TargetUsername, field2: `${c.courseNum} at ${c.campus}`}
							}).map(c => <ConnectionTag key={c.id} connection={c}/>)}
						</TagContainer>
					</div>
				</div>
				<DeleteButton onCommit={deleteAccountHandler} commitButtonText={"Delete this Tutor"}/>
			</AccordionDetails>
		)
	}
}

export default TutorAccordionDetail;
