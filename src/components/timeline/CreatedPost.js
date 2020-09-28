import React, { useEffect, useState, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { Collapse, Divider, Paper } from '@material-ui/core';
import DateFormatter from '../js/DateFormatter';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import Tippy from '@tippy.js/react'
import SimpleMenu from './SimpleMenu';
import Youtube from 'react-youtube';
import axios from '../../axios';
import { DesktopWindows } from '@material-ui/icons';
import firebase from '../../firebase';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '1rem',
  },

  card: {
    maxWidth: 'auto',
  },

  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  divicon: {
    display: 'flex', alignItems: 'center',
    paddingLeft: '3rem', paddingRight: '3rem', color: '#4a4e4d',
    padding: theme.spacing(1, 0),
    borderRadius: '0.3rem',
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    }
  },
  iconright: {
    marginRight: '0.5rem',
    fill: '#afafaf',
    cursor: 'pointer',
  },
  divider: {
    margin: theme.spacing(0, 2),

  },
  forminput: {
    backgroundColor: '#eee',
    borderRadius: '1.5rem',
    paddingTop: '0.3rem',
    width: '100%',
    marginLeft: '0.5rem',
  },

  outlineinput: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#eee',
    padding: theme.spacing(0, 1),

    width: '100%',
  },
  divinput: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '1rem',
    marginLeft: '1rem',
    paddingTop: '2px',
  },
  divcontent: {
    display: 'flex',
  },

}));

