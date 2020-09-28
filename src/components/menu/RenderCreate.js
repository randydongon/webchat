/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import Menu from '@material-ui/core/Menu';
import './RenderUser.css';
import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { ListItem, ListItemText, List, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  root: {
    display: 'flex !important',
    top: '12vh !important',
    paddingRight: '1ch',
    paddingLeft: '1ch',
  },
  renderuserdiv: {
    borderBottom: '1px solid #eee',
    padding: '0ch 2ch',
    textAlign: 'center',
  },
  createlink: {
    display: 'flex',
    color: blue[600],
  }
});

const RenderCreate = (props) => {

  const classes = useStyles();

  const isMenuOpen = Boolean(props.create);

  const handleMenuClose = () => {
    props.setCreate(null)

  };

  const handleListItemClick = (value) => {
    props.setCreate(null)

  };

  const items = [
    {
      name: 'Create new Account',
      description: 'Create profile',
      icon: <AddIcon />,
      link: '/signup'
    },
    {
      name: 'Market place listing',
      description: 'Sell items',
      icon: <ShoppingBasketIcon />,
      link: '',
    },
    {
      name: 'Settings',
      description: 'Update profile',
      icon: <SettingsIcon />,
      link: '',
    }

  ]

  return (
    <Menu
      anchorEl={props.create}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={props.id}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.root}
    >
      <div className={classes.renderuserdiv}>
        <Typography variant='h5' component='h4' >Create</Typography>
      </div>
      <List>

        {items.map((item, i) => (
          <ListItem button onClick={() => handleListItemClick(true)} key={i}>
            <Link to={item.link} className={classes.createlink}>
              <ListItemAvatar>
                <Avatar className={classes.avatar} >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </Link>
          </ListItem>
        ))}

        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Create New Account" />
        </ListItem>
      </List>

    </Menu>
  )
}

export default RenderCreate
