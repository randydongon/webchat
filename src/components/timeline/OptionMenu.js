import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import StarIcon from '@material-ui/icons/Star';
import LockIcon from '@material-ui/icons/Lock';
import { IconButton, makeStyles, Radio } from '@material-ui/core';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
  styled: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '0.5rem',
    borderRadius: '1rem',
  },
  btnstyle: {
    backgroundColor: '#ddd',
  },
  spandiv: {
    display: 'flex', marginLeft: '1rem', marginRight: 'auto', flexDirection: 'column'
  },
  text: {
    paddingTop: 0, color: '#7f7d7c',
    fontSize: '14px', fontWeight: 1,
  }
}));

export default function OptionMenu({ setPost, setOpenop }) {
  const classes = useStyles();

  const updatePostStatus = (value) => {
    const currentuser = localStorage.getItem('currentuser');
    const { id } = JSON.parse(currentuser);
    const unsubscribe = null;
    let ref = firebase.firestore().collection('userprofile').doc(id).update(
      { post: value }
    ).then(() => {
      console.log('updated successfully');
    }).catch((error) => {
      console.log(error, 'updading');
    });

    return () => ref = unsubscribe;
  }

  const handleClick = (e) => {
    const data = e.currentTarget.dataset.item;
    switch (data) {
      case 'public':
        setPost("Public");
        updatePostStatus(data);
        break;
      case 'friends':
        setPost('Friends');
        updatePostStatus(data);
        break;
      case 'except':
        setPost('Friends Except');
        updatePostStatus(data);
        break;
      case 'specific':
        setPost('Specific Friends');
        updatePostStatus(data);
        break;
      case 'onlyme':
        setPost('Only me');
        updatePostStatus(data);
        break;
      case 'closefriends':
        setPost('Close friends');
        updatePostStatus(data);
        break;
      default:
        setPost('');
        updatePostStatus('onlyme');
        break;
    };

    setOpenop(false)
  };

  return (
    <div  >

      {/* <StyledMenuItem id='public' data-item='public' value='public'> */}
      <MenuItem onClick={handleClick} data-item='public'>
        <div className={classes.styled} >
          <IconButton
            className={classes.btnstyle}
          >
            <PublicIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span style={{ paddingBottom: 0 }}><strong>Public</strong></span>
            <span className={classes.text} >Anyone or off Facebook</span>
          </div>
          <Radio color="primary" />
        </div></MenuItem>
      {/* </StyledMenuItem> */}

      <MenuItem onClick={handleClick} data-item='friends'>
        <div className={classes.styled}>
          <IconButton className={classes.btnstyle}>
            <PeopleIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span style={{ paddingBottom: 0 }}><strong>Friends</strong></span>
            <span className={classes.text}>Your friends on Facebook</span>
          </div>
          <Radio color="primary" />
        </div>
      </MenuItem>

      <MenuItem onClick={handleClick} data-item='except'>
        <div className={classes.styled}>
          <IconButton className={classes.btnstyle}>
            <PeopleOutlineIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span><strong>Friends Except...</strong></span>
            <span className={classes.text}>Don't show to some friends</span>
          </div>
          <KeyboardArrowRightIcon />
        </div>
      </MenuItem>

      <MenuItem onClick={handleClick} data-item='specific'>
        <div className={classes.styled}>
          <IconButton className={classes.btnstyle}>
            <PersonIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span><strong>Specific Friends</strong></span>
            <span className={classes.text}>Only show to some friends</span>
          </div>
          <KeyboardArrowRightIcon />
        </div>
      </MenuItem>

      <MenuItem onClick={handleClick} data-item='onlyme'>
        <div className={classes.styled}>
          <IconButton className={classes.btnstyle}>
            <LockIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span><strong>Only me</strong></span>
            <span className={classes.text}>Only me</span>
          </div>
          <Radio color="primary" />
        </div>
      </MenuItem>

      <MenuItem onClick={handleClick} data-item='closefriends'>
        <div className={classes.styled}>
          <IconButton className={classes.btnstyle}>
            <StarIcon fontSize="large" />
          </IconButton>
          <div className={classes.spandiv}>
            <span><strong>Close Friends</strong></span>
            <span className={classes.text}>Your custom list</span>
          </div>
          <Radio color="primary" />
        </div>
      </MenuItem>

    </div>
  );
}