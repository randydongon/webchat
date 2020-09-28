import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import { Avatar, Card, CardActions, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import firebase from '../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '0rem 0rem',
    marginTop: '0rem',

  },
  gridList: {
    width: '5rem',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  cardimg: {
    position: 'relative',
    display: 'flex',
    borderRadius: '1rem',
    margin: '0rem 0.3rem',
    height: '180px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '120px',

    '&:hover': {
      transform: 'scale(1.01)',
      cursor: 'pointer',
    },
  },
  cardAction: {
    position: 'absolute',
    bottom: '0rem',
    opacity: '0.7',
    background: 'rgba(0,0,0,0.2)'
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },

}));

export default function SingleLineGridList({ tileData }) {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      {tileData.length > 0 ? tileData?.map((tile) => (

        <Card
          key={tile.id}
          className={classes.cardimg}
          style={{
            backgroundColor: 'black',
            backgroundImage: `url(${tile.url})`, backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity: 1,

          }}
        >
          <IconButton style={{ position: 'absolute', top: 0, left: 0, }}>

            <Avatar style={{ backgroundColor: blue[600] }}>
              <img src={tile.url}
                style={{
                  width: '2rem', height: '2rem',
                  borderRadius: '50%',
                }} alt="" />
            </Avatar>

          </IconButton>
          {/* <img src={tile.img} alt={tile.title} /> */}
          <CardActions className={classes.cardAction} >
            <Typography
              className={classes.text}
              variant="body2" color="textSecondary" component="p" >
              {tile.name}
            </Typography>
          </CardActions>
        </Card>

      )) : null}
    </div>
  );
}
