import React, {useState} from 'react'
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid, TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import theme from "../../../theme";
import './UserInfo.css';
import {Tag, TagContainer} from "../../TagContainer";
import config from "../../../config";
import {useSelector} from "react-redux";
import {selectToken} from "../../../redux/slices/authSlice";
import {useFetch} from "use-http";

const UserInfo = (props) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [url, setURL] = useState("");
    const accessToken = useSelector(selectToken);

    const {patch, response, error} = useFetch(`${config.api_host}/api/connection/${props.tutorAccountCourseID}`, {
        cachePolicy: 'no-cache',
        headers: {
            "authorization": 'Bearer ' + accessToken
        }
    })

    const setClose = () => {
        setOpen(false);
    }

    const userTypeRelation = (type) => {
        if (type === "student"){
            return "a Tutor";
        }else if (type === "tutor"){
            return "an Admin/Student";
        }else {
            return "a Tutor"
        }
    }

    if (props.username === null){
        return <div className={"errorMessageContainer"}>
            <h1>
                {`Select ${userTypeRelation(props.userType)} to connect with.`}
            </h1>
        </div>
    }

    const userStatusDisplay = () => {
        if (props.userType === "student" ||
            (props.userType === "tutor" &&
                props.targetType === "student")){
            return "(Registered)";
        }else if (props.userType === "admin"){
            return "(Approved)";
        }else {
            return "";
        }
    }

    return (
        <div className={"userInfoContainer"}>
            <ThemeProvider theme={theme}>
                <Grid container columnSpacing={3}>
                    <Grid item xs={3}>
                        <div className={'userInfoProfilePicContainer'}>
                            <img className={"img"} src={props.profilePicture} alt={`Profile Picture of ${props.username}`}/>
                        </div>
                    </Grid>
                    <Grid item xs={5.5}>
                        <Typography variant={'h5'}>{"Course: " + props.course}</Typography>
                        <Typography variant={'h5'}>
                            {`${props.username} ${props.status ? userStatusDisplay() : ""}`}
                        </Typography>
                        <div className={"inlineTagsContainer"}>
                            <TagContainer>
                                {
                                    props.campus ?
                                        <Tag>
                                            {props.campus}
                                        </Tag> :
                                        <></>
                                }
                                {
                                    props.program ?
                                        <Tag>
                                            {props.program}
                                        </Tag> :
                                        <></>
                                }
                            </TagContainer>
                        </div>
                        <Typography variant={'body1'}>{props.description}</Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                        {(props.userType === "student") ?
                            <></> :
                            <div  className={"userInfoButton"}>
                                <Button
                                    className={"userInfoButton"}
                                    fullWidth
                                    variant="contained"
                                    component="label"
                                    onClick={(_) => {
                                        setOpen(true);
                                        setDate("");
                                        setDescription("");
                                        setURL("");
                                        setTitle("");
                                    }}
                                >
                                    Schedule Meeting
                                </Button>
                                <Dialog open={open} onClose={setClose}>
                                    <DialogTitle>Choose a time for the meeting</DialogTitle>
                                    <DialogContent>
                                        <div className={"inputContainer"}>
                                            {"Date and time of meeting:   "}
                                            <input
                                                type={"datetime-local"}
                                                required
                                                value={date}
                                                onChange={(event) => {
                                                    setDate(event.target.value);
                                                }}
                                                min={new Date().toISOString().slice(0, 16)}
                                            />
                                        </div>
                                        <div className={"inputContainer"}>
                                            <TextField fullWidth
                                                       required
                                                       maxRows={1}
                                                       value={title}
                                                       onChange={(event) => {
                                                           setTitle(event.target.value);
                                                       }}
                                                       id="title"
                                                       label="Meeting Title"
                                            />
                                        </div>
                                        <div className={"inputContainer"}>
                                            <TextField multiline
                                                       fullWidth
                                                       required
                                                       maxRows={2}
                                                       minRows={2}
                                                       value={description}
                                                       onChange={(event) => {
                                                           setDescription(event.target.value);
                                                       }}
                                                       id="meetingDescription"
                                                       label="Meeting Description"
                                            />
                                        </div>
                                        <div className={"inputContainer"}>
                                            <TextField fullWidth
                                                       required
                                                       maxRows={1}
                                                       value={url}
                                                       onChange={(event) => {
                                                           setURL(event.target.value);
                                                       }}
                                                       id="url"
                                                       label="Meeting URL"
                                            />
                                        </div>
                                        <DialogActions>
                                            <Button
                                                onClick={(_) => {
                                                    setOpen(false);
                                                    if (date !== ""){
                                                        const newSchedule = {
                                                            title: title,
                                                            description: description,
                                                            datetime: new Date(date),
                                                            url: url
                                                        }
                                                        // Making a request to post the schedule to server
                                                        const request = new Request(
                                                            `${config.api_host}/api/schedule/${props.tutorAccountCourseID}`,
                                                            {
                                                                    method: "post",
                                                                    body: JSON.stringify(newSchedule),
                                                                    cachePolicy: 'no-cache',
                                                                    headers: {
                                                                        Accept: "application/json, text/plain, */*",
                                                                        "Content-Type": "application/json",
                                                                        "authorization": 'Bearer ' + accessToken
                                                                    }
                                                                });

                                                        // Send the request with fetch()
                                                        fetch(request)
                                                            .then(res => {
                                                                if (res.status !== 200) {
                                                                    alert(`Error: ${res.status}, Cannot send message`)
                                                                }
                                                            })
                                                            .catch(error => {
                                                                console.log(error);
                                                            });

                                                    }
                                                }}
                                            >
                                                Schedule Meeting
                                            </Button>
                                        </DialogActions>

                                    </DialogContent>
                                </Dialog>
                            </div>
                        }
                        <br/>
                        {(props.status || props.userType === "tutor") ?
                            <></> :
                            <div className={"userInfoButton"}>
                                <Button
                                    className={"userInfoButton"}
                                    fullWidth
                                    variant="contained"
                                    component="label"
                                    onClick={(_) => {
                                        // Send request to server to patch the connection status
                                        patch()
                                            .then(_ => {
                                                if (!response.ok) {
                                                    console.log(response);
                                                    alert(`Error: ${response.data}, Cannot send message?`)
                                                }else {
                                                    props.onChangeStatus();
                                                }
                                            })
                                            .catch(_ => {
                                                console.log(error);
                                            });
                                    }}
                                >
                                    {(props.userType === "student") ?
                                        "Purchase" :
                                        "Approve"}
                                </Button>
                            </div>}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    )
}

export default UserInfo