import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Card, Input } from '@material-ui/core';
import firebase from '../firebase';
import { useStateValue } from '../StateProvider';

const useStyles = makeStyles((theme) => (
  {
    root: {
      display: 'flex',
      flexDirection: 'columnn',
      marginLeft: 'auto',
      marginRight: 'auto',
      justifyContent: 'center',
      textAlign: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
      }
    },
    signinbtn: {
      width: '100%',
      marginTop: '1ch',
      color: 'white',
      fontWeight: '300',
      backgroundColor: '#7bc043',
    },
    signindiv: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '3rem',
      minWidth: 'auto',
      maxWidth: '300px',
    },
    signincard: {
      width: '100%',
      paddingTop: '1',
      paddingBottom: '2ch',
      flexDirection: 'column',
    },
  }));

const Login = ({ history }) => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ isLogin, }, dispatch] = useStateValue();

  const handleClick = (e) => {
    e.preventDefault();
    if (isLogin) {
      return;
    }
    else {
      firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        console.log('successfully login')
        //  if (!user) return;

        const myemail = user.user.email;
        const profile = [];

        localStorage.clear();

        const ref = firebase.firestore().collection('userprofile').onSnapshot(query => {
          query.forEach((doc) => {

            if (myemail === doc.data().email) {

              localStorage.setItem('uid', JSON.stringify(doc.id));
              const { name, url, email, coverurl } = doc.data();
              const currentuser = { name: name, email: email, url: url, isLogin: true, id: doc.id, coverurl };
              localStorage.setItem('currentuser', JSON.stringify(currentuser));
              dispatch({
                type: 'IS_USER_LOGIN',
                isLogin: true,
                user: name,
                email: email,
                url: url,
                id: doc.id,
                coverurl: coverurl,
              });

            }
          });
        })

        dispatch({
          type: 'IS_USER_LOGIN',
          isLogin: true,
        });
        setEmail('');
        setPassword('');
        history.push('/');

      }).catch((error) => { //end auth

      })
    }
  }

  return (
    <div className={classes.signindiv} >
      <h1>Login </h1>
      <Card className={classes.signincard}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField onChange={(e) => setEmail(e.target.value)}
            placeholder='Email address'
            variant='outlined' size='small'
            type='email' />

          <TextField onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            variant='outlined' size='small'
            type='password' />

          <Button onClick={handleClick}
            className={classes.signinbtn}
            color='primary' variant='contained'
            size='large'   >Sign-In</Button>

        </form></Card>
    </div>
  )
}

export default Login
