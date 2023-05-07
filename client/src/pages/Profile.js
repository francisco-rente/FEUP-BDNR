import MyNavbar from "../components/MyNavbar";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2),
  },
  reviewItem: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewBody: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

function Profile() {
  const classes = useStyles();

  // Replace with real user data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatarUrl: "https://i.pravatar.cc/300",
    reviews: [
      {
        title: "Great product",
        body: "I love this product! It works great and looks stylish.",
        date: "2023-04-30",
      },
      {
        title: "Could be better",
        body: "This product is okay, but could be improved in some areas.",
        date: "2023-04-28",
      },
    ],
  };

  return (
    <>
      <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
      <div className={classes.root}>
        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          className={classes.avatar}
        />
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="subtitle1">{user.email}</Typography>
        <List>
          {user.reviews.map((review) => (
            <ListItem key={review.date} className={classes.reviewItem}>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    className={classes.reviewTitle}
                  >
                    {review.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" className={classes.reviewBody}>
                    {review.body}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
}

export default Profile;
