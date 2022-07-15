import {useState} from "react";
import {Button, ButtonGroup} from "@mui/material";
import {ProfileAccordion} from "../ProfileAccordion";
import TextFieldAccordion from "../ProfileAccordion/TextFieldAccordion";
import {useFetchAccount} from "../../../api/account";
import {useSelector} from "react-redux";
import {selectToken} from "../../../redux/slices/authSlice";

function StudentTabPanel({user, setUser}) {

	const accessToken = useSelector(selectToken);

	const [expanded, setExpanded] = useState("");

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const CampusAccordion = () => {

		const {patch, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const campuses = ["St. George", "Scarborough", "Mississauga"]

		const setCampus = (index) => {
			patch({campus: campuses[index]}).then(setUser)
		}

		return (
			<ProfileAccordion title={"Campus"} subtitle={"Campus at UofT"}
			                  expanded={expanded === 'campus'} onChange={handleAccordionChange('campus')}
			                  loading={loading}>
				<ButtonGroup color={error ? "error" : "primary"} fullWidth>
					{campuses.map((campusName, index) => {
						return (
							<Button
								onClick={() => setCampus(index)}
								variant={user.campus === campuses[index] ? "contained" : "outlined"}
								disableRipple
								key={index}
							>{campusName}</Button>
						)
					})}
				</ButtonGroup>
			</ProfileAccordion>
		)
	}

	const ProgramOfStudyAccordion = () => {

		const {patch, response, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Update Program Of Study")

		const changeProgramOfStudy = (programOfStudy) => {
			patch({programOfStudy: programOfStudy}).then(r => {
				if(! response.ok) {
					setMessage(response.data)
				} else {
					setUser(r)
					setMessage("Update Successful")
				}
			})
			setCommitted(true)
		}

		return (
			<TextFieldAccordion
				defaultValue={user.programOfStudy}
				label={"Program Name"}
				onTextSubmit={changeProgramOfStudy}
				title={"Program"} subtitle={"Program of Study"}
				commitButtonText={message}
				expanded={expanded === 'program'} onChange={handleAccordionChange('program')}
				loading={loading} error={error} committed={committed}
			/>
		)
	}

	const DescriptionAccordion = () => {

		const {patch, response, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Update Description")

		const changeDescription = (description) => {
			patch({description: description}).then(r => {
				if(! response.ok) {
					setMessage(response.data)
				} else {
					setUser(r)
					setMessage("Update Successful")
				}
			})
			setCommitted(true)
		}

		return (
			<TextFieldAccordion
				defaultValue={user.description}
				label={"Description"}
				onTextSubmit={changeDescription}
				rows={4}
				multiline={true}
				title={"Description"} subtitle={"Something About Yourself"}
				commitButtonText={message}
				expanded={expanded === 'description'} onChange={handleAccordionChange('description')}
				loading={loading} error={error} committed={committed}
			/>
		)
	}

	return (
		<div>
			{CampusAccordion()}
			{ProgramOfStudyAccordion()}
			{DescriptionAccordion()}
		</div>
	);
}

export default StudentTabPanel;