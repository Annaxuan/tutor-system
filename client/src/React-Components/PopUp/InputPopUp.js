import React, {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import config from "../../config";

import {useSelector} from "react-redux";
import {selectToken} from "../../redux/slices/authSlice";

import './PopUp.css'

// Copied some code from MUI5 FORM DIALOG


const FormDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [pic, setPic] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
  };

  const url = `${config.api_host}/api/course`;

  const accessToken = useSelector(selectToken);

  const handleClose2 = () => {
    setOpen(false);
    if(!pic) {
	  window.alert("Please upload a Course picture to add course")
	  return
    }
    try{
      fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          courseNum: document.getElementById("courseNum").value,
          courseName: document.getElementById("courseName").value,
          courseInfo: document.getElementById("courseInfo").value,
          campus: document.getElementById("courseCampus").value
        }
      )
    }).then(res => {
		if(! res.ok) {
			throw new Error("Failed to add course (Please check your input)")
		}
		return res
      })
		.then(res => res.json())
    .then(async result => {
	    await changeCoursePicture(pic, result.id)
	    props.fetchCourseInfo(result)
    }).catch(error => window.alert(error.message))
    }
    catch (error){
      console.log(error)
    }

	setPic(null)


  };


  const setFile = (event) => {
		if (event.target.files !== undefined && event.target.files.length !== 0) {
			setPic(event.target.files[0])
		}
	}


  const changeCoursePicture = async (coursePicture, courseID) => {
    const form = new FormData();
    form.set("coursePicture", coursePicture, coursePicture.name)

    try{await fetch(`${config.api_host}/api/course/coursePic/${courseID}`, {
              method: 'POST',
      cachePolicy: 'no-cache',
              headers: {
        "authorization": 'Bearer ' + accessToken
              },
              body: form
            })
            }
            catch (error){
              console.log(error)
            }
  }

  return (
    <div>
        <span className={props.className} onClick={handleClickOpen}>
            {props.buttonContent}
        </span>
        <Dialog open={open} onClose={handleClose1}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.content}
                </DialogContentText>
                <TextField
                required
                margin="dense"
                id="courseNum"
                label="Course Number"
                fullWidth
                variant="standard"
                />
                <TextField
                required
                margin="dense"
                id="courseName"
                label="Course Name"
                fullWidth
                variant="standard"
                />
                <TextField
                required
                margin="dense"
                id="courseInfo"
                label="Course Info"
                fullWidth
                variant="standard"
                />
                <TextField
                required
                margin="dense"
                id="courseCampus"
                label="Campus (Can only be one of 'St. George', 'Scarborough', 'Mississauga')"
                fullWidth
                variant="standard"
                />
                {/* <TextField
                required
                margin="dense"
                id="coursePicture"
                label="Course Picture"
                fullWidth
                variant="standard"
                /> */}
                <Button variant="contained" component="label" color={"primary"} fullWidth>
				         Upload Course Picture
				        <input accept={"image/*"} type="file" onChange={setFile} hidden/>
			          </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose1}>Cancel</Button>
                <Button onClick={handleClose2}>Yes</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}



export default FormDialog;