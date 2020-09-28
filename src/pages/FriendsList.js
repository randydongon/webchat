import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';

import { Card, CardActionArea, CardMedia, CardContent, } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 'auto',
  },
  card: {
    maxWidth: 100,
    marginBottom: theme.spacing(0.5),

  },
  media: {
    height: 100,
    borderRadius: '0.3rem',
  },
}));

export default function FriendsList({ friends }) {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <GridList cellHeight={150} className={classes.gridList} cols={3}>
        {friends.map((person, index) => (
          <Card className={classes.card} key={index}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={person.url}
                title="Contemplative Reptile"
              />
              <CardContent>
                <span>
                  {person.name}
                </span>

              </CardContent>
            </CardActionArea>

          </Card>
        ))}
      </GridList>
    </div>
  );
}

/*
<GridListTileBar
  title={''}
  subtitle={<span>{friend.name}</span>}
actionIcon={
  <IconButton aria-label={`info about ${friend.name}`} className={classes.icon}>
    <InfoIcon />
  </IconButton>
}
/>
*/