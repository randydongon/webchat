import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { Collapse, Divider, Paper, TextField } from '@material-ui/core';
import DateFormatter from '../components/js/DateFormatter';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import GifOutlinedIcon from '@material-ui/icons/GifOutlined';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import Tippy from '@tippy.js/react'
import SimpleMenu from '../components/timeline/SimpleMenu';
import Youtube from 'react-youtube';
import axios from '../axios';
import firebase from '../firebase';
import PostOptionVideo from './PostOptionVideo';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import { BsDot } from "react-icons/bs";
import PublicPostMenu from './PublicPostMenu';


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
    // paddingLeft: '3rem', paddingRight: '3rem',
    color: '#4a4e4d',
    padding: theme.spacing(0.5, 1),
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
  imgStyle: {
    width: '2rem', height: '2rem', borderRadius: '50%',
    '&:hover': { cursor: 'pointer', }
  },

  textWrap: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#eee',
    marginBottom: '0rem',
    width: 'fit-content', marginRight: 'auto',
    borderRadius: '1rem', flexWrap: 'wrap',
    paddingLeft: '1rem', paddingRight: '1rem',
    paddingBottom: '0rem', paddingTop: '0rem',
    textAlign: 'left',
    justifyContent: 'left',
  },
  spantext: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    fontSize: '14px',
  },
  divOver: {
    display: 'flex', width: 'fit-content'
  },
  imgurl: {
    width: '2rem', height: '2rem', borderRadius: '50%', marginRight: '0.3rem'
  },
  spanbsdot: {
    fill: '#aaa', paddingTop: '0.3rem'
  },
  overIcon: {
    display: 'none',
  }

}));

const opts = {
  heigth: 'auto',
  width: '100%',
  playerVars: {
    autoplay: 0,
  }
}

