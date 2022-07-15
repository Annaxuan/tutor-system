import {useState} from "react";
import TextFieldAccordion from "../ProfileAccordion/TextFieldAccordion";
import {useFetchAccount} from "../../../api/account";
import {useSelector} from "react-redux";
import {selectToken} from "../../../redux/slices/authSlice";

function TutorTabPanel({user, setUser}) {

	const accessToken = useSelector(selectToken);

	const [expanded, setExpanded] = useState("");

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

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
			{DescriptionAccordion()}
		</div>
	);
}

export default TutorTabPanel;