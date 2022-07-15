import "./index.css";
import {Tag} from "../../../TagContainer";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const ConnectionTag = ({connection}) => {

	const {status, field1, field2} = connection;

	return (
		<Tag className={"connectionTag" + (status ? " registered" : " unRegistered")}>
			<div>
				<span><strong>{field1}</strong></span>
				<AlternateEmailIcon fontSize={"small"}/>
				<span>{field2}</span>
			</div>
		</Tag>
	)
}

export default ConnectionTag;