export default function PublicPost({ items }) {
  const classes = useStyles();

  const [profile, setProfile] = useState({ name: '', url: '', });
  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [movieInfo, setMovieInfo] = useState({});
  const [result, setResult] = useState(false);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const [comment, setComment] = useState([]);
  const [moreIcon, setMoreIcon] = useState(false);
  const [comInfo, setComInfo] = useState(null);

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

  //check if the string is a valid url
  function isValidWebUrl(url) {
    let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
    return regEx.test(url);
  }

  useEffect(() => {

    setMovieInfo({})
    setResult(false)
    const value = isValidWebUrl(items.message);
    setResult(value);
    //setting profile
    firebase.firestore().collection('userprofile').doc(items.uid).get()
      .then(doc => setProfile({ name: doc.data().name, url: doc.data().url, uid: items.uid }));

    if (!value) {
      let postid = formatDate(items.id)

      setMovieInfo({
        message: items.message, urlimg: items.urlimg, datepost: postid
      })

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

              //format date
              let postid = formatDate(items.id)

              const results = await axios.get(vId).then(res => {

                setMovieInfo({
                  url: url.href, videoId: vId, host: url.host.slice(4).toUpperCase(), title: res.data.items[0].snippet.title, description: res.data.items[0].snippet.description, datepost: postid
                });

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
  }, [items]);

  //this method will trancate the string if greater the limit
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  //method will handle option menu
  const handleOption = (e) => {
    setAnchorEl1(e.currentTarget)
  }



  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleComments = () => {
    setExpanded(!expanded);
    document.getElementById('inputcomment').focus();

  }
  const sendComment = async (e) => {
    e.preventDefault();

    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { id, name, url } = JSON.parse(currentuser);
    const timestamp = moment().valueOf().toString();
    firebase.firestore().collection('post').doc(items.id).collection('comments')
      .doc(timestamp).set({ message: input, uid: id, name: name, url: url, reply: '' }).then(() => {
        console.log('comment added');
        setInput('');
      }).catch(error => {
        console.log(error);
      })
  };

  useEffect(() => {
    async function fetchComment() {

      firebase.firestore().collection('post').doc(items.id).collection('comments')
        .onSnapshot(query => {
          setComment(query.docs.map(doc => ({
            message: doc.data().message, uid: doc.data().uid, name: doc.data().name,
            url: doc.data().url, id: doc.id,
          })));
        })
    }
    fetchComment();
  }, [items.id]);

  const dateFormatter = (v) => {
    const oldDate = new Date(Number(v));
    let oldDays = oldDate.getDate();
    let oldHrs = oldDate.getHours();
    let oldMnts = oldDate.getMinutes();

    const currentDate = new Date();
    let currentDays = currentDate.getDate();
    let currentHrs = currentDate.getHours();
    let currentMnts = currentDate.getMinutes();

    let days = currentDays - oldDays;
    let hrs = currentHrs - oldHrs;
    let mnts = currentMnts - oldMnts;

    if (days >= 1 && days < 5) {
      return days + 'd';
    } else if (hrs > 0) {
      return hrs + 'h';
    }
    else if (mnts > 0) {
      return mnts + 'm'
    }
  }

  const handleOver = (value, id) => {
    document.getElementById(id).style.display = value;
  };

  const handleMoreIcon = (e, item) => {
    setMoreIcon(e.currentTarget);
    setComInfo({ postId: items.id, commentId: item.commentId, uid: item.uid })
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Card className={classes.card}>

          <CardHeader style={{ textAlign: 'left' }}
            avatar={

              <Avatar>
                <img src={profile.url} className={classes.imgStyle} alt="" />
              </Avatar>
            }
            action={
              <IconButton
                onClick={handleOption}
                aria-label="settings">
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
                  {/* <strong >{truncate(movieInfo?.title, 39)}</strong><br />
                  {truncate(movieInfo?.description, 69)} */}
                </p>
              </div>

              <div>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {movieInfo?.title}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    {/* <FavoriteIcon /> */}
                  </IconButton>
                  <IconButton aria-label="share">
                    {/* <ShareIcon /> */}
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>

                    <Typography paragraph>
                      {movieInfo?.description}
                    </Typography>

                    {comment?.length > 0 ? comment.map(com =>
                      <div key={com.id}
                        onMouseLeave={() => handleOver('none', com.id)}>

                        <div
                          className={classes.divOver}
                          data-item={com.id}
                          onMouseEnter={() => handleOver('block', com.id)}>

                          <img src={com.url} className={classes.imgurl} alt="" />

                          <div className={classes.textWrap}>
                            <span className={classes.spantext}>{com.name}</span>
                            <span data-item={com.id}>
                              {com.message}
                            </span>
                          </div>
                          <div style={{ display: 'flex', marginLeft: '0.3rem', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              onClick={(e) => handleMoreIcon(e, { commentId: com.id, uid: com.uid })}
                              style={{ width: '2rem', height: '2rem' }}>
                              <MoreHorizIcon
                                id={com.id} className={classes.overIcon} />
                            </IconButton>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex', width: 'fit-content', alignItems: 'center',
                          marginLeft: '3rem', paddingTop: '0rem', marginBottom: '0.1rem',
                        }}>
                          <span className={classes.spantext}>Like</span>
                          <span><BsDot className={classes.spanbsdot} /> </span>
                          <span className={classes.spantext} >Reply</span>
                          <span><BsDot className={classes.spanbsdot} /> </span>
                          <span className={classes.spantext}>{dateFormatter(com.id)}</span>
                        </div>

                      </div>)

                      : null
                    }

                  </CardContent>
                </Collapse>
              </div>

            </div>
            :
            <div>
              <CardContent style={{ marginTop: 0, textAlign: 'left', paddingTop: 0 }}>
                <Typography style={{ marginTop: 0, textAlign: 'left', paddingTop: 0, marginBottom: '1rem', }} >

                  {movieInfo.message} </Typography>
                <img src={movieInfo.urlimg} style={{ width: '100%', height: 'auto' }} alt="" />
              </CardContent>
            </div>
          }
          <Divider />

          <CardActions style={{ justifyContent: 'space-between', margin: '1rem 1rem' }} >

            <div className={classes.divicon}>
              <ThumbUpOutlinedIcon className={classes.iconright} />
              <span>Like</span>
            </div>

            <div
              onClick={handleComments}
              className={classes.divicon}>
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
                <img src={profile.url} style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} alt="" />
              </Avatar>
              <div
                className={classes.forminput} >
                <div className={classes.divinput}>
                  <form >
                    <input type='text' id='inputcomment'
                      autoComplete='off'
                      multiple
                      className={classes.outlineinput}
                      value={input}
                      onChange={handleChange}
                      placeholder='Write a comment'
                    />
                    <button type='submit' onClick={sendComment} style={{ border: 'none' }}></button>
                  </form>
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
        <PostOptionVideo anchorEl={anchorEl1} setAnchorEl={setAnchorEl1} uid={profile.uid} itemId={items.id} />
      </Paper>
      <PublicPostMenu anchorEl={moreIcon} setAnchorEl={setMoreIcon} items={comInfo} />
    </div >
  );
}

