import "./index.css";
import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectToken} from "../../../../redux/slices/authSlice";
import TutorAccordionDetail from "./TutorAccordionDetail";
import AdminAccordionDetail from "./AdminAccordionDetail";
import {useFetchProfilePicture} from "../../../../api/account";
import StudentAccordionDetail from "./StudentAccordionDetail";

function AccountManagementAccordion({account, expanded, handleOnChange, updateAccountResult, ...others}) {

	const accessToken = useSelector(selectToken);

	const [profilePictureSrc, setProfilePictureSrc] = useState("")

	const {get, response} = useFetchProfilePicture(accessToken)

	useEffect(() => {
		get(`${account.id}`).then(async () => {
			setProfilePictureSrc(URL.createObjectURL(await response.blob()))
		})
	}, [])

	const renderDetail = () => {
		if(account.role === "admin") {
			return <AdminAccordionDetail id={account.id} expanded={expanded}/>
		} else if(account.role === "tutor") {
			return <TutorAccordionDetail id={account.id} expanded={expanded} updateAccountResult={updateAccountResult}/>
		} else {
			return <StudentAccordionDetail id={account.id} expanded={expanded} updateAccountResult={updateAccountResult}/>
		}
	}

	return (
		<Accordion expanded={expanded} onChange={handleOnChange} disableGutters className={"managementAccordion account"} {...others}>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>} className={"managementAccordionSummary"}>
				<div className={"gridBox"}>
					<div className={"entry icon"}>
						<img className={"profilePicture"} src={profilePictureSrc} alt={"Icon"}/>
					</div>
					<div className={"entry"}>
						<h4>ID</h4>
						<p>{account.id}</p>
					</div>
					<div className={"entry"}>
						<h4>Username</h4>
						<p>{account.username}</p>
					</div>
					<div className={"entry"}>
						<h4>Role</h4>
						<p>{account.role}</p>
					</div>
					<div className={"entry"}>
						<h4>Email</h4>
						<p>{account.email}</p>
					</div>
					<div className={"entry"}>
						<h4>Campus</h4>
						<p>{account.campus ? account.campus : "-"}</p>
					</div>
					<div className={"entry"}>
						<h4>Program of Study</h4>
						<p>{account.programOfStudy ? account.programOfStudy : "-"}</p>
					</div>
					<div className={"entry"}>
						<h4>Description</h4>
						<p>{account.description ? account.description : "-"}</p>
					</div>
				</div>
			</AccordionSummary>
			{renderDetail()}
		</Accordion>
	);
}

export {AccountManagementAccordion};
