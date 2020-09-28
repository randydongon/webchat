import React from 'react'
import { forwardRef } from 'react';
import { Typography, Card, CardContent, makeStyles } from '@material-ui/core';
import '../css/Messages.css';
import Tippy from '@tippy.js/react';

const useStyles = makeStyles({
  user: {
    color: '#3385c6',
    fontSize: '10px !important',

  },
  tipspan: {
    fontSize: '12px !important',
    alignItems: 'center',
  },
  tippy: {

  }
})
const Messages = forwardRef(({ message, user }, ref) => {
  const classes = useStyles();

  const isUser = user === message.user;

  //message date
  const formatDate = (value) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const msd = new Date(Number(value));
    let date = msd.getDate();
    const month = months[msd.getMonth()];
    const year = msd.getFullYear();
    const h = msd.getHours();
    const m = msd.getMinutes();

    if (date < 10) {
      date = '0' + date;
    }
    const ampm = (((h / 12) % 12) > 1) && (((h / 12) % 12) < 2) ? 'PM' : 'AM'
    return `${month} ${date}, ${year} at ${h}:${m} ${ampm}`;
  }

  return (
    <div ref={ref} className={`messages__message ${isUser && 'message_card'}`}
    >
      {!isUser ? <Typography
        primary='white'
        variant='h6'
        component='span'
        className={classes.user}
      >
        {message.user}
      </Typography> : null}
      <Tippy content={<span className={classes.tipspan}>{formatDate(message.id)}</span>}><Card className={isUser ? 'message_userCard' : 'message_guestCard'
      }>
        <CardContent className='messages__cardcontent'>
          <Typography
            variant='h6'
            component='span'
            className='messages__typo'
          >
            {message.message}
          </Typography>
        </CardContent>
      </Card></Tippy>
    </div>
  )
});

export default Messages
