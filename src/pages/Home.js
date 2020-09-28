import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Typography, } from '@material-ui/core';
import '../components/css/Home.css';
import CreatePost from '../components/timeline/CreatePost';
import firebase from '../firebase';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { blue } from '@material-ui/core/colors';
import CardList from './CardList';
import PublicPost from '../pages/PublicPost';
import { useStateValue } from '../StateProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#eee',
    paddingTop: '5rem',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  papermid: {
    backgroundColo: '#eee',
  },
  feeds: {
    display: 'flex',
    padding: theme.spacing(0, 1),
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  user: {
    display: 'flex',
    // margin: '0.5rem 0.3rem',
    justifyContent: 'center',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  cardimg: {
    position: 'relative',
    display: 'flex',
    borderRadius: '1rem',
    margin: '0rem 0.3rem',
    marginBottom: '0.5rem',
    height: '190px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110px',
    flexDirection: 'column',

    '&:hover': {
      transform: 'scale(1.01)',
      cursor: 'pointer',
    },
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(6),
    right: theme.spacing(5),
    backgroundColor: 'white',
    height: theme.spacing(5),
    width: theme.spacing(5),
  },

  svgicon: {
    backgroundColor: blue[600],
    height: theme.spacing(3.5),
    width: theme.spacing(3.5),

  },
  cardmedia: {
    height: 120,
  },

}));

const Home = () => {
  const [{ isChat, isLogin }, dispatch] = useStateValue()
  const classes = useStyles();
  const [tileData, setTileData] = useState({ name: '', url: '', id: '' })
  const [profile, setProfile] = useState('');
  const [post, setPost] = useState([])

  useEffect(() => {
    const currentuser = localStorage.getItem('currentuser');
    let ref = firebase.firestore().collection('userprofile')
    const unsubscribe = null;

    if (currentuser) {
      const { id, url } = JSON.parse(currentuser);
      setProfile(url)
      let items = [];
      let count = 0;
      ref.doc(id).collection('friendslist')
        .onSnapshot(
          query => query.forEach(doc => {
            if (count < 4) {
              items.push({ name: doc.data().name, url: doc.data().url, id: doc.id })
              count++;
            }
            setTileData(items);
          }))

    } else {
      let items = [];
      let count = 0;
      ref.onSnapshot(query => query.forEach(doc => {
        if (count < 4) {
          items.push({ name: doc.data().name, url: doc.data().url, id: doc.id })
          count++;
        }
        setTileData(items);

      }));



      ref = unsubscribe;
      return () => {
        return ref
      }
    }

  }, [isLogin])

  useEffect(() => {
    const ref = firebase.firestore().collection('post').onSnapshot(query =>
      setPost(query.docs.map(doc => ({
        urlimg: doc.data().urlimg, urlvideo: doc.data().urlvideo,
        message: doc.data().message,
        uid: doc.data().uid, comment: doc.data().comment, id: doc.id
      }))));

    return () => ref;
  }, [isLogin])

  return (
    <div className={classes.root}>
      <Grid container spacing={1} >

        <Grid item xs={12} sm={12} md={8} lg={6} className={classes.feeds} >
          <div className={classes.user} >
            <Card className={classes.cardimg}
            >
              <CardActionArea>
                <CardMedia
                  component='img'
                  className={classes.cardmedia}
                  image={profile}
                  title=""
                />
              </CardActionArea>

              <IconButton className={classes.fab}>
                <Avatar className={classes.svgicon}>
                  <AddOutlinedIcon />
                </Avatar></IconButton>


              {/* <img src={randy} alt="" /> */}
              <CardContent className={classes.cardAction} >
                <Typography
                  className={classes.text}
                  variant="body2" color="textSecondary" component="p" >
                  My Story
              </Typography>
              </CardContent>
            </Card>
            {tileData?.length > 0 ? tileData.map((item, index) =>
              <CardList item={item} key={index} />) : null}

          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}>
            <Grid item xs={12} sm={9} md={9} lg={6}>
              {isLogin ? <CreatePost /> : null}
              {post?.length > 0 ? post.map(item =>
                <PublicPost key={item.id} items={item} />) : (<div></div>)}
            </Grid>
          </div>

        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3} >

        </Grid>

      </Grid>

    </div>
  )
}

export default Home