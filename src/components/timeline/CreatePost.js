import React, { useEffect, useState } from 'react'
import { Paper, makeStyles, IconButton, Divider, } from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoIcon from '@material-ui/icons/Photo';
import EventIcon from '@material-ui/icons/Event';
import { blue } from '@material-ui/core/colors';
import CreatePostDialog from './CreatePostDialog';
import { useStateValue } from '../../StateProvider';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
  },
  post: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    width: '100%',

  },
  createpost: {
    borderRadius: '1rem',
    background: '#eee',
    width: '100%',

    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: '1rem',
    padding: theme.spacing(1, 0),
    marginRight: '1rem',
    outline: 'none',
    border: 'none',
    '&:hover': {
      backgroundColor: '#ddd',
      cursor: 'pointer',
    }
  },
  divider: {
    // display: 'flex',
    margin: theme.spacing(1, 0),
    // border: '1px solid #eee',
    // width: '95%',
  },
  live: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(1, 'auto'),
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  divicons: {
    alignItems: 'center', display: 'flex',
    padding: theme.spacing(0.2, 1),
    borderRadius: '0.5rem'
    ,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#eee',
    },
  },
  icons: {
    height: '2rem',
    width: '2rem',
    marginRight: '0.5rem',


  }
}));

const CreatePost = () => {
  const [{ isChat, isLogin }, dispatch] = useStateValue()
  const classes = useStyles();
  const [image, setImage] = useState('')
  const [open, setOpen] = useState(false);
  const [fileImage, setFileImage] = useState(null);

  useEffect(() => {
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { url } = JSON.parse(currentuser);
    setImage(url);
    // setMovieInfo(profileMovie);
  }, [open, isLogin])

  const handleInput = (e) => {
  }

  const handleImage = (e) => {
    setFileImage(e.target.files[0])
    setOpen(true);
  }

  return (

    <div>
      <Paper className={classes.root}>
        <div>
          <div className={classes.post}>
            <IconButton>
              <img src={image} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} alt="" />
            </IconButton>
            <input type='text' readOnly={true}
              onClick={() => setOpen(!open)}
              onChange={handleInput}
              className={classes.createpost} placeholder={`What' s on your friend's mind?`} />
          </div>
          <Divider className={classes.divider}></Divider>
          <div className={classes.live}>
            <div className={classes.divicons}>
              <VideocamIcon className={classes.icons} style={{ color: 'red' }} />
                Live Video
            </div>
            <label
              className={classes.divicons} style={{ color: 'green' }}
              htmlFor="pickimg">
              <PhotoIcon className={classes.icons} style={{ color: 'green' }} />
              Photo/Video
            </label>
            <input
              onChange={handleImage}
              style={{ display: 'none' }}
              type="file" name="" id="pickimg" />
            {/* </div> */}
            <div className={classes.divicons}>
              <EventIcon className={classes.icons} style={{ color: blue[600] }} />
              Life Event
            </div>
          </div>
        </div>
      </Paper>
      {open ? <CreatePostDialog open={open} setOpen={setOpen} fileImage={fileImage} setFileImage={setFileImage} /> : null}
    </div>

  )
}

export default CreatePost
