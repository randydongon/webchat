import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import firebase from '../../firebase';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],

  },
  search: {
    position: 'relative',
    backgroundColor: '#eee',
    borderRadius: '1rem',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AddFriend = (props) => {
  const [profile, setProfile] = useState([]);

  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  useEffect(() => {

    const ref = firebase.firestore().collection('userprofile')
      .onSnapshot(query => setProfile(query.docs.map(
        (doc) => ({ name: doc.data().name, url: doc.data().url, id: doc.id }))))

    return () => ref()
  }, [props]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id } = JSON.parse(currentuser)

    const friend = { name: value.name, notification: 0, url: value.url }
    if (!value.id) return;
    const ref = firebase.firestore()
      .collection('userprofile').doc(id)
      .collection('friendslist').doc(value.id)
      .set(friend).then(() => {
        console.log(value.name, ' is added in your list')
      }).catch(error => {
        console.log(error)
      })

    onClose(value);
    return () => ref();
  };

  //search registered member
  const handleSearch = (e) => {
    console.log(e.target.value);

  }

  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>

      <DialogTitle id="simple-dialog-title">Members</DialogTitle>
      <div className={classes.search}>
        <div className={classes.searchIcon}><SearchIcon /></div>
        <InputBase placeholder='Search'

          onChange={(e) => handleSearch(e)}
          classes={{ root: classes.inputRoot, input: classes.inputInput }}
          inputProps={{ 'area-label': 'search' }} />
      </div>
      <List>
        {profile.map((item) => (
          <ListItem button onClick={() => handleListItemClick(item)} key={item.name}>
            <ListItemAvatar>

              <Avatar className={classes.avatar}>
                <img src={item.url} style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} alt='user-img' />
              </Avatar>

            </ListItemAvatar>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}

        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem>
      </List>
    </Dialog>

  )
}
AddFriend.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};


export default AddFriend
