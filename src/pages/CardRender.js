import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import pancake from '../images/pancake.jpg';
import { TextField, TextareaAutosize } from '@material-ui/core';
import Tippy from '@tippy.js/react';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import comment from '../images/comment.png';
import { auth } from 'firebase';


const useStyles = makeStyles((theme) => ({

  root: {
    border: '1px solid #eee',
    background: '#eee',
    textAlign: 'justify',

    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(60),
      height: 'auto',

    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundColor: '#eee',
    transition: 'all 0.3s linear',
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1.08)',
    }

  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    overflow: 'hidden',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: red[500],
  },
  ingredients: {
    display: 'flex',
    justifyContent: 'space',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  divcomment: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 1rem',

    '&:hover': {
      background: '#eee',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    padding: '2px 10px',
  },
  divcard: {
    marginBotton: '0rem !important',

  },

  span: {
    border: '1px solid #eee',
    borderRadius: '3px',
  },
  like: {
    fillColor: 'brown',
  }
}));
export default function CardRender({ char, title, subheader, Url, subtitle, subtitletext, ingredients, method, description, setShow, setIndexImg, index, setImgName }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleImage = (value) => {

    setShow(true);
    setImgName(value)

  }
  return (

    <div className={classes.root}>
      <Card key={index} >
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {char}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={title}
          subheader={subheader}
        />
        <CardMedia
          onClick={() => handleImage(Url)}
          className={classes.media}
          image={Url}
          title={title}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <strong>{subtitle}</strong>
            {subtitletext}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <div className={classes.divcomment}>
            <img src={comment} style={{ width: '1.5rem', marginTop: '0.3rem' }} alt='icon'></img><span style={{ marginLeft: '0.5rem', color: '#aaa' }}>Comment</span>
          </div>
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
            <Typography paragraph><strong>Ingredients</strong> </Typography>
            <div className={classes.ingredients}>
              {ingredients.map((item, i) => <url key={i}>
                <li>{item}</li>
              </url>)}
            </div>
            <Typography paragraph><strong>Method:</strong> </Typography>
            <Typography paragraph>
              {method}
            </Typography>
            <Typography paragraph>
              {description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>

    </div>
  );
}