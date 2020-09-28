import { Menu, MenuItem } from '@material-ui/core';
import React from 'react';
import firebase from '../firebase';

const PublicPostMenu = ({ anchorEl, setAnchorEl, items }) => {

  const handleClose = () => {
    setAnchorEl(null)
  }

  //delete comments
  const handleClick = async () => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id } = JSON.parse(currentuser);
    const ref = firebase.firestore().collection('post')
      .doc(items.postId).collection('comments')
      .doc(items.commentId);
    ref.get().then(doc => {
      const ui = doc.data().uid;
      if (ui == id) {
        ref.delete().then(() => {
          console.log('comment deleted')
        }).catch(error => { console.log(error) })
      } else {
        alert('You can only delete your post');
      }
    }).catch(error => { console.log(error) })

    setAnchorEl(null);
  }

  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClick} >
          <span>Delete</span>
        </MenuItem>
        <MenuItem >
          <span>Hide comment</span>
        </MenuItem>

      </Menu>

    </div>
  )
}

export default PublicPostMenu
