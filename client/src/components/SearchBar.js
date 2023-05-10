import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  input: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
}));

function SearchBar({ onSearch, label, formProps }) {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit} {...formProps}>
      <TextField
        className={classes.input}
        variant="outlined"
        label={label}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </form>
  );
}

export default SearchBar;
