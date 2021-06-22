import React, { useState } from "react";
import swal from 'sweetalert';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Layout from "../../components/Layout";
import axios from "axios";
import BASE_API from "../../constants/uri";

import { useQuery } from "react-query";
import { fetchEvents } from "../../query/events";
import { Spinner } from "react-bootstrap";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  rootPaper: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "& > *": {
      margin: theme.spacing(4),
      height: theme.spacing(16),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Events = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { status, data, refetch } = useQuery("events", fetchEvents);
  const [form, setForm] =useState({title:'', description:''})

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createEvent = async () => {
    try {
      const res = await axios.post(`/api/event`, form);
      if (res.data.hasError) {
        swal("Failed", res.data.message, "error");
      } else {
        swal("Success", res.data.message, "success");
        refetch();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }
  console.log(data);
  return (
    <div className={classes.root}>
      <Layout>
        <h1>Manage Events</h1>
        <div className=" row m-5">
          <div className="col-md-3 mb-2">
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Create event
          </Button>
          </div>
          <div className="col-md-3">
          <Button variant="contained" color="primary" onClick={() => history.push(`/scan`)}>
            scan ticket
          </Button>
          </div>
        </div>

        <div className="row m-5">
          {data.map((item) => {
            return (
              <div className="col-md-4 mb-2" key={item._id}>
                <Card className={classes.root} style={{backgroundColor: '#f2f2f2'}}>
                  <CardContent>
                    <Typography
                      className={classes.title}
                      variant="h6"
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
               
                    <Typography className={classes.pos} color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => history.push(`/event/${item._id}`)}
                    >
                      view {item.title} tickets
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })}
        </div>


        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This event is used to create tickets
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            onChange={(e) => setForm({...form, title: e.target.value})}
          />
          <TextField
            margin="dense"
            id="name"
            label="Description"
            type="text"
            fullWidth
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createEvent} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      </Layout>
    </div>
  );
};

export default Events;
