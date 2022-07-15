import "./index.css";
import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useEffect, useState} from "react";

function ProfileAccordion({children, title, subtitle, loading, ...other}) {

	return (
		<Accordion disableGutters className={"accordion"} {...other}>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>} className={"accordionSummary"}>
				<h3 className={"title"}>{title}</h3>
				<h3 className={"subTitle"}>{subtitle}</h3>
			</AccordionSummary>
			<AccordionDetails className={"accordionDetails"}>
				{loading ? <p className={"processing"}>Processing ...</p> : children}
			</AccordionDetails>
		</Accordion>
	);
}

function CommitButton({onCommit, commitButtonText, committed, error}) {
	const [color, setColor] = useState("primary")

	useEffect(() => {
		if (error) {
			setColor(committed ? "error" : "primary")
		} else {
			setColor(committed ? "success" : "primary")
		}
	}, [committed, error])

	return <Button
		variant={"contained"}
		type={"submit"}
		onClick={onCommit}
		color={color}
		fullWidth
	>
		{commitButtonText}
	</Button>
}

export {ProfileAccordion, CommitButton};
