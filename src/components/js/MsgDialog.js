import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import '../css/MsgDialog.css';
import { useStateValue } from '../../StateProvider';
import firebase from '../../firebase';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

let messages = [
  {

    from: 'randy',
    text: 'hello',
    timestamp: 'date and time'
  },
  {
    from: 'reymund',
    text: 'lets go',
    timestamp: 'date and time',
  },
  {
    from: 'olsen',
    text: 'somewhere',
    timestamp: 'date and time',
  }
]

function MsgDialogue(props) {

  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [profile, setProfile] = useState([])

  const [{ isChat }, dispatch] = useStateValue();

  const handleListItemClick = (value) => {
    onClose(value);
    if (open) {
      dispatch({
        type: 'CHATROOM_IS_OPEN',
        isChat: open,

      })
    }
    console.log(isChat)
  };

  useEffect(() => {
    //firebase.firestore().collection('userprofile').onSnapshot(onCollectData)

  }, [])

  const onCollectData = (snapQuery) => {
    const user = [];
    snapQuery.forEach((item) => {
      const file = item.data();
      console.log(file.name);
      user.push({ name: file.name, url: file.url, id: item.id })

    })
    // setProfile(user);
  }

  return (
    <div className='msgdialog_dialog' >
      <DialogTitle id="simple-dialog-title">Chat with friends</DialogTitle>
      <List>
        {profile.map((item) => (
          <ListItem button onClick={() => handleListItemClick(true)} key={item.id}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>

                <img src={item.url} alt="" className='person_img'
                  style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}
                />

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
          <ListItemText primary="Add account " />
        </ListItem>
      </List>
      <div>

      </div>
    </div>
  );
}

MsgDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

/*
  return (
    <div>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
  */

export default MsgDialogue;