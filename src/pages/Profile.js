import React, { useState, useEffect } from 'react'
import '../components/css/Profile.css';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Tippy from '@tippy.js/react';
import dummyUser from '../images/dummy-user.png';
import firebase from '../firebase';
import { useStateValue } from '../StateProvider';
import { Grid, Paper, Divider, Button } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import ProfileImageList from './ProfileImageList';
import FriendsList from './FriendsList';
import CreatePost from '../components/timeline/CreatePost';
import Posts from '../components/timeline/Posts';
import CreatedPost from '../components/timeline/CreatedPost';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    textAlign: 'center',
    boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.5)',
  },
  subroot: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: '1rem',
    marginBottom: '1rem',

  },
  menudiv: {
    display: 'flex',
    flexDirection: 'row | column',
    flex: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(8),
    }
  },
  proot: {
    display: 'flex',
    // flexDirection: 'column | row',
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#eee',
    textAlign: 'center',
  },
  subdiv: {
    display: 'flex',
    border: '1px solid red',

  },
  smallbox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'wrap',
    marginBottom: theme.spacing(1),
  },
  midbox: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'wrap',
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'wrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  flexgrid: {
    display: 'flex',
    //flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#eee',
    textAlign: 'center',
  },
  toproot: {
    marginTop: '4rem',
  },
  timeline: {

  }
}));

const Profile = () => {
  const classes = useStyles();
  const [{ isLogin }] = useStateValue();
  const [image, setImage] = useState('');
  const [compimg, setCompImg] = useState(null);
  const [name, setName] = useState('');
  const [postAdd, setPostAdd] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;

    const { id } = JSON.parse(currentuser);

    let ref = firebase.firestore().collection('userprofile');
    ref.doc(id).collection('friendslist')
      .onSnapshot(query => setFriends(
        query.docs.map(doc =>
          ({ name: doc.data().name, url: doc.data().url }))));
    ref.doc(id).collection('post').onSnapshot(query =>
      setPostAdd(query.docs.map(doc => ({ post: doc.data().post, id: doc.id }))))
    return () => ref;
  }, ['one'])

  useEffect(() => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id, name, url, coverurl } = JSON.parse(currentuser);
    // const username = firebase.auth().currentUser;
    setName(name)
    setCompImg(coverurl);
    setImage(url);

  }, [isLogin])




  const handleChange = (e) => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      const { id, url } = JSON.parse(localStorage.getItem('currentuser'));
      const delRef = firebase.storage().refFromURL(url);
      const upLoad = firebase.storage().ref(`photos/${imageFile.name}`).put(imageFile);
      upLoad.on('state_changed', (snapshot) => { console.log('snapshot') },
        (error) => { console.log(error) },
        () => {
          firebase.storage().ref('photos').child(imageFile.name).getDownloadURL().then((URL) => {
            const updateRef = firebase.firestore()
              .collection('userprofile').doc(id).update({ url: URL })
            return () => updateRef;
          });
        }
      );
      delRef.delete().then(() => {
        console.log("updated successfully")
      }).catch(error => { console.log(error) })
    }

  }

  const handleChangeCover = async (e) => {
    const file = e.target.files[0];

    // console.log(newFile)
    const { id } = JSON.parse(localStorage.getItem('currentuser'));
    const ref = firebase.firestore().collection('userprofile').doc(id).get()
      .then(doc => {
        if (!doc.data().coverurl) {
          const upload = firebase.storage().ref(`coverphoto/${file.name}`).put(file);
          upload.on('state_changed', (snapshot) => { console.log('snapshot'); }, (error) => {
            console.log(error);
          }, () => {
            firebase.storage()
              .ref('coverphoto').child(file.name).getDownloadURL().then(url => {
                const ref = firebase.firestore()
                  .collection('userprofile').doc(id).update({ coverurl: url }).then(() => {
                    console.log('cover photo updated')
                  }).catch(error => { console.log('error while updating cover photo ', error) })
                return () => ref;
              })
          })
        } else {
          const refDel = firebase.storage().refFromURL(doc.data().coverurl);
          const upload = firebase.storage().ref(`coverphoto/${file.name}`).put(file);
          upload.on('state_changed', (snapshot) => { console.log('snapshot'); },
            (error) => {
              console.log('Error while uploading photo ', error);
            }, () => firebase.storage().ref('coverphoto').child(file.name).getDownloadURL()
              .then((url) => {
                const ref = firebase.firestore().collection('userprofile').doc(id).update({ coverurl: url }).then(() => { console.log('cover photo updated') })
                  .catch(error => { console.log('error update cover photo ', error) });
                return () => ref;
              }).catch(error => { console.log('error ', error) })
          );
          refDel.delete().then(() => { console.log('deleted') })
            .catch(error => { console.log(error) })
        }
      });

    return () => ref;
  }

  return (
    <div className={classes.toproot}>
      <div className={classes.root}>
        <div className='profile_banner'
          style={{
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${compimg})`,
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: 'auto auto',

          }}>

          <div className='profile_content'>
            <img src={image ? image : dummyUser} alt='p-img' style={{ width: '8rem', height: '8rem', borderRadius: '50%' }} />
            <Tippy content='Update profile picture'>
              <label
                className='profile_label'
                htmlFor="image"><AddAPhotoIcon /></label>
            </Tippy>

          </div>
          <input
            onChange={handleChange}
            type="file" id='image' style={{ display: 'none' }} />
          <label

            htmlFor='cover-photo'
            className='cover_photo'>Edit cover photo</label>
          <input type="file" id='cover-photo'
            onChange={handleChangeCover}
            style={{ display: 'none' }} />

        </div>
        <div className={classes.subroot}>
          <h1 style={{ margin: '0', padding: '0', }}>{name}</h1>
          <h4 style={{ margin: '0', padding: '0' }} >Profile</h4>
        </div>

      </div>
      <Divider className={classes.divider} />

      <div className={classes.proot}>

        <div className={classes.subdiv}>

          <Grid container className={classes.flexgrid}
            spacing={1}>

            <Grid item xs={4} sm={2} md={2}>
              <Paper className={classes.smallbox}>
                <Button>Timeline</Button>
              </Paper>
            </Grid>
            <Grid item xs={4} sm={2} md={2}>
              <Paper className={classes.smallbox}>
                <Button>About</Button>
              </Paper>
            </Grid>
            <Grid item xs={4} sm={2} md={2}>
              <Paper className={classes.smallbox}>
                <Button>Friends</Button>
              </Paper>
            </Grid>
            <Grid item xs={4} sm={2} md={2}>
              <Paper className={classes.smallbox}>
                <Button>Photos</Button>
              </Paper>
            </Grid>

            <Grid item xs={8} sm={8} md={4}>
              <Paper className={classes.midbox}>
                <Button>Edit</Button>
                <Button>Message</Button>
                <Button>Search</Button>
                <Button>Icon</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7} >
              <CreatePost />
              <Posts />
              {postAdd?.length > 0 ? postAdd.map((item) =>
                <CreatedPost key={item.id} items={item} />) : null}
              <Paper className={classes.paper}>

              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Paper className={classes.paper}>
                <Typography style={{ marginBottom: '1rem', textAlign: 'left', marginLeft: '1rem', }} >Photos</Typography>

                <ProfileImageList />
              </Paper>
              <Divider className={classes.divider} />
              <Paper className={classes.paper}>
                <Typography style={{ marginBottom: '1rem', textAlign: 'left', marginLeft: '1rem', }} >Friends</Typography>
                <FriendsList friends={friends} />
              </Paper>
            </Grid>
          </Grid></div>

      </div>

    </div>
  )
}

export default Profile
