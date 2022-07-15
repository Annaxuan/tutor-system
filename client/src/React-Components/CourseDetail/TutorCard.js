import {React, useEffect, useState} from "react";
import {Paper, Grid, Box} from '@mui/material';
import WarningPopUpDialog from "../PopUp/WarningPopUp";
import './index.css';
import config from "../../config";

const TutorCard = (props) => {


    const [profilePictureSrc, setProfilePictureSrc] = useState("public/logo.png")


    useEffect(() => {
            fetch(`${config.api_host}/api/account/profilePic/${props.tutorID}`, {
            }).then(res => {
                if (res.status !== 200) {
                    alert(`Error: ${res.status}, Cannot load profile picture`)
                    throw new Error(`request failed, ${res.status}`);
                }else {
                    return res
                }
            })
                .then(async res => {
                    setProfilePictureSrc(URL.createObjectURL(await res.blob()))
                })
                .catch(error => {
                    console.log(error);
                });
	}, [])


    return (
        <Grid item xs = {4}>
            <div className={"profileSideBar"}>
                <div className={"courseTutorIcon"}>
                <img src={profilePictureSrc} alt = "profile icon" className="courseTutorIcon" />
                </div>
                {(props.hasButton) ? 
					<WarningPopUpDialog buttonContent="connect" 
                    title = "Do you want to connect with this tutor?"
                    content = "You can chat with the tutor first, then decide whether to purchase the services."
                    className = "connectTutorButton"
                    onConfirm={props.establishConnection}
                    />:
						<></>}
                <Paper variant = "outlined" className = "tutorInfoCard">
				    <Box paddingX = {2} paddingY={2}>
					    <div className={"tutorName"}>
						    {props.name}
					    </div>
					    <div className={"tutorInfo"}>
						    {props.intro}
					    </div>
				    </Box>
			    </Paper>
            </div>
		</Grid>
    )
}

export default TutorCard;