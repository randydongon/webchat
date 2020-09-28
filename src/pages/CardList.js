import { blue } from '@material-ui/core/colors';
import React from 'react'

import {
  Avatar,
  Card, CardActionArea, CardActions,
  Grid,
  IconButton,
  makeStyles, Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  cardimg: {
    position: 'relative',
    display: 'flex',
    borderRadius: '1rem',
    margin: '0rem 0.2rem',

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
  user: {
    display: 'flex',
    margin: '0.5rem 0.3rem',
  },
  cardmedia: {
    height: 0,
    paddingTop: '100%', // 16:9
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
  text: {
    color: 'white',
    fontWeight: '600',
  },

}));

const CardList = ({ item }) => {
  const classes = useStyles();

  return (
    <div>

      <Card
        style={{
          backgroundColor: 'black', marginBottom: '0.5rem',
          backgroundImage: `url(${item.url})`, backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity: 1,
        }}
        className={classes.cardimg}
      >
        <Avatar color='primary' style={{
          display: 'flex',
          position: 'absolute',
          top: '0',
          left: '0',
          backgroundColor: blue[600],
          marginLeft: '0.3rem',
          marginTop: '0.3rem',

        }}>
          <img src={item.url}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',

            }}
            alt="" />
        </Avatar>
        <CardActions style={{
          position: 'absolute', bottom: 0,
          color: 'white', fontWeight: 700
        }}>
          <Typography className={classes.text}
            variant="body2" color="textSecondary" component="p">
            {item.name}
          </Typography>
        </CardActions>
      </Card>

    </div>
  )
}

export default CardList
