import React, { useState, useEffect } from 'react'
import '../components/css/Signup.css';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css';
import firebase from '../firebase';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Button, Card, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import avaicon from '../images/avaicon.jpg';
import uuid from 'react-uuid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import signupData from './signupData';

const useStyle = makeStyles((theme) => (
  {
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '35ch',

      },
      justifyContent: 'center',
      textAlign: 'center',
    },
    signupdiv: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginTop: '2ch',
    },
    signupcard: {
      width: '40ch',
      paddingTop: '2ch',
      paddingBottom: '2ch',
    },
    signupbtn: {
      width: '35ch',
      marginTop: '1ch',
      color: 'white',
      fontWeight: '300',
      backgroundColor: '#7bc043'
    },
    input: {
      display: 'none',
    },
    signuptext: {
      padding: '0',
    },
    warning: {
      border: '1px solid red !important',
      borderRadius: '5px !important',

    },
    none: {
      border: '1px solid #eee'

    },
    innerdiv: {
      width: '300px',
      textAlign: 'left',
      justifyContent: 'left',
      marginLeft: '23px',
      marginTop: '0',
      marginBottom: '0rem',
    },
    selection: {
      border: '1px solid #bbb',
      padding: '4px 5px',

    },
    muted: {
      color: '#bbb',
      textAlign: 'left',
      paddingBottom: 0,
      marginBottom: '5px',
      paddinTop: '10px',
      marginTop: '10px',

    },
  }
));

const Singup = ({ history }) => {
  const classes = useStyle()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(new File(['foo', 'bar'], avaicon));
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [radioGroup, setRadioGroup] = useState('');

  const [empty, setEmpty] = useState(false); //show warning if field is empty

  const handleClick = (e) => {
    e.preventDefault();

    if (!name) {
      setEmpty(true)

    }
    else {
      setEmpty(false);
      createAccount(); //proceed to create account
    }

  }

  const createAccount = () => {
    let profileId = uuid(); //auto generate id for each profile created
    profileId = JSON.stringify(parseInt(profileId.split('-')[4], 16));

    const uploadRef = firebase.storage()
      .ref(`photos/${photo.name}`).put(photo);
    uploadRef.on('state_changed', (snapshot) => { console.log('snapshot') },
      (error) => { console.log(error) },
      () => {
        firebase.storage().ref('photos').child(photo.name)
          .getDownloadURL().then((url) => {
            firebase.firestore().collection('userprofile')
              .doc(profileId).set({
                name, email, password, url, coverurl: '',
                birthday: `${month} ${date}, ${year}`, gender: radioGroup,
              }).then(() => {
                firebase.auth()
                  .createUserWithEmailAndPassword(email, password).then(() => {
                    console.log('login account successfully created')
                  }).catch(error => { console.log(error) })

                console.log('new profile added!')

                setName('')
                setEmail('')
                setPassword('')
                setDate(0);
                setMonth('');
                setYear(0);
                setRadioGroup('');

                history.push('/');

              }).catch(error => {
                console.log(error)
              })

          })
      }
    );


  }

  return (
    <div className={classes.signupdiv} >
      <Typography variant='h4' component='h3' >Create New Account</Typography>
      <Card className={classes.signupcard}>
        <form className={classes.root}>
          <div>
            <input onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*" className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera size='large' />
              </IconButton>
            </label>

            <Tippy content={`What's your name`}>
              <TextField id='name' className={!name && empty ? classes.warning : null} size="small"
                variant='outlined'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Full name' type="text" /></Tippy>
            <TextField variant='outlined'
              className={!email && empty ? classes.warning : null}
              onChange={(e) => setEmail(e.target.value)}
              name='email'
              value={email}
              size="small"
              placeholder='Email' type="email" />
            <TextField variant='outlined'
              className={!password && empty ? classes.warning : null}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              placeholder='Password' type="password" />

            <div className={classes.innerdiv}>
              <h4 className={classes.muted}>Birthday</h4>
              <select className={classes.selection} onClick={(e) => setDate(e.target.value)}
                name="" id="">{signupData[0].map((item, i) =>
                  <option key={i} value={item}>{item}</option>)}
              </select>
              <select className={classes.selection} onClick={(e) => setMonth(e.target.value)}
                name="" id="">{signupData[1].map((item, i) =>
                  <option key={i} value={item}>{item}</option>)}
              </select>
              <select className={classes.selection} onClick={(e) => setYear(e.target.value)}
                name="" id="">{signupData[2].map((item, i) =>
                  <option key={i} value={item}>{item}</option>)}
              </select>
            </div>
            <div className={classes.innerdiv}><FormControl component="fieldset">
              <h4 className={classes.muted} >Gender</h4>
              <RadioGroup row aria-label="gender"
                name="gender1" value={radioGroup} onChange={(e) => setRadioGroup(e.target.value)}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl></div>
          </div>
          <Button
            size='large'
            className={classes.signupbtn}
            variant='contained'
            onClick={handleClick}
          >Sign Up</Button>
        </form>
      </Card>
    </div>
  )
}

export default Singup

/*

<input onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*" className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera size='large' />
              </IconButton>
            </label>

 <TextField variant='outlined'
              value={province}

              onChange={(e) => setProvince(e.target.value)}
              size="small"
              placeholder='Province' type="text" />
            <TextField variant='outlined'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              size="small"
              placeholder='City' type="text" />

*/