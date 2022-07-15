import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import './PopUp.css'

// Copied some code from MUI5 WARNING DIALOG

const PopUpDialog = (props) => {
  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToChat = () =>{
    setOpen(false);
    props.onConfirm();
  }

  return (
    <div>
        <button className={props.className} onClick={handleClickOpen}>
            {props.buttonContent}
        </button>
        <Dialog
            open={open}
            onClose={handleClose}
            >
            <DialogTitle>
            {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleToChat} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}


export default PopUpDialog;