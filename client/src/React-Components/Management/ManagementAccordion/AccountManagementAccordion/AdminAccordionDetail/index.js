import {TagContainer} from "../../../../TagContainer";
import ConnectionTag from "../../ConnectionTag";
import {AccordionDetails, Button} from "@mui/material";
import {useFetchAccountConnection} from "../../../../../api/connection";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../../redux/slices/authSlice";

const AdminAccordionDetail = ({id, expanded}) => {

	const accessToken = useSelector(selectToken);

	const [tutorAdmin, setTutorAdmin] = useState([])

	const {get: getAccountConnection, loading, error} = useFetchAccountConnection(accessToken);

	useEffect(() => {
		if(expanded) {
			getAccountConnection(`${id}`).then(result => {
				setTutorAdmin(result.tutorAdmin)
			})
		}
	}, [expanded])

	if (error) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			{error.message}
		</AccordionDetails>
	} else if (loading) {
		return <AccordionDetails className={"managementAccordionDetails"}>
			<p className={"processing"}>Processing ...</p>
		</AccordionDetails>
	} else {
		return (
			<AccordionDetails className={"managementAccordionDetails"}>
				<div className={"flexBox"}>
					<div className={"column"}>
						<h4>Tutor Connections (Unapproved appears red):</h4>
						<TagContainer>
							{tutorAdmin.map(c => {
								return {id: c.id, status: c.status, field1: `${c.courseNum} at ${c.campus}`, field2: c.TargetUsername}
							}).map(c => <ConnectionTag key={c.id} connection={c}/>)}
						</TagContainer>
					</div>
				</div>
			</AccordionDetails>
		)
	}
}

export default AdminAccordionDetail;