export default function CreatedPost({ items }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState({ name: '', url: '', });
  const [input, setInput] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const [movieInfo, setMovieInfo] = useState({});
  const [message, setMessage] = useState({});
  const [result, setResult] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  //user avatar
  // useEffect(() => {
  //   let currentuser = localStorage.getItem('currentuser');

  //   if (currentuser) {

  //     const { name, url } = JSON.parse(currentuser);
  //     setProfile({ name, url })
  //   }
  //   return () => {
  //     //currentuser = undefined;
  //   }
  // }, ['one']);

  //date formatter
  const formatDate = (datepost) => {
    let date = new Date(Number(datepost));
    date = <DateFormatter value={date.getTime()} />;
    return date;
  };

  const handleChange = (e) => {
    e.preventDefault();
    let data = e.target.value;
    setInput(data)

  };

  const enableInput = () => {

  }

  const handleAnchor = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleInput = (value) => {
    setInput(input += ' ' + value)
  };

  //check if the string is a valid url
  function isValidWebUrl(url) {
    let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return regEx.test(url);
  }

  useEffect(() => {

    setMovieInfo({})
    setResult(false)
    const value = isValidWebUrl(items.message);
    setResult(value);
    //setting profile
    firebase.firestore().collection('userprofile').doc(items.uid).get()
      .then(doc => setProfile({ name: doc.data().name, url: doc.data().url }));

    if (!value) {
      let postid = formatDate(items.id)

      setMovieInfo({ message: items.message, urlimg: items.urlimg, datepost: postid })

    } else {
      const fetchData = async () => {
        // const data = post;
        let url = null;
        try {
          if (items.length <= 0) return;
          url = new URL(items.message);
          if (url) {
            let data = url.host;
            data = data.split('.')
            if (data[1] === 'youtube') {

              const urlParams = new URLSearchParams(url.search);
              const vId = urlParams.get('v')
              console.log(vId)
              //format date
              let postid = formatDate(items.id)

              const results = await axios.get(vId).then(res => {

                setMovieInfo({ url: url.href, videoId: vId, host: url.host.slice(4).toUpperCase(), title: res.data.items[0].snippet.title, description: res.data.items[0].snippet.description, datepost: postid });

              }).catch(error => {
                setMovieInfo({ url: url.href, videoId: vId, host: url.host.slice(4).toUpperCase(), title: '', description: '', datepost: postid });
                return null;
              });

              return results;
            }
          } else {

          }
        } catch (error) {
          console.log(error);

          return null;
        }
        return null;
      }

      fetchData();
    }
  }, [items])

  const opts = {
    heigth: '360',
    width: '100%',
    playerVars: {
      autoplay: 0,
    }
  }
  //this method will trancate the string if greater the limit
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  //control Youtube playing 
  const _onReady = (e) => {
    e.target.pauseVideo();
  }

  return (
    <Paper className={classes.root}>
      <Card className={classes.card}>

        <CardHeader style={{ textAlign: 'left' }}
          avatar={
            <Avatar>
              <img src={profile.url} alt="" />
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreHorizIcon />
            </IconButton>
          }
          title={<strong>{profile.name}</strong>}
          subheader={movieInfo.datepost}
        />
        {result ?
          <div>
            <CardContent style={{ marginTop: 0, textAlign: 'left', paddingTop: 0 }}>
              <Typography style={{ marginTop: 0, textAlign: 'left', paddingTop: 0, }} >
                <a
                  style={{ outline: 'none' }}
                  href={movieInfo?.url}
                  rel='nofollow noopener noreferrer'
                  tabIndex='0'
                  target='_blank'
                >{movieInfo?.url}</a> </Typography>
            </CardContent>
            <div>
              <Youtube videoId={movieInfo.videoId} opts={opts} />
            </div>
            <div style={{ textAlign: 'left', margin: 0, paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '0.5rem', backgroundColor: '#eee' }}>
              <p style={{ margin: 0, padding: 0 }}><span style={{ fontSize: '16px' }}>{movieInfo?.host}</span><br />
                <strong >{truncate(movieInfo?.title, 39)}</strong><br />
                {truncate(movieInfo?.description, 69)}
              </p>
            </div>
          </div>
          :
          <div>
            <CardContent style={{ marginTop: 0, textAlign: 'left', paddingTop: 0 }}>
              <Typography style={{ marginTop: 0, textAlign: 'left', paddingTop: 0, }} >

                {movieInfo.message} </Typography>
              <img src={movieInfo.urlimg} style={{ width: '100%', height: 'auto' }} alt="" />
            </CardContent>
          </div>
        }
        <Divider />


        <CardActions style={{ justifyContent: 'space-between', }} >

          <div className={classes.divicon}>
            <ThumbUpOutlinedIcon className={classes.iconright} />
            <span>Like</span>
          </div>

          <div className={classes.divicon}>
            <ModeCommentOutlinedIcon className={classes.iconright}
              onClick={enableInput}
            />
            <span>Comment</span>
          </div>

          <div className={classes.divicon}>
            <ShareOutlinedIcon className={classes.iconright} />
            <span>Share</span>
          </div>

        </CardActions>

        <Divider className={classes.divider} />

        <CardContent>
          <div className={classes.divcontent}>
            <Avatar>
              <img src={profile.url} alt="" />
            </Avatar>
            <div
              className={classes.forminput} >
              <div className={classes.divinput}>
                <input type='text'
                  className={classes.outlineinput}
                  value={input}
                  onChange={handleChange}
                  placeholder='Write a comment'

                />
                <div className={classes.divcontent}>
                  <Tippy content='Insert an emoji'>
                    <EmojiEmotionsOutlinedIcon
                      onClick={handleAnchor}
                      className={classes.iconright} />

                  </Tippy>

                  {/* {active ? <Picker onEmojiClick={onEmojiClick} /> : null} */}
                  <Tippy content='Attach a photo or video'>
                    <CameraAltOutlinedIcon className={classes.iconright} />
                  </Tippy>
                  <Tippy content='Post a GIF'>
                    <GifOutlinedIcon style={{ border: '1px solid #afafaf', borderRadius: '50%' }} className={classes.iconright} />
                  </Tippy>
                  <Tippy content='Post a sticker'>
                    <NoteOutlinedIcon className={classes.iconright} />
                  </Tippy>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SimpleMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} setInput={setInput} input={input} />
    </Paper >
  );
}

/*
useState({
    url: '', videoId: '', host: '', title: '',
    description: '', datepost: ''
  });

  */
