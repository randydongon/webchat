import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import MoodIcon from '@material-ui/icons/Mood';
import RoomIcon from '@material-ui/icons/Room';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Card, CardActionArea, CardMedia, Divider, TextField } from '@material-ui/core';
import FileResizer from 'react-image-file-resizer';
import { blue, red } from '@material-ui/core/colors';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LockIcon from '@material-ui/icons/Lock';
import axios from '../../axios';
import Youtube from 'react-youtube';
import firebase from '../../firebase';
import moment from 'moment';
import Tippy from '@tippy.js/react';
import OptionDialog from './OptionDialog';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import StarIcon from '@material-ui/icons/Star';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { useStateValue } from '../../StateProvider';
import { FaUserTag } from "react-icons/fa";
import { MdGif } from "react-icons/md";


let icons = [
  { public: <PublicIcon style={{ height: '13px' }} /> },
  { friends: <PeopleIcon style={{ height: '13px' }} /> },
  { specific: <PersonIcon style={{ height: '13px' }} /> },
  { closefriends: <StarIcon style={{ height: '13px' }} /> },
  { except: <PeopleOutlineIcon style={{ height: '13px' }} /> },
  { onlyme: <LockIcon style={{ height: '13px' }} /> },
]
const opts = {
  heigth: 'auto',
  width: '100%',
  playerVars: {
    autoplay: 0,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    minHeight: '450px',
  },

  bottomdiv: {
    display: 'flex',
    border: '1px solid #eee',
    borderRadius: '0.3rem',
    width: 'object-fit',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 1),

  },
  space: {
    marginLeft: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '1rem',
    padding: '0.3rem',
    width: '1rem',
    height: '1rem',

  },
  textarea: {
    display: 'flex',
    width: 'content-fit',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },

  text: {
    width: '100%',
    outline: 'white',
    border: 'white',
    fontSize: '2rem',
    fontWeight: 300,
    marginBottom: '1rem',
    wordWrap: 'wrap',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  savepost: {

    border: '1px solid #eee',
    backgroundColor: '#eee',
    borderRadius: '0.5rem',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: blue[600],
      cursor: 'pointer',
    }
  },
  root1: {
    maxWidth: 'auto',
    marginBottom: '0.5rem',
  },
  media: {
    height: 300,
  },
  divbtn: {
    position: 'relative',
    zIndex: 9,
  },
  iconbtn: {
    position: 'absolute', right: 0,
    top: 0, backgroundColor: '#fff',
    width: '1rem', height: '1rem',
    border: '1px solid #ccc',
    marginRight: '1rem',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#eee',
    }
  },

}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CreatePostDialog({ open, setOpen, fileImage, setFileImage }) {
  const classes = useStyles();
  const [uploadImage, setUploadImage] = useState([]);
  const [toUpload, setToUpload] = useState(null);
  const [image, setImage] = useState({ url: '', name: '' });
  const [inputFile, setInputFile] = useState('');
  const [movieInfo, setMovieInfo] = useState({ url: '', videoId: '', host: '', title: '', description: '' })
  const [youtube, setYoutube] = useState(false);
  const [openop, setOpenop] = React.useState(false);
  const [post, setPost] = useState('');
  const [{ isLogin }] = useStateValue();

  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  const handleClose = () => {
    setOpen(false);
  };

  //prepare to upload image 
  const handleImage = (e) => {
    const image = e.target.files[0];
    if (!image) {
      setUploadImage([]);
      return;
    }
    FileResizer.imageFileResizer(image,
      300, 300, 'JPEG', 100, 0,
      uri => {
        setUploadImage([{ url: uri }])
        setToUpload(image)
      },
      'JPEG',
      200,
      200,
    );
  }

  useEffect(() => {
    const item = localStorage.getItem('currentuser');

    if (item) {
      const { url, name, } = JSON.parse(item);
      setImage({ url, name })

    }
  }, [isLogin]);

  const handleInput = (e) => {
    let data = e.target.value;

    const results = isValidWebUrl(data);
    if (results) {
      setInputFile(data);
      fetchData(data);
      setYoutube(true);
    }
    else {
      setInputFile(data);
    }
  }

  //this method check the string if valid url
  function isValidWebUrl(url) {
    let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
    return regEx.test(url);
  }
  //upload post to firebase
  const handleUploadPost = async (e) => {
    e.preventDefault();

    const results = isValidWebUrl(inputFile);

    if (results) {
      await uploadVideoPost(inputFile);
    } else {
      await uploadPost(inputFile);
    }
    setOpen(false);
    setFileImage(null);
  };

  async function fetchData(data) {
    let url = new URL(data);

    if (url !== null) {
      try {

        data = data.split('.')
        if (data[1] === 'youtube') {

          const urlParams = new URLSearchParams(url.search);
          const vId = urlParams.get('v')

          let results = await axios.get(vId).then((res) => {

            setMovieInfo({ url: url.href, videoId: vId, host: url.host.slice(4).toUpperCase(), title: results.data.items[0].snippet.title, description: results.data.items[0].snippet.description });

          }).catch(error => {
            setMovieInfo({ url: url.href, videoId: vId, host: url.host.slice(4).toUpperCase(), title: '', description: '' });
          })
        }
      } catch (error) {
        console.log(error);
        setYoutube(false);
        setMovieInfo(null);
      }
    }
  };

  const uploadVideoPost = async (value) => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id } = JSON.parse(currentuser);
    const docid = moment().valueOf().toString();

    if (post === 'public' || post === '') {
      console.log('uploading to firebase')
      const ref = firebase.firestore().collection('post').doc(docid).set({
        uid: id, message: value, commend: '', urlimg: '', urlvideo: value
      }).then(() => {
        console.log('file uploaded');
        setToUpload(null);
        setInputFile('');
        setUploadImage([]);
      })
        .catch(error => { console.log(error) });

      return () => ref;
    }
  };
  //upload messages or image 
  const uploadPost = async (value) => {
    if (post === 'public' || post === '') {
      const currentuser = localStorage.getItem('currentuser');
      if (!currentuser) return;
      const { id } = JSON.parse(currentuser);
      const docid = moment().valueOf().toString();
      if (toUpload != null) {
        const refImg = firebase.storage().ref(`postimg/${toUpload.name}`).put(toUpload);
        refImg.on('state_changed', (snapshot) => { console.log('snapshot') },
          (error) => { console.log('there was an error uploading image') },
          () => firebase.storage().ref('postimg').child(toUpload.name).getDownloadURL()
            .then((url) => {
              console.log(url)
              const ref = firebase.firestore().collection('post').doc(docid).set({
                uid: id, message: value, comment: '', urlimg: url, urlvideo: ''
              }).then(() => { console.log('file uploaded') })
                .catch(error => { console.log(error) });
              setToUpload(null);
              setInputFile('');
              setUploadImage([]);
              return () => ref;
            }).catch(error => {
              console.log('uploading image');

            })
        );
        return () => refImg;
      }
      else {

        const ref = firebase.firestore().collection('post').doc(docid).set({
          uid: id, message: value, comment: '', urlimg: '', urlvideo: ''
        }).then(() => {
          console.log('file uploaded');
          setToUpload(null);
          setInputFile('');
          setUploadImage([]);

        })
          .catch(error => { console.log(error) });

        return () => ref;
      }
    }
  }
  const handleClick = () => {
    setUploadImage([]);
    setToUpload(null);
    setFileImage(null);
  };

  useEffect(() => {

    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id } = JSON.parse(currentuser);
    let ref = firebase.firestore().collection('userprofile').doc(id).get()
      .then(doc => {
        setPost(doc.data().post);
      });

    return () => ref

  }, [isLogin]);

  useEffect(() => {
    if (!fileImage) return;
    setUploadImage([]);
    FileResizer.imageFileResizer(fileImage,
      300, 300, 'JPEG', 100, 0,
      uri => {
        setUploadImage([{ url: uri }])
        setToUpload(fileImage)
      },
      'JPEG',
      200,
      200,
    );

  }, [fileImage]);

  return (
    <div className={classes.root}>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create Post
        </DialogTitle>
        <DialogContent dividers
          style={{ minHeight: '200px' }}
        >
          <div>
            <div style={{
              display: 'flex', paddingTop: 0, marginTop: 0,
              alignItems: 'center', marginBottom: '1rem',
            }}>
              <img src={image?.url} alt="" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', marginRight: '0.5rem' }} />

              <div
                onClick={() => setOpenop(true)}
                style={{
                  display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', cursor: 'pointer',
                }}>
                <span>{image?.name}</span>

                <div style={{
                  display: 'flex', marginTop: '0.4rem',
                  backgroundColor: '#ccc', borderRadius: '0.3rem',
                  alignItems: 'center', textAlign: 'center', justifyContent: 'center',
                }}> {post?.length > 0 ? icons.map((item, index) => <div key={index}> {item[post]}
                </div>) : <LockIcon style={{ height: '13px' }} />}
                  <span style={{ paddingBottom: '0.2rem', fontSize: '13px' }} >{post}</span> <ArrowDropDownIcon />
                </div>
              </div>
            </div>
            <div className={classes.textarea}>
              <TextField
                focused={false}
                type='url'
                multiline
                placeholder="What's on your friend's mind?"
                onChange={handleInput}
                className={classes.text}
                name='textarea'
              />
              {/* </input> */}
              {youtube ?
                <div>
                  <div>
                    <Youtube videoId={movieInfo.videoId} opts={opts} />
                  </div>
                  <div>
                    <p><strong>{movieInfo?.host}</strong><br />
                      <strong >{truncate(movieInfo?.title, 39)}</strong><br />
                      {truncate(movieInfo?.description, 69)}
                    </p>
                  </div>
                </div>
                :
                <div>
                  {uploadImage.length > 0 ? <div className={classes.divbtn}>
                    <IconButton className={classes.iconbtn} onClick={handleClick}>
                      <CloseIcon />
                    </IconButton>
                  </div> : null}
                  {uploadImage?.map((item, index) =>
                    <Card className={classes.root1} key={index}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={item.url}
                        />
                      </CardActionArea>
                    </Card>)}
                </div>
              }
              {/* <CardImage friends={friends} setFriends={setFriends} /> */}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div style={{ width: '100%' }}>
            <div className={classes.bottomdiv}>
              <span style={{ paddingBottom: 0, paddingTop: '0.3rem', }}>Add to Your Post</span>

              <div style={{ display: 'flex' }}>
                <label htmlFor="dialogImage">
                  <Tippy content={'Photo/Video'}>
                    <div><PhotoCameraIcon
                      className={classes.space} style={{ fill: '#7bc043' }} /></div>
                  </Tippy>
                </label>
                <input
                  onChange={handleImage}
                  type="file" id='dialogImage' style={{ display: 'none', }} />
                <Tippy content={'Tag a friends'}>
                  <div>
                    <FaUserTag style={{ fill: '#0392cf' }} className={classes.space} />
                  </div>
                </Tippy>
                <Tippy content={'Felling/Activity'} >
                  <div>
                    <MoodIcon className={classes.space} style={{ fill: '#f37736' }} />
                  </div>
                </Tippy>
                <Tippy content={'Check In'}>
                  <div>
                    <RoomIcon className={classes.space} style={{ fill: '#ee4035' }} />
                  </div>
                </Tippy>
                <Tippy content={'Gif'}>
                  <div>
                    <MdGif style={{
                      backgroundColor: '#2ab7ca',
                    }} className={classes.space} />
                  </div>
                </Tippy>
                <Tippy content={'More'}>
                  <div>
                    <MoreHorizIcon className={classes.space} />
                  </div>
                </Tippy>
              </div>
            </div>
            <Divider className={classes.divider} />
            <div className={classes.savepost} onClick={handleUploadPost}>
              <Button type='submit' autoFocus size='large' color="primary">
                Save Post
            </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
      <OptionDialog openop={openop} setOpenop={setOpenop} setPost={setPost} />

    </div>
  );
}

/*
<div style={{ display: 'flex', position: 'relative', marginRight: '0.5rem', }}
                    className={classes.space}
                  >
 <LocalOfferIcon style={{ fill: '#0392cf', position: 'absolute', width: '9px', height: '9px', top: 10, left: 23 }} />
 </div>
 */