import "./index.css"
import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material"
import {getDetailedLocalDateTimeString} from "../dateUtil";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const EventItem = ({event, disabledEvent, ...others}) => {
	const handleButtonClick = (event) => {
		event.stopPropagation()
	}

	return (
		<Accordion className={"eventAccordion"} disableGutters {...others}>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>} className={"eventAccordionSummary"} disabled={disabledEvent}>
				<div className={"eventTitle"}>
					<p>{event.courseName} - {event.opponent}</p>
					<h2>{event.title}</h2>
					<h5>{getDetailedLocalDateTimeString(event.date)}</h5>
				</div>
				<div className={"eventButton"}>
					<Button variant={"contained"} href={event.link} onClick={handleButtonClick} disabled={disabledEvent}>Join Meeting</Button>
				</div>
			</AccordionSummary>
			<AccordionDetails className={"eventAccordionDescription"}>
				{event.description}
			</AccordionDetails>
		</Accordion>
	)
}

export default EventItem;
