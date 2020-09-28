import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles({
  root: {
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
  }
});

export default function CardImage({ friends, setFriends }) {
  const classes = useStyles();

  const handleClick = () => {
    setFriends([])
  }

  return (
    <div>
      {friends.length > 0 ? <div className={classes.divbtn}>
        <IconButton className={classes.iconbtn} onClick={handleClick}>
          <CloseIcon />
        </IconButton>
      </div> : null}
      {friends.map((item, index) =>
        <Card className={classes.root} key={index}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={item.url}
            />

          </CardActionArea>
        </Card>)}
    </div>
  );
}