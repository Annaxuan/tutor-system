import "./index.css"
import {useState} from "react";
import {TextField} from "@mui/material";
import {ProfileAccordion, CommitButton} from "../ProfileAccordion";
import FileUploadAccordion from "../ProfileAccordion/FileUploadAccordion";
import TextFieldAccordion from "../ProfileAccordion/TextFieldAccordion";
import {useFetchAccount, useFetchProfilePicture} from "../../../api/account";
import {useSelector} from "react-redux";
import {selectToken} from "../../../redux/slices/authSlice";

function AccountTabPanel({user, setUser}) {

	const accessToken = useSelector(selectToken);

	const [expanded, setExpanded] = useState("");

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const EmailAccordion = () => {

		const {patch, response, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Update Email")

		const changeEmail = (email) => {
			patch({email: email}).then(r => {
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
				defaultValue={user.email}
				label={"Email"}
				onTextSubmit={changeEmail}
				title={"Email"} subtitle={"Change your UofT email"}
				expanded={expanded === 'email'} onChange={handleAccordionChange('email')}
				commitButtonText={message}
				loading={loading} error={error} committed={committed}
			/>
		)
	}

	const PasswordAccordion = () => {

		const {patch, response, loading, error} = useFetchAccount(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Change Password")

		const [oldPassword, setOldPassword] = useState("")
		const [newPassword, setNewPassword] = useState("")
		const [confirmNewPassword, setConfirmNewPassword] = useState("")

		const [oldPasswordError, setOldPasswordError] = useState(false)
		const [newPasswordError, setNewPasswordError] = useState(false)
		const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false)

		const changePassword = (event) => {
			event.preventDefault();
			// reset errors
			setOldPasswordError(false)
			setNewPasswordError(false)
			setConfirmNewPasswordError(false)
			// check password
			if (newPassword !== confirmNewPassword) {
				setNewPasswordError(true)
				setConfirmNewPasswordError(true)
			} else {
				patch({password: {oldPassword, newPassword}}).then(r => {
					if(! response.ok) {
						if(response.data === "Incorrect password") {
							setOldPasswordError(true)
						} else {
							setNewPasswordError(true)
							setConfirmNewPasswordError(true)
						}
						setMessage(response.data)
					} else {
						setUser(r)
						setMessage("Change Password Success")
					}
				})
			}
			setCommitted(true)
		}

		return (
			<ProfileAccordion title={"Password"} subtitle={"Change Password"}
			                  expanded={expanded === 'password'} onChange={handleAccordionChange('password')}
			                  loading={loading}>
				<div className={"passwordAccContainer"}>
					<TextField value={oldPassword} onChange={event => setOldPassword(event.target.value)}
					           label="Old Password" type={"password"}
					           error={oldPasswordError} required fullWidth/>
					<TextField value={newPassword} onChange={event => setNewPassword(event.target.value)}
					           label="New Password" type={"password"}
					           error={newPasswordError} required fullWidth/>
					<TextField value={confirmNewPassword} onChange={event => setConfirmNewPassword(event.target.value)}
					           label="Confirm New Password" type={"password"}
					           error={confirmNewPasswordError} required fullWidth/>
					<CommitButton onCommit={changePassword} commitButtonText={message} error={error} committed={committed}/>
				</div>
			</ProfileAccordion>
		)
	}

	const ProfilePictureAccordion = () => {

		const {post, response, loading, error} = useFetchProfilePicture(accessToken, {}, {cachePolicy: 'no-cache'});

		const [committed, setCommitted] = useState(false)
		const [message, setMessage] = useState("Upload Profile Picture")

		const changeProfilePicture = (profilePicture) => {
			const form = new FormData();
			form.set("profilePicture", profilePicture, profilePicture.name)

			post(form).then(r => {
				if(! response.ok) {
					setMessage(response.data)
				} else {
					// force refresh
					setUser(null, false, true)
					setMessage("Upload Successful")
				}
			})
			setCommitted(true)
		}

		return (
			<FileUploadAccordion
				accept={"image/*"}
				uploadText={message}
				onFileUpload={changeProfilePicture}
				title={"Profile Picture"} subtitle={"Upload a New Profile Picture"}
				expanded={expanded === 'profile-picture'} onChange={handleAccordionChange('profile-picture')}
				loading={loading} error={error} committed={committed}
			/>
		)
	}

	return (
		<div>
			{EmailAccordion()}
			{PasswordAccordion()}
			{ProfilePictureAccordion()}
		</div>
	);
}

export default AccountTabPanel;