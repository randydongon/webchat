import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import OptionMenu from './OptionMenu';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//import DialogTitle from '@material-ui/core/DialogTitle';

const styles = (theme) => ({
  root: {
    margin: '0',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    paddingRight: '2rem',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>

      <div>{children}</div>
      {
        onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>

          </IconButton>
        ) : null
      }

    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function OptionDialog({ openop, setOpenop, setPost }) {

  const handleClose = () => {
    setOpenop(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openop}>
        <DialogTitle

          id="customized-dialog-title" onClose={handleClose}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <IconButton onClick={handleClose}>
              <ArrowBackIcon />
            </IconButton>
            <span style={{ margin: 'auto auto', textAlign: 'center' }} >Privacy Settings</span></div>

        </DialogTitle>

        <DialogContent dividers>
          <span>
            <strong>Who can see your post?</strong>
          </span>
          <span style={{ paddingBottom: '0.5rem', fontSize: '14px', color: '#7f7d7c', }}>

            Your post will show up in News Feed, on your profile and in search results.
          </span>

          <OptionMenu setPost={setPost} setOpenop={setOpenop} />

        </DialogContent >

      </Dialog>
    </div>
  );
}

