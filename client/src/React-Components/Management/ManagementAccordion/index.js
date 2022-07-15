import "./index.css";
import {Button} from "@mui/material";

function DeleteButton({onCommit, commitButtonText}) {
	return <Button
		className={"deleteButton"}
		variant={"contained"}
		type={"submit"}
		onClick={onCommit}
		color={"error"}
		fullWidth
	>
		{commitButtonText}
	</Button>
}

export {DeleteButton};
