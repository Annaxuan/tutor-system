import React, {useEffect, useRef, useState} from 'react'
import {Button, Grid, TextField} from "@mui/material";
import {uid} from "react-uid";
import './Chat.css';
import config from "../../../config";
import {useSelector} from "react-redux";
import {selectToken} from "../../../redux/slices/authSlice";

const parseMessages = (messages, self, target, selfProfile, targetProfile, onClick) => {
    return messages.map(
        (message) => {
            return <Grid container spacing={1} key={uid(message)} >
                <Grid item xs={1}>
                    {
                        (message[0] === target) ?
                            <div className={'profilePictureContainer'}>
                                <img className={"chatProfilePicture"} src={targetProfile} alt={`${target}`}/>
                            </div> :
                            <></>
                    }
                </Grid>
                    <Grid item xs={10}>
                        <div className={`messages ${(message[0] === target) ? "receivedMessages" : "sentMessages"}
                                         ${onClick ? "clickableChatMessage" : ""}`}
                            onClick={onClick}>
                            <div className={"paragraph"}>
                                {message[1]}
                            </div>
                        </div>
                    </Grid>
                <Grid item xs={1}>
                    {
                        (message[0] === self) ?
                            <div className={'profilePictureContainer'}>
                                <img className={"chatProfilePicture"} src={selfProfile} alt={`${self}`}/>
                            </div>
                             :
                            <></>
                    }
                </Grid>
            </Grid>
        }
    )
}

const ChatBox = (props) => {
    // Each message is represented by a pair, with first element being the sender, second element being the content
    const [input, setInput] = useState("");
    const accessToken = useSelector(selectToken);
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current){
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    })

    if (props.target === null){
        return <></>
    }

    return (
        <div className={"chatContainer"}>
            <div className={"chat"} ref={ref}>
                {parseMessages(props.messages, props.self, props.target, props.selfProfile, props.targetProfile, props.onClick, ref)}
            </div>
            <div className={"chatOperationsContainer"}>
                {
                    !props.fileView ?
                        <Grid container spacing={1}>
                            <Grid item xs={10.5}>
                                <TextField multiline
                                           fullWidth
                                           required
                                           maxRows={2}
                                           minRows={2}
                                           value={input}
                                           onChange={(event) => {
                                               setInput(event.target.value);
                                           }}
                                           id="messageEditor"
                                           label="Type message here"/>
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    className={"chatButtons"}
                                    onClick={(_) => {
                                        if (input.length > 0){
                                            props.messages.push([props.self, input]);
                                            props.setMessages([...props.messages]);
                                            setInput("");

                                            const message = {
                                                content: input,
                                            }

                                            // Making a request to post the message to server
                                            const request = new Request(`${config.api_host}/api/message/${props.tutorAccountCourseID}`, {
                                                method: "post",
                                                body: JSON.stringify(message),
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
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={1}>
                            <Grid item xs={11.6}>
                            <Button
                                fullWidth
                                className={"chatButtons"}
                                variant="contained"
                                component="label"
                            >
                                + Upload file or images
                                <input type="file" hidden onChange={(event) => {

                                    if (event.target.files !== undefined && event.target.files.length !== 0){

                                        const form = new FormData();
                                        form.set("file", event.target.files[0], event.target.files[0].name)

                                        // Making a request to post the message to server, but first check if the file already exists
                                        const request = new Request(
                                            `${config.api_host}/api/message/files/exists/${props.tutorAccountCourseID}/${event.target.files[0].name}`, {
                                            method: "get",
                                            cachePolicy: 'no-cache',
                                            headers: {
                                                //'Content-Type': 'multipart/form-data',
                                                "authorization": 'Bearer ' + accessToken
                                            }
                                        });

                                        // Send the request with fetch()
                                        fetch(request)
                                            .then(res => {
                                                if (res.ok){
                                                    return res.json()
                                                }else {
                                                    alert(`Error: ${res.status}, Cannot send file`)
                                                }
                                            }).then(json => {
                                                    if (json.exists === true){
                                                        if (!window.confirm("File exists, do you want to overwrite it?")){
                                                            return;
                                                        }
                                                    }
                                                    const request = new Request(
                                                        `${config.api_host}/api/message/file/${props.tutorAccountCourseID}`, {
                                                            method: "post",
                                                            body: form,
                                                            cachePolicy: 'no-cache',
                                                            headers: {
                                                                //'Content-Type': 'multipart/form-data',
                                                                "authorization": 'Bearer ' + accessToken
                                                            }
                                                        });

                                                    fetch(request).then(res => {
                                                        if (res.status !== 200) {
                                                            alert(`Error: ${res.status}, Cannot send file`)
                                                        }else {
                                                            if (json.exists === false){
                                                                props.files.push([props.self, event.target.files[0].name]);
                                                                props.setFiles([...props.files]);
                                                            }
                                                        }
                                                    })
                                                        .catch(error => {
                                                            console.log(error);
                                                        });
                                        })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                    }
                                }}/>
                            </Button>
                        </Grid>
                    </Grid>
                }
            </div>
        </div>

    )
}

export default ChatBox