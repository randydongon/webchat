import React, { useState, useEffect } from 'react'
import Menu from '@material-ui/core/Menu';
import './RenderUser.css';
import firebase from '../../firebase';
import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { ListItem, ListItemText, List, Typography, Badge, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useStateValue } from '../../StateProvider';
import AddFriend from './AddFriend';
import { MoreVertOutlined } from '@material-ui/icons';
import UserMenu from '../../components/menu/UserMenu';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  root: {
    display: 'flex',
    top: '12vh !important',
    paddingRight: '1ch',
    paddingLeft: '1ch',
  },
  renderuserdiv: {
    borderBottom: '1px solid #eee',
    padding: '0ch 2ch',
    textAlign: 'center',
  }
});

const RenderUser = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const isMenuOpen = Boolean(props.anchorE);
  const [profile, setProfile] = useState([])
  const [{ isLogin, }, dispatch] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userId, setUserId] = useState('');


  const handleClose = () => {
    setOpen(false);
  }
  const handleMenuClose = () => {
    props.setAnchorE(null)
  };

  const handleListItemClick = (item) => {
    props.setAnchorE(null);

    if (!isLogin) {
      alert('Please login to chat with friends')
      return;
    }

    if (isMenuOpen) {
      dispatch({
        type: 'CHATROOM_IS_OPEN',
        isChat: isMenuOpen,
        name: item.name,
        url: item.url,
        id: item.id,
      })
    }
  };

  useEffect(() => {

    async function fetchData() {
      const userId = localStorage.getItem('uid');
      if (!userId) return;
      let uid = JSON.parse(userId)

      if (isLogin && uid) {

        const ref = firebase.firestore().collection('userprofile');
        ref.doc(uid).collection('friendslist')
          .onSnapshot(query => setProfile(query.docs.map(
            doc => ({ id: doc.id, name: doc.data().name, url: doc.data().url, notification: doc.data().notification }))))

        return () => ref;
      }
    }

    fetchData();
  }, [isLogin, open]);

  const handleAnchorEl = (e, id) => {
    setAnchorEl(e.currentTarget)
    setUserId(id);
  }



  return (
    <div>
      <Menu
        anchorEl={props.anchorE}
        id={props.id}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        className={classes.root}
      >

        <div className={classes.renderuserdiv}>
          <Typography variant='h5' component='h4' >Chat with friends</Typography>
        </div>

        <List>
          {profile?.length > 0 ? profile.map((item) => (
            <div
              style={{ display: 'flex' }}
              key={item.id}>
              <ListItem
                style={{ borderRadius: '0.5rem', marginLeft: '0.5rem' }}
                button onClick={() => handleListItemClick(item)}
              >
                <ListItemAvatar>
                  <Badge badgeContent={item.notification} color="secondary">

                    <Avatar className={classes.avatar}>

                      <img src={item.url} alt="" className='person_img'
                        style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} />

                    </Avatar></Badge>
                </ListItemAvatar>
                <ListItemText primary={item.name} />

              </ListItem>
              <IconButton
                onClick={(e) => handleAnchorEl(e, item.id)}
                style={{ margin: '0rem 1rem', padding: '0rem 1rem' }}>
                <MoreVertOutlined />
              </IconButton>
            </div>
          )) : null}

          <ListItem autoFocus button onClick={() => setOpen(true)} id='addFriend'>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add Friend " />
          </ListItem>
        </List>

        <AddFriend open={open} onClose={handleClose} selectedValue={''} />

      </Menu>

      <UserMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} userId={userId} />
    </div>
  )
}

export default RenderUser
