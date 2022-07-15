import {ProfileAccordion} from "../index";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";

const FileUploadAccordion = ({accept, uploadText, onFileUpload, error, committed, ...others}) => {
	const [color, setColor] = useState("primary")

	useEffect(() => {
		if (error) {
			setColor(committed ? "error" : "primary")
		} else {
			setColor(committed ? "success" : "primary")
		}
	}, [committed, error])

	const setFile = (event) => {
		if (event.target.files !== undefined && event.target.files.length !== 0) {
			onFileUpload(event.target.files[0])
		}
	}

	return (
		<ProfileAccordion {...others}>
			<Button variant="contained" component="label" color={color} fullWidth>
				{uploadText}
				<input accept={accept} type="file" onChange={setFile} hidden/>
			</Button>
		</ProfileAccordion>
	)
}

export default FileUploadAccordion;
