import React, { useState, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import RenderUser from '../menu/RenderUser';
import AddIcon from '@material-ui/icons/Add';
import RenderCreate from '../menu/RenderCreate';
import { useStateValue } from '../../StateProvider';
import firebase from '../../firebase';
import { RiMessengerLine, RiEdit2Line } from "react-icons/ri";
import { Menu, MenuItem } from '@material-ui/core';
import { BiLogOutCircle } from "react-icons/bi";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '5ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
      margin: theme.spacing(0, 0.2)
    },
    margin: '0 0',
  },
  headerlink: {
    color: 'white',

  },
  menuprofile: {
    top: '12vh !important',
  },
  mobileDesktop: {
    marginLeft: 'auto',
    marginRight: 'auto',
    '& > *': {
      margin: theme.spacing(0.5, 0),
    }
  }
}));

export default function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE, setAnchorE] = useState(null);
  const [create, setCreate] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [{ isLogin }, dispatch] = useStateValue();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [badge, setBadge] = useState([]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    dispatch({
      type: 'IS_USER_LOGIN',
      isLogin: false,
    })
    const currentuser = localStorage.getItem('currentuser');
    if (!currentuser) return;
    const { name, url, email, id } = JSON.parse(currentuser);
    setName(name);
    setUrl(url);
    // setLogin(isLogin)
    dispatch({
      type: 'IS_USER_LOGIN',
      isLogin: true,
      name, url, email, id
    })

  }, [isLogin, dispatch]);

  //retrieve notification messages
  useEffect(() => {
    let uid = localStorage.getItem('uid');
    if (!uid) return;
    uid = JSON.parse(uid);
    const ref = firebase.firestore().collection('userprofile')
      .doc(uid).collection('friendslist')
      .onSnapshot(query => setBadge(query.docs.map(doc =>
        (doc.data().notification))))

    return () => ref;
  }, [isLogin])

  const handleMobileMenuClose = () => {
    // setMobileMoreAnchorEl(null);
  };

  const handleMenuProfile = (e) => {
    e.preventDefault();
    setAnchorEl(null)


  }
  const handleMenuClose = (e) => {
    e.preventDefault();
    handleMobileMenuClose();
    setAnchorEl(null);

    const value = e.target.dataset.value;

    if (value === 'exit') {
      firebase.auth().signOut();
      localStorage.clear();

      dispatch({
        type: 'IS_USER_LOGIN',
        isLogin: false,
      })
    }
  };
  const openRenderUser = (value) => {
    setAnchorE(value.currentTarget)
  }

  const openRenderCreate = (value) => {
    setCreate(value.currentTarget);
  }

  const createId = 'primary-search-account-menu-create';
  const menuId = 'primary-search-account-menu';
  const menuUserId = 'primary-search-account-menu-user'

  const renderMenu = (
    <Menu
      className={classes.menuprofile}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuProfile} data-value='profile'>
        <Link to='/profile'>
          <RiEdit2Line style={{ margin: '0rem 1rem', width: '1.5rem', height: '1.5rem' }} /> Profile
      </Link></MenuItem>
      <MenuItem onClick={handleMenuClose} data-value='exit' id='exit' name='exit'>

        <BiLogOutCircle style={{ margin: '0rem 1rem', width: '1.5rem', height: '1.5rem' }} />
        {name} : {isLogin ? 'Log-out' : 'You are currently offline'}
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>

          <Typography className={classes.sectionDesktop} variant="h6">
            Aff
          </Typography>

          <div className={classes.mobileDesktop}>
            <IconButton color='inherit'

              onClick={openRenderCreate}
            >
              <AddIcon />
            </IconButton>

            <IconButton
              onClick={openRenderUser}
            >
              <RiMessengerLine style={{
                width: '1.5rem',
                height: '1.5rem',
                fill: 'white',

              }} />

            </IconButton>
            <IconButton color="inherit"
              aria-controls={menuId}
              onClick={handleProfileMenuOpen}
            >
              {isLogin ?
                <Badge badgeContent={badge.reduce(function (acc, curr) { return acc + curr }, 0)} color="secondary">
                  <img src={url} style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} alt="" />
                </Badge>
                : <AccountCircle />}
            </IconButton>

            <Link to='/webchat' className={classes.headerlink} >
              <IconButton color='inherit' >
                <Badge color='secondary' >

                  <HomeIcon />

                </Badge>
              </IconButton>
            </Link>
            <Link to='/login' style={{ display: isLogin && 'none', }} >Signin
             </Link>

          </div>

        </Toolbar>
      </AppBar>
      {/* {renderMobileMenu} */}
      {renderMenu}

      {isLogin && anchorE ? <RenderUser id={menuUserId} anchorE={anchorE} setAnchorE={setAnchorE} /> : null}
      <RenderCreate id={createId} create={create} setCreate={setCreate} />
    </div>
  );
}
