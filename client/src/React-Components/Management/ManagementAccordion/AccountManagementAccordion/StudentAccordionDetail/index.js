import {TagContainer} from "../../../../TagContainer";
import ConnectionTag from "../../ConnectionTag";
import {AccordionDetails, Button} from "@mui/material";
import {useFetchAccountConnection} from "../../../../../api/connection";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../../redux/slices/authSlice";
import {DeleteButton} from "../../index";
import {useFetchAccount} from "../../../../../api/account";

const StudentAccordionDetail = ({id, expanded, updateAccountResult}) => {

	const accessToken = useSelector(selectToken);

	const [tutorAdmin, setTutorAdmin] = useState([])

	const {get: getAccountConnection, loading, error} = useFetchAccountConnection(accessToken);

	useEffect(() => {
		if(expanded) {
			getAccountConnection(`${id}`).then(result => {
				setTutorAdmin(result.tutorStudent)
			})
		}
	}, [expanded])

	const {delete: deleteAccount, loading: deletingAccount, error: deleteAccountError} = useFetchAccount(accessToken);

	const deleteAccountHandler = () => {
		deleteAccount(`${id}`).then(updateAccountResult)
	}

	if (error || deleteAccountError) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			{error && error.message}
			{deleteAccountError && deleteAccountError.message}
		</AccordionDetails>
	} else if (loading || deletingAccount) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			<p className={"processing"}>Processing ...</p>
		</AccordionDetails>
	} else {
		return (
			<AccordionDetails className={"managementAccordionDetails"}>
				<div className={"flexBox"}>
					<div className={"column"}>
						<h4>Courses (Unpurchased appears red):</h4>
						<TagContainer>
							{tutorAdmin.map(c => {
								return {id: c.id, status: c.status, field1: `${c.courseNum} at ${c.campus}`, field2: c.TargetUsername}
							}).map(c => <ConnectionTag key={c.id} connection={c}/>)}
						</TagContainer>
					</div>
				</div>
				<DeleteButton onCommit={deleteAccountHandler} commitButtonText={"Delete this Student"}/>
			</AccordionDetails>
		)
	}
}

export default StudentAccordionDetail;
