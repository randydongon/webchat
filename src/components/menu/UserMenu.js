import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SettingsEthernetOutlinedIcon from '@material-ui/icons/SettingsEthernetOutlined';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { RiMessengerLine, RiDeleteBin5Line } from "react-icons/ri";
import { BsPerson, BsCheck } from "react-icons/bs";
import { BiBell, BiVideo } from "react-icons/bi";
import { FiPhoneCall } from "react-icons/fi";
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
  divStyle: {
    fontSize: '15px', fontWeight: 'bold'
  },
  text: {
    fontSize: '11px', color: '#7f7d7c'
  },
  divider: {
    margin: theme.spacing(0, 2),
  }
}))

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 2),
    '&:focus': {
      // backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.gray,
      },
    },

  },

}))(MenuItem);

export default function UserMenu({ anchorEl, setAnchorEl, userId, uid, itemId }) {
  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    const filter = e.currentTarget.dataset.filter;
    switch (filter) {
      case 'Mark as Unread':
        markUnread(filter)
        break;
      case 'View Profile':
        viewProfile(filter)
        break;
      case 'Remove friend':
        deleteFriend(filter)
        break;
      case 'Open in Messanger':
        hidePost(filter);
        break;
      case 'Mute conversation':
        console.log('Mute conversation')
        break;
      case 'Audio Call':
        console.log('Audio call')
        break;
      case 'Video Chat':
        console.log('Video chat')
        break;

      default:
        break;
    }
    setAnchorEl(null);
  }

  const markUnread = (value) => {
    console.log('mark unread');
  }
  const deleteFriend = async (value) => {
    const user = localStorage.getItem('currentuser');
    if (!user) return;
    const { id } = JSON.parse(user);
    // console.log('...deleting contact ', userId, id)
    firebase.firestore().collection('userprofile')
      .doc(id).collection('friendslist').doc(userId).delete().then(() => {
        console.log('successfully unfriend')
      }).catch(error => {
        console.log(error);
      })
    setAnchorEl(null);
  }
  function viewProfile(value) {
    console.log('View Profile')
  }
  const hidePost = (value) => {
    console.log('hide post')
  }

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Divider className={classes.divider} />

        <StyledMenuItem onClick={handleClick} data-filter='Mark as Unread'>
          <ListItemIcon>
            <BsCheck />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}  >Mark as Unread</Typography>
            <Typography className={classes.text}>Messages from friend</Typography>
          </div>
        </StyledMenuItem>
        <Divider className={classes.divider} />
        <StyledMenuItem onClick={handleClick} data-filter='Remove friend'>
          <ListItemIcon>
            <RiDeleteBin5Line />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}  >Remove Friend</Typography>
            <Typography className={classes.text}>Remove friend from you list</Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='Open in Messanger'>
          <ListItemIcon>
            <RiMessengerLine />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>Open in Messenger</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='View Profile'>
          <ListItemIcon>
            <BsPerson />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>View Profile</Typography>
            <Typography className={classes.text}>View friend's profile</Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='Mute conversation'>
          <ListItemIcon>
            <BiBell />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>Mute conversation</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='Audio Call'>
          <ListItemIcon>
            <FiPhoneCall />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>Audio Call</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='Video Chat'>
          <ListItemIcon>
            <BiVideo />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>Video Chat</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <SettingsEthernetOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <div>
            <Typography className={classes.divStyle} ></Typography>
            <Typography className={classes.text}>
            </Typography>
          </div>
        </StyledMenuItem>

      </StyledMenu>
    </div>
  );
}