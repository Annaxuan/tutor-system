import "./index.css"
import {useEffect, useState} from "react";
import {ProfileAccordion, CommitButton} from "../index";
import {Button, TextField} from "@mui/material";

const TextFieldAccordion = ({defaultValue, onTextSubmit, label, rows = 1, multiline = false, commitButtonText= "Submit", error, committed, ...others}) => {
	const [text, setText] = useState("")

	const onCommit = (event) => {
		event.preventDefault()
		onTextSubmit(text)
	}

	useEffect(() => {
		setText(defaultValue ? defaultValue : "")
	}, [defaultValue])

	return (
		<ProfileAccordion {...others}>
			<div className={"textFieldAccordion"}>
				<TextField
					value={text} onChange={event => setText(event.target.value)}
					label={label} rows={rows}
					fullWidth multiline={multiline}
					error={!!error}/>
				<CommitButton onCommit={onCommit} commitButtonText={commitButtonText} error={error} committed={committed}/>
			</div>
		</ProfileAccordion>
	)
}

export default TextFieldAccordion;
