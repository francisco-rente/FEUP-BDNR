import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function stringAvatar(name) {
  console.log("Name: " + name);
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function Navbar() {
  const classes = useStyles();
  const [user, setUser] = React.useState(null);
  const useparam = useParams();
  const navigate = useNavigate();
  const user_id = useparam.id;

  useEffect(() => {
    const userId = user_id ? user_id : localStorage.getItem("userId");
    console.log("Sending request to get user with id: " + userId);

    async function fetchUser(userId) {
      console.log("Calling fetchUser");
      await fetch("http://localhost:3001/api/customer/" + userId)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) navigate("/login");
          setUser({
            name: data.customer.name,
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
          return null;
        });
    }
    fetchUser(userId);
  }, [user_id, navigate]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            BDNR couch dwelling chad storage system (kuantokusta desconto de
            amigo version)
          </Typography>
          <Button component={Link} to="/productList" color="inherit">
            Products
          </Button>
          <Button component={Link} to="/reviewList" color="inherit">
            Reviews
          </Button>
{/*          <Button component={Link} to="/customer" color="inherit">
            Customers
          </Button>*/}
          <Button component={Link} to="/storeList" color="inherit">
            Stores
          </Button>
          {user ? (
            <Avatar
              {...stringAvatar(user.name)}
              component={Link}
              to="/profile"
              style={{ textDecoration: "none" }}
              sx={{ bgcolor: "green" }}
            />
          ) : (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
