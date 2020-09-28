import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LinkIcon from '@material-ui/icons/Link';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import SettingsEthernetOutlinedIcon from '@material-ui/icons/SettingsEthernetOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import firebase from '../firebase';

const useStyles = makeStyles((theme) => ({
  divStyle: {
    fontSize: '1rem', fontWeight: 'bold'
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

export default function PostOptionVideo({ anchorEl, setAnchorEl, uid, itemId }) {
  const classes = useStyles();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id } = JSON.parse(currentuser);
    setUserId(id)

  }, [uid])

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    const filter = e.currentTarget.dataset.filter;
    switch (filter) {
      case 'save post':
        savePost(filter)
        break;
      case 'notification':
        notification(filter)
        break;
      case 'delete post':
        deletePost(filter)
        break;
      case 'hide post':
        hidePost(filter);
        break;
      case 'copy link':

        break;
      case 'unfollow':

        break;
      case 'snooze':

        break;

      default:
        break;
    }

    setAnchorEl(null);

  }

  const savePost = (value) => {
    console.log('save post');
  }
  const deletePost = async (value) => {

    let ref = firebase.firestore().collection('post').doc(itemId).delete()
      .then(() => {
        console.log('post deleted')

      }).catch(error => {
        console.log(error)
      });

    return () => {
      ref = null;
    };
  }
  function notification(value) {
    console.log(value)
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
        {uid !== userId ? <StyledMenuItem onClick={handleClick} data-filter='save post'>
          <ListItemIcon>
            <BookmarkBorderIcon fontSize="default" />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}  >Save Post</Typography>
            <Typography className={classes.text}>Add this to you save items</Typography>
          </div>
        </StyledMenuItem> : null}

        <Divider className={classes.divider} />

        {uid !== userId ? <StyledMenuItem onClick={handleClick} data-filter='notification'>
          <ListItemIcon>
            <NotificationsNoneIcon fontSize="default" />
          </ListItemIcon>
          <div >
            <Typography style={{ padding: '0.4rem 0rem' }} className={classes.divStyle}  >Turn on notification for this post</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem> : null}

        <Divider className={classes.divider} />

        {userId == uid ? <StyledMenuItem onClick={handleClick} data-filter='delete post'>
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon fontSize="default" />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}  >Delete Post</Typography>
            <Typography className={classes.text}>This will only delete your post</Typography>
          </div>
        </StyledMenuItem> : null}

        <StyledMenuItem onClick={handleClick} data-filter='hide post'>
          <ListItemIcon>
            <VisibilityOffOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle}>Hide Post</Typography>
            <Typography className={classes.text}>See fewer posts like this. </Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='copy link'>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <div >
            <Typography className={classes.divStyle} >Copy Link</Typography>
            <Typography className={classes.text}></Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='unfollow'>
          <ListItemIcon>
            <CancelPresentationOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <div>
            <Typography className={classes.divStyle} >Unfollow</Typography>
            <Typography className={classes.text}>Stop seeing posts but stay friends
            </Typography>
          </div>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClick} data-filter='snooze'>
          <ListItemIcon>
            <WatchLaterOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <div>
            <Typography className={classes.divStyle} >Snooze</Typography>
            <Typography className={classes.text}>Temporarily stop seeing posts
            </Typography>
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
