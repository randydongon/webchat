import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Paper, makeStyles, Divider } from '@material-ui/core';

import ListIcon from '@material-ui/icons/List';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1)
  },
  line: {
    border: '1px solid #eee',
    margin: theme.spacing(1, 0),
    marginTop: '1rem'
  },
  upper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '2rem',

  },
  lower: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '2rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
  },

  indiv: {
    display: 'flex',
    marginTop: '1rem',
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '1rem',
    backgroundColor: '#eee',
    borderRadius: '1rem',
    padding: theme.spacing(0.5, 2),
    '&:hover': {
      backgroundColor: '#ddd',
    }
  },
  text: {
    fontWeight: 600,
    fontSize: 25,
  },
  divider: {
    margin: theme.spacing(1, 0),
  }

}));

const Posts = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div >
        <div className={classes.upper}>
          <span className={classes.text}>Posts</span>
          <div className={classes.indiv}>
            <div className={classes.inner} ><FilterListIcon /> <span>Filters</span> </div>
            <div className={classes.inner} ><SettingsIcon /> <span>Manage Posts</span> </div>
          </div>
        </div>
        {/* <div className={classes.line}></div> */}
        <Divider className={classes.divider} />
        <div className={classes.lower}>
          <div></div>
          <div className={classes.inner} ><ListIcon /><span>List View</span> </div>
          <div className={classes.inner} ><ViewModuleIcon /> <span>Grid View</span> </div>
          <div>
          </div>
        </div>
      </div>
    </Paper>
  )
}

export default Posts
