import React, { useState, useEffect } from 'react'
import '../css/ChatDialog.css';
import { useStateValue } from '../../StateProvider';
import IconButton from '@material-ui/core/IconButton';
import { Input, FormControl, Avatar, ListItemAvatar, Typography, } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import FlipMove from 'react-flip-move';
import Messages from '../js/Messages';
import firebase from '../../firebase';
import moment from 'moment';

const ChatDialog = () => {
  const [{ isChat, isLogin, name, url, id }, dispatch] = useStateValue();
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  //const [msgCount, setMsgCount] = useState(0);
  //const [groupId, setGroupId] = useState(0);
  const [curu, setCuru] = useState('');

  useEffect(() => {
    setCuru(JSON.parse(localStorage.getItem('currentuser')));
  }, [])

  const onCloseChatWindow = () => {

    if (isChat) {

      dispatch({
        type: 'CHATROOM_IS_OPEN',
        isChat: false,

      })
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const messageId = JSON.stringify(Number(curu.id) + Number(id));
    // setGroupId(messageId);
    const message = { message: input, from: curu.name, toid: id, fromid: curu.id }
    setMessages([
      ...messages,
      {
        message: input,
        user: curu.name,
        toid: id,
        fromid: curu.id,
      }]);

    const timestamp = moment().valueOf().toString();
    const ref = firebase.firestore();
    ref.collection('messages')
      .doc(messageId).collection('inbox')
      .doc(timestamp).set(message)
      .then(() => {
        ref.collection('userprofile').doc(id).collection('friendslist').doc(curu.id)
          .get().then(doc => {

            ref.collection('userprofile').doc(id)
              .collection('friendslist').doc(curu.id)
              .update({ notification: doc.data().notification + 1 }).then(() => {
                console.log('notification updated')
              }).catch(error => { console.log('error update notification, ', error) })

          }).catch(error => { console.log('error', error) })

        console.log('message sent')
      })
      .catch(error => { console.log('message sent fail ', error) })

    /*
    firebase.firestore().collection('messages')
      .doc(messageId).collection(messageId)
      .doc(timestamp).set(message).then(() => {
        console.log('new message added')
        setMsgCount(msgCount + 1);
        //access notification message   

      }).catch(error => {
        console.log(error)
      })
*/
    setInput('')
    return () => ref;
  }

  //retrieve my own message
  useEffect(() => {

    const curu = JSON.parse(localStorage.getItem('currentuser'));
    const messageId = JSON.stringify(Number(curu.id) + Number(id))
    const msRef = firebase.firestore().collection('messages');
    msRef.doc(messageId).collection('inbox')
      .onSnapshot((query) => {
        setMessages(query.docs.map((doc) =>
          ({ message: doc.data().message, user: doc.data().from, id: doc.id })))
      })

    /*
        const msRef = firebase.firestore().collection('messages')
          .doc(messageId).collection(messageId)
          .onSnapshot((query) => {
            setMessages(query.docs.map((doc) =>
              ({ message: doc.data().message, user: doc.data().from, id: doc.id })))
          })
    */
    return () => msRef;

  }, []);

  const onClickChat = (e) => {
    e.preventDefault();

    //console.log('chat dialog is open')
    const curu = JSON.parse(localStorage.getItem('currentuser'));
    // const messageId = JSON.stringify(Number(curu.id) + Number(id))

    if (curu === null || id === undefined) {
      return;
    }
    //console.log('going to update notification', curu.id)

    const ref = firebase.firestore().collection('userprofile').doc(curu.id)
      .collection('friendslist').doc(id)
      .update({ notification: 0 }).then(() => {
        console.log('notification updated')
      }).catch(error => { console.log('error update notification, ', error) })
    return () => ref;

  }

  /*
  const setNotification = (count, collId, userId) => {

    const ref = firebase.firestore().collection('notification').doc(collId).collection('notification');
    ref.doc(userId).update({
      count: count,
    }).catch(error => {
      if (error) {
        ref.doc(userId).set({ count: count, name: name }).then(() => { console.log('added at catch') }).catch(error => { console.log(error) })
      }
    }).then(() => {
      console.log('notifcation updated')
    }).catch(error => { console.log(error) })

  }
*/
  return (
    <div className='chatdialog__div' onClick={onClickChat}>
      <div className='chatdialog__header'>
        <ListItemAvatar>
          <Avatar>
            <img src={url} alt="" style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} />
          </Avatar>
        </ListItemAvatar>
        <Typography variant='h6' component='span' >{name}</Typography>
        <IconButton
          className='chatdialog__iconbtn'
          onClick={onCloseChatWindow}>
          <CloseOutlinedIcon
            variant='contained'
            color='primary'
            className='chatdialog_closeicon' />
        </IconButton>

      </div>

      <ScrollToBottom className='chatdialog__message'>
        <FlipMove
          enterAnimation='elevator'
          leaveAnimation='elevator'
        >
          {messages.map((message, i) =>
            <Messages key={i} message={message} user={curu.name} />
          )}
        </FlipMove>
      </ScrollToBottom>

      <div className='chatdialog__inputdiv'>

        <form className='chatdialog__form'>
          <FormControl className='chatdialog__formcontrol'>
            <Input type='text'
              className='chat_input'
              placeholder='Enter a message'
              value={input}
              onChange={(e) => setInput(e.target.value)} />
            <IconButton type='submit'
              className='chat_iconbutn'
              variant='contained'
              color='primary'
              disabled={!input}
              onClick={sendMessage}
            >
              <SendIcon />
            </IconButton>
          </FormControl>

        </form>
      </div>
    </div>
  )
}

export default ChatDialog
 /*
useEffect(() => {

firebase.firestore().collection('userprofile')
.doc(curu.id).collection(curu.id).onSnapshot((query) => {
setMFrom(query.docs.map((doc) =>
({ message: doc.data().message, user: doc.data().from })))
})

}, [])


useEffect(() => {
if (isChat) return;
firebase.firestore().collection('notificationmsg').doc(groupId
).update({
from: curu.name, count: msgCount
}).then(() => {
console.log('notication msg updated!');
setMsgCount(0)
setGroupId(0)
}).catch(error => {
console.log(error);
})
console.log(msgCount)
}, [isChat])

*/